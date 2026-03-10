// app.js — Chrome Switching, Card Rendering, Claude API, Events
// Depends on: data.js, panels.js

'use strict';

// ─── CHROME ID MAP ───────────────────────────────────────────────────────────
// Maps dropdown option values → DOM element IDs
const CHROME_IDS = {
  'new-tab':      'chrome-new-tab',
  'salesforce':   'chrome-salesforce',
  'teams':        'chrome-teams',
  'mac-app':      'chrome-mac-app',
  'claude-ext':   'chrome-claude-ext',
  'chatgpt-ext':  'chrome-chatgpt-ext'
};

let _currentChrome = 'new-tab';
let _aiCards = [];          // cards added via Claude API
let _searchResultCards = []; // cards injected by search handler
let _searchHandler = null;   // hookable external search backend

// ─── EXPOSE PUBLIC API ───────────────────────────────────────────────────────
window.App = {
  toast:                 _showToast,
  switchChrome,
  renderCards,
  // Hookable search: fn(query, chromeKey) → Promise<card[]> | card[]
  registerSearchHandler: (fn) => { _searchHandler = fn; },
  // Inject result cards above the current feed
  injectSearchResults:   (cards) => { _searchResultCards = cards; _rerenderWithResults(); }
};

// ─── INIT ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  _initClock();
  _initGreeting();
  _initControls();
  _initPanelClose();
  _initSearchBars();
  _initTeamsChat();
  switchChrome('new-tab');
});

// ─── CLOCK ───────────────────────────────────────────────────────────────────
function _initClock() {
  function update() {
    const now  = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    const date = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    document.querySelectorAll('.live-clock').forEach(el => el.textContent = time);
    document.querySelectorAll('.live-date').forEach(el  => el.textContent = date);
  }
  update();
  setInterval(update, 1000);
}

// ─── GREETING ────────────────────────────────────────────────────────────────
function _initGreeting() {
  const hour  = new Date().getHours();
  const parts = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
  const greeting = `Good ${parts}, Carmen.`;

  const ntEl  = document.getElementById('new-tab-greeting');
  const macEl = document.getElementById('mac-greeting');
  if (ntEl)  ntEl.textContent = greeting;
  if (macEl) macEl.textContent = greeting;

  // Also update the SF Ask Astro hero greeting
  const sfHero = document.querySelector('.sf-ask-heading');
  if (sfHero) sfHero.textContent = `Good ${parts}, Carmen.`;
}

// ─── CONTROLS ────────────────────────────────────────────────────────────────
function _initControls() {
  // Chrome switcher
  const chromeSelect = document.getElementById('ctrl-chrome-select');
  chromeSelect.addEventListener('change', e => switchChrome(e.target.value));

  // Theme toggle
  const themeBtn   = document.getElementById('ctrl-theme-toggle');
  const themeLabel = document.getElementById('theme-label');
  const themeIcon  = themeBtn.querySelector('i');

  themeBtn.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    document.documentElement.setAttribute('data-theme', isLight ? 'dark' : 'light');
    themeLabel.textContent = isLight ? 'Light' : 'Dark';
    themeIcon.className    = isLight ? 'ph ph-moon' : 'ph ph-sun';
    _showToast(isLight ? 'Switched to dark theme' : 'Switched to light theme', 'info');
  });

  // Settings gear toggle
  const settingsBtn = document.getElementById('ctrl-settings-btn');
  const settingsDd  = document.getElementById('ctrl-settings-dropdown');

  settingsBtn.addEventListener('click', e => {
    e.stopPropagation();
    settingsDd.classList.toggle('open');
  });
  document.addEventListener('click', e => {
    if (!settingsDd.contains(e.target) && e.target !== settingsBtn) {
      settingsDd.classList.remove('open');
    }
  });

  // Upload button triggers hidden file input
  document.getElementById('ctrl-upload-btn').addEventListener('click', () => {
    document.getElementById('ctrl-file-input').click();
  });

  // File input change → upload + Claude API
  document.getElementById('ctrl-file-input').addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) _handleFileUpload(file);
    e.target.value = '';
    settingsDd.classList.remove('open');
  });

  // Salesforce nav icon interaction
  document.querySelectorAll('.sf-nav-icon').forEach(icon => {
    icon.addEventListener('click', function() {
      document.querySelectorAll('.sf-nav-icon').forEach(i => i.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Teams sidebar icon interaction — routes between activity feed and chat
  document.querySelectorAll('.teams-sidebar-icon').forEach(icon => {
    icon.addEventListener('click', function() {
      document.querySelectorAll('.teams-sidebar-icon').forEach(i => i.classList.remove('active'));
      this.classList.add('active');
      const panel = this.dataset.panel;
      const teamsContent = document.querySelector('#chrome-teams .teams-content-area');
      const chatView     = document.querySelector('#chrome-teams .teams-chat-view');
      if (panel === 'chat') {
        if (teamsContent) teamsContent.style.display = 'none';
        if (chatView)     chatView.style.display     = 'flex';
      } else {
        if (teamsContent) teamsContent.style.display = '';
        if (chatView)     chatView.style.display     = 'none';
      }
    });
  });

  // Claude nav item interaction
  document.querySelectorAll('.claude-nav-item').forEach(item => {
    item.addEventListener('click', function() {
      document.querySelectorAll('.claude-nav-item').forEach(i => i.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

// ─── PANEL CLOSE ─────────────────────────────────────────────────────────────
function _initPanelClose() {
  document.getElementById('panel-close-btn').addEventListener('click', window.Panels.close);
  document.getElementById('panel-overlay').addEventListener('click', window.Panels.close);

  // Escape key closes panel
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') window.Panels.close();
  });
}

// ─── SEARCH BARS ─────────────────────────────────────────────────────────────
function _initSearchBars() {
  // Attach submit handlers to all search bars (Enter key + Ask button)
  document.querySelectorAll('.proactive-search-input').forEach(input => {
    const wrap = input.closest('.search-input-wrap') || input.closest('.sf-ask-input-wrap') || input.closest('.teams-search-input-wrap');
    if (!wrap) return;
    const btn = wrap.querySelector('.search-ask-btn');
    const submit = () => _handleSearch(input.value, input.dataset.chrome || 'default');
    if (btn) btn.addEventListener('click', submit);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
  });

  // Salesforce: "Ask Astro" button → enter full-page mode
  const sfTrigger = document.querySelector('.sf-ask-trigger');
  const sfBack    = document.querySelector('.sf-ask-back');
  const sfChrome  = document.getElementById('chrome-salesforce');
  const sfAskInput = document.getElementById('sf-ask-input');

  if (sfTrigger) {
    sfTrigger.addEventListener('click', () => {
      sfChrome?.classList.add('sf-ask-mode');
      sfAskInput?.focus();
      // Populate the ask-view cards-mount if empty
      const askMount = document.querySelector('.sf-ask-results-area .cards-mount');
      if (askMount && askMount.children.length === 0) renderCards(askMount);
    });
  }

  if (sfBack) {
    sfBack.addEventListener('click', () => {
      sfChrome?.classList.remove('sf-ask-mode');
    });
  }
}

// ─── SEARCH HANDLER ──────────────────────────────────────────────────────────
async function _handleSearch(query, chromeKey) {
  if (!query || !query.trim()) return;
  _showToast(`Searching for "${query.trim()}"…`, 'info');
  if (_searchHandler) {
    try {
      const results = await Promise.resolve(_searchHandler(query.trim(), chromeKey));
      if (Array.isArray(results)) window.App.injectSearchResults(results);
    } catch (e) {
      _showToast('Search error: ' + e.message, 'error');
    }
  }
}

function _rerenderWithResults() {
  // Re-render current chrome's cards-mount with result cards prepended
  const mount = document.querySelector(`#${CHROME_IDS[_currentChrome]} .cards-mount`);
  if (!mount) return;
  mount.innerHTML = '';
  const allCards = [..._searchResultCards, ...window.DATA.cards, ..._aiCards];
  allCards.forEach(card => mount.appendChild(_buildCard(card)));
}

// ─── TEAMS CHAT ───────────────────────────────────────────────────────────────
function _initTeamsChat() {
  // Attach conversation item click handlers
  document.querySelectorAll('.teams-conv-item').forEach(item => {
    item.addEventListener('click', function() {
      document.querySelectorAll('.teams-conv-item').forEach(i => i.classList.remove('active'));
      this.classList.add('active');
      _renderTeamsChat(this.dataset.conv);
    });
  });

  // Render the default conversation (marcus) on load
  _renderTeamsChat('marcus');
}

function _renderTeamsChat(convKey) {
  const conv = window.DATA.teamsChats?.[convKey];
  const area = document.getElementById('teams-messages-area');
  if (!area || !conv) return;

  area.innerHTML = conv.messages.map(msg => `
    <div class="teams-msg ${msg.from === 'me' ? 'teams-msg-me' : 'teams-msg-them'}">
      ${msg.from === 'them'
        ? `<div class="teams-msg-avatar" style="background:${conv.person.color}">${conv.person.initials}</div>`
        : ''}
      <div class="teams-msg-content">
        ${msg.from === 'them' ? `<span class="teams-msg-sender">${conv.person.name}</span>` : ''}
        <div class="teams-msg-bubble">${msg.text}</div>
        <span class="teams-msg-time">${msg.time}</span>
      </div>
    </div>
  `).join('');

  // Scroll to bottom
  area.scrollTop = area.scrollHeight;

  // Update thread header
  const hdr = document.querySelector('.teams-thread-header .tth-name');
  const sub = document.querySelector('.teams-thread-header .tth-title');
  if (hdr) hdr.textContent = conv.person.name;
  if (sub) sub.textContent = conv.person.title;
}

// ─── CHROME SWITCHING ─────────────────────────────────────────────────────────
function switchChrome(value) {
  _currentChrome = value;

  // Hide all chrome wrappers
  document.querySelectorAll('.chrome-wrapper').forEach(el => {
    el.classList.remove('chrome-active');
  });

  // Show target
  const chromeId = CHROME_IDS[value];
  const target   = document.getElementById(chromeId);
  if (!target) return;

  target.classList.add('chrome-active');

  // Short delay for polish then render
  const mount = target.querySelector('.cards-mount');
  if (!mount) return;

  _showSkeletons(mount);
  setTimeout(() => renderCards(mount), 250);
}

// ─── SKELETON LOADING STATE ───────────────────────────────────────────────────
function _showSkeletons(mount) {
  mount.innerHTML = '';
  for (let i = 0; i < 6; i++) {
    const sk = document.createElement('div');
    sk.className = 'skeleton skeleton-card';
    mount.appendChild(sk);
  }
}

// ─── CARD RENDERING ───────────────────────────────────────────────────────────
function renderCards(mountEl) {
  mountEl.innerHTML = '';
  const allCards = [..._searchResultCards, ...window.DATA.cards, ..._aiCards];
  allCards.forEach(card => mountEl.appendChild(_buildCard(card)));
}

function _buildCard(card) {
  const el = document.createElement('div');
  el.className = `proactive-card urgency-${card.urgency}`;
  el.dataset.cardId = card.id;

  el.innerHTML = `
    <div class="card-header">
      <span class="source-badge" style="--badge-color: ${card.sourceBadgeColor}">
        <i class="ph ${card.sourceIcon}"></i>
        ${card.source}
      </span>
      <span class="card-label">${card.label}</span>
      <button class="card-dismiss" aria-label="Dismiss card">×</button>
    </div>
    <div class="card-body">
      <div class="card-title">${card.title}</div>
      <div class="card-subtitle">${card.subtitle}</div>
      <div class="card-body-text">${card.body}</div>
    </div>
    <div class="card-footer">
      <div class="card-ctas">
        ${card.ctas.map((cta, i) =>
          `<button class="card-cta-btn ${i === 0 ? 'primary' : 'secondary'}"
                   data-panel="${cta.panelId || ''}"
                   data-action="${cta.action || ''}"
                   data-message="${cta.message || ''}"
                   data-url="${cta.url || ''}">
            ${cta.label}
          </button>`
        ).join('')}
      </div>
      <span class="card-timestamp">${card.timestamp}</span>
    </div>`;

  // Dismiss button
  el.querySelector('.card-dismiss').addEventListener('click', e => {
    e.stopPropagation();
    el.style.transition = 'opacity 0.3s, transform 0.3s';
    el.style.opacity    = '0';
    el.style.transform  = 'translateX(16px) scale(0.96)';
    setTimeout(() => el.remove(), 320);
  });

  // CTA buttons
  el.querySelectorAll('.card-cta-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const panelId = btn.dataset.panel;
      const action  = btn.dataset.action;
      const message = btn.dataset.message;
      const url     = btn.dataset.url;

      if (panelId) {
        window.Panels.open(panelId);
      } else if (action === 'open-url' && url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      } else if (action === 'toast' && message) {
        _showToast(message, 'info');
      }
    });
  });

  return el;
}

// ─── FILE UPLOAD + CLAUDE API ─────────────────────────────────────────────────
async function _handleFileUpload(file) {
  const apiKey = document.getElementById('ctrl-api-key').value.trim();

  if (!apiKey) {
    _showToast('Add your Claude API key in ⚙ Settings first', 'error');
    return;
  }

  _showToast(`Analyzing "${file.name}" with Claude…`, 'info');

  let fileText;
  try {
    fileText = await _readFileAsText(file);
  } catch (err) {
    _showToast('Could not read file: ' + err.message, 'error');
    return;
  }

  const prompt = `You are a proactive enterprise assistant. Analyze the following document and extract 3 proactive insight cards that would help an enterprise user stay ahead of their work.

Document content:
---
${fileText.slice(0, 8000)}
---

Return a JSON array of exactly 3 objects, each with these fields:
- title (string, max 8 words)
- body (string, 1-2 sentences, specific to the document content)
- urgency ("high" | "medium" | "low")
- type ("deal-momentum" | "upcoming-meeting" | "knowledge-drift" | "trending" | "top-collaborators" | "morning-brief")

Return ONLY valid JSON, no markdown, no explanation.`;

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!resp.ok) {
      const err = await resp.json();
      throw new Error(err.error?.message || `HTTP ${resp.status}`);
    }

    const data = await resp.json();
    const raw  = data.content?.[0]?.text || '[]';

    // Parse JSON — strip any markdown fences
    const cleaned = raw.replace(/```json?\n?/gi, '').replace(/```/g, '').trim();
    const insights = JSON.parse(cleaned);

    if (!Array.isArray(insights) || insights.length === 0) throw new Error('No insights returned');

    // Store for panel
    window.DATA.aiPanelContent = insights.map(ins => ({
      title: ins.title,
      body: ins.body
    }));

    // Build proactive cards from AI response
    const SOURCE_MAP = {
      'deal-momentum':      { source: 'AI Analysis', color: '#da7756', icon: 'ph-robot' },
      'upcoming-meeting':   { source: 'AI Analysis', color: '#0176d3', icon: 'ph-robot' },
      'knowledge-drift':    { source: 'AI Analysis', color: '#7c3aed', icon: 'ph-robot' },
      'trending':           { source: 'AI Analysis', color: '#059669', icon: 'ph-robot' },
      'top-collaborators':  { source: 'AI Analysis', color: '#4285f4', icon: 'ph-robot' },
      'morning-brief':      { source: 'AI Analysis', color: '#d97706', icon: 'ph-robot' }
    };

    _aiCards = insights.map((ins, i) => {
      const sm = SOURCE_MAP[ins.type] || SOURCE_MAP['morning-brief'];
      return {
        id: `ai-${Date.now()}-${i}`,
        type: ins.type || 'morning-brief',
        label: 'AI Insight',
        urgency: ins.urgency || 'medium',
        source: sm.source,
        sourceBadgeColor: sm.color,
        sourceIcon: sm.icon,
        title: ins.title,
        subtitle: `From "${file.name}"`,
        body: ins.body,
        ctas: [
          { label: 'View Analysis', panelId: 'ai-upload' }
        ],
        timestamp: 'Just now'
      };
    });

    // Re-render cards in current chrome
    const mount = document.querySelector(`#${CHROME_IDS[_currentChrome]} .cards-mount`);
    if (mount) renderCards(mount);

    _showToast(`${insights.length} AI insights added from "${file.name}"`, 'success');

  } catch (err) {
    console.error('Claude API error:', err);
    _showToast('Claude API error: ' + err.message, 'error');
  }
}

function _readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = e  => resolve(e.target.result);
    reader.onerror = () => reject(new Error('FileReader failed'));
    reader.readAsText(file);
  });
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function _showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="ph ${type === 'success' ? 'ph-check-circle' : type === 'error' ? 'ph-warning-circle' : 'ph-info'}"></i>
    ${message}`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-exit');
    setTimeout(() => toast.remove(), 260);
  }, 3200);
}

// ─── DEMO CONTROLS NAV ────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const nav      = document.getElementById('demo-controls');
  const branding = document.querySelector('.ctrl-branding');

  // Toggle expand/collapse when clicking the branding or the bar itself
  nav.addEventListener('click', (e) => {
    if (!nav.classList.contains('expanded')) {
      nav.classList.add('expanded');
    } else if (e.target === branding || e.target.closest('.ctrl-branding')) {
      nav.classList.remove('expanded');
    }
  });

  // Close if clicking outside the nav
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && nav.classList.contains('expanded')) {
      nav.classList.remove('expanded');
    }
  });
});

document.addEventListener('keydown', (e) => {
  // Cmd+K / Ctrl+K toggles the demo controls
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    const nav = document.getElementById('demo-controls');
    nav.classList.toggle('is-active');
    nav.classList.add('expanded');
  }
  if (e.key === 'Escape') {
    const nav = document.getElementById('demo-controls');
    nav.classList.remove('is-active');
  }
});
