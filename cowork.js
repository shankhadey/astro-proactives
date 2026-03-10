// cowork.js — Astro Cowork Agent Simulation Engine
// Depends on: data.js (window.DATA.coworkScenarios, window.DATA.coworkExamples)
//             app.js  (window.App.toast, window.App.switchChrome)

'use strict';

window.Cowork = (function () {

  // ─── STATE ─────────────────────────────────────────────────────────────────
  let _deliveryTarget  = 'feed';
  let _deliveryWhen    = 'now';
  let _timers          = [];
  let _activeScenario  = null;

  // ─── INIT ──────────────────────────────────────────────────────────────────
  function init() {
    _renderExamples();
    _renderSidebarTasks();
    _renderIphoneDefaults();
    _setState('idle');
    _bindEvents();
  }

  // Called by app.js when user switches to a cowork-related chrome
  function onChromeActive(chromeKey) {
    if (chromeKey === 'iphone') _renderIphoneDefaults();
  }

  // ─── STATE MANAGEMENT ──────────────────────────────────────────────────────
  function _setState(state) {
    document.querySelectorAll('.cw-state').forEach(el => el.classList.remove('cw-active'));
    const el = document.getElementById('cw-state-' + state);
    if (el) el.classList.add('cw-active');
  }

  // ─── BIND EVENTS ───────────────────────────────────────────────────────────
  function _bindEvents() {

    // ── Cowork main goal input ────
    const textarea  = document.getElementById('cw-goal-input');
    const submitBtn = document.getElementById('cw-goal-submit');

    if (submitBtn) submitBtn.addEventListener('click', () => _handleSubmit(textarea?.value || ''));
    if (textarea) {
      textarea.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); _handleSubmit(textarea.value); }
      });
      // Auto-resize
      textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 160) + 'px';
      });
    }

    // ── Cancel / New task ────
    const cancelBtn      = document.getElementById('cw-cancel-btn');
    const newTaskInline  = document.querySelector('.cw-new-task-inline');
    const newTaskSidebar = document.querySelector('.cw-new-task-btn');
    if (cancelBtn)      cancelBtn.addEventListener('click', _cancel);
    if (newTaskInline)  newTaskInline.addEventListener('click', _reset);
    if (newTaskSidebar) newTaskSidebar.addEventListener('click', _reset);

    // ── Delivery chips ────
    document.querySelectorAll('[data-target]').forEach(chip => {
      chip.addEventListener('click', function () {
        document.querySelectorAll('[data-target]').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        _deliveryTarget = this.dataset.target;
      });
    });
    document.querySelectorAll('[data-when]').forEach(chip => {
      chip.addEventListener('click', function () {
        document.querySelectorAll('[data-when]').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        _deliveryWhen = this.dataset.when;
      });
    });

    // ── iPhone submit ────
    const iphoneInput  = document.getElementById('iphone-goal-input');
    const iphoneSubmit = document.getElementById('iphone-submit');
    if (iphoneSubmit) iphoneSubmit.addEventListener('click', () => _handleIphoneSubmit(iphoneInput?.value || ''));
    if (iphoneInput)  iphoneInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') _handleIphoneSubmit(iphoneInput.value);
    });

    // ── iPhone quick action buttons ────
    document.querySelectorAll('.iphone-qa-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const scenario = (window.DATA.coworkScenarios || {})[btn.dataset.goal];
        if (scenario && iphoneInput) {
          iphoneInput.value = scenario.exampleGoal;
          _handleIphoneSubmit(scenario.exampleGoal);
        }
      });
    });

    // ── 2-mode Ask/Cowork toggle buttons (all chromes) ────
    document.addEventListener('click', e => {
      const opt = e.target.closest('.ask-mode-opt, .sf-ask-mode-opt');
      if (!opt) return;
      const wrap = opt.closest('.ask-mode-toggle, .sf-ask-mode-btn');
      if (!wrap) return;

      wrap.querySelectorAll('.ask-mode-opt, .sf-ask-mode-opt').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');

      const mode   = opt.dataset.mode;
      const chrome = opt.closest('.chrome-wrapper');

      // Update nearby search input placeholder + mode flag
      const input = chrome?.querySelector('.proactive-search-input, .sf-ask-search-input');
      if (input) {
        if (mode === 'cowork') {
          input.dataset.mode        = 'cowork';
          input.placeholder         = 'Describe your goal — Astro will coordinate the right agents…';
        } else {
          delete input.dataset.mode;
          input.placeholder = input.dataset.originalPlaceholder || input.placeholder;
        }
      }

      // SF top bar: enter ask-mode regardless of mode, then set the inner input
      if (opt.closest('.sf-top-bar')) {
        const sfChrome = document.getElementById('chrome-salesforce');
        sfChrome?.classList.add('sf-ask-mode');
        const sfInput = document.getElementById('sf-ask-input');
        if (sfInput) {
          sfInput.focus();
          if (mode === 'cowork') {
            sfInput.dataset.mode = 'cowork';
            sfInput.placeholder  = 'Describe your goal — Astro will coordinate the right agents…';
            // Sync the Ask-view mode toggle buttons too
            document.querySelectorAll('.sf-ask-mode-inner-opt').forEach(o => {
              o.classList.toggle('active', o.dataset.mode === 'cowork');
            });
          } else {
            delete sfInput.dataset.mode;
            sfInput.placeholder = 'Ask Astro anything — deals, contacts, docs, cases…';
            document.querySelectorAll('.sf-ask-mode-inner-opt').forEach(o => {
              o.classList.toggle('active', o.dataset.mode === 'ask');
            });
          }
        }
      }
    });

    // ── Inner SF ask-view mode toggle ────
    document.addEventListener('click', e => {
      const opt = e.target.closest('.sf-ask-mode-inner-opt');
      if (!opt) return;
      document.querySelectorAll('.sf-ask-mode-inner-opt').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      const sfInput = document.getElementById('sf-ask-input');
      if (!sfInput) return;
      if (opt.dataset.mode === 'cowork') {
        sfInput.dataset.mode = 'cowork';
        sfInput.placeholder  = 'Describe your goal — Astro will coordinate the right agents…';
      } else {
        delete sfInput.dataset.mode;
        sfInput.placeholder = 'Ask Astro anything — deals, contacts, docs, cases…';
      }
    });

    // ── Intercept Enter on any search input when in cowork mode ────
    document.querySelectorAll('.proactive-search-input, .sf-ask-search-input').forEach(input => {
      input.dataset.originalPlaceholder = input.placeholder;
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && this.dataset.mode === 'cowork') {
          e.stopImmediatePropagation();
          const goal = this.value.trim();
          if (!goal) return;
          this.value = '';
          // Close SF ask mode if open
          document.getElementById('chrome-salesforce')?.classList.remove('sf-ask-mode');
          // Navigate to cowork chrome
          window.App.switchChrome('cowork');
          document.getElementById('ctrl-chrome-select').value = 'cowork';
          setTimeout(() => _handleSubmit(goal), 120);
        }
      }, true); // capture phase so we run before app.js handlers
    });

    // ── SF submit button in ask-view ────
    document.querySelector('.sf-ask-submit')?.addEventListener('click', () => {
      const sfInput = document.getElementById('sf-ask-input');
      if (sfInput?.dataset.mode === 'cowork' && sfInput.value.trim()) {
        const goal = sfInput.value.trim();
        sfInput.value = '';
        document.getElementById('chrome-salesforce')?.classList.remove('sf-ask-mode');
        window.App.switchChrome('cowork');
        document.getElementById('ctrl-chrome-select').value = 'cowork';
        setTimeout(() => _handleSubmit(goal), 120);
      }
    });
  }

  // ─── RENDER EXAMPLES ───────────────────────────────────────────────────────
  function _renderExamples() {
    const grid = document.getElementById('cw-examples');
    if (!grid) return;
    grid.innerHTML = '';
    (window.DATA.coworkExamples || []).forEach(ex => {
      const btn = document.createElement('button');
      btn.className = 'cw-example-chip';
      btn.innerHTML = `<i class="ph ${ex.icon}"></i>${ex.label}`;
      btn.addEventListener('click', () => {
        const ta = document.getElementById('cw-goal-input');
        if (ta) { ta.value = ex.exampleGoal; ta.dispatchEvent(new Event('input')); }
        _handleSubmit(ex.exampleGoal);
      });
      grid.appendChild(btn);
    });
  }

  // ─── GOAL SUBMISSION ───────────────────────────────────────────────────────
  function _handleSubmit(rawGoal) {
    const goal = (rawGoal || '').trim();
    if (!goal) return;

    const scenario = _matchScenario(goal);
    _activeScenario = scenario;

    // Clear any previous run
    _timers.forEach(t => { clearTimeout(t); clearInterval(t); });
    _timers = [];
    document.getElementById('cw-agents-grid').innerHTML    = '';
    document.getElementById('cw-results-grid').innerHTML   = '';
    document.getElementById('cw-delivery-confirm').innerHTML = '';

    // Populate goal echo
    const echoEl = document.getElementById('cw-goal-echo');
    if (echoEl) echoEl.innerHTML = `<strong>Goal:</strong> ${_escHtml(goal)}`;

    // Hide intent until it's ready
    const intentEl = document.getElementById('cw-intent-understood');
    if (intentEl) intentEl.style.visibility = 'hidden';

    _setState('running');
    _setOrchestratorState('thinking', 'Analyzing your goal…');

    // T+0.7s — reveal parsed intent
    _delay(700, () => {
      const intentText = document.getElementById('cw-intent-text');
      if (intentEl && intentText) {
        intentText.textContent = `I'll help you ${scenario.intentLabel}`;
        intentEl.style.visibility = 'visible';
        intentEl.style.animation  = 'cwSlideIn 0.35s ease';
      }
      _setOrchestratorState('thinking', 'Routing to specialist agents…');
    });

    // T+1.4s — spawn agents
    _delay(1400, () => {
      _setOrchestratorState('working', `Coordinating ${scenario.agents.length} specialist agents…`);
      _spawnAgents(scenario.agents, () => {
        // All agents done
        _delay(500, () => {
          _setOrchestratorState('done', 'All agents completed — results ready');
          _setState('results');
          _showResults(scenario);
          _updateSidebarTask(scenario, 'done');
          _updateIphoneResults(scenario);
        });
      });
    });

    // Sidebar + iPhone live updates
    _addSidebarTask(scenario, 'running');
    _updateIphoneAgents(scenario.agents);
  }

  function _handleIphoneSubmit(rawGoal) {
    const goal = (rawGoal || '').trim();
    if (!goal) return;
    window.App.switchChrome('cowork');
    document.getElementById('ctrl-chrome-select').value = 'cowork';
    setTimeout(() => {
      const ta = document.getElementById('cw-goal-input');
      if (ta) { ta.value = goal; ta.dispatchEvent(new Event('input')); }
      _handleSubmit(goal);
    }, 150);
  }

  // ─── SCENARIO MATCHING ─────────────────────────────────────────────────────
  function _matchScenario(goal) {
    const lower     = goal.toLowerCase();
    const scenarios = window.DATA.coworkScenarios || {};
    for (const s of Object.values(scenarios)) {
      if ((s.keywords || []).some(kw => lower.includes(kw))) return s;
    }
    return Object.values(scenarios)[0]; // default: board meeting
  }

  // ─── ORCHESTRATOR CARD ─────────────────────────────────────────────────────
  function _setOrchestratorState(state, action) {
    const dot      = document.querySelector('#cw-orchestrator-card .cw-agent-status-dot');
    const actionEl = document.getElementById('cw-coord-action');
    if (dot)      dot.className       = 'cw-agent-status-dot ' + state;
    if (actionEl) actionEl.textContent = action;
  }

  // ─── SPAWN AGENTS ──────────────────────────────────────────────────────────
  function _spawnAgents(agents, onAllDone) {
    const grid = document.getElementById('cw-agents-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const cards    = agents.map(a => { const c = _buildAgentCard(a); grid.appendChild(c); return c; });
    let   doneCount = 0;
    const checkDone = () => { if (++doneCount === agents.length) onAllDone?.(); };

    agents.forEach((agent, i) => {
      _delay(i * 200, () => {
        cards[i].classList.add('cw-visible');
        _delay(250, () => _animateAgent(cards[i], agent, checkDone));
      });
    });
  }

  function _buildAgentCard(agent) {
    const card = document.createElement('div');
    card.className = 'cw-agent-card';
    card.id        = 'cw-agent-' + agent.id;
    card.innerHTML = `
      <div class="cw-agent-card-top">
        <div class="cw-agent-icon-wrap" style="background:${agent.color}18;color:${agent.color}">
          <i class="ph ${agent.icon}"></i>
        </div>
        <div class="cw-agent-info">
          <div class="cw-agent-name">${agent.name}</div>
          <div class="cw-agent-action" id="cwa-action-${agent.id}">Queued…</div>
        </div>
        <div class="cw-agent-status-dot" id="cwa-dot-${agent.id}"></div>
      </div>
      <div class="cw-agent-progress">
        <div class="cw-agent-progress-fill" id="cwa-bar-${agent.id}"></div>
      </div>
      <div class="cw-agent-result" id="cwa-result-${agent.id}">
        <i class="ph ph-check-circle"></i>
        <span>${agent.result}</span>
      </div>`;
    return card;
  }

  function _animateAgent(cardEl, agent, onDone) {
    const dot     = document.getElementById('cwa-dot-'   + agent.id);
    const action  = document.getElementById('cwa-action-' + agent.id);
    const bar     = document.getElementById('cwa-bar-'    + agent.id);
    const actions = agent.actions || [];

    // Phase 1: thinking
    cardEl.classList.add('agent-thinking');
    if (dot)    dot.className    = 'cw-agent-status-dot thinking';
    if (bar)    bar.style.width  = '15%';
    if (action && actions[0]) action.textContent = actions[0];

    _delay(1100, () => {
      // Phase 2: working — cycle action messages
      cardEl.classList.remove('agent-thinking');
      cardEl.classList.add('agent-working');
      if (dot) dot.className = 'cw-agent-status-dot working';

      let msgIdx = 1;
      const cycleMsg = () => {
        if (msgIdx < actions.length) {
          if (action) action.textContent = actions[msgIdx++];
          if (bar)    bar.style.width    = (15 + msgIdx * 18) + '%';
        }
      };
      cycleMsg();
      const timer = setInterval(cycleMsg, 1000);
      _timers.push(timer);

      const workTime = 1500 + Math.random() * 700;
      _delay(workTime, () => {
        clearInterval(timer);
        // Phase 3: done
        cardEl.classList.remove('agent-thinking', 'agent-working');
        cardEl.classList.add('agent-done');
        if (dot)    dot.className    = 'cw-agent-status-dot done';
        if (action) action.textContent = 'Complete';
        if (bar)    bar.style.width  = '100%';
        onDone?.();
      });
    });
  }

  // ─── RESULTS ───────────────────────────────────────────────────────────────
  function _showResults(scenario) {
    const grid    = document.getElementById('cw-results-grid');
    const sub     = document.getElementById('cw-results-sub');
    const confirm = document.getElementById('cw-delivery-confirm');

    if (sub) sub.textContent = `${scenario.agents.length} agents completed · ${scenario.label}`;

    if (grid) {
      grid.innerHTML = '';
      scenario.results.forEach(result => {
        const card = document.createElement('div');
        card.className = 'cw-result-card';
        card.innerHTML = `
          <div class="cw-result-icon-wrap" style="background:${result.color}18;color:${result.color}">
            <i class="ph ${result.icon}"></i>
          </div>
          <div class="cw-result-body">
            <div class="cw-result-title">${result.title}</div>
            <div class="cw-result-subtitle">${result.subtitle}</div>
            <div class="cw-result-actions">
              <button class="cw-result-btn primary">${result.primaryAction || 'Open'}</button>
              <button class="cw-result-btn secondary">${result.secondaryAction || 'Share'}</button>
            </div>
          </div>`;
        card.querySelectorAll('.cw-result-btn').forEach(btn => {
          btn.addEventListener('click', () => window.App.toast(`${btn.textContent}: ${result.title}`, 'success'));
        });
        grid.appendChild(card);
      });
    }

    if (confirm) {
      const targetMap = { feed: 'your Proactive Feed', slack: 'Slack DM', email: 'Email', salesforce: 'Salesforce' };
      const whenMap   = { now: 'right now', morning: 'tomorrow morning at 8 AM', weekly: 'every Monday at 8 AM' };
      confirm.innerHTML = `
        <i class="ph ph-check-circle"></i>
        Results delivered to <strong>${targetMap[_deliveryTarget] || _deliveryTarget}</strong>
        &nbsp;·&nbsp; ${whenMap[_deliveryWhen] || _deliveryWhen}`;
    }
  }

  // ─── SIDEBAR ───────────────────────────────────────────────────────────────
  function _renderSidebarTasks() {
    const done = document.getElementById('cw-done-tasks');
    if (done) {
      done.innerHTML = `
        <div class="cw-task-item done">
          <div class="cw-task-dot"></div>Board Meeting Brief — Mar 10
        </div>
        <div class="cw-task-item done">
          <div class="cw-task-dot"></div>FDIC Compliance Summary — Mar 8
        </div>`;
    }
  }

  function _addSidebarTask(scenario, status) {
    const active = document.getElementById('cw-active-tasks');
    if (!active) return;
    // Remove any previous task with same key
    document.getElementById('cw-task-' + scenario.key)?.remove();
    const item       = document.createElement('div');
    item.className   = 'cw-task-item ' + status;
    item.id          = 'cw-task-' + scenario.key;
    item.innerHTML   = `<div class="cw-task-dot"></div>${scenario.label}`;
    active.insertBefore(item, active.firstChild);
  }

  function _updateSidebarTask(scenario, status) {
    const item = document.getElementById('cw-task-' + scenario.key);
    if (!item) return;
    item.className = 'cw-task-item ' + status;
    if (status === 'done') {
      const done = document.getElementById('cw-done-tasks');
      done?.insertBefore(item, done.firstChild);
    }
  }

  // ─── IPHONE SYNC ───────────────────────────────────────────────────────────
  function _renderIphoneDefaults() {
    const greetEl = document.getElementById('iphone-greeting');
    if (greetEl) {
      const h     = new Date().getHours();
      const part  = h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';
      greetEl.textContent = `Good ${part}, Carmen.`;
    }

    const resultsList = document.getElementById('iphone-results');
    if (resultsList && resultsList.children.length === 0) {
      resultsList.innerHTML = `
        <div class="iphone-result-item">
          <div class="iphone-result-icon" style="background:rgba(1,118,211,0.12);color:#0176d3">
            <i class="ph ph-presentation-chart"></i>
          </div>
          <div>
            <div class="iphone-result-title">Board Meeting Brief</div>
            <div class="iphone-result-sub">5 talking points · Completed 2h ago</div>
          </div>
          <i class="ph ph-caret-right iphone-result-chevron"></i>
        </div>
        <div class="iphone-result-item">
          <div class="iphone-result-icon" style="background:rgba(220,38,38,0.12);color:#dc2626">
            <i class="ph ph-shield-check"></i>
          </div>
          <div>
            <div class="iphone-result-title">FDIC Risk Summary</div>
            <div class="iphone-result-sub">3 risk items · Completed yesterday</div>
          </div>
          <i class="ph ph-caret-right iphone-result-chevron"></i>
        </div>`;
    }

    const agentsList = document.getElementById('iphone-agents');
    if (agentsList && agentsList.children.length === 0) {
      agentsList.innerHTML = `
        <div style="font-size:12px;color:var(--text-muted);padding:6px 0;">
          No active agents — start a task below.
        </div>`;
    }
  }

  function _updateIphoneAgents(agents) {
    const list = document.getElementById('iphone-agents');
    if (!list) return;
    list.innerHTML = '';
    agents.forEach(agent => {
      const item = document.createElement('div');
      item.className = 'iphone-agent-item';
      item.id        = 'iphone-agent-' + agent.id;
      item.innerHTML = `
        <div class="iphone-agent-icon" style="background:${agent.color}18;color:${agent.color}">
          <i class="ph ${agent.icon}"></i>
        </div>
        <div class="iphone-agent-text">
          <div class="iphone-agent-name">${agent.name}</div>
          <div class="iphone-agent-action">${agent.actions[0] || 'Starting…'}</div>
        </div>
        <div class="iphone-agent-dot" id="iphone-dot-${agent.id}"></div>`;
      list.appendChild(item);
    });
  }

  function _updateIphoneResults(scenario) {
    const list = document.getElementById('iphone-results');
    if (!list) return;
    scenario.results.slice().reverse().forEach(result => {
      const item = document.createElement('div');
      item.className = 'iphone-result-item';
      item.innerHTML = `
        <div class="iphone-result-icon" style="background:${result.color}18;color:${result.color}">
          <i class="ph ${result.icon}"></i>
        </div>
        <div>
          <div class="iphone-result-title">${result.title}</div>
          <div class="iphone-result-sub">${result.subtitle}</div>
        </div>
        <i class="ph ph-caret-right iphone-result-chevron"></i>`;
      list.insertBefore(item, list.firstChild);
    });
    // Mark all agent dots done
    document.querySelectorAll('[id^="iphone-dot-"]').forEach(dot => {
      dot.className = 'iphone-agent-dot done';
    });
    document.querySelectorAll('.iphone-agent-action').forEach(el => {
      el.textContent = 'Complete';
    });
  }

  // ─── CANCEL / RESET ────────────────────────────────────────────────────────
  function _cancel() {
    _timers.forEach(t => { clearTimeout(t); clearInterval(t); });
    _timers = [];
    _setState('idle');
    const ta = document.getElementById('cw-goal-input');
    if (ta) ta.value = '';
    window.App.toast('Agents stopped', 'info');
  }

  function _reset() {
    _cancel();
  }

  // ─── HELPERS ───────────────────────────────────────────────────────────────
  function _delay(ms, fn) {
    const t = setTimeout(fn, ms);
    _timers.push(t);
    return t;
  }

  function _escHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ─── EXPOSE ────────────────────────────────────────────────────────────────
  return { init, onChromeActive };

})();
