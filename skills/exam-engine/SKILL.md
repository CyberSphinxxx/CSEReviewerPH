# SKILL: Generic Exam Engine

The core principle: **adding a new exam should mean adding content and configuration, never modifying engine code.** Before writing any engine-level code, ask: "would this survive adding a second exam (e.g. LET)?" If not, redesign before implementing.

## Data Model (do not deviate without updating this file)

```text
Exam
└── ExamLevel (e.g. Professional, Subprofessional)
    ├── Subject (e.g. Verbal Ability)
    │   └── Topic (e.g. Grammar)
    │       └── Question
    ├── ExamRules (item count, time limit, subject distribution, passing score)
    └── ScoringRules
```

Every question belongs to exactly one Topic, which belongs to exactly one Subject, which belongs to exactly one ExamLevel. Subject/topic weighting for test generation is configuration data attached to the ExamLevel/ExamRules, never a hardcoded percentage in a function.

## Engine Responsibilities (generic — must not branch on exam identity)

```text
Exam configuration loading
Question selection (respecting distribution rules + exposure history)
Question ordering
Answer state management
Timer (single countdown per ExamRules.timeLimitMinutes — see §5 below)
Navigation (previous/next, jump, flag)
Submission
Scoring (per ScoringRules)
Results generation
```

If you find yourself writing `if (exam.slug === 'cse')` or similar inside engine code, stop — that logic belongs in the exam's configuration data (seeded in the database), not in code.

## Test Modes

```text
Quick Test    5–10 items, randomized, immediate results, short/no timer
Medium Test   20–50 items, single subject or mixed, configurable timer
Full Test     ExamRules.itemCount items, ExamRules.timeLimitMinutes as ONE
              continuous countdown, free navigation across all items/subjects,
              flagging, review-before-submit, auto-submit on timeout
```

**Full Test must never gate navigation by section or run separate per-section timers.** The real CSE-PPT gives one time allotment for the entire paper; examinees choose how to allocate their own time. Building a section-gated timer misrepresents the actual exam and must not be "improved" into one even if it seems more structured.

## Question Exposure & Selection

Track which questions a given user has recently seen (via `UserAnswer`/`TestAttempt` history) and bias selection away from immediate repeats, without making this exam-specific — it's a property of the selection algorithm, driven by exposure data, not a CSE rule.

## Difficulty

Every question has a difficulty: `Easy | Medium | Hard | Very Hard`. Test generation can request either a percentage mix (`20% Easy / 60% Medium / 20% Hard`) or fixed counts — both should be supported by the same underlying selection function, parameterized by ExamRules, not two separate code paths per exam.
