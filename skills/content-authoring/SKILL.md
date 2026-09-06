# SKILL: Question Content Authoring

This skill exists because of a specific, real risk: most freely-circulating CSE reviewer material online is of unclear provenance and has been copied between sites for years. Building this platform on scraped or paraphrased versions of that material creates legal and reputational exposure, and inherits other people's uncaught errors. See `/docs/product-plan-addendum.md` §47.

## Absolute Rule

**Never generate exam question content by referencing, paraphrasing, or restructuring specific third-party reviewer material** (blog reviewer PDFs, Scribd docs, Facebook group posts, other CSE prep sites). This applies even if asked to "look at examples" for style — describe the *category* of question (e.g., "an analogy question testing part-to-whole relationships") rather than reproducing or closely mirroring any specific existing item.

It is fine, and expected, to know the general shape of CSE question types (grammar correction, vocabulary-in-context, number series, analogy, reading comprehension, Constitution/RA 6713 facts) from general knowledge of the exam format — that's coverage information, not copied content. The line is: **write the specific question, choices, and explanation from scratch.**

## Question Authoring Workflow

```text
1. Author writes the question against the official CSC-published subtest/topic
   list (not a third-party reviewer's structure)
2. Question enters status: Draft
3. An independent reviewer (a different person or a separate review pass —
   never self-approval) checks: correctness, clarity, distractor quality,
   difficulty label accuracy, explanation quality
4. Status: Under Review → Approved → Published
5. If flagged by a user report, status can move to Under Review again,
   never silently edited-and-left-Published without re-review
```

If asked to bulk-generate placeholder/seed questions for development or testing purposes (not for real publication), clearly mark them, e.g. `[SEED-PLACEHOLDER]` in the question text or a `isSeedData: true` field, and never let seed data reach `Published` status.

## Explanation Quality Bar

An explanation must teach the underlying concept, not just restate the correct choice. Compare:

```text
Bad:  "The answer is C."
Good: "The answer is C. 'Ambivalent' means having mixed or contradictory
       feelings — the sentence describes uncertainty about the answers,
       which matches 'uncertain' more precisely than 'confusion' (a state,
       not a feeling toward something specific)."
```

## Metadata Every Question Needs

```text
Exam, ExamLevel, Subject, Topic, Subtopic (optional)
Question text, Choices, Correct answer
Explanation
Difficulty (Easy/Medium/Hard/Very Hard)
Language (en / fil) — CSE Verbal Ability tests both English and Filipino
Tags
Status (Draft/Under Review/Approved/Published/Archived)
Author of record
Created/Updated timestamps
```

## Current-Events Content

Questions referencing current events (officials, recent laws, ongoing programs) additionally need `relevantDate`, `publicationDate`, and `expirationDate` fields, and should move to `Archived` (not stay `Published`) once no longer accurate — a stale "who is the current X" question actively teaches wrong information.
