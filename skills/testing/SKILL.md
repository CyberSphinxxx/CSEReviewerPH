# SKILL: Testing & Verification Loop

Use this skill for every task that changes application behavior — which is nearly every task.

## The Loop

```text
1. Write or update the test FIRST (or alongside the implementation, never after "it looks done")
2. Implement the change
3. Run the relevant test file directly (fast feedback)
4. Run `npm run verify` (full gate: typecheck, lint, unit/integration, build)
5. If anything fails: fix it, go back to step 3. Do not skip a failing check.
6. Only after a clean `npm run verify`: run e2e/browser checks if the change is user-facing
7. Write the walkthrough with the actual pass/fail results — not "should work"
```

Never report a task as complete based on the code "looking correct." The loop above is the only acceptable evidence of correctness.

## What Needs Which Kind of Test

```text
Change type                          Required tests
────────────────────────────────────────────────────────────
Scoring logic                        Unit tests with known inputs/expected scores,
                                      including edge cases (all correct, all wrong,
                                      unanswered items, negative-marking off)
Question selection / randomization   Unit tests verifying distribution rules are
                                      respected (e.g. subject-weighted selection,
                                      no immediate repeat of recently-seen questions)
Timer                                Unit tests for countdown/expiry logic +
                                      an e2e test confirming auto-submit on timeout
Exam navigation (flagging, jump)     e2e test clicking through the actual flow
Auth / account changes               Integration test hitting the real auth flow,
                                      not a mocked stand-in for the whole path
API routes                           Integration test against a real (test) database,
                                      not just a mocked ORM
UI-only change (copy, styling)       Browser check is often sufficient; add a unit
                                      test if the change involves conditional logic
```

## Test Data

- Use a seeded test database, not the dev database, for integration/e2e tests.
- Never write a test that depends on real scraped/copied question content — use clearly-fake placeholder questions in test fixtures (e.g., "Sample Question 1") so there's no ambiguity about test data vs. real content.

## When `npm run verify` Fails and You Can't Fix It

Say so plainly in the walkthrough: what failed, the actual error, and what you tried. Do not:
- Delete or skip the failing test to make the suite pass
- Loosen an assertion just to get a green check
- Mark the task done anyway "since it's probably fine"

A failing check reported honestly is more valuable than a false "all tests pass."
