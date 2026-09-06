# /new-feature

Use for any request that adds or changes user-facing behavior. This is a reinforcement of the default AGENTS.md process, invoked explicitly when you want to be sure all three phases happen deliberately rather than being rushed.

## Steps

1. **Understand**: Re-read the relevant section(s) of `/docs/product-plan.md` and `/docs/product-plan-addendum.md` for this feature area before planning. Check `skills/exam-engine/SKILL.md` if the feature touches test-taking, scoring, or question selection.
2. **Plan**: Produce `implementation_plan.md` with:
   - What will change, file by file
   - Which existing patterns/components will be reused vs. newly created
   - A Verification Plan: specific automated tests to add, and the manual/browser check that proves it works
   - Anything from AGENTS.md §3 (Hard Constraints) that's relevant to flag explicitly
3. **Build**: Implement following the folder structure in AGENTS.md §5, writing tests alongside code per `skills/testing/SKILL.md`.
4. **Verify**: Run `npm run verify`. For UI changes, use the browser tool to actually exercise the feature. Do not proceed to walkthrough on a failing check.
5. **Report**: Walkthrough with the Definition of Done checklist from AGENTS.md §4, each line marked true/false based on what actually happened.
