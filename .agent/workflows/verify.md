# /verify

Run a full verification pass on the current state of the repo, independent of any specific feature work. Use this after a batch of manual edits, before ending a session, or whenever asked to "make sure everything still works."

## Steps

1. Run `npm run verify` (typecheck, lint, architecture check, unit/integration tests, build). Report the actual output, not a summary that omits failures.
2. If it passes, run `npm run test:e2e` for the exam-taking flow (topic practice, quick test, full test with timer, submission, results) since this is the highest-risk regression surface.
3. If anything fails, do not attempt to silently patch it into passing (no deleting tests, no loosening assertions — see `skills/testing/SKILL.md`). Report the failure clearly and propose a fix as a normal planned task.
4. Produce a walkthrough summarizing: what was checked, pass/fail per category, and any warnings (e.g., type errors that are suppressed, TODOs left in code, console warnings during e2e runs).
5. Do not modify unrelated code while running this workflow — it's a check, not a refactor pass. If you notice something worth fixing, note it rather than fixing it inline, unless asked to fix issues found.
