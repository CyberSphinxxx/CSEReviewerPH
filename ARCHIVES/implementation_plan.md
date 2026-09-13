# Dashboard Redesign: Personal Study Day (Direction B) Implementation Plan

## Goal Description
Redesign the learner dashboard (`src/features/dashboard/DashboardView.tsx`) and shared navigation header (`src/components/layout/Header.tsx`) strictly following the design review report. This transitions the dashboard from a crowded, competing-priorities layout with invented metrics into a calm, personal daily study view that answers:
1. **What should I do today?** (Single dominant "For today" action with a one-sentence reason and quiet utility links)
2. **When is my exam?** (Compact "Your exam" panel with target date, days remaining, mini month calendar with target day pinned, and an accessible "Change date" workflow)
3. **Am I building consistency?** (GitHub-style practice activity grid distinguishing daily check-ins from active study sessions, with correct streak pluralization and weekly active day metrics)
4. **Where do I stand?** (Truthful subject progress and practice accuracy that render "Not measured yet" when unmeasured, eliminating sample backfills)

---

## Findings Addressed & Architecture Contracts

| Finding | Severity | Description & Solution |
|---|---|---|
| **D01** | **HIGH** | **Data Credibility**: Fresh guest sees 74.5% overall accuracy and 75% subject accuracy. Fix `local-storage-service.ts:getSubjectReadiness()` to return `0` questions answered and `0%` accuracy when unmeasured. Update `DashboardView.tsx` to render `"Not measured yet"` with a diagnostic invitation. Never backfill personal metrics with sample values. |
| **D02** | **HIGH** | **Mobile Navigation**: Header measured 478px at 390px viewport due to horizontal link spill. Fix `Header.tsx` to recompose into a mobile-friendly layout with a hamburger menu dropdown on screens `< md` while keeping all destinations accessible and eliminating page-level horizontal scrolling. |
| **D03** | **HIGH** | **Calendar Accessibility**: Form controls for preset select, date picker, and goal spinbutton lacked accessible names. Connect each label with `htmlFor` / `id`, support keyboard shortcuts (Escape to cancel, Enter to save), and retain focus after save/cancel. |
| **D04** | **MEDIUM** | **Next Action Hierarchy**: Eliminate competing loud CTAs and alarmist red Leitner jargon. Provide a single "For today" action card with a one-sentence plain-language explanation and a primary action button, with quiet links below for Mistake Bank and Bookmarks. |
| **D05** | **MEDIUM** | **Exam Target Discoverability**: Replace hidden settings gear in a dark banner with a compact "Your exam" panel featuring visible "Change date" button, days remaining calculation, and an interactive mini month calendar. |
| **D06** | **MEDIUM** | **Navigation Emphasis**: Remove saturated filled button styling from "Dashboard" in `Header.tsx`. Style as a subtle navigation active state with `aria-current="page"`, reserving primary filled buttons for study actions. |
| **D07** | **MEDIUM** | **Reading Load & Structure**: Shorten descriptions, remove nested card clutter, adopt 2-column desktop (2/3 study, 1/3 personal context) and single-column mobile stacking. Move backup/storage controls to a compact "Saved on this device · Manage data" panel. |
| **D08** | **MEDIUM** | **Progress Terminology**: Replace "Overall Accuracy" with "Practice accuracy", label 80% as "Study target: 80%" (not official passing benchmark), show sample sizes (e.g., "12 of 15 correct"), and avoid official pass predictions. |
| **D09** | **LOW** | **Streak Presentation & Activity**: Fix "1 days" pluralization bug. Implement a GitHub-style activity grid (~12 weeks desktop, ~6 weeks mobile) with Asia/Manila date keys, clearly distinguishing daily check-ins from active study sessions, with an explicit rule and "4 active days this week" metric. |

---

## Proposed Changes

### Storage Layer (`src/lib/storage`)

#### [MODIFY] [local-storage-service.ts](file:///c:/L3mxr/Github%20Repositories/CSEReviewerPH/src/lib/storage/local-storage-service.ts)
- **Fix D01**: In `getSubjectReadiness()`, when `val.total === 0`, return `questionsAnswered: 0`, `correctCount: 0`, `accuracyPercentage: 0`.
- **Check-in Tracking**: Add `recordDailyCheckIn()` which records today's date in `cse_guest_check_ins` (deduplicated Asia/Manila date string `YYYY-MM-DD`).
- **Activity Grid Data**: Add `getActivityGridData(weeks: number)` returning an array of day objects (`date`, `formattedDate`, `dayOfWeek`, `questionCount`, `hasCheckIn`, `sessionsCount`, `activityLevel`, `isToday`, `isFuture`).
- **Streak Calculation**: Fix streak calculation to retain streak through today if yesterday was active, calculate longest streak accurately, and export pluralization helper `${streak} ${streak === 1 ? 'day' : 'days'}`.

---

### Dashboard Recommendation Engine (`src/features/dashboard`)

#### [MODIFY] [recommendation-engine.ts](file:///c:/L3mxr/Github%20Repositories/CSEReviewerPH/src/features/dashboard/recommendation-engine.ts)
- Update copy for truthful, pedagogical tone:
  - Diagnostic: "Take a short diagnostic drill to measure your strengths and set your study baseline."
  - Due mistakes: "${count} question(s) ready to review. Revisit these questions from your earlier practice to strengthen retention."
  - Weak area: "Strengthen ${subject}. Practice this area to raise your practice accuracy toward your 80% study target."
  - Milestone: "Validate your stamina and timing with a full mock exam."
  - Daily: "10-question daily practice. Keep your skills sharp with a quick mixed drill."
- Replace aggressive "urgent" red styling with calm, focused urgency classes.

---

### Dashboard Subcomponents (`src/features/dashboard`)

#### [NEW] [TodayActionCard.tsx](file:///c:/L3mxr/Github%20Repositories/CSEReviewerPH/src/features/dashboard/TodayActionCard.tsx)
- Dominant "For today" action with single-sentence reason and 1 primary CTA button.
- Quiet secondary status line for Mistake Bank count and Bookmark count.

#### [NEW] [ExamCalendarCard.tsx](file:///c:/L3mxr/Github%20Repositories/CSEReviewerPH/src/features/dashboard/ExamCalendarCard.tsx)
- Compact "Your exam" panel showing chosen exam name/level, formatted target date, and days remaining status ("X days remaining", "Your exam is today!", or "Target date has passed · Choose a new target date").
- Mini month calendar with month navigation (`<` / `>`) and "Today" button, showing current month, today highlighted, and target exam day pinned with a gold badge.
- Visible "Change date" button.
- Accessible inline target editor with `htmlFor`/`id` bindings for preset select, custom date input, and daily goal spinbutton (D03), with keyboard save/cancel.
- Daily goal pacing progress bar with items answered today.

#### [NEW] [PracticeActivityGrid.tsx](file:///c:/L3mxr/Github%20Repositories/CSEReviewerPH/src/features/dashboard/PracticeActivityGrid.tsx)
- GitHub-style contribution grid (~12 weeks on desktop, ~6 weeks on mobile).
- Cells show:
  - Outlined square: daily check-in (visited dashboard/practice without answered questions).
  - Shaded green squares: active study questions (1-10, 11-25, 26+ questions).
  - Ring outline: today's cell.
  - Disabled/dimmed: future cells.
- Interactive tooltip/focus detail on each cell showing date, questions answered, and sessions completed.
- Summary metrics: Current study streak (pluralized correctly), "X active days this week", and longest streak.
- Clear explanatory rule: "Answer at least 1 question to build your study streak. Check-ins track daily visits."

#### [NEW] [SubjectProgressList.tsx](file:///c:/L3mxr/Github%20Repositories/CSEReviewerPH/src/features/dashboard/SubjectProgressList.tsx)
- Clean aligned rows titled "Your subject progress" with sample sizes ("12 of 15 correct" or "Not measured yet").
- "Study target: 80%" label, avoiding official pass predictions.
- Direct links to launch practice for each subject.

#### [NEW] [RecentSessionsList.tsx](file:///c:/L3mxr/Github%20Repositories/CSEReviewerPH/src/features/dashboard/RecentSessionsList.tsx)
- Displays the last 3 test attempts with date, score, mode, and review links.
- Clean empty state when no tests have been completed yet, with a diagnostic invitation.
- "View full history →" link to `/dashboard/history`.

#### [NEW] [DataStorageSection.tsx](file:///c:/L3mxr/Github%20Repositories/CSEReviewerPH/src/features/dashboard/DataStorageSection.tsx)
- Compact panel: "Saved on this device · Manage data".
- Actions: Sync to Cloud / Save to Cloud Account, Export Backup (JSON), Restore Backup (file upload), Reset All Data (with confirmation).

#### [MODIFY] [DashboardView.tsx](file:///c:/L3mxr/Github%20Repositories/CSEReviewerPH/src/features/dashboard/DashboardView.tsx)
- Recompose into Direction B (2-column desktop: 2/3 study column, 1/3 personal context column; 1-column mobile stack).
- Greeting: "Welcome back, {name}" or "Your study space" for guests + exam level badge.
- Truthful stat tiles: Practice accuracy ("Not measured yet" when 0 tests), Tests completed, Study streak (pluralized), Items answered.
- Wire in the new subcomponents.

---

### Shared Navigation (`src/components/layout`)

#### [MODIFY] [Header.tsx](file:///c:/L3mxr/Github%20Repositories/CSEReviewerPH/src/components/layout/Header.tsx)
- **Fix D02**: Recompose on mobile (`< md`):
  - Retain brand logo and UserNav.
  - Add accessible mobile menu toggle button (`aria-label="Toggle navigation menu"`, `aria-expanded={isOpen}`).
  - Provide collapsible mobile menu drawer containing Practice, Study Guides, How It Works, FAQ, and Dashboard links.
  - Eliminates all horizontal scrolling at 390px.
- **Fix D06**: Style "Dashboard" link as subtle navigation active state (`text-brand-800 bg-brand-50 border border-brand-200/80 font-semibold`) with `aria-current="page"` when on `/dashboard`, reserving filled buttons for primary study actions.

---

## Verification Plan

### Automated Tests
1. **Unit Tests**:
   - `npx vitest run tests/unit/dashboard/recommendation-engine.test.ts`
   - `npx vitest run tests/unit/dashboard/dashboard.test.tsx` (updated for truthful empty states, accessible labels, new copy)
   - `npx vitest run tests/unit/dashboard/ExamCalendarCard.test.tsx` (new test suite for calendar, accessibility, preset vs custom date, save/cancel)
   - `npx vitest run tests/unit/dashboard/PracticeActivityGrid.test.tsx` (new test suite for activity grid, check-ins vs study, streak pluralization)
   - `npx vitest run tests/unit/components/home-components.test.tsx` (verify header & navigation tests pass)
2. **Full Verification Suite**:
   - `npm run verify` (`npm run typecheck && npm run lint && npm run check:architecture && npm run test && npm run build`)
3. **End-to-End Tests**:
   - `npx playwright test tests/e2e/exam-flow.spec.ts`

### Manual & Browser Verification
- Use `browser_subagent` to load `http://localhost:3000/dashboard`:
  - **Desktop (1440px)**:
    - Verify 2-column layout (Today action, Activity grid, Subject progress, Recent sessions on left; Your exam calendar, Goal gauge, Data storage on right).
    - Verify truthful "Not measured yet" for new guest.
    - Open "Change date" editor, verify accessible labels in DOM accessibility tree, change date, verify mini calendar updates and days remaining calculates accurately.
    - Cancel edit, verify original values preserved and focus restored.
  - **Mobile (390px)**:
    - Verify zero horizontal scrolling (`document.documentElement.scrollWidth <= 390`).
    - Open mobile navigation menu, verify all links visible and accessible.
    - Verify clean vertical stacking of the dashboard.

---

# Settings recommendations guide — 2026-09-13

## Interpretation
Prepare an implementation-ready recommendations guide for the settings area and related site pages. This turn delivers documentation, not settings UI or account mutations. Preserve the active dashboard implementation plan above and all ongoing application changes.

## Deliverable
Create docs/settings-recommendations.md covering information architecture, routes, setting options/defaults/scope, guest and account behavior, persistence, save/error states, accessibility, privacy/data controls, appearance/text/layout, study preferences, reminders, support/about, phased rollout, and acceptance criteria.

## Verification Plan
- Inspect current routes, account menu, consent controls, storage models, and design audit; distinguish existing functions from proposed capabilities.
- Consult current first-party accessibility/browser guidance for recommendations that depend on platform behavior.
- Run npm run verify; record actual exit status and tests in a task-specific walkthrough section. No new application logic or tests for this documentation-only change.
- No new product UI exists to click through; prior dashboard browser evidence is contextual, not verification of settings functionality. Future settings implementation must include browser checks and navigation E2E coverage.

## Privacy and product constraints
No new data collection now. Proposed reminders/time-zone/profile/sync settings must declare their scope and supporting capabilities. Retain guest access, export/deletion, separate optional analytics/ad consent, and fixed Full Test rules. Do not imply UI language controls translate exam questions or simulate official scoring differently.
