# Astro Proactives — Product Requirements & Engineering Backlog

**Product**: Astro Proactives ("Astro")
**Document type**: Foundational PRD + Engineering Backlog
**Status**: Based on prototype v0.1 (March 2026)
**Audience**: Engineering, Design, Data Science, Infrastructure

---

## 1. Vision & Product Summary

Astro is an AI-powered proactive intelligence layer for enterprise knowledge workers in regulated financial services domains. It surfaces timely, contextual insights — deals going quiet, compliance deadlines, meeting prep, market signals — before users know to ask for them. It also executes multi-step background research and action workflows via an agentic "Cowork" mode. Astro embeds into the surfaces users already live in: new-tab browser override, Salesforce, Microsoft Teams, Mac desktop, Chrome extension, ChatGPT extension, and mobile.

The prototype (this codebase) is a high-fidelity functional frontend demonstrating all core surfaces, interaction patterns, card types, digest layouts, and agentic cowork flows across 9 user personas (Sales/Service/Marketing × Banking/FinServ/Insurance). It serves as the specification for the production system.

---

## 2. Design Principles

1. **Proactive over reactive** — surface what matters before the user looks for it
2. **Context-first** — every card explains *why* it's being shown (`triggeredBecause`)
3. **Dismissal as signal** — a dismissed card is feedback; restore via undo within session
4. **Embed, don't interrupt** — integrate into existing surfaces rather than requiring a new app switch
5. **Token-resolved freshness** — all time references are computed at render; zero stale data shown
6. **Persona depth** — insights are role- and domain-specific, not generic

---

## 3. Priority Definitions

| Level | Meaning |
|-------|---------|
| **P0** | Blocking — product cannot ship without this |
| **P1** | Launch-critical — required for GA; must ship in first release |
| **P2** | Important — required within 60 days of GA |
| **P3** | Nice-to-have — post-launch roadmap |

---

## 4. Epics & Feature Requirements

---

### Epic 1: Multi-Surface Rendering

**Goal**: Astro renders correctly and idiomatically within each host surface.

#### REQ-1.1 — Chrome Switcher & Surface Fidelity (P0)
The app renders 8 distinct chrome environments, each faithfully replicating the visual conventions of its host:

| Chrome | Host | Key Conventions |
|--------|------|----------------|
| `new-tab` | Browser new tab override | Full-bleed dark gradient, centered clock + greeting, bottom-pinned search bar |
| `salesforce` | Salesforce Sales/Service Cloud | Left nav (52px, `#032d60`), top bar (`#0176d3`), SF avatar/logo, full-bleed dark gradient body matching new-tab layout |
| `teams` | Microsoft Teams | 48px icon sidebar (`#141414`), top bar, two-panel chat/activity, Teams purple (`#6264a7`) |
| `mac-app` | macOS Desktop App | Rounded window frame, titlebar with traffic lights, menu bar, compact 3-col card grid |
| `claude-ext` | Claude Browser Extension | Claude brand colors (`#da7756`), sidebar nav, dark brown theme |
| `chatgpt-ext` | ChatGPT Browser Extension | GPT green (`#10a37f`), `#171717` sidebar, extension badge |
| `cowork` | Astro Cowork standalone | 228px sidebar + 3-state main area (idle/running/results) |
| `iphone` | iOS Mobile App | 393×852px device frame, dynamic island, tab bar, home indicator |

**AC**: Each chrome renders visually distinct. No CSS bleed between chromes.

**Production gap**: These are currently static HTML shells. Production requires each to be a standalone deployable surface (browser extension manifest, Salesforce LWC, Teams app manifest, Electron app, iOS/Android native).

#### REQ-1.2 — Chrome Switching State Preservation (P1)
When switching between chromes (e.g., New Tab → Salesforce → back to New Tab), dismissed card state must persist. `_dismissedCardIds` (Set) and `_dismissedCardData` (Map) survive chrome transitions; they only clear on persona change.

**AC**: Dismiss a card in New Tab, switch to Salesforce, return — card remains dismissed and shows in "Completed today" section.

#### REQ-1.3 — Global Mode Toggle (P1)
A fixed pill (top-center, z-index above all surfaces) with two buttons: **Ask Astro** and **✦ Astro Cowork**. Clicking Cowork saves the current chrome and navigates to the Cowork chrome. Clicking Ask Astro returns to the saved chrome (not necessarily new-tab).

**AC**: Toggle always visible across all 8 chromes. Active state syncs bidirectionally with chrome state.

**Production gap**: Currently this toggle is per-chrome. A unified fixed global toggle needs to replace all per-chrome Ask/Cowork toggles.

#### REQ-1.4 — Skeleton Loading State (P1)
When switching chromes or personas, show 6 `.skeleton-card` shimmer placeholders for 250ms before rendering real cards.

**AC**: No flash of empty mount. Transition feels < 400ms perceived.

---

### Epic 2: Persona & Role System

**Goal**: Astro adapts content, tone, CRM context, and available actions to the authenticated user's role and domain.

#### REQ-2.1 — 9-Persona Matrix (P0)
The system supports 9 user personas: 3 roles (Sales, Service, Marketing) × 3 domains (Banking, FinServ, Insurance). Each persona has:

- `key`: e.g., `sales-banking`
- `label`: display name + role + domain
- `user`: `{ name, title, company, initials, color }`
- `sfAppName`: surface-specific app name (e.g., "Sales Cloud", "Service Cloud")
- `cards`: persona-specific card array (or inherits default)
- `lateCard`: a single card that arrives 11 seconds after render (simulates real-time event)
- `morningDigest`: digest data with calendar, cowork, signals, and focus sections

**AC**: Switching personas immediately re-renders greeting, cards, SF app name, avatar initials/color, and digest content. Dismissed card state clears.

#### REQ-2.2 — Greeting Personalization (P1)
Greeting renders time-of-day aware ("Good morning/afternoon/evening") + first name of persona user. Subline states card count: "Astro surfaced N things that need your attention today."

**AC**: Greeting updates across New Tab, Salesforce body, Mac app, and Cowork chrome simultaneously. Count reflects actual unfiltered card count from persona.

**Targets**: `#new-tab-greeting`, `#sf-greeting`, `#mac-greeting`, `#cw-greeting`, `.sf-ask-heading`

#### REQ-2.3 — Domain-Specific Card Content (P0)
Each persona's card content reflects role- and domain-relevant context:
- **Sales/Banking**: deal pipeline (Beacon Capital, stale leads), CRA compliance, FDIC risk, Q2 strategy
- **Sales/FinServ**: portfolio rebalancing triggers, SEC filings, client retention alerts
- **Sales/Insurance**: renewal pipeline, claims severity spikes, regulatory filing deadlines
- **Service/Banking**: SLA breaches, case escalations, document processing queues
- **Service/FinServ**: fraud case queue, advisor escalations, compliance case deadlines
- **Service/Insurance**: claims investigation queues, auto adjudication anomalies, customer churn signals
- **Marketing/Banking**: campaign performance anomalies, lead scoring shifts, CRA community event signals
- **Marketing/FinServ**: advisor engagement rates, lead quality drops, competitor product launches
- **Marketing/Insurance**: campaign CTR drops, co-op compliance (FTC), search trend opportunities

**AC**: No card content appears in the wrong persona. Domain-specific entities (companies, regulators, metrics) are correct per persona.

#### REQ-2.4 — Late Card Arrival (P1)
11 seconds after initial card render, a "breaking" card arrives with animation and a notification banner. The banner:
- Shows: bell icon + "1 new update from Astro — [card title]"
- Dismiss via × button or auto-dismiss after 8 seconds (fade-out)
- Card arrives with `.card-new` CSS class + pulsing `.card-new-badge`
- Badge self-removes after 6 seconds

**AC**: Banner appears 11s after render. Card prepends to feed with animation. Banner dismisses cleanly.

**Production gap**: "Late card" simulates real-time push events. Production requires WebSocket or SSE channel from backend.

---

### Epic 3: Proactive Card System

**Goal**: The card feed is the core value delivery mechanism — timely, actionable, and respectful of user attention.

#### REQ-3.1 — Card Data Schema (P0)
Each card must include:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `id` | string | Yes | Unique per card, stable |
| `type` | string | Yes | See §3.1a |
| `urgency` | `high\|medium\|low` | Yes | Controls left-border color |
| `source` | string | Yes | Integration name ("Calendar", "Salesforce", "FDIC") |
| `sourceBadgeColor` | hex | Yes | Badge background tint |
| `sourceIcon` | `ph-*` | Yes | Phosphor icon class |
| `label` | string | Yes | Small category tag |
| `title` | string | Yes | Primary text, supports `{{tokens}}` |
| `subtitle` | string | Yes | Secondary context, supports `{{tokens}}` |
| `body` | string | Yes | Detail text, supports `{{tokens}}` |
| `triggeredBecause` | string | No | "Why am I seeing this?" explanation |
| `ctas` | CTA[] | Yes | 1–3 action buttons |
| `timestamp` | string | Yes | Supports `{{tokens}}` |

**CTA schema**: `{ label: string, panelId?: string, action?: 'open-url'\|'toast', message?: string, url?: string }`

#### REQ-3.1a — Card Types (P0)
Supported card types (each has a designated color + icon in production):

| Type | Domain | Source Color |
|------|--------|-------------|
| `upcoming-meeting` | All | `#0176d3` (Salesforce blue) |
| `deal-momentum` | Sales | `#da7756` (Claude orange) |
| `knowledge-drift` | All | `#7c3aed` (purple) |
| `trending` | All | `#059669` (green) |
| `top-collaborators` | All | `#4285f4` (Google blue) |
| `morning-brief` | All | `#d97706` (amber) |
| `anomaly` | Service/Marketing | `#ef4444` (red) |
| `sla-risk` | Service | `#f59e0b` (amber) |
| `campaign-alert` | Marketing | `#059669` (green) |
| `lead-quality` | Marketing/Sales | `#da7756` |

#### REQ-3.2 — Card Feed Composition (P0)
Feed merges three card sources in priority order:
1. `_searchResultCards` (prepended from search/Ask Astro results)
2. Persona cards (from `window.DATA.personas[key].cards`)
3. AI-generated cards (`_aiCards`, from Claude API file upload)

Cards in `_dismissedCardIds` are filtered from all three sources before render.

#### REQ-3.3 — Card Dismissal Flow (P0)
Dismiss (×) button behavior:
1. Animate card out: opacity → 0, scale → 0.95 over 250ms, then remove from DOM
2. Add `card.id` to `_dismissedCardIds` (Set)
3. Store `card` object in `_dismissedCardData` (Map, keyed by id)
4. Ensure "Completed today" collapsible section exists and is open
5. Prepend `.card-done-row` (check icon + title + "Undo" button)
6. Increment count badge on section header

**AC**: No dismissed card re-appears on chrome switch. Undo restores card to top of feed. Count badge accurate.

#### REQ-3.4 — Undo Dismissal (P1)
Undo button in done row:
1. Removes `card.id` from `_dismissedCardIds`
2. Removes card from `_dismissedCardData`
3. Removes done row from DOM
4. Decrements count badge
5. Prepends rebuilt card to feed mount (if mount still in DOM)

**AC**: Undo is available for entire session. Multiple undos work correctly. Count stays accurate.

#### REQ-3.5 — Completed Section (P1)
`.completed-section` renders below active cards:
- Collapsible via header click (toggles `.open` class)
- Header: `▶ Completed today (N)`
- Items: `.card-done-row` per dismissed card
- Persists across chrome switches (rebuilt from `_dismissedCardData` on re-render)

**AC**: Section opens automatically when first card is dismissed. Remains open on subsequent chrome switches.

#### REQ-3.6 — Token Resolution (P0)
All string fields on cards (title, subtitle, body, timestamp) are passed through `_resolveTokens()` at render time. Supported tokens:

| Token | Output |
|-------|--------|
| `{{TODAY}}` | "Wednesday, March 11, 2026" |
| `{{TODAY_SHORT}}` | "Mar 11" |
| `{{DIGEST_DATE}}` | "Wednesday, March 11" |
| `{{T+N}}` | Current time + N minutes, formatted as "3:15 PM" |
| `{{T-Nm}}` | "N min ago" |

**AC**: No hardcoded dates or times visible to user. All times reflect current clock at render.

#### REQ-3.7 — `triggeredBecause` Explainability (P1)
If a card has `triggeredBecause` string, render a `.card-why` section below the header: icon `ph-sparkle` + italic explanation text. User must always understand why a card surfaced.

**AC**: Present on all AI-generated cards. Recommended on all persona-seeded cards.

---

### Epic 4: Morning Digest

**Goal**: The morning digest condenses overnight signals, today's calendar, cowork results, and focus time into a single collapsible card rendered above the main card feed.

#### REQ-4.1 — Digest Container & Default State (P0)
Digest renders in `.morning-digest-mount` above the `.cards-mount`. It renders with `.open` class by default (body visible). Header click toggles `.open`.

**Elements**:
- Header: gradient bg, `ph-sun-horizon` icon, "Your Morning Digest" title, current date, summary text, chevron
- Body: `.md-sections` (flex-column, gap 16px)

**AC**: Digest visible on first load without user interaction. Date shows current date from `new Date()`. Chevron rotates on toggle.

#### REQ-4.2 — Section Types (P0)
Five section types, each with distinct icon, rendering, and fallback:

**`calendar`** — Today's schedule
- Item fields: `{ title, timeOffset: number (minutes from now), context?, color? }`
- Render: Left-border colored block with time (bold) + title + context
- Fallback (empty items): "Connect your calendar to see today's meetings"
- Icon: `ph-calendar`

**`signals`** — System-detected behavioral intelligence (replaces removed standalone cards)
- Item fields: `{ icon: string, text: string, meta?: string }`
- Render: Icon + content text + meta (muted, smaller)
- No fallback (section hidden if no items)
- Icon: `ph-activity`

**`cowork`** — Overnight agentic job results
- Item fields: `{ title|label|text, note|detail? }`
- Render: Accent-tinted bg block, sparkle icon, title + detail
- Fallback (empty items): "No cowork tasks defined — set up in Astro Cowork"
- Icon: `ph-sparkle`

**`focus`** — Focus time recommendation
- Item fields: `{ text }`
- Render: Green-tinted block, leaf icon, time range text
- Fallback (empty items): "No focus window suggestions"
- Icon: `ph-leaf`

**`commitments`** — Open action items / follow-ups
- Item fields: `{ text, source?, overdue?: boolean }`
- Render: Clock-countdown icon (red if overdue), text + source
- Icon: `ph-clock-countdown`

**`blockers`** — Pending responses / waiting-on items
- Item fields: `{ text, source? }`
- Render: Chat-dots icon with `blocker` class
- Icon: `ph-chat-dots`

**AC**: Each section type renders distinctly. Missing items → fallback. `timeOffset` converts to real time via `_timeFromNow()`.

#### REQ-4.3 — Dynamic Date & Time in Digest (P0)
- Digest date header: computed from `new Date()`, not data field
- Calendar times: computed from `timeOffset` (minutes from now), not hardcoded strings
- Focus window: uses `{{T+N}}` tokens resolved at render

**AC**: No hardcoded dates. Reloading at different times of day shows different meeting times.

#### REQ-4.4 — Per-Persona Digest Data (P0)
All 9 personas have unique `morningDigest` with:
- `summary` string (static context for that persona)
- `sections` array (must include calendar, cowork, signals, and focus for completeness)

Calendar items use `timeOffset` fields (not `time`). Cowork items represent the 2 user-defined jobs ("Follow-up with leads silent 2+ weeks" and "Q1 Compliance Risk Summary" equivalent for each domain). Signals items describe removed standalone card types (doc updates, trending views, collaborator activity).

**AC**: No two personas share the same digest content. All 9 render without errors.

---

### Epic 5: Cowork / Agentic Execution

**Goal**: Users define research and action goals in natural language; Astro orchestrates multi-agent workflows and delivers structured results.

#### REQ-5.1 — Goal Input & Submission (P0)
Goal input: `<textarea>` with auto-resize (max 220px) in `.cw-goal-input-wrap`. Submit via:
- Click submit button
- Press Enter (without Shift)

On submit: trim whitespace → run scenario matching → begin execution.

**AC**: Empty goal does nothing. Shift+Enter inserts newline. Input focuses correctly after navigation.

#### REQ-5.2 — Scenario Matching (P0)
`_matchScenario(goal)`: case-insensitive keyword search over `window.DATA.coworkScenarios[key].keywords[]`. Returns first match. Falls back to first scenario if no keyword match.

**Scenarios must cover** (per domain):
- Stale leads follow-up / pipeline at-risk deals
- Compliance risk summary (Q1/quarterly)
- Competitive intelligence report
- Meeting/board prep
- Campaign performance analysis
- Customer case escalation summary

**AC**: Typing "follow up with leads" matches the stale-leads scenario. Typing "compliance" matches the compliance scenario. Unrecognized input uses fallback.

**Production gap**: Production should use semantic embedding similarity, not keyword matching.

#### REQ-5.3 — Three-State UI Lifecycle (P0)
State machine: `idle` → `running` → `results`

**Idle state** (`#cw-state-idle`):
- Goal textarea
- Delivery target chips: `feed`, `slack`, `email` (single-select)
- Delivery when chips: `now`, `morning`, `daily`, `hourly`, `weekly` (single-select)
- Example goal chips (from `window.DATA.coworkExamples`)

**Running state** (`#cw-state-running`):
- Goal echo block (shows what was submitted)
- "Intent understood" green success bar (appears at T+700ms)
- Orchestrator card (thinking → coordinating)
- Agent cards grid (staggered appearance)
- Cancel button

**Results state** (`#cw-state-results`):
- Results header: count + scenario label
- `.cw-result-card` per result item
- Delivery confirmation message

**AC**: State transitions are animated. Cancel returns to idle cleanly. Persona change while running clears all state.

#### REQ-5.4 — Agent Animation System (P0)
For each agent in `scenario.agents[]`:

Agent card structure:
- Icon wrap (tinted bg from agent color)
- Name + action text (cycles through `agent.actions[]`)
- Status dot: `thinking` → `working` → `done`
- Progress bar: 10% → 55% → 75% → 100%
- Result line (appears on done): check icon + `agent.result`

**Timing** (approximate, randomized for realism):
- Spawn stagger: 150–550ms between agents
- Thinking phase: 1.2–2.8s
- Working phase: 3–7s (cycles action messages every 700–1400ms)

**AC**: Agent cards appear with stagger. Progress bar fills smoothly. All agents complete before results render. Cancel interrupts all timers.

#### REQ-5.5 — Results Display (P0)
Each `scenario.result[]` item renders as `.cw-result-card` with:
- Colored icon wrap (40px, tinted bg from `result.color`)
- Title + subtitle
- Primary action button + secondary action button
- Action buttons mapped via `_ACTION_MAP` → toast, chrome switch, or panel open

**Result object schema**: `{ title, subtitle, color, icon, primaryAction, secondaryAction }`

**AC**: All button labels map to handlers. Unknown labels show generic toast (not crash).

#### REQ-5.6 — Delivery Confirmation (P1)
After results show, display `.cw-delivery-confirm`:
- "Results delivered to [target] · [when]"
- Target: "Astro Feed" / "Slack" / "Email"
- When: "Now" / "Tomorrow 8 AM" / "Daily at 8 AM" / "Hourly" / "Every Monday"

**AC**: Delivery message reflects actual selected chips. Changes if user changes chips before re-running.

#### REQ-5.7 — Task Persistence (P0)
Active and completed tasks stored in `localStorage` key `astro-cowork-tasks`.

Task lifecycle:
1. On submission: save to `tasks.active` (deduplicated by scenario key)
2. On completion: move to `tasks.completed` (with `completedAt` timestamp)
3. Max 10 completed tasks retained (oldest pruned)
4. Sidebar re-renders on each state change

**AC**: Refresh page → sidebar shows persisted tasks. Deduplication prevents duplicate active entries.

#### REQ-5.8 — Sidebar Task List (P1)
`#cw-active-tasks` and `#cw-done-tasks` render from localStorage:

Active tasks:
- Green dot indicator
- Task label
- Delivery schedule string
- Edit (pencil) button — repopulates textarea, sets state to idle

Completed tasks:
- Completion date
- Click to view results

**Default seed** (first load, no localStorage):
- Active: "Follow Up Stale Leads" (daily, Slack)
- Completed: "Q1 Compliance Risk Summary" (completed 2 days ago)

**AC**: Only 2 seeded tasks (not 4). Sidebar updates immediately after submit/complete.

#### REQ-5.9 — Example Goal Chips (P1)
`window.DATA.coworkExamples[]` renders as clickable chips with icon + label. Click populates textarea with `ex.exampleGoal` and auto-submits.

**AC**: Chips visible in idle state. Clicking a chip immediately begins execution. Examples are domain-relevant.

#### REQ-5.10 — Cancel & Reset (P1)
Cancel button clears all `_timers` (all active `setTimeout`/`setInterval`), shows toast "Agents stopped", returns to idle. Reset calls cancel. No orphaned timers after cancel.

**AC**: Rapid submit → cancel → submit works correctly. No animation artifacts.

#### REQ-5.11 — In-Card Toast (P1)
`_showCardToast(cardEl, message, type)` inserts a dismissible toast within a result card's `.cw-result-body`. Types: `success`, `warning`, `info`. Auto-dismisses in 5s.

**AC**: Toast appears inline (not global). Multiple rapid actions don't stack toasts.

---

### Epic 6: AI-Powered Card Generation (File Upload)

**Goal**: Users can upload documents; Claude API extracts 3 insight cards and injects them into the feed.

#### REQ-6.1 — File Upload Flow (P1)
Trigger: click `#ctrl-upload-btn` → triggers hidden `#ctrl-file-input`. On file selection:

1. Validate API key from `#ctrl-api-key` (error toast if missing)
2. Read file as text via `FileReader`
3. Slice to first 8,000 characters
4. POST to `https://api.anthropic.com/v1/messages` with:
   - Model: `claude-sonnet-4-6`
   - System: "You are a proactive enterprise assistant"
   - User: Extract 3 insight cards as JSON (fields: `title`, `body`, `urgency`, `type`)
5. Parse JSON from response
6. Map types to colors/icons, build card objects
7. Store in `_aiCards`, re-render feed
8. Show success toast: "Astro extracted N insights from [filename]"

**AC**: Upload a PDF or text file → 3 relevant cards appear in feed with "From [filename]" subtitle. "View Analysis" CTA opens `ai-upload` panel.

**Production gap**: Currently uses `anthropic-dangerous-direct-browser-access: true` header — this is a browser prototype workaround. Production requires a backend proxy (never expose API keys to browser).

#### REQ-6.2 — AI Card Schema (P1)
AI cards built with:
- `id`: `ai-${Date.now()}-${index}`
- `source`: "Claude AI"
- `sourceBadgeColor`: mapped per type
- `sourceIcon`: `ph-robot` (all AI cards)
- `subtitle`: `"From \"[filename]\""`
- `triggeredBecause`: "Extracted from uploaded document"
- `ctas`: [{ label: "View Analysis", panelId: "ai-upload" }]
- `timestamp`: "Just now"

**AC**: AI cards visually distinct (robot icon). Appear above persona cards in feed.

---

### Epic 7: Search & Ask Astro

**Goal**: Users can ask questions or search across their workspace from any surface.

#### REQ-7.1 — Search Bar Integration (P0)
Every chrome has at least one `.proactive-search-input`. Submit (Enter or button click) calls `_handleSearch(query, chromeKey)`.

**AC**: Search available in: New Tab (bottom centered), Salesforce (body bottom), Teams, Mac app, Claude extension, ChatGPT extension.

#### REQ-7.2 — Search Handler Interface (P1)
`window.App.registerSearchHandler(fn)` registers an async function `fn(query, chromeKey) → card[]`. Results injected via `window.App.injectSearchResults(cards)`, which prepends to feed above persona cards.

**AC**: External module can register handler. Results render correctly. Error shown as toast.

#### REQ-7.3 — Salesforce Ask Astro Full-Page Mode (P1)
`#sf-ask-trigger` click adds `sf-ask-mode` class to `#chrome-salesforce`, revealing full-page `.sf-ask-view`:
- Large heading: "What's on your mind today?"
- Search input (`.sf-ask-input-wrap`) with 2px accent border
- 3-column compact results grid in `.sf-ask-results-area .cards-mount`

Back button removes `sf-ask-mode` class and returns to main SF body.

**AC**: SF Ask mode renders correctly. Cards pre-populated if mount empty. Back button works.

#### REQ-7.4 — Cowork Mode Search Interception (P1)
If the persona has been set to cowork mode, Enter on any search input (`.proactive-search-input`, `.sf-ask-search-input`) routes the query to Cowork as a goal, not a search. SF ask-mode is cleared first.

**AC**: Typing a goal in the search bar while in cowork mode switches to Cowork chrome and begins execution.

---

### Epic 8: Side Panel Detail View

**Goal**: Deep-dive content (meeting prep, FDIC diff, CRA collaborators, AI analysis) opens in a right-side panel without leaving the current surface.

#### REQ-8.1 — Panel Infrastructure (P0)
`window.Panels.open(panelId)` and `window.Panels.close()` control `#side-panel`.

Panel behavior:
- Slides in from right (translate X transform, transition 0.25s)
- `#panel-overlay` darkens background
- Close: `#panel-close-btn`, overlay click, or Escape key

**AC**: No more than one panel open at once. Close returns focus to previous element.

#### REQ-8.2 — Panel Content Types (P0)
Panels render rich structured content. All content types defined in `window.DATA.panels[panelId]`:

| Content Type | CSS Class | Notes |
|-------------|-----------|-------|
| Meta rows (icon + label + value) | `.panel-meta-row` | Key details row |
| Stat grid (3-col) | `.stat-grid` + `.stat-cell` | KPIs |
| Attendee grid | `.attendee-grid` + `.attendee-card` | Avatar, name, title, last-contact |
| Document list | `.doc-list` + `.doc-row` + `.doc-tag` | Tags: `hot`, `stale`, `updated` |
| Action item list (checkboxes) | `.action-item-list` + `.action-item` | Toggle strikethrough on check |
| Talking points | `.talking-points` + `.talking-point` | Left-bordered, AI-generated |
| Timeline | `.timeline` + `.timeline-item` | Vertical connector line |
| Email preview | `.email-preview-box` | From/to/subject/body |
| FDIC diff view | `.diff-container` (2-col) | `.diff-removed` / `.diff-added` highlights |
| Compliance tasks | `.compliance-tasks` + `.compliance-task` | `in-progress` / `pending` variants |
| CRA changes | `.cra-change` | Left-border gdocs color |
| Reader list | `.reader-list` + `.reader-row` | Name, role, time |
| Sparkline chart | `.sparkline-wrap` | SVG chart with labels |
| Brief email list | `.brief-email-list` + `.brief-email` | Urgency colors, due tags |
| Brief calendar | `.brief-cal-list` + `.brief-cal-event` | Time + details |
| Alert rows | `.alert-list` + `.alert-row` | `.alert-high` / `.alert-medium` |
| AI insight block | `.ai-insight-block` | Left-border claude color |
| Impact list | `.impact-list` + `.impact-item` | Icons + text |

**Defined panels**: `meeting-prep`, `beacon-deal`, `fdic-diff`, `cra-collaborators`, `morning-brief`, `ai-upload`

**AC**: All panel types render without horizontal scroll. Panels scroll vertically if content exceeds height. Action checkboxes toggle correctly.

---

### Epic 9: Microsoft Teams Integration

**Goal**: Astro surfaces in Teams as a native-feeling app with conversation threads and proactive activity feed.

#### REQ-9.1 — Teams Chat Rendering (P1)
`_renderTeamsChat(convKey)` renders a selected conversation from `window.DATA.teamsChats[convKey]`.

**Conversation schema**:
```
{
  person: { name, title, color, initials },
  messages: [{ from: 'me'|'them', text, time }]
}
```

Messages:
- "me" bubbles: right-aligned, Teams purple (`#6264a7`) background
- "them" bubbles: left-aligned, avatar circle (colored), sender name above
- Auto-scroll to bottom on render

**AC**: Clicking a conversation in `.teams-chat-list` renders it on the right. Thread header shows person name + title.

#### REQ-9.2 — Teams Navigation (P1)
`.teams-sidebar-icon` clicks:
- `data-panel="chat"` → show chat view, hide activity
- All others → show activity (feed), hide chat

**AC**: Chat and activity views toggle correctly. Icons show active state.

---

### Epic 10: iPhone / Mobile View

**Goal**: Astro native mobile experience mirrors the Cowork interaction model on a device frame.

#### REQ-10.1 — iPhone Device Frame (P1)
Renders a 393×852px iPhone frame with:
- Dynamic island (CSS `::after` pseudo-element)
- Status bar
- App header (logo + greeting)
- Scrollable body (greeting, quick actions, agent list, results list)
- Input bar (floating pill)
- Tab bar (5 tabs)
- Home indicator

**AC**: Frame renders correctly at desktop scale. No actual responsiveness required for prototype.

#### REQ-10.2 — iPhone Quick Actions (P1)
`.iphone-qa-btn` chips pre-populate the goal input with scenario example goals and submit on click.

**AC**: 4 quick action chips visible. Click immediately triggers iphone submit → switches to Cowork chrome → executes scenario.

#### REQ-10.3 — iPhone Agent & Result Sync (P1)
During cowork execution:
- `_updateIphoneAgents(agents)` renders agent rows with pulsing dots and action text in `#iphone-agents`
- `_updateIphoneResults(scenario)` appends result items to `#iphone-results`, sets all dots to `done`

**AC**: iPhone view reflects cowork execution state. Default state shows Board Meeting Brief + FDIC Risk Summary results.

---

### Epic 11: Notifications & Toasts

**Goal**: Non-blocking, self-dismissing feedback for user actions.

#### REQ-11.1 — Global Toast System (P0)
`_showToast(message, type)` appends `.toast.toast-${type}` to `#toast-container` (fixed bottom-center).

Types: `success` (green, check icon), `error` (red, warning icon), `info` (default, info icon)

Auto-dismisses in 3.2s with 260ms fade-out.

**AC**: Multiple toasts stack correctly (LIFO). No toast persists longer than 4s. Error toasts require manual dismiss or same timer.

#### REQ-11.2 — New Update Banner (P1)
`.new-update-banner` (slide-down, bell icon) for late card arrival:
- Contains: "1 new update from Astro — [card.title]"
- Dismiss button (×) or auto-dismiss in 8s
- Only one banner at a time (removes previous if present)

**AC**: Banner appears before card animation. Dismissing banner does not dismiss the card.

---

### Epic 12: Theming & Demo Controls

**Goal**: Demo controls allow rapid context switching for stakeholder presentations.

#### REQ-12.1 — Light / Dark Theme Toggle (P1)
Toggle button (`#ctrl-theme-toggle`) alternates `data-theme` attribute on `<html>` between `""` (dark) and `"light"`. All 8 chromes and all components have light-theme overrides via `[data-theme="light"]` selectors. Icon updates: dark → `ph-moon`, light → `ph-sun`.

**AC**: Light theme matches all chromes. No unstyled components in either mode.

#### REQ-12.2 — Demo Controls Navbar (P1)
Collapsible `#demo-controls` (fixed top-right). Expand via click on nav or branding area. Close by clicking outside or pressing Escape. Keyboard shortcut: Cmd+K / Ctrl+K to toggle.

**Controls include**:
- Chrome selector dropdown (`#ctrl-chrome-select`)
- Persona selector dropdown (`#ctrl-persona-select`)
- Theme toggle button
- Settings dropdown: API key input (`#ctrl-api-key`), file upload button

**AC**: Demo controls don't overlay content. All controls functional. Settings dropdown closes on outside click.

#### REQ-12.3 — Clock & Date Display (P1)
`_initClock()` updates all `.live-clock` (h:mm a) and `.live-date` (weekday, month day) elements every 1000ms.

**AC**: Clock accurate to the second. Multiple surfaces update simultaneously.

---

### Epic 13: Token Resolution System

**Goal**: Zero stale time/date references — all temporal strings computed at render time.

#### REQ-13.1 — Token Resolver (P0)
`_resolveTokens(str)` must be called on all rendered string fields. Behavior:

| Token | Example Output |
|-------|---------------|
| `{{TODAY}}` | "Wednesday, March 11, 2026" |
| `{{TODAY_SHORT}}` | "Mar 11" |
| `{{DIGEST_DATE}}` | "Wednesday, March 11" |
| `{{T+14}}` | "9:42 AM" (14 min from now) |
| `{{T+360}}` | "3:28 PM" (6 hr from now) |
| `{{T-5m}}` | "5 min ago" |

**AC**: No raw `{{token}}` string visible in rendered UI. Function handles non-string input gracefully (returns value unchanged).

#### REQ-13.2 — timeOffset for Calendar Items (P0)
Digest calendar items use `timeOffset: number` (minutes from now) instead of hardcoded `time` strings. `_timeFromNow(offsetMinutes)` converts to localized time string at render.

**AC**: Calendar item showing `timeOffset: 45` renders correct time if page loaded at any hour.

---

### Epic 14: Design System & CSS Architecture

**Goal**: Consistent, maintainable visual language across all 8 surfaces.

#### REQ-14.1 — CSS Custom Properties (P0)
All colors, radii, shadows, transitions, and fonts defined as CSS custom properties under `:root`. Light theme overrides under `[data-theme="light"]`.

**Core tokens** (must be defined):
- Typography: `--font-body`, `--font-display`, `--font-mono`
- Backgrounds: `--bg-primary`, `--bg-secondary`, `--bg-card`, `--bg-card-hover`, `--bg-tertiary`, `--bg-overlay`
- Text: `--text-primary`, `--text-secondary`, `--text-muted`, `--text-inverse`
- Accent: `--accent`, `--accent-hover`, `--accent-light`
- Urgency: `--urgency-high`, `--urgency-medium`, `--urgency-low`
- Borders: `--border-subtle`, `--border-default`, `--border-strong`
- Shadows: `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-btn`
- Shape: `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-btn`
- Motion: `--transition-fast`, `--transition-base`
- Source colors: `--color-gdocs`, `--color-salesforce`, `--color-compliance`, `--color-activity`, `--color-multi`, `--color-teams`, `--color-claude`, `--color-chatgpt`, `--color-mac`

**AC**: Zero hardcoded hex values outside `:root` definitions. Theme switch changes all colors.

#### REQ-14.2 — Phosphor Icons (P1)
All icons use Phosphor icon font (`ph ph-*` classes). No mixed icon libraries.

**AC**: All icons render at correct sizes. No broken icon references.

#### REQ-14.3 — Card Grid Responsive Layout (P1)
`.cards-mount` uses CSS Grid with `repeat(auto-fill, minmax(300px, 1fr))`. At ≤768px viewport, columns collapse to single column. Cards have min-width to prevent overly narrow rendering.

**AC**: Feed layout renders correctly at 1440px, 1024px, and 768px.

#### REQ-14.4 — Animation Keyframes (P1)
All animations defined as `@keyframes`:
- `shimmer` — skeleton loading shimmer
- `toastIn` / `toastOut` — toast slide + fade
- `cwDotPulse` — cowork agent status dot pulse
- `cwSlideIn` — cowork agent card entrance
- `cwProgressStripe` — progress bar fill animation
- `cardArrive` — late card entrance (scale + translate)
- `badgePulse` — "NEW" badge box-shadow ring
- `bannerSlideDown` — new update banner slide-in

**AC**: No animation jank. Animations work correctly with `prefers-reduced-motion` (should degrade gracefully).

---

### Epic 15: Production Architecture (Currently Unimplemented)

These are the gaps between the prototype and a shippable product.

#### REQ-15.1 — Backend API Layer (P0)
All data currently hardcoded in `data.js`. Production requires:
- REST/GraphQL API for card generation (with user context, CRM data, calendar data)
- WebSocket/SSE channel for real-time card push (late card simulation)
- Authenticated endpoints per persona/user

**Tech stack recommendation**: Node.js + GraphQL + Redis pub/sub for real-time

#### REQ-15.2 — Authentication & Authorization (P0)
- OAuth2 SSO integration (Salesforce, Microsoft, Google)
- Role-based access: card content scoped to user's actual permissions
- Session management: token refresh, logout

#### REQ-15.3 — CRM & Calendar Integrations (P0)
Real card content requires:
- **Salesforce**: Opportunity data, account history, contact activity (via Salesforce REST API)
- **Microsoft**: Calendar (Graph API), Teams messages (Graph API), SharePoint docs
- **Google**: Calendar, Drive, Gmail
- **FDIC/Compliance**: Regulatory feed ingestion pipeline

#### REQ-15.4 — AI Card Generation Backend (P0)
Replace browser-direct Claude API call with:
- Backend service that receives file + user context
- Calls Claude with enriched system prompt (persona, domain, recent activity)
- Returns typed card objects
- Rate limiting + cost controls

#### REQ-15.5 — Cowork Execution Engine (P0)
Replace simulated agent animations with real multi-agent orchestration:
- Task queue with persistent state
- Agent pool: each agent type (intel, compliance, CRM, doc retrieval) as real Claude API call
- Result storage and retrieval
- Actual Slack/Email delivery integrations

#### REQ-15.6 — Real-Time Event Pipeline (P1)
Replace 11-second late card timer with:
- Event ingestion from CRM webhooks, calendar push notifications, compliance feeds
- User-scoped event router
- WebSocket delivery to active client sessions
- Deduplication and rate limiting

#### REQ-15.7 — API Key Security (P0)
Remove `anthropic-dangerous-direct-browser-access: true` header. All AI calls must go through authenticated backend proxy. No API keys in browser.

#### REQ-15.8 — LocalStorage → User Data Store (P1)
Cowork task persistence in localStorage is prototype-only. Production requires:
- Server-side task storage per user
- Cross-device sync
- Task history and audit trail

#### REQ-15.9 — Analytics & Observability (P2)
Track:
- Card impressions, dismissals, CTA clicks per card type
- Cowork task submission, completion, cancel rates
- Feature adoption per persona type
- Panel open rates per panel type
- Search query patterns

---

### Epic 16: Accessibility (Currently Minimal)

#### REQ-16.1 — Keyboard Navigation (P1)
- All interactive elements reachable via Tab
- Focus ring visible on all focusable elements
- Modal/panel focus trapped while open
- Escape closes panel and returns focus

#### REQ-16.2 — Screen Reader Support (P1)
- All icon buttons have `aria-label`
- Cards have `role="article"` with descriptive `aria-label`
- Status messages use `aria-live="polite"`
- Panels have `role="dialog"` with `aria-modal="true"`

#### REQ-16.3 — Color Contrast (P1)
All text must meet WCAG 2.1 AA contrast ratios (4.5:1 for normal text, 3:1 for large text). Urgency colors must not be the sole means of conveying information.

#### REQ-16.4 — Reduced Motion (P2)
`@media (prefers-reduced-motion: reduce)`: disable shimmer, card entrance animations, banner slide-in. Preserve functional state transitions.

---

### Epic 17: Error Handling & Edge Cases

#### REQ-17.1 — Graceful API Failures (P1)
Claude API file upload failures: show error toast with human-readable message. Retry not automatic. Input file cleared after error.

#### REQ-17.2 — Empty States (P1)
If a persona has zero cards:
- Show empty state in feed: "No items surfaced — Astro will notify you when something needs attention."
- Do not show skeleton indefinitely.

If digest has no sections:
- Do not render digest component.

#### REQ-17.3 — Long Text Truncation (P1)
Card titles: single line, ellipsis overflow. Card body: 3-line clamp. Panel content: no truncation (user can scroll). Done-row titles: single line, ellipsis.

#### REQ-17.4 — Concurrent Chrome Switches (P1)
If user switches chromes mid-skeleton delay (250ms timer), the delayed `renderCards` call must check mount is still connected before rendering. If disconnected, abort silently.

**AC**: Rapid chrome switching does not cause duplicate renders or orphaned cards.

#### REQ-17.5 — Stale `_previousChrome` State (P2)
If `_previousChrome` value points to a chrome that no longer exists in the DOM, fall back to `new-tab`.

---

## 5. Data Architecture Summary

### Card Types
10 defined types (§3.1a). All support token resolution. All require `id` uniqueness globally.

### Persona Data
9 personas × domain-specific content. Each persona object contains cards, lateCard, morningDigest. Personas must be servable from backend with user-specific data at runtime.

### Cowork Scenarios
Each scenario object requires:
```
{
  key: string,
  label: string,
  keywords: string[],
  exampleGoal: string,
  agents: Agent[],
  result: ResultItem[]
}
```

### Panel Data
6 defined panels. Each panel requires `title`, `width`, and `sections[]`. Section types defined in §8.2.

### Teams Chat Data
Keyed conversation objects with person metadata + message array.

---

## 6. Success Metrics

| Metric | Target |
|--------|--------|
| Card CTR (any CTA click within 60s of render) | ≥ 35% |
| Dismiss rate (within 30s) | ≤ 20% (high-urgency cards) |
| Morning digest open rate | ≥ 60% |
| Cowork task completion (submit → results, no cancel) | ≥ 70% |
| Late card banner engagement | ≥ 40% |
| Panel open rate per card CTA click | ≥ 50% |
| p95 card render latency (backend → visible) | < 1.5s |
| Chrome switch perceived latency | < 400ms |

---

## 7. Non-Goals (v1)

- Native iOS/Android app (iPhone view is demo-only frame)
- Multi-tenant / team-shared dashboards
- User-created card templates
- Card snooze (future: "remind me in 2h")
- Inline card reply / annotation
- PDF/image file upload (text files only for v1)
- Multi-language / i18n
- Offline mode

---

## 8. Open Questions & Risks

| # | Question | Owner | Priority |
|---|---------|-------|---------|
| 1 | How does Astro identify the user's persona at auth time? SSO role claims or user-configured? | Product/Eng | P0 |
| 2 | What is the card freshness SLA? How often does the backend re-score proactive cards? | Eng/Data | P0 |
| 3 | Salesforce deployment: Salesforce LWC or iFrame? LWC has strict CSP constraints. | Eng | P0 |
| 4 | Teams deployment: Tab app or Message Extension or Bot? Different UX models. | Eng | P1 |
| 5 | How does Cowork delivery to Slack/Email work in production? Astro-owned Slack app required. | Eng | P1 |
| 6 | What card data is safe to display without CRM re-auth? PII exposure surface. | Legal/Eng | P0 |
| 7 | Token resolution: server-side or client-side in production? Client-side has clock drift risk. | Eng | P1 |
| 8 | `_dismissedCardIds` currently lives in memory. Server-side persistence requires user session identity. | Eng | P1 |
| 9 | Morning digest: personalized by backend AI or configured by user? | Product | P1 |
| 10 | Agent animation timing: how to reflect real execution time without over/under-promising? | Design | P2 |
