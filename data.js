// data.js — OneUnited Bank Demo Data
// All static data constants for the Proactive Search Demo
// OneUnited Bank: Nation's largest Black-owned bank. Boston, Miami, LA.

window.DATA = {

  user: {
    name: 'Carmen Rodriguez',
    title: 'Sales Director',
    company: 'OneUnited Bank',
    initials: 'CR',
    email: 'carmen.rodriguez@oneunited.com'
  },

  // ─────────────────────────────────────────────────────────────────────────
  // PROACTIVE CARDS
  // ─────────────────────────────────────────────────────────────────────────
  cards: [
    {
      id: 'meeting-1',
      type: 'upcoming-meeting',
      label: 'Upcoming Meeting',
      urgency: 'high',
      source: 'Calendar',
      sourceBadgeColor: '#0176d3',
      sourceIcon: 'ph-calendar-blank',
      title: 'Q2 Strategy Review',
      subtitle: 'Conference Room A &nbsp;·&nbsp; Starts in 14 min',
      body: 'Marcus Thompson, Keisha Williams, and David Chen attending. 3 open action items from your last sync. Q2 Budget Reforecast trending — may come up.',
      ctas: [
        { label: 'View Meeting Prep', panelId: 'meeting-prep' },
        { label: 'Join Meeting', action: 'open-url', url: 'https://calendar.google.com/calendar/r/day' }
      ],
      timestamp: '2:00 PM today'
    },
    {
      id: 'collab-1',
      type: 'top-collaborators',
      label: 'Top Collaborators',
      urgency: 'medium',
      source: 'Google Docs',
      sourceBadgeColor: '#4285f4',
      sourceIcon: 'ph-google-logo',
      title: 'Keisha Williams updated CRA Assessment',
      subtitle: 'Added 3 new sections &nbsp;·&nbsp; 23 min ago',
      body: '"CRA Community Reinvestment Assessment 2026" now includes Fair Lending Analysis, HMDA Data Review, and Branch Access sections — all relevant to your upcoming FDIC examination.',
      ctas: [
        { label: 'Review Changes', panelId: 'cra-collaborators' },
        { label: 'Open in Docs', action: 'open-url', url: 'https://docs.google.com/document/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms/edit' }
      ],
      timestamp: '1:23 PM'
    },
    {
      id: 'deal-1',
      type: 'deal-momentum',
      label: 'Deal/Case Momentum',
      urgency: 'high',
      source: 'Salesforce',
      sourceBadgeColor: '#0176d3',
      sourceIcon: 'ph-cloud',
      title: 'Beacon Capital Deal Gone Quiet',
      subtitle: '$2.4M SMB Lending Program &nbsp;·&nbsp; No activity in 14 days',
      body: 'Last touchpoint: Feb 23 email from David Chen — no response. At 50% probability and closing Apr 30. Competitor outreach from First Citizens Bank detected.',
      ctas: [
        { label: 'View Opportunity', panelId: 'beacon-deal' },
        { label: 'Draft Follow-Up', panelId: 'beacon-deal' }
      ],
      timestamp: 'At risk'
    },
    {
      id: 'drift-1',
      type: 'knowledge-drift',
      label: 'Knowledge Drift',
      urgency: 'medium',
      source: 'Compliance',
      sourceBadgeColor: '#7c3aed',
      sourceIcon: 'ph-shield-check',
      title: 'FDIC Examination Guidelines Updated',
      subtitle: 'Section 3.2 Capital Requirements revised &nbsp;·&nbsp; 2 days ago',
      body: 'A document you reference regularly was updated by the FDIC. You last opened it 3 weeks ago. New capital ratio threshold (8%) and supplemental CDFI report due April 30.',
      ctas: [
        { label: 'See What Changed', panelId: 'fdic-diff' },
        { label: 'Open Document', action: 'open-url', url: 'https://www.fdic.gov/regulations/examinations/supervisory/insights/' }
      ],
      timestamp: '2 days ago'
    },
    {
      id: 'trending-1',
      type: 'trending',
      label: 'Trending',
      urgency: 'low',
      source: 'Activity',
      sourceBadgeColor: '#059669',
      sourceIcon: 'ph-chart-line-up',
      title: '7 teammates viewed this today',
      subtitle: '"Q2 Budget Reforecast" &nbsp;·&nbsp; Trending internally since 9 AM',
      body: 'Marcus Thompson, David Chen, Amara Osei and 4 others opened this document this morning. Likely relevant to your 2 PM Q2 Strategy Review.',
      ctas: [
        { label: 'Open Document', panelId: 'trending-doc' },
        { label: 'See Readers', panelId: 'trending-doc' }
      ],
      timestamp: '1:30 PM'
    },
    {
      id: 'morning-1',
      type: 'morning-brief',
      label: 'Morning Brief',
      urgency: 'medium',
      source: 'Multiple Sources',
      sourceBadgeColor: '#d97706',
      sourceIcon: 'ph-stack',
      title: 'Monday Brief · March 9',
      subtitle: '3 priority emails &nbsp;·&nbsp; 2 meetings today &nbsp;·&nbsp; 1 deal at risk',
      body: 'FDIC response deadline March 15. Beacon Capital follow-up overdue 14 days. Amara flagged 3 fintech partnership inquiries for your review.',
      ctas: [
        { label: 'View Full Brief', panelId: 'morning-brief' },
        { label: 'Open Inbox', action: 'open-url', url: 'https://mail.google.com/mail/u/0/#inbox' }
      ],
      timestamp: '9:00 AM'
    }
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // PANEL DEFINITIONS
  // ─────────────────────────────────────────────────────────────────────────
  panels: {
    'meeting-prep': {
      title: 'Meeting Prep — Q2 Strategy Review',
      width: '540px',
      renderer: 'renderMeetingPanel'
    },
    'cra-collaborators': {
      title: 'CRA Community Reinvestment Assessment 2026',
      width: '520px',
      renderer: 'renderCraPanel'
    },
    'beacon-deal': {
      title: 'Beacon Capital — SMB Lending Program',
      width: '580px',
      renderer: 'renderBeaconPanel'
    },
    'fdic-diff': {
      title: 'FDIC Examination Guidelines — What Changed',
      width: '660px',
      renderer: 'renderFdicPanel'
    },
    'trending-doc': {
      title: 'Q2 Budget Reforecast — Trending Now',
      width: '520px',
      renderer: 'renderTrendingPanel'
    },
    'morning-brief': {
      title: 'Morning Brief — Monday, March 9',
      width: '540px',
      renderer: 'renderMorningPanel'
    },
    'ai-upload': {
      title: 'AI-Generated Proactive Insights',
      width: '540px',
      renderer: 'renderAiPanel'
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  // PEOPLE
  // ─────────────────────────────────────────────────────────────────────────
  people: {
    marcus: {
      name: 'Marcus Thompson',
      title: 'SVP, Operations',
      initials: 'MT',
      color: '#0176d3',
      lastMet: '2 weeks ago',
      lastNote: 'Agreed to revisit Q2 headcount after budget review',
      email: 'marcus.thompson@oneunited.com'
    },
    keisha: {
      name: 'Keisha Williams',
      title: 'Director, Compliance',
      initials: 'KW',
      color: '#7c3aed',
      lastMet: '1 week ago',
      lastNote: 'Flagged new FDIC section 3.2 changes for Carmen\'s review',
      email: 'keisha.williams@oneunited.com'
    },
    david: {
      name: 'David Chen',
      title: 'VP, Commercial Lending',
      initials: 'DC',
      color: '#059669',
      lastMet: '3 days ago',
      lastNote: 'Owns Beacon Capital opportunity — last email Feb 23',
      email: 'david.chen@oneunited.com'
    },
    amara: {
      name: 'Amara Osei',
      title: 'Director, Business Development',
      initials: 'AO',
      color: '#d97706',
      lastMet: 'Yesterday',
      lastNote: 'Sent 3 fintech partnership leads for review',
      email: 'amara.osei@oneunited.com'
    },
    james: {
      name: 'James Rivera',
      title: 'Regional Manager, Miami',
      initials: 'JR',
      color: '#e11d48',
      lastMet: '5 days ago',
      lastNote: 'New Miami branch opening drove CRA score improvement',
      email: 'james.rivera@oneunited.com'
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SALESFORCE OPPORTUNITIES & CASES
  // ─────────────────────────────────────────────────────────────────────────
  opportunities: {
    beacon: {
      id: 'OPP-2024-0847',
      name: 'Beacon Capital — SMB Lending Program',
      amount: '$2,400,000',
      stage: 'Proposal',
      probability: '50%',
      closeDate: 'Apr 30, 2026',
      owner: 'David Chen',
      account: 'Beacon Capital Group',
      contact: 'Sarah Kim, CFO',
      lastActivity: 'Feb 23, 2026',
      activityLog: [
        { date: 'Feb 23', type: 'Email', note: 'David Chen sent proposal follow-up — no reply received', icon: 'ph-envelope', quiet: true },
        { date: 'Feb 10', type: 'Meeting', note: 'Proposal walkthrough call with Sarah Kim (CFO)', icon: 'ph-video-camera', quiet: false },
        { date: 'Jan 28', type: 'Document', note: 'Beacon Capital Proposal v3 delivered via DocuSign', icon: 'ph-file-text', quiet: false },
        { date: 'Jan 15', type: 'Call', note: 'Discovery call — $2.4M SMB budget confirmed as approved', icon: 'ph-phone', quiet: false }
      ],
      draftEmail: {
        to: 'Sarah Kim <sarah.kim@beaconcapital.com>',
        from: 'Carmen Rodriguez <carmen.rodriguez@oneunited.com>',
        subject: 'OneUnited SMB Lending — Checking In',
        body: `Hi Sarah,

I wanted to follow up on the proposal David shared a couple of weeks ago. I know Q1 close has been busy for everyone, and I'd love to find a quick 20 minutes to address any questions on the SMB Lending Program before your Q2 planning kicks off.

A few things that may be relevant since our last conversation:
• We've finalized our CDFI co-lending structure, which could reduce your effective rate by ~30 bps
• The Mass Housing partnership we discussed is now confirmed — opens joint community investment angle
• Our new Miami branch strengthens coverage for your Southeast portfolio clients

Would Tuesday or Wednesday this week work for a quick call?

Warm regards,
Carmen Rodriguez
Sales Director, OneUnited Bank`
      }
    },
    massHousing: {
      id: 'OPP-2024-0831',
      name: 'Mass Housing Initiative Partnership',
      amount: '$1,800,000',
      stage: 'Negotiation',
      probability: '70%',
      closeDate: 'Mar 31, 2026',
      owner: 'Carmen Rodriguez',
      account: 'Massachusetts Housing Authority'
    }
  },

  cases: [
    {
      id: 'CS-2024-4821',
      subject: 'Mobile Banking App — Login Authentication Failure',
      priority: 'Critical',
      status: 'Open',
      openTime: '28 hours',
      account: 'OneUnited Retail Banking',
      contact: 'Patricia Hayes, Head of Service'
    },
    {
      id: 'CS-2024-4733',
      subject: 'Mortgage Application Processing Delay — Boston Branch',
      priority: 'High',
      status: 'Escalated',
      openTime: '3 days',
      account: 'Boston Community Investment Trust',
      contact: 'Denise Carter, Loan Officer'
    }
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // EMAIL DATA
  // ─────────────────────────────────────────────────────────────────────────
  emails: [
    {
      from: 'David Chen',
      email: 'david.chen@oneunited.com',
      subject: 'Re: Beacon Capital — should we reach out before they go to a competitor?',
      preview: 'It\'s been 14 days since our last touch. First Citizens Bank was at their offices last week. I think we should send a personalized note from you…',
      time: '8:47 AM',
      urgency: 'high',
      tag: 'Deal at Risk'
    },
    {
      from: 'FDIC Office of Compliance',
      email: 'compliance@fdic.gov',
      subject: 'Updated CRA Examination Schedule — Response Required by March 15',
      preview: 'Please review the updated examination timeline. Section 3.2 has been revised: minimum Tier 1 capital ratio now 8%, effective Q3 2026. CDFI supplemental report required…',
      time: 'Yesterday',
      urgency: 'high',
      tag: 'Due Mar 15'
    },
    {
      from: 'Amara Osei',
      email: 'amara.osei@oneunited.com',
      subject: 'BizDev: 3 fintech partnership inquiries — your input needed',
      preview: 'Received inbound interest from Plaid, MX Technologies, and Greenwood Banking. All three want to explore data-sharing or co-branded product partnerships. Attaching briefs…',
      time: '7:15 AM',
      urgency: 'medium',
      tag: 'Action Needed'
    }
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // CALENDAR EVENTS
  // ─────────────────────────────────────────────────────────────────────────
  calendarEvents: [
    {
      time: '2:00 PM',
      title: 'Q2 Strategy Review',
      attendees: 'Marcus Thompson, Keisha Williams, David Chen',
      location: 'Conference Room A',
      urgency: 'In 14 min',
      icon: 'ph-users',
      color: '#0176d3'
    },
    {
      time: '4:30 PM',
      title: 'Board Prep — Q1 Performance Review',
      attendees: 'Teri Williams (CEO), CFO, Board Members',
      location: 'Executive Conference Room',
      urgency: '',
      icon: 'ph-presentation-chart',
      color: '#7c3aed'
    }
  ],

  // Meeting action items for the panel
  meetingActionItems: [
    { done: false, text: 'Share Q1 lending pipeline summary with Marcus before EOD' },
    { done: false, text: 'Confirm CRA self-assessment timeline with Keisha' },
    { done: true, text: 'Pull Beacon Capital deal status from Salesforce — completed' }
  ],

  // AI talking points for meeting panel
  meetingTalkingPoints: [
    'Q2 Budget Reforecast is trending across the team — align on reforecast assumptions early',
    'Beacon Capital is 14 days quiet — ask David to loop Carmen in on any competitor activity',
    'FDIC capital ratio change (6% → 8%) impacts Q3 planning — flag for Marcus',
    'New Miami branch strengthens CRA score — good news to lead with'
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // DOCUMENTS
  // ─────────────────────────────────────────────────────────────────────────
  docs: [
    { name: 'Q2 2026 Strategic Plan', updatedBy: 'Marcus Thompson', updatedWhen: 'Yesterday 3:42 PM', status: 'updated' },
    { name: 'CRA Community Reinvestment Assessment 2026', updatedBy: 'Keisha Williams', updatedWhen: 'Today 1:23 PM', status: 'hot' },
    { name: 'Beacon Capital Proposal v3', updatedBy: 'David Chen', updatedWhen: '14 days ago', status: 'stale' }
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // TRENDING DOCUMENT
  // ─────────────────────────────────────────────────────────────────────────
  trendingReaders: [
    { initials: 'MT', name: 'Marcus Thompson', color: '#0176d3', time: '9:02 AM', role: 'SVP Operations' },
    { initials: 'DC', name: 'David Chen', color: '#059669', time: '9:15 AM', role: 'VP, Commercial Lending' },
    { initials: 'AO', name: 'Amara Osei', color: '#d97706', time: '9:31 AM', role: 'Director, BizDev' },
    { initials: 'JR', name: 'James Rivera', color: '#e11d48', time: '10:12 AM', role: 'Regional Manager, Miami' },
    { initials: 'KW', name: 'Keisha Williams', color: '#7c3aed', time: '10:45 AM', role: 'Director, Compliance' },
    { initials: 'TR', name: 'Tanya Robinson', color: '#0891b2', time: '11:20 AM', role: 'VP, Strategy' },
    { initials: 'BS', name: 'Brian Simmons', color: '#be185d', time: '12:08 PM', role: 'Finance Director' }
  ],

  // Sparkline data points (views per hour from 8am–1pm)
  trendingSparkline: [1, 2, 1, 3, 5, 7, 6, 5, 7, 8],

  // ─────────────────────────────────────────────────────────────────────────
  // FDIC DIFF DATA
  // ─────────────────────────────────────────────────────────────────────────
  fdicDiff: {
    before: [
      { text: 'Section 3.2 — Capital Requirements', type: 'heading' },
      { text: 'Banks must maintain a minimum Tier 1 capital ratio of ', type: 'normal' },
      { text: '6%', type: 'removed' },
      { text: ' of risk-weighted assets.', type: 'normal' },
      { text: ' Community development loans are weighted at ', type: 'normal' },
      { text: '100%', type: 'removed' },
      { text: ' for CRA assessment purposes.', type: 'normal' },
      { text: ' Annual review cycles apply to all lending institutions with assets exceeding ', type: 'normal' },
      { text: '$250M', type: 'removed' },
      { text: '.', type: 'normal' }
    ],
    after: [
      { text: 'Section 3.2 — Capital Requirements (Revised March 2026)', type: 'heading' },
      { text: 'Banks must maintain a minimum Tier 1 capital ratio of ', type: 'normal' },
      { text: '8%', type: 'added' },
      { text: ' of risk-weighted assets, effective Q3 2026.', type: 'normal' },
      { text: ' Community development loans are now weighted at ', type: 'normal' },
      { text: '85%', type: 'added' },
      { text: ' for CRA assessment, incentivizing CDFI-designated institutions.', type: 'normal' },
      { text: ' Semi-annual review cycles now apply to institutions with assets exceeding ', type: 'normal' },
      { text: '$200M', type: 'added' },
      { text: '.', type: 'normal' },
      { text: '\n\nNew: CDFI-designated banks must file a supplemental compliance report by April 30, 2026.', type: 'added-block' }
    ]
  },

  fdicImpacts: [
    { icon: 'ph-warning-circle', color: '#ef4444', text: 'Capital ratio target increases 6% → 8% — review Q3 reserves with CFO' },
    { icon: 'ph-file-plus', color: '#f59e0b', text: 'New CDFI supplemental report required by Apr 30 — assign to Keisha Williams' },
    { icon: 'ph-calendar-check', color: '#0176d3', text: 'Review cycle changes from annual to semi-annual — schedule for Aug 2026' }
  ],

  fdicTasks: [
    { status: 'in-progress', text: 'Review revised Section 3.2 capital requirements', assignee: 'Carmen Rodriguez', due: 'Mar 15' },
    { status: 'pending', text: 'Submit FDIC examination response', assignee: 'Keisha Williams', due: 'Mar 15' },
    { status: 'pending', text: 'File CDFI supplemental compliance report', assignee: 'Keisha Williams', due: 'Apr 30' },
    { status: 'pending', text: 'Update Q3 capital reserve projections', assignee: 'CFO Office', due: 'Apr 15' }
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // CRA DOCUMENT CHANGES
  // ─────────────────────────────────────────────────────────────────────────
  craChanges: [
    {
      section: 'Section 4: Fair Lending Analysis',
      author: 'Keisha Williams',
      time: '1:23 PM',
      preview: 'HMDA data for 2025 mortgage apps analyzed across Boston, Miami, and LA. 3 improvement areas flagged — denial rate disparity in Dorchester zip codes.',
      relatedSF: { type: 'Case', id: 'CRA-2026-0041', label: 'Fair Lending Exam Prep' }
    },
    {
      section: 'Section 6: HMDA Data Review',
      author: 'Keisha Williams',
      time: '12:47 PM',
      preview: 'Imported and formatted 2025 Home Mortgage Disclosure Act data. Cross-referenced with FFIEC community need maps.',
      relatedSF: { type: 'Account', id: 'ACC-0083', label: 'Boston Community Investment Trust' }
    },
    {
      section: 'Section 8: Branch Access & Distribution',
      author: 'Keisha Williams',
      time: '11:30 AM',
      preview: 'Geographic analysis of branch locations vs. LMI census tracts. New Miami branch (Feb 2026) improved LMI coverage from 61% to 74%.',
      relatedSF: { type: 'Opportunity', id: 'OPP-2024-0831', label: 'Mass Housing Initiative' }
    }
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // TEAMS CHAT DATA
  // ─────────────────────────────────────────────────────────────────────────
  teamsChats: {
    marcus: {
      person: { name: 'Marcus Thompson', title: 'SVP Operations', initials: 'MT', color: '#4f46e5' },
      preview: 'See you at 2pm! 👍',
      time: '2m',
      messages: [
        { from: 'them', text: 'Hey Carmen, are we still on for the Q2 review at 2pm?', time: '10:15 AM' },
        { from: 'me',   text: 'Absolutely! I\'ll have the deck ready. Sending the prep doc shortly.', time: '10:17 AM' },
        { from: 'them', text: 'Perfect. David and Keisha confirmed. Should be a good session.', time: '10:19 AM' },
        { from: 'me',   text: 'Agreed. I flagged the Beacon Capital deal — we need to decide on next steps in today\'s session.', time: '10:21 AM' },
        { from: 'them', text: 'Good call. Let\'s put 10 minutes on that agenda. See you at 2! 👍', time: '10:22 AM' }
      ]
    },
    keisha: {
      person: { name: 'Keisha Williams', title: 'Director, Compliance', initials: 'KW', color: '#059669' },
      preview: 'FDIC deadline is March 15',
      time: '9:47 AM',
      messages: [
        { from: 'them', text: 'Carmen — I just added the updated CRA assessment sections. Can you review by EOD?', time: '9:02 AM' },
        { from: 'me',   text: 'On it. I saw the Astro alert — will look at Sections 4 and 6 changes first.', time: '9:45 AM' },
        { from: 'them', text: 'Thanks! Also heads up — FDIC deadline is March 15. We\'re tracking all compliance tasks in the Astro feed.', time: '9:47 AM' }
      ]
    },
    david: {
      person: { name: 'David Chen', title: 'VP, Commercial Lending', initials: 'DC', color: '#0176d3' },
      preview: 'Sent you a draft this morning',
      time: '8:30 AM',
      messages: [
        { from: 'me',   text: 'David, any update on the Beacon Capital follow-up? We\'re 14 days quiet.', time: 'Yesterday' },
        { from: 'them', text: 'I know — I\'ve been drafting an email. Will sync with you before sending.', time: 'Yesterday' },
        { from: 'them', text: 'Sent you a draft this morning. Lmk if the tone works.', time: '8:30 AM' },
        { from: 'me',   text: 'Looks good. Let\'s discuss the CDFI angle in the Q2 review today — could be a closer.', time: '8:45 AM' }
      ]
    },
    amara: {
      person: { name: 'Amara Osei', title: 'Director, Business Development', initials: 'AO', color: '#d97706' },
      preview: 'All three briefs are attached',
      time: 'Yesterday',
      messages: [
        { from: 'them', text: 'Hi Carmen — received inbound interest from Plaid, MX Technologies, and Greenwood Banking for data-sharing partnerships.', time: 'Yesterday' },
        { from: 'them', text: 'All three briefs are attached. Plaid is most time-sensitive — they want a decision by March 20.', time: 'Yesterday' },
        { from: 'me',   text: 'Thanks Amara. I\'ll review the Plaid brief tonight. Can you set up a 30-min intro call for early next week?', time: 'Yesterday' }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  // AI UPLOAD PANEL PLACEHOLDER
  // (populated at runtime by app.js after Claude API response)
  // ─────────────────────────────────────────────────────────────────────────
  aiPanelContent: null,

  // ─────────────────────────────────────────────────────────────────────────
  // ASTRO COWORK — SCENARIOS & AGENT DEFINITIONS
  // OneUnited Bank context: 4 enterprise scenarios, each with specialist agents
  // ─────────────────────────────────────────────────────────────────────────
  coworkScenarios: {

    'board-meeting': {
      key: 'board-meeting',
      label: 'Board Meeting Prep',
      exampleGoal: 'Prepare me for my board meeting tomorrow',
      intentLabel: 'prepare you for tomorrow\'s Q2 Strategy Board Review',
      keywords: ['board', 'meeting', 'prepare', 'prep', 'strategy review', 'tomorrow', 'talking points'],
      agents: [
        {
          id: 'cal-bm', name: 'Calendar Agent', icon: 'ph-calendar', color: '#0176d3',
          actions: ['Fetching tomorrow\'s agenda…', 'Found Q2 Strategy Review at 2:00 PM', 'Identifying 8 attendees…', 'Checking for conflicts…'],
          result: 'Q2 Strategy Review · 2:00 PM · 8 attendees'
        },
        {
          id: 'crm-bm', name: 'CRM Agent', icon: 'ph-currency-dollar-simple', color: '#059669',
          actions: ['Querying Salesforce pipeline…', 'Flagged Beacon Capital — 14 days silent', 'Pulling Mass Housing deal status…', 'Summarizing $4.2M pipeline…'],
          result: '$4.2M pipeline · 2 deals flagged'
        },
        {
          id: 'res-bm', name: 'Research Agent', icon: 'ph-magnifying-glass', color: '#7c3aed',
          actions: ['Scanning Google Drive for recent docs…', 'Q2 Budget Reforecast trending (7 readers)…', 'Pulling FDIC updated guidelines…', 'Indexing 3 relevant documents…'],
          result: '3 documents surfaced · 1 trending'
        },
        {
          id: 'wri-bm', name: 'Writing Agent', icon: 'ph-pencil', color: '#da7756',
          actions: ['Synthesizing research + CRM data…', 'Drafting 5 talking points…', 'Highlighting Beacon Capital risk…', 'Formatting board-ready brief…'],
          result: '5-point executive brief ready'
        }
      ],
      results: [
        {
          title: 'Board Meeting Brief', subtitle: '5 talking points · Q2 Strategy Review · Ready to present',
          icon: 'ph-file-text', color: '#0176d3', primaryAction: 'Open Brief', secondaryAction: 'Send to Team'
        },
        {
          title: 'Deal Alert: Beacon Capital', subtitle: '14 days no activity · $2.4M at risk · Competitor contact detected',
          icon: 'ph-warning-circle', color: '#ef4444', primaryAction: 'View in Salesforce', secondaryAction: 'Draft Follow-up'
        },
        {
          title: 'Q2 Budget Reforecast Summary', subtitle: '7% upward revision · Trending among 7 leaders today',
          icon: 'ph-presentation-chart', color: '#059669', primaryAction: 'Open Document', secondaryAction: 'Add to Brief'
        }
      ]
    },

    'follow-up': {
      key: 'follow-up',
      label: 'Follow Up Stale Leads',
      exampleGoal: 'Follow up with leads who haven\'t responded in 2+ weeks',
      intentLabel: 'identify and re-engage leads that have gone quiet',
      keywords: ['follow up', 'follow-up', 'leads', 'silent', 'no response', 'stale', 'quiet', 'outreach', '2 weeks', '14 days', 'prospect'],
      agents: [
        {
          id: 'crm-fu', name: 'CRM Agent', icon: 'ph-currency-dollar-simple', color: '#059669',
          actions: ['Querying opps with no activity ≥14 days…', 'Found Beacon Capital — 14 days silent…', 'Checking Mass Housing last touchpoint…', '2 opportunities need attention…'],
          result: '2 opportunities need attention'
        },
        {
          id: 'res-fu', name: 'Research Agent', icon: 'ph-magnifying-glass', color: '#7c3aed',
          actions: ['Scanning news for Beacon Capital…', 'Detected First Citizens Bank competitor outreach…', 'Pulling Mass Housing RFP update…', 'Identifying re-engagement hooks…'],
          result: '1 competitor threat · 1 new angle found'
        },
        {
          id: 'wri-fu', name: 'Writing Agent', icon: 'ph-pencil', color: '#da7756',
          actions: ['Drafting personalized Beacon Capital email…', 'Weaving in CDFI co-lending offer (+30 bps)…', 'Referencing Miami branch expansion…', 'Drafting Mass Housing check-in note…'],
          result: '2 personalized emails drafted'
        },
        {
          id: 'com-fu', name: 'Communication Agent', icon: 'ph-chat-circle-dots', color: '#d97706',
          actions: ['Queuing emails in Outbox…', 'Checking Carmen\'s send-time preferences…', 'Scheduling optimal send window (8 AM Tue)…', 'Ready for review and approval…'],
          result: '2 emails queued · awaiting approval'
        }
      ],
      results: [
        {
          title: 'Follow-up: Sarah Kim (Beacon Capital)', subtitle: 'Personalized · CDFI offer + Miami branch angle · Optimal send: 8 AM Tuesday',
          icon: 'ph-envelope', color: '#059669', primaryAction: 'Review & Send', secondaryAction: 'Edit Draft'
        },
        {
          title: 'Check-in: Mass Housing Authority', subtitle: 'References upcoming March 31 close date · Professional tone',
          icon: 'ph-envelope', color: '#0176d3', primaryAction: 'Review & Send', secondaryAction: 'Edit Draft'
        },
        {
          title: 'Competitor Alert: Beacon Capital', subtitle: 'First Citizens Bank visited their offices last week · Act within 48h',
          icon: 'ph-warning-circle', color: '#ef4444', primaryAction: 'View Intelligence', secondaryAction: 'Escalate to Marcus'
        }
      ]
    },

    'compliance': {
      key: 'compliance',
      label: 'Q1 Compliance Risk Summary',
      exampleGoal: 'Summarize Q1 compliance risks in our loan portfolio',
      intentLabel: 'surface and summarize compliance risks across the Q1 loan portfolio',
      keywords: ['compliance', 'risk', 'fdic', 'cra', 'loan portfolio', 'q1', 'examination', 'regulatory', 'audit', 'capital ratio'],
      agents: [
        {
          id: 'res-cr', name: 'Research Agent', icon: 'ph-magnifying-glass', color: '#7c3aed',
          actions: ['Pulling FDIC updated guidelines (March 2026)…', 'Scanning CRA assessment document…', 'Querying compliance case history…', 'Cross-referencing 3 regulatory sources…'],
          result: '3 compliance sources indexed'
        },
        {
          id: 'ana-cr', name: 'Analysis Agent', icon: 'ph-chart-bar', color: '#4285f4',
          actions: ['Analyzing Q1 capital ratio data…', 'HMDA: denial rate disparity in Dorchester…', 'Comparing ratios vs. new 8% FDIC threshold…', 'Scoring 3 risk areas by severity…'],
          result: '3 risk areas · 1 critical flagged'
        },
        {
          id: 'com-cr', name: 'Compliance Agent', icon: 'ph-shield-check', color: '#dc2626',
          actions: ['Validating CDFI supplemental report status…', 'Checking FDIC examination response deadline…', 'Reviewing CRA Fair Lending sections…', 'Flagging items for legal review…'],
          result: '2 deadlines at risk · Mar 15 critical'
        },
        {
          id: 'wri-cr', name: 'Writing Agent', icon: 'ph-pencil', color: '#da7756',
          actions: ['Drafting executive risk summary…', 'Prioritizing items by urgency…', 'Adding remediation recommendations…', 'Formatting for board distribution…'],
          result: 'Executive risk summary complete'
        }
      ],
      results: [
        {
          title: 'Q1 Compliance Risk Summary', subtitle: '3 risk areas · 2 deadlines flagged · Board-ready executive format',
          icon: 'ph-shield-check', color: '#dc2626', primaryAction: 'Open Report', secondaryAction: 'Share with Keisha'
        },
        {
          title: 'FDIC Response Due: March 15', subtitle: '6 days remaining · Section 3.2 capital ratio response required',
          icon: 'ph-calendar-x', color: '#f59e0b', primaryAction: 'View Task', secondaryAction: 'Notify Keisha'
        },
        {
          title: 'Fair Lending: HMDA Disparity Flagged', subtitle: 'Dorchester zip codes · Denial rate 12% above benchmark · Legal review needed',
          icon: 'ph-warning-circle', color: '#ef4444', primaryAction: 'View Analysis', secondaryAction: 'Open CRA Doc'
        }
      ]
    },

    'intel': {
      key: 'intel',
      label: 'Weekly Intel Report Setup',
      exampleGoal: 'Set up a weekly competitive intelligence report for me',
      intentLabel: 'set up a recurring weekly competitive intelligence report delivered every Monday',
      keywords: ['weekly', 'intelligence', 'competitive', 'intel', 'report', 'recurring', 'monitor', 'fintech', 'competitor', 'landscape'],
      agents: [
        {
          id: 'res-ir', name: 'Research Agent', icon: 'ph-magnifying-glass', color: '#7c3aed',
          actions: ['Identifying key sources to monitor…', 'Fintech: Plaid, MX Technologies, Greenwood…', 'Setting up First Citizens Bank tracker…', 'Configuring CDFI market pulse feed…'],
          result: '8 intelligence sources configured'
        },
        {
          id: 'ana-ir', name: 'Analysis Agent', icon: 'ph-chart-bar', color: '#4285f4',
          actions: ['Structuring weekly report template…', 'Defining significance thresholds…', 'Configuring trend detection filters…', 'Setting competitor movement alerts…'],
          result: 'Report template + alert filters ready'
        },
        {
          id: 'wri-ir', name: 'Writing Agent', icon: 'ph-pencil', color: '#da7756',
          actions: ['Building this week\'s first report…', 'Surfacing Plaid partnership opportunity…', 'Flagging First Citizens expansion activity…', 'Formatting for executive reading…'],
          result: 'Issue #1 of weekly report ready'
        },
        {
          id: 'cal-ir', name: 'Calendar Agent', icon: 'ph-calendar', color: '#0176d3',
          actions: ['Scheduling weekly Monday delivery…', 'Setting 8:00 AM delivery window…', 'Adding to Carmen\'s calendar…', 'Confirmed recurrence through Q2 2026…'],
          result: 'Scheduled every Mon at 8:00 AM'
        }
      ],
      results: [
        {
          title: 'Competitive Intel Report · Issue #1', subtitle: 'Plaid partnership · First Citizens activity · CDFI market pulse · Mar 10, 2026',
          icon: 'ph-trend-up', color: '#7c3aed', primaryAction: 'Read Report', secondaryAction: 'Customize'
        },
        {
          title: 'Weekly Intel Report · Recurring', subtitle: 'Every Monday at 8:00 AM · Delivered to Proactive Feed · Through Q2 2026',
          icon: 'ph-calendar-check', color: '#0176d3', primaryAction: 'View Schedule', secondaryAction: 'Adjust Timing'
        },
        {
          title: 'High-priority: Plaid Partnership Window', subtitle: 'Amara flagged inbound interest · Decision requested by March 20',
          icon: 'ph-sparkle', color: '#059669', primaryAction: 'View Brief', secondaryAction: 'Schedule Call'
        }
      ]
    }

  },

  // Quick example goals shown in the Cowork idle state
  coworkExamples: [
    { key: 'board-meeting', label: 'Prepare for my board meeting tomorrow',   icon: 'ph-presentation-chart', exampleGoal: 'Prepare me for my board meeting tomorrow' },
    { key: 'follow-up',     label: 'Follow up with leads silent 2+ weeks',    icon: 'ph-envelope-open',      exampleGoal: 'Follow up with leads who haven\'t responded in 2+ weeks' },
    { key: 'compliance',    label: 'Summarize Q1 compliance risks',            icon: 'ph-shield-check',       exampleGoal: 'Summarize Q1 compliance risks in our loan portfolio' },
    { key: 'intel',         label: 'Set up weekly competitive intel report',   icon: 'ph-trend-up',           exampleGoal: 'Set up a weekly competitive intelligence report for me' }
  ]

};
