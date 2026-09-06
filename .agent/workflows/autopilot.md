# /autopilot

Run the full MVP build (Phases 0–3 of `/docs/product-plan.md`) end to end, continuously, with minimal interruption. This is the workflow for a long unattended session — invoke it once and keep working until the MVP is complete and verified, or everything remaining is genuinely blocked.

Governed by AGENTS.md §9 (Autonomous Operation) throughout: do not stop between the steps below to ask for confirmation.

## If PROGRESS.md already exists

Read it first. Continue from the first item not marked done/verified. Do not redo completed, verified work.

## Otherwise, start here

### Phase 0 — Bootstrap
Follow AGENTS.md §4a exactly: scaffold Next.js/TypeScript/Tailwind/shadcn/ui if not present, install the full dependency set (Drizzle + pg, Better Auth, Vitest + React Testing Library, Playwright, ESLint + Prettier, Husky + lint-staged, PostHog, Sentry), write the package.json scripts yourself, set up the pre-commit hook, create `.env.example`, add `scripts/check-architecture.mjs`, init git, and create `PROGRESS.md`. Run `npm run verify` once bootstrap is done to confirm the baseline is healthy before building anything.

### Phase 1 — Foundation
Generic `Exam / ExamLevel / Subject / Topic / Question` schema and migrations per `skills/exam-engine/SKILL.md` and `skills/database/SKILL.md`. Tests for schema constraints (required fields, foreign keys, cascade behavior on archive vs. delete). `npm run verify` before moving on.

### Phase 2 — CSE Implementation
In order, verifying after each:
1. Seed CSE Professional and Subprofessional as data (levels, subjects, topics) per `docs/product-plan.md` §3.
2. Topic Practice flow.
3. Quick Test (5–10 items, short/no timer, immediate results).
4. Medium Test (20–50 items, configurable timer).
5. Full Test — single continuous timer matching real CSE-PPT allotments (170 items/3h10m Professional, 165 items/2h40m Subprofessional), free navigation, flagging, review-before-submit, auto-submit on timeout. This is the highest-risk piece — give it real e2e coverage, not just unit tests.
6. Scoring, results page with per-subject breakdown, answer explanations.
7. Seed ~15–20 questions clearly marked as placeholder/seed data (`isSeedData: true`) per `skills/content-authoring/SKILL.md` so every flow above is actually exercised end to end. These must never reach `Published` status.

### Phase 3 — User Experience
Dashboard, test history, progress tracking, mistake bank, bookmarks, per `docs/product-plan.md` §16–20. `npm run verify` + relevant e2e after each.

### Throughout
- Update `PROGRESS.md` after every completed unit of work.
- On a failure that survives 3 fix attempts: log it under `## Blocked` in `PROGRESS.md`, move to the next task that doesn't depend on it, keep going.
- On hitting a genuinely missing credential: log it under `## Needs Human` with exactly what's needed and why, substitute a local/dev-safe alternative where one exists (e.g. a local Postgres instance instead of a hosted one) so you can keep moving, and continue with everything else.

## Stop condition

Stop only when Phases 0–3 are complete and `npm run verify` (plus e2e for the exam-taking flow) passes, or when every remaining item is logged under `## Needs Human`. Either way, finish by writing a clear final summary at the top of `PROGRESS.md`.
