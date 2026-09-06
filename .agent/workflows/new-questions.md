# /new-questions

Use when asked to add exam questions to the bank. Always defers to `skills/content-authoring/SKILL.md` — read it before starting if it's not already fresh in context.

## Steps

1. Confirm target: which Exam, ExamLevel, Subject, Topic, difficulty mix, and count is being requested. If unspecified, propose a reasonable batch (e.g., 10 questions for one named topic) rather than guessing across the whole subject.
2. Author each question from scratch against the official CSC subtest/topic description — never referencing a specific third-party reviewer's items or phrasing.
3. Every question gets full metadata per the content-authoring skill (language tag, difficulty, tags, explanation that teaches the concept, author of record).
4. Set status to `Draft`. Do **not** self-approve to `Approved`/`Published` — flag clearly in the walkthrough that these need independent human review before publication, per the two-person rule.
5. If this is seed/test data rather than real content, mark it explicitly (`isSeedData: true` or a `[SEED-PLACEHOLDER]` prefix) and keep it out of `Published` status regardless of instructions to the contrary — surface the conflict instead of silently publishing seed data.
6. Run any applicable content-linting (schema validation, duplicate-detection against existing questions) as part of verification, alongside the normal `npm run verify`.
7. Walkthrough should list each question added (ID + short summary) and its status, plus a note that they're pending human review.
