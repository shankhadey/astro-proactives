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
      triggeredBecause: 'Starts in 14 min · 3 open action items unresolved from last sync',
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
      triggeredBecause: 'Keisha updated a doc you co-own · 3 sections added since you last opened it',
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
      triggeredBecause: 'No CRM activity in 14 days · competitor visited their office last week',
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
      triggeredBecause: 'A regulation you reference was revised · new capital ratio affects your Q3 plan',
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
      triggeredBecause: '7 of your close colleagues read this today · it\'s on your 2 PM agenda',
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
      triggeredBecause: 'Daily intelligence compiled from calendar, email, CRM, and compliance systems',
      ctas: [
        { label: 'Open Morning Digest', action: 'open-digest' },
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

  // ─────────────────────────────────────────────────────────────────────────
  // PERSONAS  — 9 pre-built combos: Role (Sales/Service/Marketing) × Industry
  // Each has: user info, 6 cards (with triggeredBecause), lateCard, morningDigest
  // ─────────────────────────────────────────────────────────────────────────
  personas: {

    // ── Sales · Banking ──────────────────────────────────────────────────────
    'sales-banking': {
      key: 'sales-banking',
      label: 'Carmen · AE · Banking',
      sfAppName: 'Sales Cloud',
      user: { name: 'Carmen Rodriguez', title: 'Account Executive', company: 'OneUnited Bank', initials: 'CR', color: '#4caf50' },
      cards: null, // uses window.DATA.cards (default)
      lateCard: {
        id: 'late-sb', type: 'trending', label: 'Anomaly Detected', urgency: 'high',
        source: 'Support', sourceBadgeColor: '#ef4444', sourceIcon: 'ph-warning',
        title: 'Support Ticket Spike: Beacon Capital',
        subtitle: '3 mobile banking complaints from Beacon accounts &nbsp;·&nbsp; Last hour',
        body: 'Three Beacon Capital employees filed mobile banking complaints in the last hour — unusual pattern for this account. May indicate an IT rollout or a friction point ahead of your deal close.',
        triggeredBecause: 'Anomaly: 3× normal complaint rate from a key prospect account',
        ctas: [{ label: 'View Tickets', panelId: 'beacon-deal' }, { label: 'Alert David Chen', action: 'toast', message: 'David Chen notified about Beacon Capital ticket spike ✓' }],
        timestamp: 'Just now'
      },
      morningDigest: {
        date: 'Monday, Mar 9',
        summary: '2 meetings · 2 forgotten commitments · Compliance Cowork ran overnight · 1 doc awaiting your reply',
        sections: [
          { type: 'calendar', title: "Today's Calendar", items: [
            { time: '2:00 PM', title: 'Q2 Strategy Review', context: 'Deal at risk flagged · 3 open action items', color: '#0176d3' },
            { time: '4:30 PM', title: 'Board Prep — Q1 Review', context: 'Keisha needs FDIC response before this', color: '#7c3aed' }
          ]},
          { type: 'commitments', title: 'Forgotten Commitments', items: [
            { text: 'You told David Chen: "I\'ll send Beacon Capital the final terms by Friday"', source: 'Email · Feb 20', overdue: true },
            { text: 'You told Amara: "I\'ll review the Plaid brief tonight"', source: 'Teams · Yesterday', overdue: false }
          ]},
          { type: 'blockers', title: 'Awaiting Your Reply', items: [
            { text: 'Keisha Williams commented on CRA Assessment Section 4 — waiting on your feedback', source: '1:23 PM today' }
          ]},
          { type: 'cowork', title: 'Overnight Cowork Results', items: [
            { label: 'Q1 Compliance Risk Summary', note: 'Ran at 11:00 PM · 3 risks flagged · 2 FDIC deadlines at risk · Report ready' }
          ]},
          { type: 'focus', title: 'Suggested Focus Window', items: [
            { time: '10:00 AM – 12:00 PM', note: '2 hrs clear — ideal for Beacon Capital follow-up and FDIC response draft' }
          ]}
        ]
      }
    },

    // ── Sales · Healthcare ────────────────────────────────────────────────────
    'sales-healthcare': {
      key: 'sales-healthcare',
      label: 'Jordan · Regional Dir · Healthcare',
      sfAppName: 'Health Cloud',
      user: { name: 'Jordan Hayes', title: 'Regional Sales Director', company: 'Medline Solutions', initials: 'JH', color: '#0891b2' },
      cards: [
        {
          id: 'sh-meet', type: 'upcoming-meeting', label: 'Upcoming Meeting', urgency: 'high',
          source: 'Calendar', sourceBadgeColor: '#0176d3', sourceIcon: 'ph-calendar-blank',
          title: 'Renewal Call — Memorial Hospital',
          subtitle: 'Video Call &nbsp;·&nbsp; Starts in 22 min',
          body: 'Dr. Priya Anand (CPO) and procurement lead attending. $340K annual contract up for renewal. Competitor Medtronic quoted 8% below current rate — prepare value defense.',
          triggeredBecause: 'Renewal call in 22 min · competitor undercut your price by 8% last week',
          ctas: [{ label: 'View Account Prep', action: 'toast', message: 'Opening Memorial Hospital account prep…' }, { label: 'Join Call', action: 'open-url', url: 'https://calendar.google.com' }],
          timestamp: '11:00 AM today'
        },
        {
          id: 'sh-deal', type: 'deal-momentum', label: 'Deal/Case Momentum', urgency: 'high',
          source: 'Salesforce', sourceBadgeColor: '#0176d3', sourceIcon: 'ph-cloud',
          title: 'Stanford Health Care — Surgical Suite',
          subtitle: '$1.2M capital equipment &nbsp;·&nbsp; No activity in 18 days',
          body: 'Last touchpoint was a product demo Feb 19. Stryker was spotted at Stanford\'s procurement office last week. Close date is April 15 — window narrowing.',
          triggeredBecause: 'No activity 18 days · competitor detected at prospect location',
          ctas: [{ label: 'View Opportunity', action: 'toast', message: 'Opening Stanford opportunity in Salesforce…' }, { label: 'Draft Re-Engagement', action: 'toast', message: 'Drafting personalized re-engagement email…' }],
          timestamp: 'At risk'
        },
        {
          id: 'sh-collab', type: 'top-collaborators', label: 'Top Collaborators', urgency: 'medium',
          source: 'Google Docs', sourceBadgeColor: '#4285f4', sourceIcon: 'ph-google-logo',
          title: 'Lindsay Park updated Stanford Account Plan',
          subtitle: 'Added exec sponsor section &nbsp;·&nbsp; 41 min ago',
          body: '"Stanford Health Care Q2 Account Plan" now has a new exec sponsor map and budget approval chain. Lindsay flagged that Dr. Martinez (new CMO) is the key unworked contact.',
          triggeredBecause: 'Lindsay updated a shared plan for your largest open deal',
          ctas: [{ label: 'Review Changes', action: 'toast', message: 'Opening Stanford account plan…' }, { label: 'View Exec Map', action: 'toast', message: 'Loading exec sponsor map…' }],
          timestamp: '10:41 AM'
        },
        {
          id: 'sh-trend', type: 'trending', label: 'Trending', urgency: 'low',
          source: 'Activity', sourceBadgeColor: '#059669', sourceIcon: 'ph-chart-line-up',
          title: '6 teammates viewed this today',
          subtitle: '"Memorial Hospital Contract Template" &nbsp;·&nbsp; Trending since 8 AM',
          body: 'Your regional team and legal are all in this doc today — likely related to the renewal negotiation and Medtronic competitive pressure on pricing.',
          triggeredBecause: '6 colleagues from your deal team opened this before your renewal call',
          ctas: [{ label: 'Open Template', action: 'toast', message: 'Opening contract template…' }, { label: 'See Editors', action: 'toast', message: 'Loading recent viewers…' }],
          timestamp: '11:15 AM'
        },
        {
          id: 'sh-drift', type: 'knowledge-drift', label: 'Knowledge Drift', urgency: 'medium',
          source: 'Regulatory', sourceBadgeColor: '#7c3aed', sourceIcon: 'ph-shield-check',
          title: 'FDA MDR Reporting Requirements Revised',
          subtitle: 'UDI documentation rules updated &nbsp;·&nbsp; 3 days ago',
          body: 'FDA updated Medical Device Reporting rules for Class II devices. Affects how you document adverse event tracking in sales proposals — legal requires an updated disclaimer in all Q2 contracts.',
          triggeredBecause: 'Regulation affects your active contract language · legal flagged action needed',
          ctas: [{ label: 'See What Changed', action: 'toast', message: 'Opening FDA MDR diff…' }, { label: 'Notify Legal', action: 'toast', message: 'Legal team notified of FDA MDR update ✓' }],
          timestamp: '3 days ago'
        },
        {
          id: 'sh-brief', type: 'morning-brief', label: 'Morning Brief', urgency: 'medium',
          source: 'Multiple Sources', sourceBadgeColor: '#d97706', sourceIcon: 'ph-stack',
          title: 'Monday Brief · March 9',
          subtitle: '1 renewal call today &nbsp;·&nbsp; 2 RFP responses due this week &nbsp;·&nbsp; 1 deal at risk',
          body: 'Stanford deal needs engagement before April 15 close. Memorial renewal call in 22 min. Q1 pipeline at $4.8M — 14% ahead of target.',
          triggeredBecause: 'Daily intelligence compiled from calendar, Salesforce, email, and regulatory feeds',
          ctas: [{ label: 'Open Morning Digest', action: 'open-digest' }, { label: 'Open Inbox', action: 'open-url', url: 'https://mail.google.com' }],
          timestamp: '9:00 AM'
        }
      ],
      lateCard: {
        id: 'late-sh', type: 'trending', label: 'New RFP Alert', urgency: 'high',
        source: 'Procurement', sourceBadgeColor: '#ef4444', sourceIcon: 'ph-file-text',
        title: 'Stanford Posted a $1.4M Surgical Robotics RFP',
        subtitle: 'Response window: 5 days &nbsp;·&nbsp; Just posted',
        body: 'Stanford Health Care just published an RFP for surgical robotics integration — directly adjacent to your open equipment deal. Medline\'s robotics division should be looped in immediately.',
        triggeredBecause: 'New RFP from an active prospect · overlaps with your open deal · closes in 5 days',
        ctas: [{ label: 'View RFP', action: 'toast', message: 'Opening Stanford RFP details…' }, { label: 'Loop in Robotics Team', action: 'toast', message: 'Robotics team notified about Stanford RFP ✓' }],
        timestamp: 'Just now'
      },
      morningDigest: {
        date: 'Monday, Mar 9',
        summary: '2 calls today · 1 forgotten follow-up · Competitive intel ran overnight · 1 contract doc needs update',
        sections: [
          { type: 'calendar', title: "Today's Calendar", items: [
            { time: '11:00 AM', title: 'Renewal Call — Memorial Hospital', context: '$340K renewal · Medtronic competing · value defense needed', color: '#0176d3' },
            { time: '3:00 PM', title: 'Weekly Pipeline Review', context: '4 deals to discuss · Stanford flagged', color: '#059669' }
          ]},
          { type: 'commitments', title: 'Forgotten Commitments', items: [
            { text: 'You told Dr. Anand: "I\'ll send updated device specs before our renewal call"', source: 'Email · Mar 6', overdue: true },
            { text: 'You promised legal: "I\'ll review the updated contract disclaimers this week"', source: 'Teams · Last week', overdue: false }
          ]},
          { type: 'blockers', title: 'Awaiting Your Reply', items: [
            { text: 'Lindsay Park is waiting on your approval of the Stanford exec sponsor map before sharing externally', source: '10:41 AM today' }
          ]},
          { type: 'cowork', title: 'Overnight Cowork Results', items: [
            { label: 'Competitive Intelligence Report', note: 'Ran at 10:00 PM · Medtronic pricing analysis complete · 3 counter-points ready for Memorial call' }
          ]},
          { type: 'focus', title: 'Suggested Focus Window', items: [
            { time: '1:00 PM – 3:00 PM', note: '2 hrs clear — tackle Stanford re-engagement email and FDA contract language update' }
          ]}
        ]
      }
    },

    // ── Sales · Automotive ────────────────────────────────────────────────────
    'sales-automotive': {
      key: 'sales-automotive',
      label: 'Tyler · Fleet Sales Mgr · Automotive',
      sfAppName: 'Sales Cloud',
      user: { name: 'Tyler Brooks', title: 'Fleet Sales Manager', company: 'AutoNation', initials: 'TB', color: '#d97706' },
      cards: [
        {
          id: 'sa-meet', type: 'upcoming-meeting', label: 'Upcoming Meeting', urgency: 'high',
          source: 'Calendar', sourceBadgeColor: '#0176d3', sourceIcon: 'ph-calendar-blank',
          title: 'Fleet Demo Day — Amazon Logistics',
          subtitle: 'AutoNation Showroom &nbsp;·&nbsp; Starts in 35 min',
          body: 'Fleet manager James O\'Brien and two procurement leads attending. 48-vehicle F-150 Pro order on the table. Confirm Q2 delivery commitment and fleet financing terms before they arrive.',
          triggeredBecause: 'Demo starts in 35 min · 48-vehicle deal depends on today\'s close',
          ctas: [{ label: 'View Account Prep', action: 'toast', message: 'Opening Amazon fleet account prep…' }, { label: 'Get Directions', action: 'open-url', url: 'https://maps.google.com' }],
          timestamp: '10:00 AM today'
        },
        {
          id: 'sa-deal', type: 'deal-momentum', label: 'Deal/Case Momentum', urgency: 'high',
          source: 'CDK', sourceBadgeColor: '#059669', sourceIcon: 'ph-car',
          title: 'Dell Technologies Fleet Quote Gone Quiet',
          subtitle: '$840K — 60-vehicle mixed fleet &nbsp;·&nbsp; No response in 12 days',
          body: 'Dell\'s procurement lead requested a revised EV-heavy quote on Feb 25 — no reply since. EnterpriseFleet was spotted at Dell\'s Austin office last Tuesday.',
          triggeredBecause: '12 days silent after a quote request · competitor in active conversations',
          ctas: [{ label: 'View Quote', action: 'toast', message: 'Opening Dell fleet quote in CDK…' }, { label: 'Draft Follow-Up', action: 'toast', message: 'Drafting Dell follow-up email…' }],
          timestamp: 'At risk'
        },
        {
          id: 'sa-collab', type: 'top-collaborators', label: 'Top Collaborators', urgency: 'medium',
          source: 'SharePoint', sourceBadgeColor: '#4285f4', sourceIcon: 'ph-files',
          title: 'Rachel Moore updated Q1 Fleet Incentive Sheet',
          subtitle: 'March rates revised &nbsp;·&nbsp; 1 hr ago',
          body: '"Q1 Fleet Pricing Playbook" now has updated March incentive rates — F-150 Pro fleet discount increased 2.5%, Lightning EV fleet incentive extended through April 30.',
          triggeredBecause: 'Pricing you use in active quotes was just updated · affects Dell and Amazon deals',
          ctas: [{ label: 'Review Updates', action: 'toast', message: 'Opening Q1 fleet incentive sheet…' }, { label: 'Update Dell Quote', action: 'toast', message: 'Flagging Dell quote for rate update…' }],
          timestamp: '9:45 AM'
        },
        {
          id: 'sa-trend', type: 'trending', label: 'Trending', urgency: 'low',
          source: 'Activity', sourceBadgeColor: '#059669', sourceIcon: 'ph-chart-line-up',
          title: '5 managers viewing this now',
          subtitle: '"2026 Fleet Pricing Playbook" &nbsp;·&nbsp; Trending since 8:30 AM',
          body: 'Regional managers in Dallas, Chicago, and Atlanta all opened the fleet playbook this morning — likely prepping for the same quarter-end push you\'re running.',
          triggeredBecause: '5 regional peers are reading this · Q1 close window opens today',
          ctas: [{ label: 'Open Playbook', action: 'toast', message: 'Opening fleet pricing playbook…' }, { label: 'See Viewers', action: 'toast', message: 'Loading viewer list…' }],
          timestamp: '9:00 AM'
        },
        {
          id: 'sa-drift', type: 'knowledge-drift', label: 'Knowledge Drift', urgency: 'medium',
          source: 'Regulatory', sourceBadgeColor: '#7c3aed', sourceIcon: 'ph-shield-check',
          title: 'EPA Clean Fleet Act Deadlines Announced',
          subtitle: '2027 EV transition thresholds published &nbsp;·&nbsp; 2 days ago',
          body: 'EPA finalized corporate fleet EV percentage requirements: 30% by 2027 for fleets over 50 vehicles. Directly affects 4 of your active large-fleet quotes — EV pitch needs updating.',
          triggeredBecause: 'New regulation directly affects 4 of your active fleet proposals',
          ctas: [{ label: 'See Full Update', action: 'toast', message: 'Opening EPA Clean Fleet Act summary…' }, { label: 'Update EV Pitches', action: 'toast', message: 'Flagging 4 active quotes for EV compliance update…' }],
          timestamp: '2 days ago'
        },
        {
          id: 'sa-brief', type: 'morning-brief', label: 'Morning Brief', urgency: 'medium',
          source: 'Multiple Sources', sourceBadgeColor: '#d97706', sourceIcon: 'ph-stack',
          title: 'Monday Brief · March 9',
          subtitle: '1 demo today &nbsp;·&nbsp; 3 fleet bids due this week &nbsp;·&nbsp; Q1 close rate 67%',
          body: 'Amazon demo in 35 min. Dell quote needs re-engagement. March incentive rates updated — revise open quotes before week\'s end.',
          triggeredBecause: 'Daily intelligence compiled from calendar, CDK, email, and pricing systems',
          ctas: [{ label: 'Open Morning Digest', action: 'open-digest' }, { label: 'Open Inbox', action: 'open-url', url: 'https://mail.google.com' }],
          timestamp: '9:00 AM'
        }
      ],
      lateCard: {
        id: 'late-sa', type: 'deal-momentum', label: 'Deal Update', urgency: 'high',
        source: 'Intelligence', sourceBadgeColor: '#ef4444', sourceIcon: 'ph-lightning',
        title: 'Dell Expanded Their Fleet Budget by $200K',
        subtitle: 'Budget approved for EV additions &nbsp;·&nbsp; Just confirmed',
        body: 'LinkedIn activity and a procurement update indicate Dell\'s fleet budget was increased by $200K for EV vehicles. Your quote can now include 12 additional Lightnings.',
        triggeredBecause: 'Deal signal: prospect budget just increased · re-engage now while window is open',
        ctas: [{ label: 'Update Quote', action: 'toast', message: 'Updating Dell quote with expanded EV allocation…' }, { label: 'Send to Dell', action: 'toast', message: 'Revised quote sent to Dell procurement ✓' }],
        timestamp: 'Just now'
      },
      morningDigest: {
        date: 'Monday, Mar 9',
        summary: '1 demo today · 1 forgotten commitment · Pricing updated overnight · 3 bids due this week',
        sections: [
          { type: 'calendar', title: "Today's Calendar", items: [
            { time: '10:00 AM', title: 'Fleet Demo Day — Amazon Logistics', context: '48-vehicle F-150 order · Q2 delivery TBD', color: '#0176d3' },
            { time: '2:00 PM', title: 'Q1 Pipeline Review with Regional Director', context: 'Bring Dell and Amazon status', color: '#d97706' }
          ]},
          { type: 'commitments', title: 'Forgotten Commitments', items: [
            { text: 'You told Dell procurement: "I\'ll have a revised EV-heavy quote to you by end of last week"', source: 'Email · Feb 25', overdue: true }
          ]},
          { type: 'blockers', title: 'Awaiting Your Reply', items: [
            { text: 'Rachel Moore is waiting on your approval of the updated F-150 Lightning fleet spec sheet before publishing', source: '9:45 AM today' }
          ]},
          { type: 'cowork', title: 'Overnight Cowork Results', items: [
            { label: 'EPA Compliance Analysis', note: 'Ran at 9:00 PM · 4 quotes need EV percentage update · template revision ready for review' }
          ]},
          { type: 'focus', title: 'Suggested Focus Window', items: [
            { time: '12:00 PM – 2:00 PM', note: '2 hrs clear — ideal for Dell re-engagement and EPA quote updates' }
          ]}
        ]
      }
    },

    // ── Service · Banking ─────────────────────────────────────────────────────
    'service-banking': {
      key: 'service-banking',
      label: 'Priya · CSM · Banking',
      sfAppName: 'Service Cloud',
      user: { name: 'Priya Patel', title: 'Customer Success Manager', company: 'Chase Business Banking', initials: 'PP', color: '#0176d3' },
      cards: [
        {
          id: 'svb-meet', type: 'upcoming-meeting', label: 'Upcoming Meeting', urgency: 'high',
          source: 'Calendar', sourceBadgeColor: '#0176d3', sourceIcon: 'ph-calendar-blank',
          title: 'QBR — Harrington Construction',
          subtitle: 'Zoom Call &nbsp;·&nbsp; Starts in 45 min',
          body: 'CEO Mark Harrington and CFO attending. $2.1M relationship with 4 active products. Open wire transfer issue (CS-4821) must be resolved or acknowledged before this call.',
          triggeredBecause: 'QBR in 45 min · open critical case on this account unresolved',
          ctas: [{ label: 'View Account Brief', action: 'toast', message: 'Opening Harrington Construction QBR prep…' }, { label: 'Join Call', action: 'open-url', url: 'https://zoom.us' }],
          timestamp: '11:00 AM today'
        },
        {
          id: 'svb-case', type: 'deal-momentum', label: 'Case Escalation Risk', urgency: 'high',
          source: 'Salesforce', sourceBadgeColor: '#ef4444', sourceIcon: 'ph-headset',
          title: 'Wire Transfer Failure — Harrington Construction',
          subtitle: 'Case CS-4821 &nbsp;·&nbsp; Open 3 days &nbsp;·&nbsp; SLA breach in 4 hours',
          body: '$85K wire transfer failed March 6 — funds in limbo. Harrington\'s CFO has escalated twice. Engineering confirmed ACH routing bug in fix queue but not yet resolved.',
          triggeredBecause: 'SLA breach in 4 hours · impacted account has QBR in 45 min',
          ctas: [{ label: 'View Case', action: 'toast', message: 'Opening case CS-4821 in Service Cloud…' }, { label: 'Escalate to Eng', action: 'toast', message: 'Engineering team escalated for urgent fix ✓' }],
          timestamp: 'SLA breach in 4h'
        },
        {
          id: 'svb-collab', type: 'top-collaborators', label: 'Case Assignment', urgency: 'medium',
          source: 'ServiceNow', sourceBadgeColor: '#4285f4', sourceIcon: 'ph-ticket',
          title: 'Michael Torres escalated Riverside Bakery',
          subtitle: 'ACH dispute — Case CS-4833 &nbsp;·&nbsp; Assigned to you',
          body: 'Riverside Bakery\'s $12K payroll ACH was rejected for the second consecutive month. Michael escalated to you after Tier 1 resolution failed. Response needed within 2 hours per SLA.',
          triggeredBecause: 'Case assigned to you by colleague · 2-hour SLA clock started',
          ctas: [{ label: 'Open Case', action: 'toast', message: 'Opening Riverside Bakery case CS-4833…' }, { label: 'Contact Customer', action: 'toast', message: 'Drafting customer outreach for Riverside Bakery…' }],
          timestamp: '10:15 AM'
        },
        {
          id: 'svb-trend', type: 'trending', label: 'Anomaly Detected', urgency: 'high',
          source: 'Activity', sourceBadgeColor: '#ef4444', sourceIcon: 'ph-chart-line-up',
          title: 'Mobile App Login Complaints Spiking',
          subtitle: '9 new cases this week &nbsp;·&nbsp; 3× normal rate',
          body: 'Mobile banking login failures are appearing across multiple business accounts — not isolated to one customer. May indicate a platform issue. Tech team not yet alerted.',
          triggeredBecause: 'Case volume 3× above baseline · pattern suggests systemic platform issue',
          ctas: [{ label: 'View All Cases', action: 'toast', message: 'Filtering cases by mobile login issue…' }, { label: 'Alert Tech Team', action: 'toast', message: 'Tech team alerted about mobile login spike ✓' }],
          timestamp: 'Ongoing today'
        },
        {
          id: 'svb-drift', type: 'knowledge-drift', label: 'Knowledge Drift', urgency: 'medium',
          source: 'Compliance', sourceBadgeColor: '#7c3aed', sourceIcon: 'ph-shield-check',
          title: 'Reg E Dispute Window Updated',
          subtitle: 'Resolution deadline reduced 10 → 5 days &nbsp;·&nbsp; Effective April 1',
          body: 'Federal Reserve updated Reg E: electronic fund transfer dispute resolution must now occur within 5 business days, down from 10. 3 of your current open disputes are affected.',
          triggeredBecause: 'Regulation you work under was updated · 3 active cases fall under new deadline',
          ctas: [{ label: 'See What Changed', action: 'toast', message: 'Opening Reg E compliance diff…' }, { label: 'Flag Affected Cases', action: 'toast', message: '3 cases flagged for new Reg E timeline ✓' }],
          timestamp: '4 days ago'
        },
        {
          id: 'svb-brief', type: 'morning-brief', label: 'Morning Brief', urgency: 'medium',
          source: 'Multiple Sources', sourceBadgeColor: '#d97706', sourceIcon: 'ph-stack',
          title: 'Monday Brief · March 9',
          subtitle: '12 open cases &nbsp;·&nbsp; 2 SLA breaches today &nbsp;·&nbsp; 1 QBR at 11 AM',
          body: 'Harrington Construction SLA breach in 4 hours. Mobile login anomaly needs tech escalation. Reg E change affects 3 open disputes.',
          triggeredBecause: 'Daily intelligence compiled from Service Cloud, email, compliance, and calendar',
          ctas: [{ label: 'Open Morning Digest', action: 'open-digest' }, { label: 'View Case Queue', action: 'toast', message: 'Opening your case queue in Service Cloud…' }],
          timestamp: '9:00 AM'
        }
      ],
      lateCard: {
        id: 'late-svb', type: 'trending', label: 'Anomaly Detected', urgency: 'high',
        source: 'Monitoring', sourceBadgeColor: '#ef4444', sourceIcon: 'ph-warning',
        title: 'Wire Transfer Complaints Spiking',
        subtitle: '6 new cases in the last hour &nbsp;·&nbsp; Possible system issue',
        body: 'Wire transfer failure reports tripled in the last hour across multiple business accounts — not isolated to Harrington. Possible backend routing issue affecting all business accounts.',
        triggeredBecause: 'Anomaly: 6 wire complaints in 1 hour · cross-account pattern detected',
        ctas: [{ label: 'View All Cases', action: 'toast', message: 'Filtering all wire transfer cases…' }, { label: 'Escalate to Ops', action: 'toast', message: 'Operations team escalated about wire transfer spike ✓' }],
        timestamp: 'Just now'
      },
      morningDigest: {
        date: 'Monday, Mar 9',
        summary: '1 QBR today · 2 SLA breaches due · mobile anomaly active · 2 cases waiting on your reply',
        sections: [
          { type: 'calendar', title: "Today's Calendar", items: [
            { time: '11:00 AM', title: 'QBR — Harrington Construction', context: 'Critical open case must be addressed · $2.1M relationship', color: '#0176d3' },
            { time: '3:00 PM', title: 'Service Team Standup', context: 'Mobile login spike to discuss', color: '#059669' }
          ]},
          { type: 'commitments', title: 'Forgotten Commitments', items: [
            { text: 'You told Harrington\'s CFO: "The wire issue will be resolved by end of last week"', source: 'Email · Mar 5', overdue: true },
            { text: 'You promised Michael Torres: "I\'ll look at the Riverside Bakery escalation today"', source: 'Slack · Friday', overdue: false }
          ]},
          { type: 'blockers', title: 'Awaiting Your Reply', items: [
            { text: 'Engineering is waiting on your case documentation to begin the wire transfer hotfix', source: '9:30 AM today' }
          ]},
          { type: 'cowork', title: 'Overnight Cowork Results', items: [
            { label: 'Weekly SLA Risk Report', note: 'Ran at 11:00 PM · 2 breach risks identified for today · Harrington and Riverside Bakery flagged' }
          ]},
          { type: 'focus', title: 'Suggested Focus Window', items: [
            { time: '9:00 AM – 10:45 AM', note: '1.75 hrs clear — resolve Harrington wire case before QBR starts' }
          ]}
        ]
      }
    },

    // ── Service · Healthcare ──────────────────────────────────────────────────
    'service-healthcare': {
      key: 'service-healthcare',
      label: 'Aisha · Patient Coord · Healthcare',
      sfAppName: 'Health Cloud',
      user: { name: 'Aisha Johnson', title: 'Patient Experience Coordinator', company: 'Kaiser Permanente', initials: 'AJ', color: '#0891b2' },
      cards: [
        {
          id: 'svh-meet', type: 'upcoming-meeting', label: 'Care Coordination', urgency: 'high',
          source: 'Calendar', sourceBadgeColor: '#0176d3', sourceIcon: 'ph-calendar-blank',
          title: 'Care Coordination Round — ICU Team',
          subtitle: 'ICU Conference Room B &nbsp;·&nbsp; Starts in 18 min',
          body: 'Dr. Chen, Dr. Patel, and charge nurse attending. Patient Nguyen and Rivera cases on agenda. Medication scheduling concern for Nguyen is unresolved — flag before the round.',
          triggeredBecause: 'Round starts in 18 min · unresolved medication concern for patient on agenda',
          ctas: [{ label: 'View Care Plans', action: 'toast', message: 'Opening ICU care plans in Epic…' }, { label: 'Notify Dr. Chen', action: 'toast', message: 'Dr. Chen notified about Nguyen medication concern ✓' }],
          timestamp: '9:30 AM today'
        },
        {
          id: 'svh-case', type: 'deal-momentum', label: 'Case Escalation Risk', urgency: 'high',
          source: 'Epic', sourceBadgeColor: '#ef4444', sourceIcon: 'ph-heartbeat',
          title: 'Patient Nguyen — Medication Concern Open 4 Days',
          subtitle: 'Case #8821 &nbsp;·&nbsp; Escalation risk high',
          body: 'Patient filed a concern about missed morning insulin scheduling on March 5 — not yet resolved. Family has contacted patient relations twice. This is approaching formal complaint threshold.',
          triggeredBecause: 'Case open 4 days without resolution · family contact count rising',
          ctas: [{ label: 'View Case', action: 'toast', message: 'Opening case #8821 in Epic…' }, { label: 'Contact Family', action: 'toast', message: 'Drafting family outreach for Patient Nguyen…' }],
          timestamp: 'Escalation risk'
        },
        {
          id: 'svh-collab', type: 'top-collaborators', label: 'Care Plan Update', urgency: 'medium',
          source: 'Epic', sourceBadgeColor: '#0891b2', sourceIcon: 'ph-heartbeat',
          title: 'Dr. Chen updated Care Plan — Patient Rivera',
          subtitle: 'Post-op recovery protocol revised &nbsp;·&nbsp; 52 min ago',
          body: 'Revised post-op PT schedule and added new dietary restrictions for Patient Rivera. As the coordinating contact, you need to brief the family before the 2 PM visit.',
          triggeredBecause: 'Care plan for a patient you coordinate was changed · family visit at 2 PM',
          ctas: [{ label: 'Review Plan', action: 'toast', message: 'Opening Patient Rivera care plan…' }, { label: 'Brief Family', action: 'toast', message: 'Drafting family update for Patient Rivera…' }],
          timestamp: '9:02 AM'
        },
        {
          id: 'svh-trend', type: 'trending', label: 'Anomaly Detected', urgency: 'medium',
          source: 'HCAHPS', sourceBadgeColor: '#f97316', sourceIcon: 'ph-chart-line-up',
          title: '"Wait Time" Appears in 11 Surveys This Week',
          subtitle: 'Above weekly threshold &nbsp;·&nbsp; Satisfaction score trending down',
          body: 'Eleven patient satisfaction responses mentioned wait time negatively — up from 3 last week. The ICU and Radiology departments have the highest concentration.',
          triggeredBecause: 'Complaint pattern exceeds threshold · your department is in the affected group',
          ctas: [{ label: 'View Survey Data', action: 'toast', message: 'Opening HCAHPS wait time analysis…' }, { label: 'Share with Dept Head', action: 'toast', message: 'Survey trend shared with Department Head ✓' }],
          timestamp: 'This week'
        },
        {
          id: 'svh-drift', type: 'knowledge-drift', label: 'Knowledge Drift', urgency: 'medium',
          source: 'Compliance', sourceBadgeColor: '#7c3aed', sourceIcon: 'ph-shield-check',
          title: 'CMS Telehealth Consent Rules Updated',
          subtitle: 'Documentation requirements revised &nbsp;·&nbsp; Jan 2026',
          body: 'CMS updated informed consent documentation for telehealth visits — patients must now acknowledge data recording policy separately. Affects your 12 scheduled telehealth follow-ups this week.',
          triggeredBecause: 'Regulation affects your scheduled telehealth visits · 12 patients need updated consent',
          ctas: [{ label: 'See What Changed', action: 'toast', message: 'Opening CMS telehealth consent diff…' }, { label: 'Update Consent Forms', action: 'toast', message: '12 telehealth consent forms flagged for update ✓' }],
          timestamp: '6 days ago'
        },
        {
          id: 'svh-brief', type: 'morning-brief', label: 'Morning Brief', urgency: 'medium',
          source: 'Multiple Sources', sourceBadgeColor: '#d97706', sourceIcon: 'ph-stack',
          title: 'Monday Brief · March 9',
          subtitle: '7 active cases &nbsp;·&nbsp; 3 follow-ups due by EOD &nbsp;·&nbsp; 1 care plan review',
          body: 'ICU round in 18 min. Nguyen medication concern at escalation risk. Patient Rivera care plan updated — family visit at 2 PM.',
          triggeredBecause: 'Daily intelligence compiled from Epic, calendar, HCAHPS, and care coordination logs',
          ctas: [{ label: 'Open Morning Digest', action: 'open-digest' }, { label: 'Open Patient List', action: 'toast', message: 'Opening active patient list in Epic…' }],
          timestamp: '9:00 AM'
        }
      ],
      lateCard: {
        id: 'late-svh', type: 'trending', label: 'Satisfaction Alert', urgency: 'high',
        source: 'HCAHPS', sourceBadgeColor: '#ef4444', sourceIcon: 'ph-warning',
        title: 'Patient Satisfaction Score Dropped 9 Points',
        subtitle: '3 new escalations filed this week &nbsp;·&nbsp; Director reviewing',
        body: 'HCAHPS weekly aggregation shows a 9-point drop in your department\'s overall satisfaction score. The Director of Patient Experience has been notified and will want your input.',
        triggeredBecause: 'Score drop exceeds alert threshold · 3 new formal escalations filed this week',
        ctas: [{ label: 'View Score Breakdown', action: 'toast', message: 'Opening HCAHPS score breakdown…' }, { label: 'Prepare Response', action: 'toast', message: 'Drafting response summary for Director review…' }],
        timestamp: 'Just now'
      },
      morningDigest: {
        date: 'Monday, Mar 9',
        summary: '2 care rounds today · 1 medication concern unresolved · telehealth consent update required · 1 family briefing',
        sections: [
          { type: 'calendar', title: "Today's Calendar", items: [
            { time: '9:30 AM', title: 'ICU Care Coordination Round', context: 'Nguyen + Rivera on agenda · unresolved medication concern', color: '#0176d3' },
            { time: '2:00 PM', title: 'Patient Rivera Family Visit', context: 'Care plan updated this morning · brief family on changes', color: '#0891b2' }
          ]},
          { type: 'commitments', title: 'Forgotten Commitments', items: [
            { text: 'You told Patient Nguyen\'s family: "We\'ll resolve the medication scheduling by Friday"', source: 'Call log · Mar 6', overdue: true }
          ]},
          { type: 'blockers', title: 'Awaiting Your Reply', items: [
            { text: 'Dr. Chen is waiting on your review of the revised care plan before the family visit at 2 PM', source: '9:02 AM today' }
          ]},
          { type: 'cowork', title: 'Overnight Cowork Results', items: [
            { label: 'Weekly Case Summary', note: 'Ran at 10:00 PM · 3 cases approaching escalation threshold · Nguyen at highest risk' }
          ]},
          { type: 'focus', title: 'Suggested Focus Window', items: [
            { time: '11:00 AM – 1:00 PM', note: '2 hrs clear — resolve Nguyen medication concern and update telehealth consent forms' }
          ]}
        ]
      }
    },

    // ── Service · Automotive ──────────────────────────────────────────────────
    'service-automotive': {
      key: 'service-automotive',
      label: 'Marcus · Service Advisor · Automotive',
      sfAppName: 'Service Cloud',
      user: { name: 'Marcus Webb', title: 'Service Advisor', company: 'AutoNation BMW', initials: 'MW', color: '#1e40af' },
      cards: [
        {
          id: 'sva-meet', type: 'upcoming-meeting', label: 'Upcoming Appointment', urgency: 'high',
          source: 'DMS', sourceBadgeColor: '#059669', sourceIcon: 'ph-car',
          title: '2023 BMW X5 — Michael Reeves',
          subtitle: 'Service Bay 4 &nbsp;·&nbsp; Arrives in 20 min',
          body: 'Oil service + open recall: Brake fluid line inspection (TSB-2026-08). Customer flagged engine noise last visit — check tech notes. Previous service dispute — be proactive with timing estimate.',
          triggeredBecause: 'Appointment in 20 min · open recall + prior dispute on this vehicle',
          ctas: [{ label: 'View RO', action: 'toast', message: 'Opening Repair Order #5102 in CDK…' }, { label: 'View Tech Notes', action: 'toast', message: 'Loading technician notes for 2023 X5…' }],
          timestamp: '9:30 AM today'
        },
        {
          id: 'sva-case', type: 'deal-momentum', label: 'Customer Complaint', urgency: 'high',
          source: 'DMS', sourceBadgeColor: '#ef4444', sourceIcon: 'ph-warning',
          title: 'Patricia Chen Complaint — Prior Brake Work',
          subtitle: 'Case open 2 days &nbsp;·&nbsp; Escalation risk',
          body: 'Patricia Chen returned after a brake pad replacement — still hearing noise. She\'s filed a formal complaint and asked for a manager. Last communication was 2 days ago with no resolution.',
          triggeredBecause: 'Complaint open 2 days with no resolution · manager escalation requested',
          ctas: [{ label: 'View Case', action: 'toast', message: 'Opening Patricia Chen complaint case…' }, { label: 'Schedule Re-Inspection', action: 'toast', message: 'Scheduling complimentary brake re-inspection for Patricia Chen ✓' }],
          timestamp: 'Escalation risk'
        },
        {
          id: 'sva-collab', type: 'top-collaborators', label: 'Tech Flag', urgency: 'medium',
          source: 'DMS', sourceBadgeColor: '#4285f4', sourceIcon: 'ph-wrench',
          title: 'Luis Rodriguez flagged transmission issue',
          subtitle: 'RO #4821 — Johnson vehicle &nbsp;·&nbsp; Parts on order',
          body: 'Tech Luis flagged an unexpected transmission issue on the Johnson vehicle during routine service. Parts estimate $2,400 — customer approval required before work can continue.',
          triggeredBecause: 'Tech found additional issue during service · customer approval needed today',
          ctas: [{ label: 'View RO', action: 'toast', message: 'Opening RO #4821 in DMS…' }, { label: 'Call Customer', action: 'toast', message: 'Opening customer call script for Johnson approval…' }],
          timestamp: '8:55 AM'
        },
        {
          id: 'sva-trend', type: 'trending', label: 'Anomaly Detected', urgency: 'medium',
          source: 'Survey', sourceBadgeColor: '#f97316', sourceIcon: 'ph-chart-line-up',
          title: '"Wait Time" in 5 Reviews This Week',
          subtitle: 'Satisfaction score dropped to 3.2/5 &nbsp;·&nbsp; Below monthly target',
          body: 'Five service survey responses this week specifically mention wait time estimates being inaccurate. Score is 3.2 vs. 4.1 target. Monday-morning backlog may be driving perception.',
          triggeredBecause: 'Survey score below target · pattern in responses linked to your scheduling window',
          ctas: [{ label: 'View Reviews', action: 'toast', message: 'Opening service survey breakdown…' }, { label: 'Adjust Time Estimates', action: 'toast', message: 'Flagging time estimate calibration for service team…' }],
          timestamp: 'This week'
        },
        {
          id: 'sva-drift', type: 'knowledge-drift', label: 'Service Bulletin', urgency: 'medium',
          source: 'BMW', sourceBadgeColor: '#7c3aed', sourceIcon: 'ph-shield-check',
          title: 'BMW TSB-2026-08 Issued',
          subtitle: 'iDrive software — 2022-2024 models &nbsp;·&nbsp; 3 days ago',
          body: 'Technical Service Bulletin affects iDrive 8 navigation and connectivity on 2022-2024 3-Series, 5-Series, and X5 models. 6 vehicles booked this week are in the affected range.',
          triggeredBecause: '6 of your booked vehicles this week are affected by this recall notice',
          ctas: [{ label: 'View Bulletin', action: 'toast', message: 'Opening TSB-2026-08 details…' }, { label: 'Flag Affected ROs', action: 'toast', message: '6 ROs flagged for TSB-2026-08 inspection ✓' }],
          timestamp: '3 days ago'
        },
        {
          id: 'sva-brief', type: 'morning-brief', label: 'Morning Brief', urgency: 'medium',
          source: 'Multiple Sources', sourceBadgeColor: '#d97706', sourceIcon: 'ph-stack',
          title: 'Monday Brief · March 9',
          subtitle: '9 ROs today &nbsp;·&nbsp; 2 vehicles waiting on parts &nbsp;·&nbsp; 1 recall appointment',
          body: 'Michael Reeves recall appointment in 20 min. Patricia Chen complaint still open. TSB-2026-08 affects 6 of today\'s vehicles.',
          triggeredBecause: 'Daily intelligence compiled from DMS, customer survey, BMW TechInfo, and calendar',
          ctas: [{ label: 'Open Morning Digest', action: 'open-digest' }, { label: 'View Today\'s ROs', action: 'toast', message: 'Opening today\'s repair order schedule…' }],
          timestamp: '9:00 AM'
        }
      ],
      lateCard: {
        id: 'late-sva', type: 'deal-momentum', label: 'Review Alert', urgency: 'high',
        source: 'Google', sourceBadgeColor: '#ef4444', sourceIcon: 'ph-star',
        title: 'James Peterson Left a 1-Star Google Review',
        subtitle: 'Mentions your name &nbsp;·&nbsp; Just posted',
        body: 'James Peterson posted a 1-star review referencing his service experience today — mentions long wait and unexpected charges. Responds within 2 hours improves recovery rate by 70%.',
        triggeredBecause: 'Review mentions you by name · rapid response window is now',
        ctas: [{ label: 'View Review', action: 'toast', message: 'Opening Google review for James Peterson…' }, { label: 'Draft Response', action: 'toast', message: 'Drafting professional response to 1-star review…' }],
        timestamp: 'Just now'
      },
      morningDigest: {
        date: 'Monday, Mar 9',
        summary: '9 ROs scheduled · 1 complaint unresolved · TSB recall affects 6 vehicles · 2 tech flags',
        sections: [
          { type: 'calendar', title: "Today's RO Schedule", items: [
            { time: '9:30 AM', title: '2023 BMW X5 — Michael Reeves', context: 'Recall + oil service · prior noise complaint on file', color: '#059669' },
            { time: '11:00 AM', title: '2024 BMW 3-Series — Anderson', context: 'TSB-2026-08 iDrive update required', color: '#0176d3' }
          ]},
          { type: 'commitments', title: 'Forgotten Commitments', items: [
            { text: 'You told Patricia Chen: "We\'ll have the brake noise diagnosed by end of last week"', source: 'Call log · Mar 6', overdue: true }
          ]},
          { type: 'blockers', title: 'Awaiting Your Reply', items: [
            { text: 'Johnson is waiting on your call to approve the $2,400 transmission repair estimate before work continues', source: 'Tech note · 8:55 AM' }
          ]},
          { type: 'cowork', title: 'Overnight Cowork Results', items: [
            { label: 'Weekly Customer Satisfaction Summary', note: 'Ran at 10:00 PM · 5 low-score surveys identified · wait time pattern flagged for today\'s review' }
          ]},
          { type: 'focus', title: 'Suggested Focus Window', items: [
            { time: '12:30 PM – 2:00 PM', note: '1.5 hrs slow period — tackle Patricia Chen complaint and survey response plan' }
          ]}
        ]
      }
    },

    // ── Marketing · Banking ───────────────────────────────────────────────────
    'marketing-banking': {
      key: 'marketing-banking',
      label: 'Sofia · Digital Marketing Mgr · Banking',
      sfAppName: 'Marketing Cloud',
      user: { name: 'Sofia Chen', title: 'Digital Marketing Manager', company: 'Wells Fargo', initials: 'SC', color: '#dc2626' },
      cards: [
        {
          id: 'mb-camp', type: 'deal-momentum', label: 'Campaign Alert', urgency: 'high',
          source: 'Marketing Cloud', sourceBadgeColor: '#f97316', sourceIcon: 'ph-megaphone',
          title: '"Spring Savings" Campaign CTR Dropped 24%',
          subtitle: 'Checking acquisition &nbsp;·&nbsp; Drop since Thursday',
          body: 'Click-through rate fell from 3.2% to 2.4% since Thursday across paid search and display. Impression volume stable — issue is likely creative fatigue or landing page change. $40K in weekly budget at reduced efficiency.',
          triggeredBecause: 'CTR dropped 24% while budget runs · $40K/week at reduced efficiency',
          ctas: [{ label: 'View Campaign', action: 'toast', message: 'Opening Spring Savings campaign dashboard…' }, { label: 'Run A/B Test', action: 'toast', message: 'Creating A/B creative test for Spring Savings…' }],
          timestamp: 'Since Thursday'
        },
        {
          id: 'mb-leads', type: 'top-collaborators', label: 'Lead Quality', urgency: 'high',
          source: 'Salesforce', sourceBadgeColor: '#0176d3', sourceIcon: 'ph-users',
          title: '63 High-Intent Checking Signups via LinkedIn',
          subtitle: 'Above forecast by 40% &nbsp;·&nbsp; Since yesterday',
          body: '63 qualified checking account signups since yesterday from the LinkedIn retargeting campaign — well above the 45-per-day forecast. Segment skews 35-44, professional, above-average deposit intent score.',
          triggeredBecause: 'Lead volume 40% above forecast · segment quality score is highest of the week',
          ctas: [{ label: 'View Leads', action: 'toast', message: 'Opening LinkedIn campaign leads in Salesforce…' }, { label: 'Scale Budget', action: 'toast', message: 'Increasing LinkedIn daily budget by 25% ✓' }],
          timestamp: 'Since yesterday'
        },
        {
          id: 'mb-collab', type: 'top-collaborators', label: 'Top Collaborators', urgency: 'medium',
          source: 'Google Docs', sourceBadgeColor: '#4285f4', sourceIcon: 'ph-google-logo',
          title: 'Jamie Rivera updated Q2 Media Plan',
          subtitle: 'Budget shifted display → paid social &nbsp;·&nbsp; 2 hrs ago',
          body: '"Q2 2026 Media Allocation" reallocated $120K from programmatic display to paid social — based on Q1 LinkedIn performance lift. This changes your creative pipeline for April.',
          triggeredBecause: 'Budget shift affects your active campaigns · creative assets need realignment',
          ctas: [{ label: 'Review Changes', action: 'toast', message: 'Opening Q2 media plan in Google Docs…' }, { label: 'Update Creative Pipeline', action: 'toast', message: 'Flagging Q2 creative pipeline for reallocation ✓' }],
          timestamp: '8:30 AM'
        },
        {
          id: 'mb-trend', type: 'trending', label: 'Search Trend', urgency: 'low',
          source: 'Google Trends', sourceBadgeColor: '#059669', sourceIcon: 'ph-chart-line-up',
          title: '"High-Yield Savings" Searches Up 37%',
          subtitle: 'This week nationally &nbsp;·&nbsp; No Wells Fargo content ranking',
          body: 'Google Trends shows a 37% spike in high-yield savings queries this week — likely driven by Fed rate news. Wells Fargo has no top-10 ranking for this term. Competitor Marcus by Goldman Sachs is ranking #2.',
          triggeredBecause: 'Search demand spike in your product category · you have no content ranking for it',
          ctas: [{ label: 'View Trend Data', action: 'toast', message: 'Opening high-yield savings trend analysis…' }, { label: 'Create Content Brief', action: 'toast', message: 'Creating SEO content brief for high-yield savings…' }],
          timestamp: 'This week'
        },
        {
          id: 'mb-drift', type: 'knowledge-drift', label: 'Knowledge Drift', urgency: 'medium',
          source: 'Compliance', sourceBadgeColor: '#7c3aed', sourceIcon: 'ph-shield-check',
          title: 'CFPB Digital Advertising Guidance Updated',
          subtitle: 'APY disclosure rules revised &nbsp;·&nbsp; 5 days ago',
          body: 'CFPB updated guidance on digital APY disclosures — rate claims must now include a "conditions apply" link visible in the first viewport. 2 of your active ad creatives may be non-compliant.',
          triggeredBecause: '2 of your running ad creatives may violate the new CFPB disclosure guidance',
          ctas: [{ label: 'See What Changed', action: 'toast', message: 'Opening CFPB disclosure guidance diff…' }, { label: 'Audit Active Ads', action: 'toast', message: 'Compliance audit flagged for 2 active creatives ✓' }],
          timestamp: '5 days ago'
        },
        {
          id: 'mb-brief', type: 'morning-brief', label: 'Morning Brief', urgency: 'medium',
          source: 'Multiple Sources', sourceBadgeColor: '#d97706', sourceIcon: 'ph-stack',
          title: 'Monday Brief · March 9',
          subtitle: '3 campaigns live &nbsp;·&nbsp; A/B test ends today &nbsp;·&nbsp; Q2 budget review Thursday',
          body: 'Spring Savings CTR needs investigation. LinkedIn leads outperforming — consider scaling. CFPB compliance check needed on 2 active creatives.',
          triggeredBecause: 'Daily intelligence compiled from Marketing Cloud, Salesforce, Google Trends, and compliance',
          ctas: [{ label: 'Open Morning Digest', action: 'open-digest' }, { label: 'View Campaign Dashboard', action: 'toast', message: 'Opening campaign performance dashboard…' }],
          timestamp: '9:00 AM'
        }
      ],
      lateCard: {
        id: 'late-mb', type: 'deal-momentum', label: 'Competitor Alert', urgency: 'high',
        source: 'Intelligence', sourceBadgeColor: '#ef4444', sourceIcon: 'ph-lightning',
        title: 'US Bank Launched 5.25% APY Savings Campaign',
        subtitle: 'Launched this morning &nbsp;·&nbsp; Targeting your segments',
        body: 'US Bank announced a limited-time 5.25% APY offer on savings accounts — targeting 25-45 professionals in your primary acquisition markets. Your current campaign offers 4.75%.',
        triggeredBecause: 'Competitor launched a rival offer in your primary target market today',
        ctas: [{ label: 'View Campaign', action: 'toast', message: 'Opening US Bank competitive campaign brief…' }, { label: 'Escalate to Product', action: 'toast', message: 'Product team escalated about competitive APY gap ✓' }],
        timestamp: 'Just now'
      },
      morningDigest: {
        date: 'Monday, Mar 9',
        summary: '3 campaigns live · CTR drop needs investigation · A/B test ending · CFPB compliance check required',
        sections: [
          { type: 'calendar', title: "Today's Calendar", items: [
            { time: '10:00 AM', title: 'Creative Review — Spring Savings', context: 'CTR drop 24% since Thursday · bring fix options', color: '#f97316' },
            { time: '2:00 PM', title: 'Weekly Marketing Standup', context: 'LinkedIn overperformance and Q2 reallocation to discuss', color: '#0176d3' }
          ]},
          { type: 'commitments', title: 'Forgotten Commitments', items: [
            { text: 'You told Jamie: "I\'ll review the Q2 media plan reallocation by end of last week"', source: 'Slack · Mar 6', overdue: true },
            { text: 'You promised Legal: "I\'ll send updated APY ad creatives for review before Monday"', source: 'Email · Mar 5', overdue: true }
          ]},
          { type: 'blockers', title: 'Awaiting Your Reply', items: [
            { text: 'Jamie is waiting on your Q2 media plan approval before finalizing vendor commitments', source: '8:30 AM today' }
          ]},
          { type: 'cowork', title: 'Overnight Cowork Results', items: [
            { label: 'Weekly Competitor Campaign Monitor', note: 'Ran at 11:00 PM · 3 competitor campaign changes detected · US Bank and Marcus by Goldman flagged' }
          ]},
          { type: 'focus', title: 'Suggested Focus Window', items: [
            { time: '11:00 AM – 1:00 PM', note: '2 hrs clear — audit CFPB compliance on active creatives and brief on Spring Savings fix' }
          ]}
        ]
      }
    },

    // ── Marketing · Healthcare ────────────────────────────────────────────────
    'marketing-healthcare': {
      key: 'marketing-healthcare',
      label: 'Darius · Growth Marketing · Healthcare',
      sfAppName: 'Marketing Cloud',
      user: { name: 'Darius Kim', title: 'Growth Marketing Lead', company: 'Oscar Health', initials: 'DK', color: '#7c3aed' },
      cards: [
        {
          id: 'mh-camp', type: 'deal-momentum', label: 'Campaign Alert', urgency: 'high',
          source: 'Meta Ads', sourceBadgeColor: '#f97316', sourceIcon: 'ph-megaphone',
          title: 'Open Enrollment CPL Up 22% This Week',
          subtitle: 'Facebook audience performance declining &nbsp;·&nbsp; Week-over-week',
          body: 'Cost per qualified lead increased from $38 to $46 week-over-week. Facebook lookalike audiences are showing audience fatigue. With 9 days left in enrollment, budget efficiency is critical.',
          triggeredBecause: 'CPL up 22% with 9 days left in open enrollment · budget burn rate at risk',
          ctas: [{ label: 'View Performance', action: 'toast', message: 'Opening open enrollment campaign dashboard…' }, { label: 'Refresh Audiences', action: 'toast', message: 'Refreshing Facebook lookalike audiences…' }],
          timestamp: 'This week'
        },
        {
          id: 'mh-leads', type: 'top-collaborators', label: 'Lead Quality', urgency: 'high',
          source: 'Attribution', sourceBadgeColor: '#0176d3', sourceIcon: 'ph-users',
          title: '218 Quote Completions in Last 24 Hours',
          subtitle: 'Best single day this enrollment period',
          body: '218 health plan quote completions yesterday — highest single-day total this open enrollment. SEO traffic drove 61% of conversions, up from a typical 40%. Attribution model may be understating organic.',
          triggeredBecause: 'Record single-day conversion volume · SEO outperforming paid · attribution gap found',
          ctas: [{ label: 'View Attribution', action: 'toast', message: 'Opening enrollment attribution report…' }, { label: 'Boost SEO Budget', action: 'toast', message: 'Increasing SEO content production budget for final push ✓' }],
          timestamp: 'Yesterday'
        },
        {
          id: 'mh-collab', type: 'top-collaborators', label: 'Top Collaborators', urgency: 'medium',
          source: 'Confluence', sourceBadgeColor: '#4285f4', sourceIcon: 'ph-files',
          title: 'Amy Zhang updated Member Acquisition Model',
          subtitle: 'SEO channel underreported by 18% &nbsp;·&nbsp; 3 hrs ago',
          body: 'Amy revised the member acquisition attribution model — SEO channel was underreported by 18% due to direct-type-in misclassification. This changes Q1 channel ROI rankings significantly.',
          triggeredBecause: 'Attribution model you rely on for budget decisions was revised · SEO underreported',
          ctas: [{ label: 'Review Changes', action: 'toast', message: 'Opening updated attribution model in Confluence…' }, { label: 'Recalculate Q1 ROI', action: 'toast', message: 'Running Q1 channel ROI recalculation with new model…' }],
          timestamp: '7:45 AM'
        },
        {
          id: 'mh-trend', type: 'trending', label: 'Search Trend', urgency: 'medium',
          source: 'Google Trends', sourceBadgeColor: '#059669', sourceIcon: 'ph-chart-line-up',
          title: '"Affordable Health Insurance 2026" Up 31%',
          subtitle: 'Your 3 target markets spiking &nbsp;·&nbsp; This week',
          body: 'Search volume for affordable health insurance queries is up 31% in Texas, Florida, and Ohio — your primary enrollment markets. This is a late-enrollment surge pattern. Content gaps exist for Florida.',
          triggeredBecause: 'Late-enrollment demand spike in your key markets · content gap in Florida',
          ctas: [{ label: 'View Trend Data', action: 'toast', message: 'Opening health insurance search trend analysis…' }, { label: 'Create Florida Content', action: 'toast', message: 'Creating Florida market content brief ✓' }],
          timestamp: 'This week'
        },
        {
          id: 'mh-drift', type: 'knowledge-drift', label: 'Knowledge Drift', urgency: 'medium',
          source: 'Compliance', sourceBadgeColor: '#7c3aed', sourceIcon: 'ph-shield-check',
          title: 'HHS ACA Marketing Compliance Updated',
          subtitle: 'Email marketing restrictions revised &nbsp;·&nbsp; 7 days ago',
          body: 'HHS updated ACA marketplace marketing rules — email campaigns must now include a "not affiliated with the Federal Marketplace" disclaimer. 1 of your active email sequences is missing this.',
          triggeredBecause: '1 of your active email campaigns may be non-compliant with new HHS guidance',
          ctas: [{ label: 'See What Changed', action: 'toast', message: 'Opening HHS ACA marketing compliance diff…' }, { label: 'Audit Email Sequences', action: 'toast', message: 'Compliance audit flagged for active email sequences ✓' }],
          timestamp: '7 days ago'
        },
        {
          id: 'mh-brief', type: 'morning-brief', label: 'Morning Brief', urgency: 'medium',
          source: 'Multiple Sources', sourceBadgeColor: '#d97706', sourceIcon: 'ph-stack',
          title: 'Monday Brief · March 9',
          subtitle: '4 active campaigns &nbsp;·&nbsp; Enrollment closes in 9 days &nbsp;·&nbsp; Q1 target at 94%',
          body: 'CPL increase needs attention before week\'s end. Record conversion day yesterday — SEO surge. ACA email compliance issue in 1 active sequence.',
          triggeredBecause: 'Daily intelligence compiled from Meta Ads, attribution model, Google Trends, and HHS feeds',
          ctas: [{ label: 'Open Morning Digest', action: 'open-digest' }, { label: 'View Enrollment Dashboard', action: 'toast', message: 'Opening open enrollment performance dashboard…' }],
          timestamp: '9:00 AM'
        }
      ],
      lateCard: {
        id: 'late-mh', type: 'trending', label: 'Volume Alert', urgency: 'high',
        source: 'Meta Ads', sourceBadgeColor: '#ef4444', sourceIcon: 'ph-lightning',
        title: '89 Quote Requests in Last 2 Hours',
        subtitle: 'Approaching daily budget cap &nbsp;·&nbsp; Decision needed now',
        body: '89 quote completions in the last 2 hours — if this rate continues, you\'ll hit the daily ad budget cap before 3 PM. Increase budget now or risk missing late-day enrollment conversions.',
        triggeredBecause: 'Conversion surge approaching budget cap · extend now or lose enrollment conversions',
        ctas: [{ label: 'Extend Budget', action: 'toast', message: 'Daily budget increased by $3,000 to capture enrollment surge ✓' }, { label: 'Notify Team', action: 'toast', message: 'Growth team notified about enrollment surge ✓' }],
        timestamp: 'Just now'
      },
      morningDigest: {
        date: 'Monday, Mar 9',
        summary: '4 campaigns live · enrollment closes in 9 days · ACA compliance issue · attribution model updated',
        sections: [
          { type: 'calendar', title: "Today's Calendar", items: [
            { time: '10:00 AM', title: 'Enrollment Performance Review', context: 'CPL increase + record conversion day to discuss', color: '#7c3aed' },
            { time: '1:00 PM', title: 'Creative Review — Final 10 Days Push', context: 'Facebook audience refresh decision needed', color: '#f97316' }
          ]},
          { type: 'commitments', title: 'Forgotten Commitments', items: [
            { text: 'You told Amy: "I\'ll validate the attribution model changes before Monday\'s budget meeting"', source: 'Slack · Mar 7', overdue: true },
            { text: 'You promised Legal: "I\'ll review the email sequence disclaimers this week"', source: 'Email · Mar 4', overdue: false }
          ]},
          { type: 'blockers', title: 'Awaiting Your Reply', items: [
            { text: 'Amy Zhang is waiting on your sign-off on the updated attribution model before sharing with leadership', source: '7:45 AM today' }
          ]},
          { type: 'cowork', title: 'Overnight Cowork Results', items: [
            { label: 'Late Enrollment Search Surge Analysis', note: 'Ran at 9:00 PM · 31% demand spike in target markets · Florida content gap identified · brief ready' }
          ]},
          { type: 'focus', title: 'Suggested Focus Window', items: [
            { time: '11:00 AM – 1:00 PM', note: '2 hrs clear — fix ACA email compliance and review Amy\'s attribution model changes' }
          ]}
        ]
      }
    },

    // ── Marketing · Automotive ────────────────────────────────────────────────
    'marketing-automotive': {
      key: 'marketing-automotive',
      label: 'Natasha · Campaign Mgr · Automotive',
      sfAppName: 'Marketing Cloud',
      user: { name: 'Natasha Reyes', title: 'Campaign Manager', company: 'Ford Motor Credit', initials: 'NR', color: '#dc2626' },
      cards: [
        {
          id: 'ma-camp', type: 'deal-momentum', label: 'Campaign Alert', urgency: 'high',
          source: 'Adobe Analytics', sourceBadgeColor: '#f97316', sourceIcon: 'ph-megaphone',
          title: '"0% APR" Campaign: Impressions Up, Conv Down',
          subtitle: 'Impressions +48% · Conv rate -11% &nbsp;·&nbsp; Since Friday',
          body: 'The "0% APR for 72 months" campaign is serving more impressions but converting 11% less since Friday\'s landing page update. A/B test shows the new hero image underperforms vs. the previous one.',
          triggeredBecause: 'Conversion rate dropped after a Friday page change · A/B test shows the culprit',
          ctas: [{ label: 'View Campaign', action: 'toast', message: 'Opening APR campaign in Adobe Analytics…' }, { label: 'Revert Landing Page', action: 'toast', message: 'Reverting to previous hero image variant ✓' }],
          timestamp: 'Since Friday'
        },
        {
          id: 'ma-leads', type: 'top-collaborators', label: 'Lead Quality', urgency: 'high',
          source: 'CRM', sourceBadgeColor: '#0176d3', sourceIcon: 'ph-users',
          title: '94 Lease-End Customers Ready for Upgrade',
          subtitle: 'High-intent segment built &nbsp;·&nbsp; 60-day window',
          body: '94 customers whose leases end in 60 days have been identified with high upgrade intent scores. No outreach has been initiated yet. Early movers have a 44% higher conversion rate.',
          triggeredBecause: 'High-intent lease-end segment ready · outreach window opens now for best conversion',
          ctas: [{ label: 'View Segment', action: 'toast', message: 'Opening lease-end segment in Ford Credit CRM…' }, { label: 'Launch Campaign', action: 'toast', message: 'Launching personalized lease-end re-engagement campaign ✓' }],
          timestamp: 'Ready now'
        },
        {
          id: 'ma-collab', type: 'top-collaborators', label: 'Top Collaborators', urgency: 'medium',
          source: 'Box', sourceBadgeColor: '#4285f4', sourceIcon: 'ph-files',
          title: 'Kevin Zhao updated Q2 Dealer Co-Op Brief',
          subtitle: 'EV incentives now featured &nbsp;·&nbsp; 1 hr ago',
          body: '"Q2 Dealer Co-Op Creative Brief" now leads with Ford EV incentives and tax credit messaging — in response to the Tesla price cut last week. Affects creative for 4 of your active dealer campaigns.',
          triggeredBecause: 'Creative brief for your active campaigns was revised in response to competitor move',
          ctas: [{ label: 'Review Brief', action: 'toast', message: 'Opening Q2 dealer co-op creative brief…' }, { label: 'Update Active Campaigns', action: 'toast', message: 'Flagging 4 campaigns for creative refresh ✓' }],
          timestamp: '9:00 AM'
        },
        {
          id: 'ma-trend', type: 'trending', label: 'Search Trend', urgency: 'medium',
          source: 'Google Trends', sourceBadgeColor: '#059669', sourceIcon: 'ph-chart-line-up',
          title: '"Ford EV Tax Credit 2026" Searches Up 44%',
          subtitle: 'Texas, Florida, Ohio spiking &nbsp;·&nbsp; This week',
          body: 'Search queries for Ford EV tax credit information are spiking 44% in your three highest-volume markets — likely driven by the IRS update on clean vehicle credits last week. No Ford content ranks.',
          triggeredBecause: 'Demand spike in your key markets · Ford has no ranking content for this query',
          ctas: [{ label: 'View Trend Data', action: 'toast', message: 'Opening EV tax credit search trend analysis…' }, { label: 'Create Content Brief', action: 'toast', message: 'Creating EV tax credit SEO content brief ✓' }],
          timestamp: 'This week'
        },
        {
          id: 'ma-drift', type: 'knowledge-drift', label: 'Knowledge Drift', urgency: 'medium',
          source: 'Regulatory', sourceBadgeColor: '#7c3aed', sourceIcon: 'ph-shield-check',
          title: 'FTC Motor Vehicle Advertising Rule Updated',
          subtitle: 'Fuel economy claim disclosures revised &nbsp;·&nbsp; 4 days ago',
          body: 'FTC updated auto advertising rules — fuel economy claims in digital ads now require a visible EPA rating disclaimer with each claim, not just at the bottom. 3 of your active campaigns are affected.',
          triggeredBecause: '3 of your active campaigns may violate the new FTC fuel economy disclosure rule',
          ctas: [{ label: 'See What Changed', action: 'toast', message: 'Opening FTC motor vehicle advertising rule diff…' }, { label: 'Audit Active Campaigns', action: 'toast', message: 'Compliance audit flagged for 3 active campaigns ✓' }],
          timestamp: '4 days ago'
        },
        {
          id: 'ma-brief', type: 'morning-brief', label: 'Morning Brief', urgency: 'medium',
          source: 'Multiple Sources', sourceBadgeColor: '#d97706', sourceIcon: 'ph-stack',
          title: 'Monday Brief · March 9',
          subtitle: '3 model campaigns live &nbsp;·&nbsp; F-150 Lightning inventory low &nbsp;·&nbsp; Q1 apps on track',
          body: 'APR campaign conversion issue needs landing page fix. Lease-end segment ready to launch. FTC compliance check needed on 3 running campaigns.',
          triggeredBecause: 'Daily intelligence compiled from Adobe Analytics, Ford Credit CRM, Google Trends, and FTC feeds',
          ctas: [{ label: 'Open Morning Digest', action: 'open-digest' }, { label: 'View Campaign Dashboard', action: 'toast', message: 'Opening campaign performance dashboard…' }],
          timestamp: '9:00 AM'
        }
      ],
      lateCard: {
        id: 'late-ma', type: 'deal-momentum', label: 'Product Alert', urgency: 'high',
        source: 'Ford', sourceBadgeColor: '#ef4444', sourceIcon: 'ph-lightning',
        title: 'Ford Announced New EV Incentive Package',
        subtitle: '$3,500 loyalty bonus just released &nbsp;·&nbsp; Update creative now',
        body: 'Ford announced a new $3,500 loyalty bonus on EV purchases for existing Ford owners — effective immediately. Your current EV campaigns don\'t reference this. Update creative before competitors notice.',
        triggeredBecause: 'New incentive released · your active EV campaigns are missing it · act now',
        ctas: [{ label: 'View Announcement', action: 'toast', message: 'Opening Ford EV incentive announcement details…' }, { label: 'Update EV Campaigns', action: 'toast', message: 'Flagging all EV campaigns for immediate creative update ✓' }],
        timestamp: 'Just now'
      },
      morningDigest: {
        date: 'Monday, Mar 9',
        summary: '3 campaigns live · conversion drop to fix · lease-end segment ready · FTC compliance check needed',
        sections: [
          { type: 'calendar', title: "Today's Calendar", items: [
            { time: '10:00 AM', title: 'APR Campaign Review', context: 'Conversion drop since Friday · landing page revert decision', color: '#f97316' },
            { time: '3:00 PM', title: 'Q1 Campaign Performance Review', context: 'Bring channel ROI breakdown and FTC compliance update', color: '#0176d3' }
          ]},
          { type: 'commitments', title: 'Forgotten Commitments', items: [
            { text: 'You told Kevin: "I\'ll approve the Q2 co-op brief by end of last week for agency handoff"', source: 'Slack · Mar 6', overdue: true },
            { text: 'You promised Legal: "I\'ll send the updated campaign disclosures for review before Monday"', source: 'Email · Mar 5', overdue: true }
          ]},
          { type: 'blockers', title: 'Awaiting Your Reply', items: [
            { text: 'Kevin Zhao is waiting on your creative brief approval before agency kickoff scheduled for 10 AM', source: '9:00 AM today' }
          ]},
          { type: 'cowork', title: 'Overnight Cowork Results', items: [
            { label: 'Weekly Competitive Campaign Monitor', note: 'Ran at 10:00 PM · Tesla price cut + GM 0% APR offer detected · counter-campaign options briefed' }
          ]},
          { type: 'focus', title: 'Suggested Focus Window', items: [
            { time: '1:00 PM – 3:00 PM', note: '2 hrs clear — approve Kevin\'s brief, audit FTC compliance, launch lease-end campaign' }
          ]}
        ]
      }
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
