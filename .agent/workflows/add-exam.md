# /add-exam

Use only once CSE is mature and a second exam (e.g. LET) is actually being added — per `/docs/product-plan.md` §33/§45, this should be almost entirely data and configuration, not engine changes.

## Steps

1. Confirm this is intentional and CSE is in a stable state (`npm run verify` and e2e both green on main) before starting — this workflow assumes the engine is trustworthy and only content/config is being added.
2. Create the new Exam + ExamLevel(s) + Subjects + Topics as data (seed/migration), not new code paths.
3. Define ExamRules (item count, time limit as one continuous allotment, subject distribution, passing score) for each level.
4. If the new exam needs a genuinely new capability the engine doesn't support (e.g. a question type the generic model can't express), stop and flag this as an engine change requiring its own `/new-feature` plan — do not bolt on an exam-specific special case inside existing engine code.
5. Add questions via `/new-questions`, respecting the same authoring/review rules.
6. Verify: run the full exam-taking flow for the new exam through e2e tests, confirming the *existing* CSE flow is unaffected (regression check is mandatory here, not optional).
7. Walkthrough should explicitly state whether any engine code was touched, and why, if so.
