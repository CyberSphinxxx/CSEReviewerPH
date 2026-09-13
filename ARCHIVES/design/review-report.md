# Dashboard design review

Date: 2026-09-13 · Scope: dashboard, shared navigation, calendar/activity proposal, reusable visual system.

## Executive read
The dashboard has a recognizable navy-and-gold identity, useful study tools, and generous outer spacing. Its next improvement should be a personal daily study view with fewer simultaneous priorities, clearer language, and trustworthy progress states.

This is an analysis and direction proposal, not an implemented redesign. No application code was changed. The supplied screenshot is evidence of the returning-learner appearance; current source and a fresh guest browser session supply separate evidence.

## Objective and product contract
Help a learner quickly answer: What should I do today? When is my exam? Am I building consistency? Keep detailed progress reachable without requiring it to dominate the landing view. A future usability check should ask new and returning learners to identify their next action and change their exam target without assistance; this study has not been conducted.

The recommendations follow product-plan §§18–20, 28, 38, 42 and addendum §§48, 50, 52. The system must remain generic across exams and levels, guest friendly, and explicit about practice accuracy versus official results. The addendum's permissive engine wording (§57) differs from the stricter repository instructions; no architecture change is proposed and the stricter configuration-driven approach is retained.

## Evidence and boundaries
- Supplied desktop screenshot: populated dashboard, review queue, metrics, countdown, history, account/storage section.
- Current source: DashboardView.tsx, recommendation-engine.ts, local-storage-service.ts, Header.tsx, globals.css, tailwind.config.ts.
- Isolated Chromium guest context: production build at http://localhost:3005/dashboard; 1440×1000 and 390×844 viewports; opened and canceled the existing target editor; inspected its accessibility tree. No real user data was altered.
- Competitor: https://civilserviceexampractice.com/ at desktop and 390px mobile; followed the public “See how it works” link to https://civilserviceexampractice.com/how-it-works. No private dashboard, paid content, exam questions, or question bank was inspected.
- First-party constraints: [W3C text spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html), [contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), and [target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).
- Captures are in .design/evidence/. Competitor viewport capture and the user screenshot were visually inspected. Other captures support reproducibility; measured browser output supports the runtime findings.
- Initial app-browser startup failed with a sandbox initialization error. Existing Playwright was used instead. The existing port-3000 preview did not produce the expected dashboard; a separate production preview supplied the successful evidence.

## What to preserve
- Existing logo, navy text, restrained gold identity, white surfaces, familiar rounded controls.
- The recommendation-first idea; it already answers the right product question.
- Guest access, mistake review, bookmarks, history, and data-management capabilities.
- The existing platform stack and the continuous exam timer.
- Useful spacing between major groups. The main issue is what gets grouped and emphasized inside those groups.

## Scorecard
Scores are design judgments, not a usability-study result; no averaged overall score.

| Dimension | Score | Evidence |
|---|---|---|
| Product clarity | 3/4 | Practice and progress purpose is clear |
| Hierarchy and composition | 2/4 | Multiple large sections and colored actions compete |
| Typography and readability | 2/4 | Heavy headings, small metadata, excessive explanatory copy |
| Task flow and feedback | 2/4 | Useful recommendation; target editing is visually hidden |
| Visual system consistency | 2/4 | Brand palette exists but actions use several unrelated emphases |
| Data credibility | 1/4 | Fresh guest sees invented accuracy values |
| Responsive behavior | 1/4 | Confirmed mobile header overflow |
| Accessibility | Not fully scored | Unnamed form controls confirmed; full keyboard/screen-reader audit not performed |
| Performance, all device states | Not scored | Insufficient measured evidence |

Hierarchy and data credibility most affect this proposal: personalization must make a useful next step obvious and earn trust in every displayed number.

## Findings

| ID | Severity | Area | Location / evidence | Current behavior | Proposed correction | User impact |
|---|---|---|---|---|---|---|
| D01 | HIGH | Data credibility | DashboardView.tsx:197; local-storage-service.ts:656; fresh guest browser | 0 completed tests but 74.5% overall accuracy and 75% subject values | Render “Not measured yet” and an invitation to start a diagnostic; never backfill personal metrics with samples | Prevents misleading readiness judgments |
| D02 | HIGH | Mobile navigation | Header.tsx:30; browser at 390px | Document and header width measured 478px | Recompose into logo/account/menu on narrow screens; retain accessible Dashboard/Practice/Guides destinations | Removes page-level horizontal scrolling |
| D03 | HIGH | Calendar accessibility | DashboardView.tsx:424–462; browser accessibility tree | Labels appear visually but combobox, date textbox, and goal spinbutton have no accessible names | Bind each label with htmlFor/id; name errors, retain focus, test keyboard save/cancel | Makes target editing understandable to assistive technology |
| D04 | MEDIUM | Next action | Supplied screenshot; DashboardView.tsx:224; recommendation-engine.ts | Multiple calls to practice, repeated mistake-bank promotion, alarming red emphasis, technical explanation | One “For today” action with one-sentence reason; keep mistake/bookmark access as quiet links below | Reduces decision effort |
| D05 | MEDIUM | Exam target | DashboardView.tsx:347–477 | Existing target/date/goal editor hidden behind settings icon in a large dark banner | A compact “Your exam” panel with visible “Change date”; selected date, days remaining, mini month calendar | Makes an existing capability discoverable |
| D06 | MEDIUM | Navigation emphasis | Screenshot “My Progress”; current Header.tsx shows “Dashboard” | The label was already changed in current user edits; saturated filled treatment remains | Style as navigation with subtle active background/underline and aria-current; reserve filled emphasis for starting study | Clarifies current location and action hierarchy |
| D07 | MEDIUM | Reading load | Supplied screenshot and rendered guest body | Repeated subtitles, all-caps metadata, jargon, nested cards, large backup section | Shorten descriptions; replace secondary cards with rows; move backup controls to an accessible data/settings area | Makes daily scanning easier |
| D08 | MEDIUM | Progress terminology | recommendation-engine.ts; addendum §50 | Copy associates raw accuracy with official passing standards and each weak subject with a required 80% benchmark | Say “Practice accuracy”; label any threshold as a study target, show sample size, avoid pass prediction | Prevents overstatement of readiness |
| D09 | LOW | Streak presentation | Supplied screenshot “1 days”; DashboardView.tsx:75–76; storage activity data | Single numeric card gives little history; fallback may show 1 for any history | Correct pluralization, derive current streak from valid dated activity, show a compact calendar with a clear rule | Makes consistency tangible and trustworthy |

Stale streak display and some calendar edge cases have source-based risks but were not exercised end to end. Track those as verification gaps rather than claiming a tested defect.

## Competitor lessons
The public landing page has restrained surfaces, a clear primary action, and a consistent heading-to-paragraph relationship. At a 1440px viewport its hero body is 16px/26px in a 492px column; another editorial paragraph is 672px wide. Supporting descriptions are 14px/22.75px. The mobile homepage had no measured horizontal overflow at 390px.

Borrow controlled line length, readable line height, grouping, and consistent emphasis. Its page also contains substantial prose: comfort comes from structure as well as quantity. The 48px landing-page hero is not an appropriate default dashboard heading, and a public marketing journey does not prove its private dashboard is effective. These observations support a direction, not a claim of superior conversion or learning outcomes.

## Direction options

| Direction | Journey and changes | Benefit | Trade-off |
|---|---|---|---|
| A. Refine current layout | Keep stacked page; shorten copy, normalize buttons, expose date editing; replace streak tile | Lowest change cost | Preserves a long page and fragmented daily context |
| B. Personal study day — RECOMMENDED | Greeting → today's action → exam target/activity → subject progress → history; merge duplicate review prompts; reduce utility cards | Best match for personalization and daily return visits | Requires coherent empty states and calendar/activity behavior |
| C. Calendar-led planner | Calendar becomes main surface; learner schedules sessions then starts practice | Useful for people explicitly planning a study week | Adds scheduling work and more controls; excessive for current brief |

All directions retain ordinary focus/hover/native control behavior. No custom choreography, confetti, pulsing countdown, or animated heatmap is needed. An optional inline-save status can update immediately; a reduced-motion preference should disable nonessential entrance motion. These are proposed contracts, not motion measured from competitor screenshots. Runtime keyboard, focus, zoom, and device proof remain required before any design is called validated.

## Recommended composition

Desktop has a generous main study column and a smaller personal context column, approximately two-thirds / one-third. Keep one DOM reading order that stacks usefully on mobile.

| Main study column | Personal context column |
|---|---|
| “Welcome back, John” and selected exam level | Quiet date context if useful |
| “For today” — review 8 questions; one primary button; daily goal | “Your exam” — chosen date, days left, mini month calendar, Change date |
| Practice activity — recent contribution grid and plain-language summary | Compact goal/preferences controls |
| Subject progress — aligned rows, sample sizes, relevant practice links | Saved items can be a short utility row below the main action |
| Recent sessions — latest three, View history | No second promotional banner |

At mobile widths: greeting → today's action → compact exam/date summary (expand calendar) → activity → subject progress → recent sessions → settings. Do not keep a squeezed desktop sidebar. The calendar replaces the large countdown banner; the activity block replaces the isolated streak metric. This is a structure specification, not a rendered approved mockup.

### Content edits

| Current | Proposed |
|---|---|
| User Dashboard | Welcome back, John / Your study space for guests |
| Review 8 Due Missed Questions | 8 questions ready to review |
| Leitner spaced repetition interval has matured… | Revisit these questions from your earlier practice. |
| Practice Due Mistakes | Review 8 questions |
| Civil Service Subtest Readiness | Your subject progress |
| Overall Accuracy | Practice accuracy |
| Diagnostic baseline with invented percentage | Not measured yet |
| Guest offline storage banner | Saved on this device · Manage data |

Use a reliable existing display name with a neutral fallback; do not collect extra personal information just for the greeting. Derive all launchers and subject rows from the learner's selected exam and level.

## Exam calendar behavior
- Display chosen exam name/level, full date, and days remaining, with an explicit “Change date” action.
- Use a small month calendar as orientation. An exam-month view is useful for a distant target; label the month explicitly and provide “Today” navigation if month browsing is offered.
- Distinguish a verified published date from “Your target date.” Offer verified upcoming schedules only when an official CSC source and last-checked date exist; otherwise let the learner choose a personal target.
- The existing 2027 preset dates were found in source, not verified as official by this audit. Do not reuse them as factual schedule claims in a proposal.
- Separate preset selection from the custom-date value. Editing a custom date must update its displayed label; do not retain an unrelated preset exam name.
- Save applies changes; Cancel discards edits. Preserve the previous saved preference on invalid input or persistence failure and explain how to retry.
- No date: “Set your exam date.” Exam day: “Your exam is today.” Past date: show the previous target and offer a new one; do not leave “0 days” indefinitely.
- Calculate dates consistently with an explicit study time zone, proposed default Asia/Manila, and keep the future implementation configuration-driven.

## Activity and streak behavior
Use the GitHub contribution-grid pattern for recent history, with roughly 12 weeks on desktop and 4–6 weeks on mobile. Avoid a full year of tiny squares as the default.

The request includes both visits and tests. A useful model honors both while explaining the difference:
- **Check-in:** a once-per-day intentional visit to the study dashboard or practice area. An outlined mark indicates a visit with no answers.
- **Study activity:** answered questions or a recorded review session. Filled shades indicate clearly labeled question-count bands, not guessed effort or time.
- Default headline can be “3-day activity streak” if visits count; use “study streak” only when the qualifying rule requires study. State the rule near the grid/help.
- Show “4 active days this week” as an encouraging secondary measure. A missed day remains a quiet gap; retain longest streak as history.
- Today's cell has a visible outline; future cells are unavailable. A text legend and focused/tapped date detail disclose date, check-in, question count, and sessions without relying solely on color.
- Use one daily aggregation key, deduplicate refreshes and repeated submission, retain a streak through today when the latest active day was yesterday, and show zero when it has actually expired.
- Existing activeDates and daily question data can seed the visualization where recorded. Historical visits cannot be reconstructed honestly. Mark unavailable imported history distinctly from confirmed inactivity.
- New visit tracking is an explicit new data signal: record only what is necessary, keep guests local, include deletion/export, and review privacy-notice coverage before implementation. No analytics installation is needed for a private activity calendar.

### Material state inventory

| State | Required behavior |
|---|---|
| New learner | Neutral greeting, no invented accuracy, empty activity explanation, diagnostic CTA |
| Returning with due review | Review count and one relevant CTA; alternate practice as a quiet link |
| No due review | Selected-level drill or supported weak-area suggestion |
| Very little history | Show observed counts; avoid confidence/readiness claims from tiny samples |
| Goal met today | Acknowledge completion; allow optional study without increasing pressure |
| Missed days | Preserve history, give an easy next action, avoid warning-red guilt treatment |
| No date / custom / official target | Explicit provenance and appropriate date editor |
| Today / past target | Distinct status and an option to choose the next target |
| Loading | Stable placeholders; do not flash sample personal metrics |
| Storage unavailable / sync failed | Explain persistence status; preserve usable practice; retry without claiming saved |
| Account / guest / long name | Accurate storage status, neutral fallback, wrapping without pushing navigation offscreen |
| Edit / invalid / save / cancel | Associated labels, clear error, preserved values, announced result, restored focus |
| Phone / zoom / keyboard / reduced motion | Reflowing layout and operable calendar/grid with equivalent text access |

## A small site-specific design system
Yes: formalize the existing identity. The repo already has CSS variables and Tailwind brand colors; finish those foundations instead of adding another UI library or inventing every control.

| Role | Starting recommendation |
|---|---|
| Character | Calm, encouraging, precise; recognizable navy and restrained sun-gold |
| Canvas and surfaces | Existing pale neutral canvas, white reading surfaces, low-contrast dividers |
| Text | Navy/slate primary; readable muted text; avoid widespread extra-light metadata |
| Actions | One primary brand-blue treatment; quiet secondary and navigation variants |
| Status | Green for completion; amber for useful attention/milestones; red for real errors/destructive actions |
| Type | 28–32px page title, 20px section title, 16px/25–26px body, 13–14px supporting text |
| Spacing | 4/8/12/16/24/32/48 scale; 24–32px section padding and 24–32px between main groups |
| Measure | About 45–70 characters for explanatory text; shorter lines for dashboard summaries |
| Shape | 12–16px panel radius, 8–10px controls; consistent border; shadows mainly for overlays |
| Components | App navigation, section heading, next-action panel, exam-target panel, activity grid, subject row, empty state, data-status row |
| Interaction | Shared default/hover/focus/selected/disabled/loading/error/success contracts, appropriately sized touch controls |

These numeric values are proposed starting tokens, not measurements of an approved redesign. Check contrast in every actual state. WCAG requires sufficient contrast (generally 4.5:1 for normal text), tolerance of specified user text-spacing overrides, and target sizing with applicable exceptions. The suggested 26px line height is a design choice; it is not a WCAG-mandated default.

Use the same foundations everywhere but permit distinct compositions: homepage explains value, dashboard supports today's decisions, guides support reading, exams support concentration. Reuse visual rules, not one universal card layout. Migrate dashboard and shared navigation first, then carry proven components to other pages in separate scoped changes.

## Prioritized plan
**Now:** D01 truthful empty metrics; D02 mobile navigation; D03 accessible form labels; then a single daily action, shorter copy, and quiet active navigation.

**Next:** Personal exam panel, activity calendar, explicit streak rules and all material states. Consolidate visual tokens/components during this work, with tests for real behavior.

**Later:** Roll proven patterns to guides/results; consider planning tools only if learners demonstrate a need. Do not add a full calendar scheduling product, leaderboards, badges, new fonts, or a year-long default heatmap simply to make the dashboard feel personal.

## Verification and remaining gaps
- npm run verify: PASS, exit 0; typecheck, lint, architecture, 171 tests in 34 files, production build.
- Existing PostgreSQL SSL-mode warnings appeared; they did not fail verification and were not changed in this audit.
- Browser: current guest dashboard loaded; existing target editor opened/canceled; form accessible names inspected; mobile width measured; competitor loaded desktop/mobile and public navigation succeeded.
- Not run: complete exam E2E suite (no product behavior changed), screen-reader testing, full keyboard/zoom/contrast audit, authenticated runtime, stale/invalid date saves, streak rollover/sync, or usability study.
- Runtime checks for future implementation must cover target persistence/cancel/error and timezone boundaries, dated activity deduplication/expiry, zero-history metrics, selected exam-level navigation, guest/account data handling, and mobile/zoom accessibility. Run npm run test:e2e when changing navigation or exam flow.

## Design Arc run status
Saved settings remain benchmarks/Mobbin and guided. This report uses the expressly requested public competitor as a one-run benchmark scope; Mobbin was not accessed and no saved provider switch is claimed. The stated objective comes directly from the request and project instructions to proceed with reasonable interpretations. No additional setup/home/task was created.

Direction B is recommended; no direction selection or visual proposal approval is recorded. This audit ends at a reviewable recommendation, matching the request for analysis. Full first-party conformance, complete rendered journey, Visual Proposal Gate, motion/device validation, asset binding, and implementation handoff are not completed or claimed. Graph default is on under workflow 0.3.0, but no valid active-review graph was available or used; the report uses direct evidence. No new image-generation assets, custom animation measurements, or deployment authorization are implied.

## Scoped verdict
**Block on the confirmed data/accessibility findings before treating the dashboard as ready for the proposed redesign rollout.** The analysis is complete, but the current dashboard still needs changes. The personal-study-day direction is recommended for the next design phase; it is not an approved or implemented visual design.

