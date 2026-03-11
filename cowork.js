// cowork.js — Astro Cowork Agent Simulation Engine
// Depends on: data.js (window.DATA.coworkScenarios, window.DATA.coworkExamples)
//             app.js  (window.App.toast, window.App.switchChrome)
//             panels.js (window.Panels.open)

'use strict';

window.Cowork = (function () {

  // ─── CONSTANTS ─────────────────────────────────────────────────────────────
  const STORAGE_KEY = 'astro-cowork-tasks';

  // Action → handler map; keeps data.js clean
  // Populated after _showCardToast and _switchTo are defined below
  let _ACTION_MAP = {};

  // ─── STATE ─────────────────────────────────────────────────────────────────
  let _deliveryTarget  = 'feed';
  let _deliveryWhen    = 'now';
  let _timers          = [];
  let _activeScenario  = null;
  let _previousChrome  = 'new-tab'; // tracks chrome before switching to cowork

  // ─── LOCAL STORAGE ─────────────────────────────────────────────────────────
  function _loadTasks() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); }
    catch { return null; }
  }

  function _saveTasks(tasks) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); } catch (e) {}
  }

  function _seedTasks() {
    const now = Date.now();
    const tasks = {
      active: [
        {
          id: 'task-followup-seed', key: 'follow-up', label: 'Follow Up Stale Leads',
          goal: "Follow up with leads who haven't responded in 2+ weeks",
          deliveryTarget: 'slack', deliveryWhen: 'daily',
          createdAt: now - 3600000
        }
      ],
      completed: [
        {
          id: 'task-compliance-seed', key: 'compliance', label: 'Q1 Compliance Risk Summary',
          goal: 'Summarize Q1 compliance risks in our loan portfolio',
          deliveryTarget: 'email', deliveryWhen: 'now',
          completedAt: now - 172800000
        }
      ]
    };
    _saveTasks(tasks);
    return tasks;
  }

  // ─── INIT ──────────────────────────────────────────────────────────────────
  function init() {
    _buildActionMap();
    _renderExamples();
    _renderSidebarTasks();
    _renderIphoneDefaults();
    _setState('idle');
    _bindEvents();
  }

  function _buildActionMap() {
    _ACTION_MAP = {
      'Open Brief':         (card) => _switchTo('salesforce'),
      'Send to Team':       (card) => _showCardToast(card, 'Brief sent to Marcus, Keisha & David via email ✓', 'success'),
      'View in Salesforce': (card) => _switchTo('salesforce'),
      'Draft Follow-up':    (card) => window.Panels.open('beacon-deal'),
      'Open Document':      (card) => _showCardToast(card, 'Opening Q2 Budget Reforecast in Google Docs…', 'info'),
      'Add to Brief':       (card) => _showCardToast(card, 'Added to Board Meeting Brief ✓', 'success'),
      'Review & Send':      (card) => _showCardToast(card, 'Email queued for delivery at optimal send time ✓', 'success'),
      'Edit Draft':         (card) => _showCardToast(card, 'Opening draft in Gmail…', 'info'),
      'View Intelligence':  (card) => window.Panels.open('beacon-deal'),
      'Escalate to Marcus': (card) => _showCardToast(card, 'Escalated to Marcus Thompson via Slack ✓', 'success'),
      'Open Report':        (card) => window.Panels.open('fdic-diff'),
      'Share with Keisha':  (card) => _showCardToast(card, 'Risk summary shared with Keisha Williams ✓', 'success'),
      'View Task':          (card) => window.Panels.open('fdic-diff'),
      'Notify Keisha':      (card) => _showCardToast(card, 'Keisha notified via Slack · Due Mar 15 ✓', 'warning'),
      'View Analysis':      (card) => window.Panels.open('cra-collaborators'),
      'Open CRA Doc':       (card) => window.Panels.open('cra-collaborators'),
      'Read Report':        (card) => _showCardToast(card, 'Opening Competitive Intel Report Issue #1…', 'info'),
      'Customize':          (card) => _showCardToast(card, 'Opening report preferences…', 'info'),
      'View Schedule':      (card) => _showCardToast(card, 'Scheduled: Every Monday at 8:00 AM · Astro Feed ✓', 'success'),
      'Adjust Timing':      (card) => _showCardToast(card, 'Opening delivery schedule settings…', 'info'),
      'View Brief':         (card) => window.Panels.open('morning-brief'),
      'Schedule Call':      (card) => _showCardToast(card, 'Opening Calendly to schedule with Plaid team…', 'info'),
    };
  }

  // Called by app.js when cowork/iphone chrome becomes active
  function onChromeActive(chromeKey) {
    if (chromeKey === 'iphone') _renderIphoneDefaults();
  }

  // ─── STATE MANAGEMENT ──────────────────────────────────────────────────────
  function _setState(state) {
    document.querySelectorAll('.cw-state').forEach(el => el.classList.remove('cw-active'));
    const el = document.getElementById('cw-state-' + state);
    if (el) el.classList.add('cw-active');
  }

  // ─── CHROME NAVIGATION ─────────────────────────────────────────────────────
  function _switchTo(chromeKey) {
    window.App.switchChrome(chromeKey);
    const sel = document.getElementById('ctrl-chrome-select');
    if (sel) sel.value = chromeKey;
    // switchChrome already syncs the global toggle via app.js
  }

  function _syncGlobalToggle(mode) {
    document.querySelectorAll('#global-mode-toggle .global-mode-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.mode === mode);
    });
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
        textarea.style.height = Math.min(textarea.scrollHeight, 220) + 'px';
      });
    }

    // ── Cancel / New task buttons ────
    const cancelBtn      = document.getElementById('cw-cancel-btn');
    const newTaskInline  = document.querySelector('.cw-new-task-inline');
    const newTaskSidebar = document.querySelector('.cw-new-task-btn');
    if (cancelBtn)      cancelBtn.addEventListener('click', _cancel);
    if (newTaskInline)  newTaskInline.addEventListener('click', _reset);
    if (newTaskSidebar) newTaskSidebar.addEventListener('click', _reset);

    // ── Delivery "to" chips ────
    document.querySelectorAll('[data-target]').forEach(chip => {
      chip.addEventListener('click', function () {
        document.querySelectorAll('[data-target]').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        _deliveryTarget = this.dataset.target;
      });
    });

    // ── Delivery "when" chips ────
    document.querySelectorAll('[data-when]').forEach(chip => {
      chip.addEventListener('click', function () {
        document.querySelectorAll('[data-when]').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        _deliveryWhen = this.dataset.when;
      });
    });

    // ── 2-mode Ask/Cowork buttons inside cowork sidebar ────
    document.querySelectorAll('.cw-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.mode === 'ask') {
          _switchTo(_previousChrome || 'new-tab');
        }
        // clicking cowork while already on cowork → do nothing
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

    // ── Global mode toggle (Ask Astro / Astro Cowork) ────
    document.addEventListener('click', e => {
      const btn = e.target.closest('#global-mode-toggle .global-mode-btn');
      if (!btn) return;
      const mode = btn.dataset.mode;
      if (mode === 'cowork') {
        const sel = document.getElementById('ctrl-chrome-select');
        _previousChrome = sel?.value || 'new-tab';
        _switchTo('cowork');
      } else {
        const target = _previousChrome || 'new-tab';
        _switchTo(target);
      }
    });

    // ── Intercept Enter on any search input in cowork mode ────
    document.querySelectorAll('.proactive-search-input, .sf-ask-search-input').forEach(input => {
      input.dataset.originalPlaceholder = input.placeholder;
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && this.dataset.mode === 'cowork') {
          e.stopImmediatePropagation();
          const goal = this.value.trim();
          if (!goal) return;
          this.value = '';
          document.getElementById('chrome-salesforce')?.classList.remove('sf-ask-mode');
          const sel = document.getElementById('ctrl-chrome-select');
          _previousChrome = sel?.value || 'new-tab';
          _switchTo('cowork');
          setTimeout(() => _handleSubmit(goal), 120);
        }
      }, true);
    });

    // ── SF submit button in ask-view (cowork mode) ────
    document.querySelector('.sf-ask-submit')?.addEventListener('click', () => {
      const sfInput = document.getElementById('sf-ask-input');
      if (sfInput?.dataset.mode === 'cowork' && sfInput.value.trim()) {
        const goal = sfInput.value.trim();
        sfInput.value = '';
        document.getElementById('chrome-salesforce')?.classList.remove('sf-ask-mode');
        const sel = document.getElementById('ctrl-chrome-select');
        _previousChrome = sel?.value || 'new-tab';
        _switchTo('cowork');
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

  // ─── SIDEBAR TASKS ─────────────────────────────────────────────────────────
  function _renderSidebarTasks() {
    let tasks = _loadTasks() || _seedTasks();
    const schedMap = {
      now:     '',
      morning: '· Tomorrow 8 AM',
      daily:   '· Daily at 8 AM',
      hourly:  '· Hourly',
      weekly:  '· Every Monday'
    };

    const activeEl = document.getElementById('cw-active-tasks');
    if (activeEl) {
      activeEl.innerHTML = '';
      (tasks.active || []).forEach(task => {
        const sched = schedMap[task.deliveryWhen] || '';
        const item = document.createElement('div');
        item.className = 'cw-task-item running';
        item.id = 'cw-sidebar-task-' + task.id;
        item.innerHTML = `
          <div class="cw-task-dot"></div>
          <div class="cw-task-label-wrap">
            <span class="cw-task-label">${_escHtml(task.label)}</span>
            ${sched ? `<span class="cw-task-sched">${sched}</span>` : ''}
          </div>
          <button class="cw-task-edit-btn" title="Edit task"><i class="ph ph-pencil-simple"></i></button>`;
        item.addEventListener('click', e => {
          if (!e.target.closest('.cw-task-edit-btn')) _viewTask(task);
        });
        item.querySelector('.cw-task-edit-btn').addEventListener('click', e => {
          e.stopPropagation();
          _editTask(task);
        });
        activeEl.appendChild(item);
      });
    }

    const doneEl = document.getElementById('cw-done-tasks');
    if (doneEl) {
      doneEl.innerHTML = '';
      (tasks.completed || []).forEach(task => {
        const dateStr = new Date(task.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const item = document.createElement('div');
        item.className = 'cw-task-item done';
        item.innerHTML = `
          <div class="cw-task-dot"></div>
          <div class="cw-task-label-wrap">
            <span class="cw-task-label">${_escHtml(task.label)}</span>
            <span class="cw-task-sched">Completed ${dateStr}</span>
          </div>`;
        item.addEventListener('click', () => _viewTask(task));
        doneEl.appendChild(item);
      });
    }
  }

  function _viewTask(task) {
    const scenario = (window.DATA.coworkScenarios || {})[task.key];
    if (!scenario) return;
    _activeScenario  = scenario;
    _deliveryTarget  = task.deliveryTarget || 'feed';
    _deliveryWhen    = task.deliveryWhen   || 'now';
    // Clear previous results
    document.getElementById('cw-results-grid').innerHTML   = '';
    document.getElementById('cw-delivery-confirm').innerHTML = '';
    _setState('results');
    _showResults(scenario);
  }

  function _editTask(task) {
    _setState('idle');
    const ta = document.getElementById('cw-goal-input');
    if (ta) {
      ta.value = task.goal;
      ta.dispatchEvent(new Event('input'));
      setTimeout(() => ta.focus(), 80);
    }
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

    // Hide intent until ready
    const intentEl = document.getElementById('cw-intent-understood');
    if (intentEl) intentEl.style.visibility = 'hidden';

    _setState('running');
    _setOrchestratorState('thinking', 'Analyzing your goal…');

    // Persist as active task
    _persistActiveTask(scenario, goal);
    _renderSidebarTasks();

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
        _delay(600, () => {
          _setOrchestratorState('done', 'All agents completed — results ready');
          _setState('results');
          _showResults(scenario);
          _persistCompletedTask(scenario, goal);
          _renderSidebarTasks();
          _updateIphoneResults(scenario);
        });
      });
    });

    // iPhone live updates
    _updateIphoneAgents(scenario.agents);
  }

  function _handleIphoneSubmit(rawGoal) {
    const goal = (rawGoal || '').trim();
    if (!goal) return;
    const sel = document.getElementById('ctrl-chrome-select');
    _previousChrome = sel?.value || 'new-tab';
    _switchTo('cowork');
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
      // Staggered spawn: 300ms base + 150–550ms per agent
      const spawnDelay = 300 + i * (150 + Math.random() * 400);
      _delay(spawnDelay, () => {
        cards[i].classList.add('cw-visible');
        // Small offset after card appears before starting animation
        _delay(180, () => _animateAgent(cards[i], agent, checkDone));
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
    const dot     = document.getElementById('cwa-dot-'    + agent.id);
    const action  = document.getElementById('cwa-action-' + agent.id);
    const bar     = document.getElementById('cwa-bar-'    + agent.id);
    const actions = agent.actions || [];

    // Phase 1: thinking (1.2s – 2.8s, randomized)
    const thinkTime = 1200 + Math.random() * 1600;
    cardEl.classList.add('agent-thinking');
    if (dot)    dot.className    = 'cw-agent-status-dot thinking';
    if (bar)    bar.style.width  = '10%';
    if (action && actions[0]) action.textContent = actions[0];

    _delay(thinkTime, () => {
      // Phase 2: working — cycle through action messages
      cardEl.classList.remove('agent-thinking');
      cardEl.classList.add('agent-working');
      if (dot) dot.className = 'cw-agent-status-dot working';

      let msgIdx = 1;
      const actionInterval = 700 + Math.random() * 700; // 700–1400ms per message
      const cycleMsg = () => {
        if (msgIdx < actions.length) {
          if (action) action.textContent = actions[msgIdx++];
          // Progress advances: 20% → 35% → 55% → 75%
          if (bar) bar.style.width = (20 + msgIdx * 18) + '%';
        }
      };
      cycleMsg();
      const timer = setInterval(cycleMsg, actionInterval);
      _timers.push(timer);

      // Phase 3: done (3s – 7s of working)
      const workTime = 3000 + Math.random() * 4000;
      _delay(workTime, () => {
        clearInterval(timer);
        cardEl.classList.remove('agent-thinking', 'agent-working');
        cardEl.classList.add('agent-done');
        if (dot)    dot.className     = 'cw-agent-status-dot done';
        if (action) action.textContent = 'Complete';
        if (bar)    bar.style.width   = '100%';
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

        // Wire up button actions
        const btns = card.querySelectorAll('.cw-result-btn');
        const primaryLabel   = result.primaryAction || 'Open';
        const secondaryLabel = result.secondaryAction || 'Share';
        const primaryFn   = _ACTION_MAP[primaryLabel];
        const secondaryFn = _ACTION_MAP[secondaryLabel];

        if (btns[0]) btns[0].addEventListener('click', () => primaryFn   ? primaryFn(card)   : _showCardToast(card, `${primaryLabel}…`,   'info'));
        if (btns[1]) btns[1].addEventListener('click', () => secondaryFn ? secondaryFn(card) : _showCardToast(card, `${secondaryLabel}…`, 'info'));

        grid.appendChild(card);
      });
    }

    if (confirm) {
      const targetMap = { feed: 'your Astro Feed', slack: 'Slack DM', email: 'your Email' };
      const whenMap   = {
        now:     'right now',
        morning: 'tomorrow at 8 AM',
        daily:   'daily at 8 AM',
        hourly:  'every hour',
        weekly:  'every Monday at 8 AM'
      };
      confirm.innerHTML = `
        <i class="ph ph-check-circle"></i>
        Results delivered to <strong>${targetMap[_deliveryTarget] || _deliveryTarget}</strong>
        &nbsp;·&nbsp; ${whenMap[_deliveryWhen] || _deliveryWhen}`;
    }
  }

  // ─── IN-CARD TOAST ─────────────────────────────────────────────────────────
  function _showCardToast(cardEl, message, type) {
    cardEl.querySelector('.cw-card-toast')?.remove();
    const t = document.createElement('div');
    t.className = `cw-card-toast cw-card-toast-${type}`;
    const iconMap = { success: 'ph-check-circle', warning: 'ph-warning', info: 'ph-info' };
    t.innerHTML = `<i class="ph ${iconMap[type] || 'ph-info'}"></i> ${message}`;
    // Insert after .cw-result-actions inside .cw-result-body
    const body = cardEl.querySelector('.cw-result-body');
    if (body) body.appendChild(t);
    else cardEl.appendChild(t);

    _timers.push(setTimeout(() => {
      t.classList.add('cw-toast-fade');
      setTimeout(() => t.remove(), 400);
    }, 5000));
  }

  // ─── PERSIST TASKS ─────────────────────────────────────────────────────────
  function _persistActiveTask(scenario, goal) {
    let tasks = _loadTasks() || { active: [], completed: [] };
    // Remove any prior entry with same key to avoid dupes
    tasks.active = tasks.active.filter(t => t.key !== scenario.key);
    tasks.active.unshift({
      id: 'task-' + scenario.key + '-' + Date.now(),
      key: scenario.key,
      label: scenario.label,
      goal: goal,
      deliveryTarget: _deliveryTarget,
      deliveryWhen: _deliveryWhen,
      createdAt: Date.now()
    });
    _saveTasks(tasks);
  }

  function _persistCompletedTask(scenario, goal) {
    let tasks = _loadTasks() || { active: [], completed: [] };
    // Move from active → completed
    tasks.active = tasks.active.filter(t => t.key !== scenario.key);
    tasks.completed = tasks.completed.filter(t => t.key !== scenario.key); // avoid dupes
    tasks.completed.unshift({
      id: 'task-' + scenario.key + '-done-' + Date.now(),
      key: scenario.key,
      label: scenario.label,
      goal: goal,
      deliveryTarget: _deliveryTarget,
      deliveryWhen: _deliveryWhen,
      completedAt: Date.now()
    });
    // Keep only 10 completed entries
    tasks.completed = tasks.completed.slice(0, 10);
    _saveTasks(tasks);
  }

  // ─── IPHONE SYNC ───────────────────────────────────────────────────────────
  function _renderIphoneDefaults() {
    const greetEl = document.getElementById('iphone-greeting');
    if (greetEl) {
      const h    = new Date().getHours();
      const part = h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';
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
