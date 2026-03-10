// panels.js — Side Panel Render Engine
// Depends on window.DATA (data.js must load first)

window.Panels = (() => {
  'use strict';

  const _panel   = document.getElementById('side-panel');
  const _overlay = document.getElementById('panel-overlay');
  const _titleEl = document.getElementById('panel-title-text');
  const _bodyEl  = document.getElementById('panel-body');

  // ─── RENDERER MAP ───────────────────────────────────────────────────────
  const RENDERERS = {
    renderMeetingPanel,
    renderCraPanel,
    renderBeaconPanel,
    renderFdicPanel,
    renderTrendingPanel,
    renderMorningPanel,
    renderAiPanel
  };

  // ─── PUBLIC API ──────────────────────────────────────────────────────────
  function open(panelId) {
    const def = window.DATA.panels[panelId];
    if (!def) return;

    _titleEl.textContent = def.title;
    _panel.style.width   = def.width || '540px';

    _bodyEl.innerHTML = '';
    const renderer = RENDERERS[def.renderer];
    if (renderer) _bodyEl.appendChild(renderer());

    _panel.classList.add('panel-open');
    _overlay.classList.add('overlay-visible');
  }

  function close() {
    _panel.classList.remove('panel-open');
    _overlay.classList.remove('overlay-visible');
  }

  // ─── HELPERS ────────────────────────────────────────────────────────────

  function _section(title, contentHtmlOrEl) {
    const s = document.createElement('div');
    s.className = 'panel-section';
    if (title) {
      const h = document.createElement('div');
      h.className = 'panel-section-title';
      h.textContent = title;
      s.appendChild(h);
    }
    if (contentHtmlOrEl instanceof Node) {
      s.appendChild(contentHtmlOrEl);
    } else if (typeof contentHtmlOrEl === 'string') {
      s.insertAdjacentHTML('beforeend', contentHtmlOrEl);
    }
    return s;
  }

  function _html(str) {
    const d = document.createElement('div');
    d.style.cssText = 'display:flex;flex-direction:column;gap:8px;';
    d.innerHTML = str;
    return d;
  }

  function _ctaRow(buttons) {
    // buttons: [{label, style}]  style = 'primary' | 'secondary'
    const row = document.createElement('div');
    row.className = 'panel-cta-row';
    buttons.forEach(({ label, style = 'secondary', action }) => {
      const btn = document.createElement('button');
      btn.className = `panel-cta-btn ${style}`;
      btn.textContent = label;
      if (action) btn.addEventListener('click', action);
      else btn.addEventListener('click', () => window.App && window.App.toast(label + ' — action triggered', 'success'));
      row.appendChild(btn);
    });
    return row;
  }

  function _metaRow(iconClass, iconBg, label, value) {
    return `<div class="panel-meta-row">
      <div class="panel-meta-icon" style="background:${iconBg || 'var(--accent-light)'};color:${iconBg ? 'white' : 'var(--accent)'};font-size:16px;">
        <i class="ph ${iconClass}"></i>
      </div>
      <div class="panel-meta-body">
        <div class="panel-meta-label">${label}</div>
        <div class="panel-meta-value">${value}</div>
      </div>
    </div>`;
  }

  function _statGrid(stats) {
    // stats: [{value, label}]
    return `<div class="stat-grid">${stats.map(s =>
      `<div class="stat-cell">
        <span class="stat-value">${s.value}</span>
        <div class="stat-label">${s.label}</div>
      </div>`
    ).join('')}</div>`;
  }

  function _avatar(initials, color, size = '') {
    return `<div class="avatar-circle ${size}" style="background:${color};">${initials}</div>`;
  }

  // ─── RENDERER 1: MEETING PREP ────────────────────────────────────────────
  function renderMeetingPanel() {
    const frag = document.createDocumentFragment();
    const D = window.DATA;

    // Meta info
    frag.appendChild(_section('Meeting Details', _html(`
      ${_metaRow('ph-calendar-blank', '#0176d3', 'Time & Location', 'Today 2:00 PM · Conference Room A')}
      ${_metaRow('ph-video-camera', null, 'Video Link', 'Zoom — zoom.us/j/oneunited-q2')}
      ${_metaRow('ph-clock', null, 'Duration', '60 minutes · Starts in 14 min')}
    `)));

    // Attendees
    const attendeeGrid = document.createElement('div');
    attendeeGrid.className = 'attendee-grid';
    const attendees = [D.people.marcus, D.people.keisha, D.people.david];
    attendees.forEach(p => {
      attendeeGrid.insertAdjacentHTML('beforeend', `
        <div class="attendee-card">
          ${_avatar(p.initials, p.color)}
          <div class="attendee-name">${p.name}</div>
          <div class="attendee-title">${p.title}</div>
          <div class="attendee-last">Last met ${p.lastMet}</div>
        </div>`);
    });
    frag.appendChild(_section('Attendees', attendeeGrid));

    // Shared docs
    const docList = document.createElement('div');
    docList.className = 'doc-list';
    D.docs.forEach(doc => {
      docList.insertAdjacentHTML('beforeend', `
        <div class="doc-row">
          <i class="ph ph-file-doc"></i>
          <div class="doc-info">
            <div class="doc-name">${doc.name}</div>
            <div class="doc-meta">${doc.updatedBy} · ${doc.updatedWhen}</div>
          </div>
          <span class="doc-tag ${doc.status}">${doc.status === 'hot' ? 'Updated' : doc.status === 'stale' ? '14d stale' : 'Changed'}</span>
        </div>`);
    });
    frag.appendChild(_section('Shared Documents', docList));

    // Action items
    const actionList = document.createElement('div');
    actionList.className = 'action-item-list';
    D.meetingActionItems.forEach((item, i) => {
      const el = document.createElement('div');
      el.className = `action-item${item.done ? ' done' : ''}`;
      el.dataset.idx = i;
      el.innerHTML = `
        <div class="action-checkbox"></div>
        <span class="action-text">${item.text}</span>`;
      el.addEventListener('click', () => {
        el.classList.toggle('done');
        D.meetingActionItems[i].done = !D.meetingActionItems[i].done;
      });
      actionList.appendChild(el);
    });
    frag.appendChild(_section('Open Action Items', actionList));

    // AI talking points
    const tpList = document.createElement('div');
    tpList.className = 'talking-points';
    D.meetingTalkingPoints.forEach(tp => {
      tpList.insertAdjacentHTML('beforeend', `
        <div class="talking-point">
          <i class="ph ph-sparkle"></i>
          <span>${tp}</span>
        </div>`);
    });
    frag.appendChild(_section('AI Talking Points', tpList));

    // CTAs
    frag.appendChild(_ctaRow([
      { label: 'Open Meeting Notes', style: 'primary' },
      { label: 'Send Agenda', style: 'secondary' },
      { label: 'Join Meeting', style: 'secondary', action: () => window.open('https://calendar.google.com/calendar/r/day', '_blank', 'noopener,noreferrer') }
    ]));

    return frag;
  }

  // ─── RENDERER 2: CRA COLLABORATORS ──────────────────────────────────────
  function renderCraPanel() {
    const frag = document.createDocumentFragment();
    const D = window.DATA;

    // Summary stats
    frag.appendChild(_section('Document Overview', _html(`
      ${_statGrid([
        { value: '3', label: 'New Sections' },
        { value: 'Today', label: 'Last Update' },
        { value: 'Keisha W.', label: 'Author' }
      ])}
    `)));

    // Changes
    const changeList = document.createElement('div');
    changeList.style.cssText = 'display:flex;flex-direction:column;gap:10px;';
    D.craChanges.forEach(change => {
      const el = document.createElement('div');
      el.className = 'cra-change';
      el.innerHTML = `
        <div class="cra-change-header">
          <span class="cra-change-section">${change.section}</span>
          <span class="cra-change-time">${change.time}</span>
        </div>
        <div class="cra-change-author"><i class="ph ph-pencil-simple" style="margin-right:4px;"></i>${change.author}</div>
        <div class="cra-change-preview">${change.preview}</div>
        <div class="cra-related-sf">
          <i class="ph ph-cloud"></i>
          ${change.relatedSF.type}: ${change.relatedSF.label}
        </div>`;
      changeList.appendChild(el);
    });
    frag.appendChild(_section('Recent Changes', changeList));

    // Related Salesforce objects
    frag.appendChild(_section('Related Salesforce Records', _html(`
      ${_metaRow('ph-currency-dollar-simple', null, 'Opportunity', 'Mass Housing Initiative — $1.8M (70%)')}
      ${_metaRow('ph-headset', null, 'Case', 'CS-2024-4733 · Mortgage Processing Delay')}
      ${_metaRow('ph-buildings', null, 'Account', 'Boston Community Investment Trust')}
    `)));

    // CTAs
    frag.appendChild(_ctaRow([
      { label: 'View in Google Docs', style: 'primary', action: () => window.open('https://docs.google.com/document/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms/edit', '_blank', 'noopener,noreferrer') },
      { label: 'Add Comment', style: 'secondary' },
      { label: 'Share with Team', style: 'secondary' }
    ]));

    return frag;
  }

  // ─── RENDERER 3: BEACON DEAL ─────────────────────────────────────────────
  function renderBeaconPanel() {
    const frag = document.createDocumentFragment();
    const D = window.DATA;
    const opp = D.opportunities.beacon;

    // Opportunity stats
    frag.appendChild(_section('Opportunity', _html(`
      ${_statGrid([
        { value: opp.amount, label: 'Amount' },
        { value: opp.probability, label: 'Probability' },
        { value: opp.stage, label: 'Stage' }
      ])}
      ${_metaRow('ph-user-circle', null, 'Contact', `${opp.contact} · ${opp.account}`)}
      ${_metaRow('ph-user', null, 'Owner', opp.owner)}
      ${_metaRow('ph-calendar-x', null, 'Close Date', opp.closeDate)}
    `)));

    // Activity timeline (14 days quiet)
    const timeline = document.createElement('div');
    timeline.className = 'timeline';
    opp.activityLog.forEach(item => {
      timeline.insertAdjacentHTML('beforeend', `
        <div class="timeline-item ${item.quiet ? 'quiet' : ''}">
          <div class="timeline-icon ${item.quiet ? 'quiet' : ''}">
            <i class="ph ${item.icon}" style="color:${item.quiet ? 'var(--text-muted)' : 'var(--accent)'}"></i>
          </div>
          <div class="timeline-content">
            <div class="timeline-date">${item.date}</div>
            <div class="timeline-note">${item.note}</div>
          </div>
        </div>`);
    });
    frag.appendChild(_section('Activity Log — 14 Days Quiet', timeline));

    // AI-drafted email
    const email = opp.draftEmail;
    frag.appendChild(_section('AI-Drafted Follow-Up Email', _html(`
      <div class="email-preview-box">
        <div class="email-preview-header">
          <div class="email-row"><span class="label">To:</span><span class="value">${email.to}</span></div>
          <div class="email-row"><span class="label">From:</span><span class="value">${email.from}</span></div>
          <div class="email-row"><span class="label">Subject:</span><span class="subject">${email.subject}</span></div>
        </div>
        <div class="email-preview-body">${email.body}</div>
      </div>
    `)));

    // Next best actions
    const actions = document.createElement('div');
    actions.className = 'action-item-list';
    const nba = [
      'Send the AI-drafted email to Sarah Kim by EOD today',
      'Ask David Chen to check for competitor activity signals',
      'Schedule a value recap call for this week'
    ];
    nba.forEach(text => {
      actions.insertAdjacentHTML('beforeend', `
        <div class="action-item" onclick="this.classList.toggle('done')">
          <div class="action-checkbox"></div>
          <span class="action-text">${text}</span>
        </div>`);
    });
    frag.appendChild(_section('Next Best Actions', actions));

    // CTAs
    frag.appendChild(_ctaRow([
      { label: 'Use This Email', style: 'primary', action: () => window.App && window.App.toast('Email copied to clipboard', 'success') },
      { label: 'View in Salesforce', style: 'secondary' },
      { label: 'Log a Call', style: 'secondary' }
    ]));

    return frag;
  }

  // ─── RENDERER 4: FDIC DIFF ───────────────────────────────────────────────
  function renderFdicPanel() {
    const frag = document.createDocumentFragment();
    const D = window.DATA;

    // Summary
    frag.appendChild(_section('Document', _html(`
      ${_metaRow('ph-shield-check', '#7c3aed', 'Source', 'FDIC Office of Compliance — fdic.gov')}
      ${_metaRow('ph-calendar', null, 'Updated', '2 days ago · You last opened this 3 weeks ago')}
      ${_metaRow('ph-warning-circle', null, 'Impact', 'High — affects Q3 capital planning & CRA filing')}
    `)));

    // Diff view
    const buildDiffHtml = (tokens) => {
      return tokens.map(t => {
        if (t.type === 'heading')     return `<span class="diff-heading">${t.text}</span>`;
        if (t.type === 'removed')     return `<span class="diff-removed">${t.text}</span>`;
        if (t.type === 'added')       return `<span class="diff-added">${t.text}</span>`;
        if (t.type === 'added-block') return `<span class="diff-added-block">${t.text.trim()}</span>`;
        return t.text;
      }).join('');
    };

    const diffSection = _section('What Changed', _html(`
      <div class="diff-container">
        <div class="diff-column">
          <div class="diff-header removed"><i class="ph ph-x-circle" style="margin-right:4px;"></i>Before</div>
          <div class="diff-body">${buildDiffHtml(D.fdicDiff.before)}</div>
        </div>
        <div class="diff-column">
          <div class="diff-header added"><i class="ph ph-check-circle" style="margin-right:4px;"></i>After (March 2026)</div>
          <div class="diff-body">${buildDiffHtml(D.fdicDiff.after)}</div>
        </div>
      </div>
    `));
    frag.appendChild(diffSection);

    // Impact
    const impactList = document.createElement('div');
    impactList.className = 'impact-list';
    D.fdicImpacts.forEach(item => {
      impactList.insertAdjacentHTML('beforeend', `
        <div class="impact-item">
          <i class="ph ${item.icon}" style="color:${item.color};"></i>
          <span>${item.text}</span>
        </div>`);
    });
    frag.appendChild(_section('Impact Assessment', impactList));

    // Compliance tasks
    const taskList = document.createElement('div');
    taskList.className = 'compliance-tasks';
    D.fdicTasks.forEach(task => {
      taskList.insertAdjacentHTML('beforeend', `
        <div class="compliance-task ${task.status}">
          <div class="compliance-task-top">
            <i class="ph ph-${task.status === 'in-progress' ? 'spinner' : 'circle'}" style="color:${task.status === 'in-progress' ? 'var(--accent)' : 'var(--urgency-medium)'};font-size:14px;"></i>
            <span class="compliance-task-text">${task.text}</span>
          </div>
          <div class="compliance-task-meta">
            <span>Assigned: ${task.assignee}</span>
            <span class="compliance-due">Due: ${task.due}</span>
          </div>
        </div>`);
    });
    frag.appendChild(_section('Compliance Tasks', taskList));

    // CTAs
    frag.appendChild(_ctaRow([
      { label: 'Open Full Document', style: 'primary', action: () => window.open('https://www.fdic.gov/regulations/examinations/supervisory/insights/', '_blank', 'noopener,noreferrer') },
      { label: 'Assign Tasks', style: 'secondary' },
      { label: 'Mark as Reviewed', style: 'secondary', action: () => window.App && window.App.toast('Document marked as reviewed', 'success') }
    ]));

    return frag;
  }

  // ─── RENDERER 5: TRENDING DOC ────────────────────────────────────────────
  function renderTrendingPanel() {
    const frag = document.createDocumentFragment();
    const D = window.DATA;

    // Stats
    frag.appendChild(_section('Today\'s Activity', _html(`
      ${_statGrid([
        { value: '7', label: 'Readers Today' },
        { value: '9 AM', label: 'Trending Since' },
        { value: '12', label: 'Total Views' }
      ])}
    `)));

    // Sparkline
    const pts = D.trendingSparkline;
    const max = Math.max(...pts);
    const w = 400, h = 48, pad = 4;
    const xs = pts.map((_, i) => pad + (i / (pts.length - 1)) * (w - pad * 2));
    const ys = pts.map(v => h - pad - ((v / max) * (h - pad * 2)));
    const polyline = xs.map((x, i) => `${x},${ys[i]}`).join(' ');
    const areaPath = `M${xs[0]},${h} ` + xs.map((x, i) => `L${x},${ys[i]}`).join(' ') + ` L${xs[xs.length-1]},${h} Z`;

    frag.appendChild(_section('View Trend (8 AM – 1 PM)', _html(`
      <div class="sparkline-wrap">
        <svg class="sparkline-svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
          <defs>
            <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.25"/>
              <stop offset="100%" stop-color="var(--accent)" stop-opacity="0"/>
            </linearGradient>
          </defs>
          <path d="${areaPath}" fill="url(#sparkGrad)"/>
          <polyline points="${polyline}" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div class="sparkline-labels">
          <span>8 AM</span><span>9</span><span>10</span><span>11</span><span>12</span><span>1 PM</span>
        </div>
      </div>
    `)));

    // Reader list
    const readerList = document.createElement('div');
    readerList.className = 'reader-list';
    D.trendingReaders.forEach(r => {
      readerList.insertAdjacentHTML('beforeend', `
        <div class="reader-row">
          ${_avatar(r.initials, r.color, 'small')}
          <div class="reader-info">
            <div class="reader-name">${r.name}</div>
            <div class="reader-role">${r.role}</div>
          </div>
          <span class="reader-time">${r.time}</span>
        </div>`);
    });
    frag.appendChild(_section('Who\'s Reading', readerList));

    // Related projects
    frag.appendChild(_section('Related Projects', _html(`
      ${_metaRow('ph-currency-dollar-simple', null, 'Opportunity', 'Beacon Capital SMB Lending — Q2 budget impact')}
      ${_metaRow('ph-presentation-chart', null, 'Meeting', 'Q2 Strategy Review — Today 2:00 PM')}
      ${_metaRow('ph-file-text', null, 'Document', 'Q2 2026 Strategic Plan — updated yesterday')}
    `)));

    // Doc preview excerpt
    frag.appendChild(_section('Document Preview', _html(`
      <div style="background:var(--bg-tertiary);border-radius:var(--radius-sm);padding:14px;border:1px solid var(--border-subtle);border-left:3px solid var(--color-gdocs);">
        <div style="font-size:11px;font-weight:700;color:var(--text-muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.05em;">Q2 Budget Reforecast · Executive Summary</div>
        <div style="font-size:13px;color:var(--text-secondary);line-height:1.6;font-style:italic;">
          "OneUnited Bank's Q2 2026 reforecast reflects a 7% upward revision in commercial lending revenue driven by the CDFI certification expansion and new Miami branch performance. SMB portfolio growth is tracking at 14% YoY…"
        </div>
      </div>
    `)));

    // CTAs
    frag.appendChild(_ctaRow([
      { label: 'Open Document', style: 'primary' },
      { label: 'Share Summary', style: 'secondary' }
    ]));

    return frag;
  }

  // ─── RENDERER 6: MORNING BRIEF ──────────────────────────────────────────
  function renderMorningPanel() {
    const frag = document.createDocumentFragment();
    const D = window.DATA;

    // Priority emails
    const emailList = document.createElement('div');
    emailList.className = 'brief-email-list';
    D.emails.forEach(email => {
      const el = document.createElement('div');
      el.className = `brief-email ${email.urgency}`;
      el.innerHTML = `
        <div class="brief-email-from">${email.from} &nbsp;·&nbsp; ${email.time}</div>
        <div class="brief-email-subject">${email.subject}</div>
        <div class="brief-email-preview">${email.preview}</div>
        ${email.tag ? `<div class="brief-due-tag">${email.tag}</div>` : ''}`;
      el.addEventListener('click', () => window.App && window.App.toast(`Opening email from ${email.from}…`, 'info'));
      emailList.appendChild(el);
    });
    frag.appendChild(_section('Priority Emails (3)', emailList));

    // Calendar
    const calList = document.createElement('div');
    calList.className = 'brief-cal-list';
    D.calendarEvents.forEach(event => {
      calList.insertAdjacentHTML('beforeend', `
        <div class="brief-cal-event">
          <div class="brief-cal-time">${event.time}</div>
          <div style="width:28px;height:28px;border-radius:6px;background:${event.color}1a;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <i class="ph ${event.icon}" style="color:${event.color};font-size:16px;"></i>
          </div>
          <div class="brief-cal-details">
            <div class="brief-cal-title">${event.title}</div>
            <div class="brief-cal-attendees">${event.attendees}</div>
          </div>
          ${event.urgency ? `<span class="brief-cal-urgent">${event.urgency}</span>` : ''}
        </div>`);
    });
    frag.appendChild(_section('Today\'s Calendar', calList));

    // Key alerts
    const alertList = document.createElement('div');
    alertList.className = 'alert-list';
    const alerts = [
      { icon: 'ph-warning-circle', level: 'high', text: 'Beacon Capital: 14 days no activity — deal at risk of stalling by Apr 30 close date' },
      { icon: 'ph-calendar-x', level: 'high', text: 'FDIC CRA examination response due March 15 — 6 days remaining' },
      { icon: 'ph-trend-up', level: 'medium', text: 'Q2 Budget Reforecast trending among leadership — review before 2 PM strategy call' }
    ];
    alerts.forEach(a => {
      alertList.insertAdjacentHTML('beforeend', `
        <div class="alert-row alert-${a.level}">
          <i class="ph ${a.icon}"></i>
          <span>${a.text}</span>
        </div>`);
    });
    frag.appendChild(_section('Key Alerts', alertList));

    // EOD Prep
    frag.appendChild(_section('EOD Prep — Tomorrow', _html(`
      ${_metaRow('ph-calendar', null, 'Tomorrow 10:00 AM', 'Client call — Mass Housing Initiative Partnership')}
      ${_metaRow('ph-presentation-chart', null, 'Tomorrow 3:00 PM', 'Board Prep Review — Q1 Performance Report')}
      ${_metaRow('ph-envelope', null, 'Send by EOD', 'Beacon Capital follow-up email (AI draft ready)')}
    `)));

    // CTAs
    frag.appendChild(_ctaRow([
      { label: 'Open Inbox', style: 'primary', action: () => window.open('https://mail.google.com/mail/u/0/#inbox', '_blank', 'noopener,noreferrer') },
      { label: 'Start Morning Review', style: 'secondary' }
    ]));

    return frag;
  }

  // ─── RENDERER 7: AI UPLOAD ──────────────────────────────────────────────
  function renderAiPanel() {
    const frag = document.createDocumentFragment();
    const content = window.DATA.aiPanelContent;

    if (!content) {
      const empty = document.createElement('div');
      empty.style.cssText = 'text-align:center;padding:40px 20px;color:var(--text-muted);font-size:14px;';
      empty.innerHTML = `<i class="ph ph-sparkle" style="font-size:40px;display:block;margin-bottom:12px;color:var(--color-claude);"></i>
        No AI analysis yet.<br>Upload a document using the ⚙ Settings menu.`;
      frag.appendChild(empty);
    } else {
      // content is an array of { title, body } insight blocks
      const wrapper = document.createElement('div');
      wrapper.style.cssText = 'display:flex;flex-direction:column;gap:12px;';
      content.forEach(block => {
        wrapper.insertAdjacentHTML('beforeend', `
          <div class="ai-insight-block">
            <div class="ai-insight-title">
              <i class="ph ph-sparkle" style="color:var(--color-claude);margin-right:6px;"></i>
              ${block.title}
            </div>
            <div class="ai-insight-body">${block.body}</div>
          </div>`);
      });
      frag.appendChild(_section('AI-Generated Insights', wrapper));

      frag.appendChild(_ctaRow([
        { label: 'Add to Feed', style: 'primary', action: () => window.App && window.App.toast('AI cards added to feed', 'success') },
        { label: 'Re-analyze', style: 'secondary' }
      ]));
    }

    return frag;
  }

  // ─── EXPOSE ──────────────────────────────────────────────────────────────
  return { open, close };

})();
