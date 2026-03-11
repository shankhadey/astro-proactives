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
  'chatgpt-ext':  'chrome-chatgpt-ext',
  'cowork':       'chrome-cowork',
  'iphone':       'chrome-iphone'
};

let _currentChrome = 'new-tab';
let _currentPersona = 'sales-banking';
let _lateCardTimer  = null;
let _aiCards = [];          // cards added via Claude API
let _searchResultCards = []; // cards injected by search handler
let _searchHandler = null;   // hookable external search backend
let _dismissedCardIds  = new Set();  // persists across chrome switches
let _dismissedCardData = new Map();  // id → card object for done-row restoration

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
  _initPersonaSelector();
  _initGreeting();
  _initControls();
  _initPanelClose();
  _initSearchBars();
  _initTeamsChat();
  // Cowork init runs after DOM is ready (cowork.js loaded after app.js)
  setTimeout(() => window.Cowork?.init(), 0);
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

// ─── PERSONA SELECTOR ────────────────────────────────────────────────────────
function _initPersonaSelector() {
  const sel = document.getElementById('ctrl-persona-select');
  if (!sel) return;
  sel.addEventListener('change', e => {
    _currentPersona = e.target.value;
    _dismissedCardIds.clear();
    _dismissedCardData.clear();
    _initGreeting();
    _applyPersonaToChrome();
    // Re-render current chrome's feed
    const chromeId = CHROME_IDS[_currentChrome];
    const target   = document.getElementById(chromeId);
    const mount    = target?.querySelector('.cards-mount[data-feed="main"]');
    if (mount) {
      _showSkeletons(mount);
      clearTimeout(_lateCardTimer);
      setTimeout(() => renderCards(mount), 250);
    }
  });
}

function _getPersona() {
  return (window.DATA.personas || {})[_currentPersona] || null;
}

function _getPersonaCards() {
  const p = _getPersona();
  if (!p || !p.cards) return window.DATA.cards; // sales-banking default
  return p.cards;
}

function _applyPersonaToChrome() {
  const p = _getPersona();
  if (!p) return;
  // Update SF app name label
  const sfAppName = document.querySelector('.sf-app-name');
  if (sfAppName) sfAppName.textContent = p.sfAppName || 'Sales Cloud';
  // Update SF avatar
  const sfAvatar = document.querySelector('.sf-top-bar .avatar-circle');
  if (sfAvatar) { sfAvatar.textContent = p.user.initials; sfAvatar.style.background = p.user.color; }
}

// ─── GREETING ────────────────────────────────────────────────────────────────
function _initGreeting() {
  const hour  = new Date().getHours();
  const parts = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
  const p     = _getPersona();
  const name  = p ? p.user.name.split(' ')[0] : 'Carmen';
  const cards = _getPersonaCards();
  const count = cards.length;
  const greeting  = `Good ${parts}, ${name}.`;
  const subline   = `Astro surfaced ${count} things that need your attention today.`;

  const ntEl  = document.getElementById('new-tab-greeting');
  const sfEl  = document.getElementById('sf-greeting');
  const macEl = document.getElementById('mac-greeting');
  const cwEl  = document.getElementById('cw-greeting');

  [ntEl, sfEl].forEach(el => {
    if (!el) return;
    el.innerHTML = `<span class="greeting-line">${greeting}</span><span class="greeting-sub">${subline}</span>`;
  });
  if (macEl) macEl.textContent = greeting;
  if (cwEl)  cwEl.textContent  = greeting;

  // SF Ask hero
  const sfHero = document.querySelector('.sf-ask-heading');
  if (sfHero) sfHero.textContent = greeting;
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
  const personaCards = _getPersonaCards();
  const allCards = [..._searchResultCards, ...personaCards, ..._aiCards]
    .filter(c => !_dismissedCardIds.has(c.id));
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

  // Sync global mode toggle: cowork → "Astro Cowork" active; everything else → "Ask Astro"
  const _toggleMode = value === 'cowork' ? 'cowork' : 'ask';
  document.querySelectorAll('#global-mode-toggle .global-mode-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.mode === _toggleMode);
  });

  // Cowork + iPhone chromes have no cards-mount — delegate to Cowork module
  if (value === 'cowork' || value === 'iphone') {
    window.Cowork?.onChromeActive(value);
    return;
  }

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

// ─── TIME / TOKEN HELPERS ─────────────────────────────────────────────────────
function _timeFromNow(offsetMinutes) {
  const d = new Date(Date.now() + offsetMinutes * 60000);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function _resolveTokens(str) {
  if (!str || typeof str !== 'string') return str;
  const now = new Date();
  return str
    .replace(/\{\{TODAY\}\}/g,  now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }))
    .replace(/\{\{TODAY_SHORT\}\}/g, now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
    .replace(/\{\{DIGEST_DATE\}\}/g, now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }))
    .replace(/\{\{T\+(\d+)\}\}/g, (_, m) => _timeFromNow(parseInt(m)))
    .replace(/\{\{T-(\d+)m\}\}/g, (_, m) => `${m} min ago`);
}

// ─── CARD RENDERING ───────────────────────────────────────────────────────────
function renderCards(mountEl) {
  mountEl.innerHTML = '';

  // Render morning digest above the grid (main feed only)
  if (mountEl.dataset.feed === 'main') {
    const digestMount = mountEl.previousElementSibling;
    if (digestMount && digestMount.classList.contains('morning-digest-mount')) {
      const p = _getPersona();
      const digest = p?.morningDigest || null;
      _renderMorningDigest(digestMount, digest);
    }
  }

  const personaCards = _getPersonaCards();
  const allCards = [..._searchResultCards, ...personaCards, ..._aiCards]
    .filter(c => !_dismissedCardIds.has(c.id));
  allCards.forEach(card => mountEl.appendChild(_buildCard(card)));

  // Restore completed section from persisted dismissed state
  const section = _ensureCompletedSection(mountEl);
  if (_dismissedCardData.size > 0) {
    const items = section.querySelector('.completed-section-items');
    items.innerHTML = '';
    _dismissedCardData.forEach(card => items.appendChild(_buildDoneRow(card, mountEl)));
    const countEl = section.querySelector('.completed-count');
    if (countEl) countEl.textContent = `(${_dismissedCardData.size})`;
    section.classList.add('open');
  }

  // Schedule late card arrival on main feed (simulates real-time update)
  if (mountEl.dataset.feed === 'main') {
    clearTimeout(_lateCardTimer);
    _lateCardTimer = setTimeout(() => _arriveLateCard(mountEl), 11000);
  }
}

// ─── DONE ROW BUILDER ─────────────────────────────────────────────────────────
function _buildDoneRow(card, mountEl) {
  const doneRow = document.createElement('div');
  doneRow.className = 'card-done-row';
  doneRow.innerHTML = `
    <i class="ph ph-check-circle"></i>
    <span class="done-title">${_resolveTokens(card.title)}</span>
    <button class="done-undo">Undo</button>`;
  doneRow.querySelector('.done-undo').addEventListener('click', () => {
    _dismissedCardIds.delete(card.id);
    _dismissedCardData.delete(card.id);
    const sec = doneRow.closest('.completed-section');
    const items = sec?.querySelector('.completed-section-items');
    doneRow.remove();
    if (items) {
      const countEl = sec.querySelector('.completed-count');
      if (countEl) countEl.textContent = `(${items.children.length})`;
    }
    if (mountEl?.isConnected) mountEl.prepend(_buildCard(card));
  });
  return doneRow;
}

// ─── MORNING DIGEST ───────────────────────────────────────────────────────────
function _renderMorningDigest(mountEl, digestData) {
  mountEl.innerHTML = '';
  if (!digestData) return;

  const SECTION_ICONS = {
    calendar:    'ph-calendar',
    signals:     'ph-activity',
    commitments: 'ph-clock-countdown',
    blockers:    'ph-chat-dots',
    cowork:      'ph-sparkle',
    focus:       'ph-leaf'
  };

  // Fallback items per section type
  const FALLBACKS = {
    calendar:    [{ fallback: true, text: 'Connect your calendar to see today\'s meetings', action: 'Connect Calendar' }],
    cowork:      [{ fallback: true, text: 'No cowork tasks defined yet', action: 'Set up a task in Astro Cowork' }],
    focus:       [{ fallback: true, text: 'No focus window suggestions — add your work schedule preferences', action: 'Update preferences' }]
  };

  const sectionsHtml = digestData.sections.map(sec => {
    const icon  = SECTION_ICONS[sec.type] || 'ph-list';
    const items = (sec.items && sec.items.length) ? sec.items : (FALLBACKS[sec.type] || []);
    let itemsHtml = '';

    if (sec.type === 'calendar') {
      itemsHtml = items.map(item => {
        if (item.fallback) return `<div class="md-fallback"><i class="ph ph-plug"></i>${item.text}</div>`;
        // Support timeOffset (minutes from now) or hardcoded time
        const timeStr = item.timeOffset !== undefined ? _timeFromNow(item.timeOffset) : _resolveTokens(item.time || '');
        return `
          <div class="md-cal-item" style="border-left-color:${item.color || 'var(--accent)'}">
            <div class="md-cal-time">${timeStr}</div>
            <div class="md-cal-text">
              <div class="md-cal-title">${_resolveTokens(item.title)}</div>
              ${item.context ? `<div class="md-cal-context">${_resolveTokens(item.context)}</div>` : ''}
            </div>
          </div>`;
      }).join('');

    } else if (sec.type === 'signals') {
      itemsHtml = items.map(item => `
        <div class="md-signal-item">
          <i class="ph ${item.icon || 'ph-pulse'} md-signal-icon"></i>
          <div class="md-signal-text">
            <div class="md-signal-content">${_resolveTokens(item.text)}</div>
            ${item.meta ? `<div class="md-signal-meta">${_resolveTokens(item.meta)}</div>` : ''}
          </div>
        </div>`).join('');

    } else if (sec.type === 'commitments' || sec.type === 'blockers') {
      const iconClass = sec.type === 'blockers' ? 'blocker' : '';
      itemsHtml = items.map(item => `
        <div class="md-commit-item">
          <i class="ph ${sec.type === 'blockers' ? 'ph-chat-dots' : 'ph-clock-countdown'} md-commit-icon ${item.overdue ? 'overdue' : ''} ${iconClass}"></i>
          <div class="md-commit-text">
            <div class="md-commit-title">${_resolveTokens(item.text)}</div>
            ${item.source ? `<div class="md-commit-source">${_resolveTokens(item.source)}</div>` : ''}
          </div>
        </div>`).join('');

    } else if (sec.type === 'cowork') {
      itemsHtml = items.map(item => {
        if (item.fallback) return `<div class="md-fallback"><i class="ph ph-plus-circle"></i>${item.text}</div>`;
        return `
          <div class="md-cowork-item">
            <i class="ph ph-sparkle md-cowork-icon"></i>
            <div class="md-cowork-text">
              <div class="md-cowork-title">${_resolveTokens(item.label || item.title || item.text)}</div>
              ${item.note || item.detail ? `<div class="md-cowork-detail">${_resolveTokens(item.note || item.detail)}</div>` : ''}
            </div>
          </div>`;
      }).join('');

    } else if (sec.type === 'focus') {
      itemsHtml = items.map(item => {
        if (item.fallback) return `<div class="md-fallback"><i class="ph ph-leaf"></i>${item.text}</div>`;
        return `
          <div class="md-focus-item">
            <i class="ph ph-leaf md-focus-icon"></i>
            <div class="md-focus-text">${_resolveTokens(item.text || item.note || item.title)}</div>
          </div>`;
      }).join('');
    }

    return `
      <div class="md-section">
        <div class="md-section-title"><i class="ph ${icon}"></i>${sec.title}</div>
        <div class="md-items">${itemsHtml}</div>
      </div>`;
  }).join('');

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const digest = document.createElement('div');
  digest.className = 'morning-digest open'; // partially expanded by default
  digest.innerHTML = `
    <div class="md-header">
      <div class="md-header-icon"><i class="ph ph-sun-horizon"></i></div>
      <div class="md-header-text">
        <div class="md-header-title">Morning Digest</div>
        <div class="md-header-date">${todayStr}</div>
        <div class="md-header-summary">${_resolveTokens(digestData.summary || '')}</div>
      </div>
      <i class="ph ph-caret-right md-chevron"></i>
    </div>
    <div class="md-body">
      <div class="md-sections">${sectionsHtml}</div>
    </div>`;

  digest.querySelector('.md-header').addEventListener('click', () => {
    digest.classList.toggle('open');
  });

  mountEl.appendChild(digest);
}

// ─── COMPLETED SECTION ────────────────────────────────────────────────────────
function _ensureCompletedSection(mountEl) {
  let section = mountEl.querySelector('.completed-section');
  if (!section) {
    section = document.createElement('div');
    section.className = 'completed-section';
    section.innerHTML = `
      <div class="completed-section-header">
        <i class="ph ph-caret-right"></i>
        Completed today
        <span class="completed-count" style="color:var(--text-muted);font-weight:400;margin-left:2px">(0)</span>
      </div>
      <div class="completed-section-items"></div>`;

    section.querySelector('.completed-section-header').addEventListener('click', () => {
      section.classList.toggle('open');
    });

    mountEl.appendChild(section);
  }
  return section;
}

// ─── LATE CARD ARRIVAL ────────────────────────────────────────────────────────
function _arriveLateCard(mountEl) {
  if (!document.contains(mountEl)) return;
  const p = _getPersona();
  if (!p?.lateCard) return;

  const card = p.lateCard;

  // Show banner first
  _showNewUpdateBanner(mountEl, card);

  // Insert new card at top after short delay
  setTimeout(() => {
    if (!document.contains(mountEl)) return;
    const cardEl = _buildCard(card);
    cardEl.classList.add('card-new');

    // Add "NEW" badge
    const badge = document.createElement('div');
    badge.className = 'card-new-badge';
    badge.textContent = 'NEW';
    cardEl.style.position = 'relative';
    cardEl.appendChild(badge);

    // Remove badge after 6s
    setTimeout(() => badge.remove(), 6000);

    mountEl.prepend(cardEl);
  }, 600);
}

function _showNewUpdateBanner(mountEl, card) {
  // Remove any existing banner
  mountEl.querySelector('.new-update-banner')?.remove();

  const banner = document.createElement('div');
  banner.className = 'new-update-banner';
  banner.innerHTML = `
    <i class="ph ph-bell-ringing"></i>
    <span><strong>1 new update from Astro</strong> — ${card.title}</span>
    <button class="banner-dismiss" aria-label="Dismiss">×</button>`;

  banner.querySelector('.banner-dismiss').addEventListener('click', () => banner.remove());

  mountEl.prepend(banner);

  // Auto-dismiss after 8s
  setTimeout(() => {
    if (banner.isConnected) {
      banner.style.transition = 'opacity 0.4s';
      banner.style.opacity = '0';
      setTimeout(() => banner.remove(), 420);
    }
  }, 8000);
}

// ─── CARD RENDERING ───────────────────────────────────────────────────────────
function _buildCard(card) {
  const el = document.createElement('div');
  el.className = `proactive-card urgency-${card.urgency}`;
  el.dataset.cardId = card.id;

  const why = _resolveTokens(card.triggeredBecause);
  const whyHtml = why
    ? `<div class="card-why"><i class="ph ph-lightning"></i>${why}</div>`
    : '';

  el.innerHTML = `
    <div class="card-header">
      <span class="source-badge" style="--badge-color: ${card.sourceBadgeColor}">
        <i class="ph ${card.sourceIcon}"></i>
        ${card.source}
      </span>
      <span class="card-label">${card.label}</span>
      <button class="card-dismiss" aria-label="Dismiss card">×</button>
    </div>
    ${whyHtml}
    <div class="card-body">
      <div class="card-title">${_resolveTokens(card.title)}</div>
      <div class="card-subtitle">${_resolveTokens(card.subtitle)}</div>
      <div class="card-body-text">${_resolveTokens(card.body)}</div>
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

  // Dismiss button → persist dismissed state, add to completed section
  el.querySelector('.card-dismiss').addEventListener('click', e => {
    e.stopPropagation();
    const mountEl = el.closest('.cards-mount');

    _dismissedCardIds.add(card.id);
    _dismissedCardData.set(card.id, card);

    el.style.transition = 'opacity 0.25s, transform 0.25s';
    el.style.opacity    = '0';
    el.style.transform  = 'scale(0.95)';

    setTimeout(() => {
      el.remove();
      if (!mountEl) return;
      const section = _ensureCompletedSection(mountEl);
      const items   = section.querySelector('.completed-section-items');
      items.prepend(_buildDoneRow(card, mountEl));
      section.classList.add('open');
      const countEl = section.querySelector('.completed-count');
      if (countEl) countEl.textContent = `(${items.children.length})`;
    }, 280);
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
