# SKILL: Database Conventions

## Migrations

- All schema changes go through Drizzle migration files, generated via the project's migration command and committed to `src/db/migrations/`.
- Never hand-edit a generated migration file after it's been applied to any shared environment (dev/staging/prod). If a migration needs to change, write a new one.
- Never modify a live database schema outside of a migration, including "quick fixes" via a DB console.

## Naming

```text
Tables         snake_case, plural (e.g. exam_levels, user_answers)
Columns        snake_case
Enums          defined in schema, not as free-text strings with app-level validation only
Foreign keys   <singular_referenced_table>_id (e.g. exam_level_id)
```

## Core Entity Relationships (see skills/exam-engine/SKILL.md for the conceptual model)

```text
exams (1) ──< exam_levels (1) ──< subjects (1) ──< topics (1) ──< questions
questions (1) ──< choices
exam_levels (1) ──< exam_rules
users (1) ──< test_attempts ──< user_answers
users (1) ──< bookmarks, user_progress
questions (1) ──< question_reports
```

## Data Integrity Rules

- Foreign keys are enforced at the database level, not just checked in application code.
- Never delete a `Published` or `Archived` question row — status transitions only. Physical deletion is reserved for true mistakes still in `Draft`.
- Test/seed data must be clearly distinguishable from real content (see `skills/content-authoring/SKILL.md`) — use a dedicated `is_seed_data` boolean or a separate schema/environment, never mixed silently into what looks like production data.

## Testing Against the Database

- Integration tests run against a real (containerized or test-schema) Postgres instance, not a mocked ORM layer — mocking the ORM hides real query bugs.
- Each test run should start from a known seeded state and clean up after itself; tests must not depend on execution order or leftover state from a previous run.
