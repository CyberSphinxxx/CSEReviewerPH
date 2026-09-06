# Philippine Exam Reviewer Platform
## Plan Addendum — Sections 47–58

*This document extends the original Product Plan & Development Guidelines. It's meant to be read as a continuation of section 46, filling gaps in content/legal strategy, business positioning, exam fidelity, and technical execution that the original architecture-focused plan didn't cover.*

---

# 47. Content Sourcing, Originality & IP Risk

This is the single biggest unaddressed risk in the original plan.

Most "free CSE reviewer" material circulating online (blog PDFs, Scribd uploads, Facebook group shares) is:

- Of unclear original authorship
- Copied and re-copied between sites for years
- Often marked "free for all" by the person sharing it, which is **not the same as a license to redistribute commercially**
- Frequently inconsistent in answer accuracy (several of the reviewer PDFs found during research had garbled explanations, mismatched answer keys, or outdated civic-info answers e.g. naming a president who is no longer in office)

Building a monetized (ad-supported) product on top of lightly reworded versions of this material creates real exposure:

```text
Legal risk       → copyright claims from original authors/compilers
Reputational risk → getting called out publicly as "just copied X's reviewer"
Quality risk      → inheriting other people's uncaught errors
```

### Required practice

- **Original authoring only.** Existing reviewers can inform *topic coverage and difficulty calibration* — never be copied, closely paraphrased, or restructured question-by-question.
- **Subject-matter experts write questions from scratch**, referencing the *official* CSC-published scope (subtests, topic list) rather than a third party's reviewer.
- **A written content-ownership policy**: every question in the bank has a known author of record, and the platform holds rights to it (via employment/contractor agreement, not implied license).
- **A plagiarism/similarity check** as a formal QA gate before any question moves to "Approved" status — not just "is this correct" but "did we actually write this."

---

# 48. Philippine Data Privacy Act (RA 10173) Compliance

The original plan's "Legal and Trust" section (§41) covers content honesty but says nothing about data privacy law, despite the platform collecting accounts, quiz history, and (per §35) running Google Analytics and AdSense.

Once real user accounts exist, the platform is a **Personal Information Controller** under RA 10173. Minimum requirements:

- **Privacy Notice** disclosing what's collected (email, quiz history, device/analytics data) and why
- **Consent mechanism** for analytics and ad personalization (cookie/consent banner before AdSense loads)
- **NPC registration** — required once processing crosses certain volume/sensitivity thresholds (check current NPC circulars at build time; this changes)
- **Data retention & deletion policy** — how long is quiz history kept, and can a user request deletion
- **Breach notification procedure** — NPC and affected users must be notified within statutory timeframes if a breach occurs
- **Data Protection Officer** designation, even informally, once the platform has meaningful user volume

This should be a Phase 1 checklist item, not something bolted on before a Phase 6 monetization launch — retrofitting consent flows onto an existing user base is much more painful than building it in from day one.

---

# 49. Question Authoring & QA Workflow

The plan defines question *statuses* (§8: Draft → Review → Approved → Published → Archived) but not the *people and process* behind those transitions.

```text
Role                  Responsibility
─────────────────────────────────────────────
Content Lead           Owns style guide, difficulty calibration, coverage map
Subject-Matter Writer   Authors questions for one subject area (Verbal, Numerical, etc.)
Independent Reviewer    Reviews a different writer's questions — never self-reviewed
QA/Editor               Checks explanation clarity, tags, difficulty, formatting
```

Concrete rules:

- No question reaches "Approved" without review by someone other than its author.
- A written **style guide** covering: tone, explanation format (must teach the concept, not just state the answer), difficulty definitions with concrete examples per level, and formatting conventions.
- Track a **coverage map** against the official CSC subtest breakdown so you can see gaps (e.g., "we have 40 Vocabulary questions but only 3 on Paragraph Organization") rather than discovering imbalance after launch.
- Target sustainable weekly output (e.g., 50–100 reviewed questions/week) over large one-time content dumps — a slow, correct pipeline beats a fast, error-prone one given §40's own "quality over quantity" principle.

---

# 50. Exam Fidelity — Verified Details

I checked the actual CSE-PPT Professional format to make sure the "Full Test" mode (§5, §13) matches reality:

```text
Professional Level
├── 170 items
├── 3 hours 10 minutes — ONE continuous timer for the entire paper
│   (not per-section limits — examinees allocate their own time across subtests)
├── Subtests: Verbal Ability (English AND Filipino), Numerical Ability,
│   Analytical Ability, General Information
└── Passing: general rating ≥ 80.00

Subprofessional Level
├── 165 items
├── 2 hours 40 minutes — same single-timer model
└── Subtests: Verbal Ability, Numerical Ability, Clerical Ability, General Information
```

Implications for the build:

1. **The Full Test timer must be one countdown for the whole exam**, with free navigation across all sections/items — not a per-section gate. A section-gated timer would misrepresent the actual test-taking experience and undermine the "simulate the real exam" value proposition.
2. **Verbal Ability needs a language tag** on questions (English / Filipino) since the real exam tests both — the question schema in §7 should add a `language` field.
3. **Be careful with "80% = passing" framing.** CSC's "general rating" isn't confirmed to be a simple raw percentage of items correct — the exact scoring/weighting formula isn't fully published by CSC. The platform should say clearly that its score is "an estimate based on percentage correct" rather than implying it replicates CSC's official rating formula exactly. This is a trust issue as much as an accuracy one.

---

# 51. Competitive Landscape

The original plan has no competitive analysis. Worth knowing before scoping v1 — several sites already offer free diagnostics plus paid full mocks in this exact space (e.g. sites branded around "CSE reviewer," "mock exam," and "reviewer for all," some charging in the ₱99–199 range for full-length mocks with per-subject analytics). Positioning should be explicit about what's different, e.g.:

- Better production quality / UX than blog-style reviewer sites
- Transparent, original content with visible authorship (addresses §47's trust gap directly)
- A real progress/mistake-bank loop (§16) rather than a one-shot quiz
- No forced signup to try the product (§18)

Write this down as a one-paragraph positioning statement before development starts — it will quietly shape a lot of feature-priority decisions.

---

# 52. Target Users

Useful to name explicitly since they have different needs:

```text
First-time takers (recent grads)     → need structured learning path, not just quizzes
Repeat takers (didn't pass before)   → need weak-area diagnosis and mistake bank fast
Working professionals                → mobile-first, short daily sessions, commute-friendly
Overseas/remote reviewers            → need it to work reliably on slow connections
```

The Quick Test mode (§5) and mobile-first requirement (§28) map well to the working-professional segment — worth confirming that's actually the priority segment before optimizing for it.

---

# 53. Success Metrics (Missing from the Original Plan)

§39 lists analytics to *collect* but never defines what "working" looks like. Suggested early KPIs:

```text
Activation      % of new visitors who complete one Quick Test
Retention       % returning within 7 days / 30 days
Depth           Avg. questions answered per active user per week
Mock completion % of started Full Tests that are finished (not abandoned)
Quality signal  Question-report rate per 1,000 attempts (lower = better content)
Conversion      % of active users upgrading to premium (once §54 exists)
```

---

# 54. Premium Tier — A Concrete Starting Point

§31 lists premium *feature ideas* with no structure. A starting hypothesis to validate rather than a final answer:

```text
Free
├── Unlimited Topic Practice and Quick Tests
├── Limited Full Mock Exams per month (e.g. 2)
└── Ads on non-exam pages only

Premium (~₱99–199/month, or a flat fee for an exam-cycle window e.g. ₱299/3 months)
├── Unlimited Full Mock Exams with fresh question sets
├── Ad-free
├── Advanced analytics (topic trends over time, predicted readiness)
├── Downloadable PDF export of a personalized reviewer
└── Priority handling of question reports
```

The exam-cycle pricing model (charging around the March/August CSC schedule) may convert better than a pure monthly subscription, since most users only need the product intensively for a few months.

---

# 55. Technical Execution Gaps

§34–35 name a stack but skip execution practices that are cheap to plan early and expensive to retrofit:

```text
Testing         Unit tests for scoring/selection logic; e2e tests (Playwright)
                for the exam-taking flow specifically — this is the part that
                cannot silently break
CI/CD           Automated test run + preview deploy on every PR (GitHub Actions
                pairs naturally with Vercel)
Error tracking  Sentry or equivalent from day one — exam-session bugs
                (lost answers, timer desync) are exactly the kind of thing
                that's invisible without monitoring
Backups         Automated Postgres backups + a documented restore drill,
                not just "the host probably backs it up"
Environments    Separate staging and production before the first real user
                accounts exist
Load planning   CSE exam season (Feb–Mar, Jul–Aug) will spike traffic —
                load-test before those windows once the platform has traction
```

---

# 56. Localization (English / Filipino)

Following from §50: the real exam's Verbal Ability section tests both English and Filipino. The plan's content model should support this from the start rather than as a later retrofit:

- `language` field on questions (already noted in §50)
- General Information explanations may also warrant bilingual phrasing for accessibility, since not everyone studying for CSE is equally comfortable in academic English
- This is a content-tagging decision now, not a full i18n framework — no need to over-build this into a full UI localization system for v1

---

# 57. MVP Discipline — What NOT to Over-Build Yet

The original plan is right to design the generic **data model** (Exam/Level/Subject/Topic/Question) from day one — that part is cheap and prevents painful migrations later.

Where it risks over-engineering: the fully generic **exam-rules engine** (§11, "the core engine should not care whether it's CSE or LET") is more valuable to build in full *after* a second real exam is actually greenlit. Building extensive configuration flexibility for exams that don't exist yet, before CSE has any users, is speculative engineering cost that delays launch without validating anything.

Practical middle ground:

```text
Now:    Generic data model (Exam → Level → Subject → Topic → Question)
Now:    Simple, slightly CSE-shaped test-taking logic — fine if it has a
        few CSE assumptions baked in, as long as they live in one place
Later:  Once exam #2 is actually committed to, extract the genuinely
        shared logic into the fully generic rules engine described in §11
```

This keeps the spirit of §44/§45 ("build a generic engine, populate with CSE first") while avoiding paying the full abstraction cost before it's proven necessary.

---

# 58. Priority Checklist Before Writing Code

In rough order of how expensive each is to fix later:

```text
1. Decide the content authoring model (§47) — hardest to undo once questions exist
2. Draft a Data Privacy Act compliance checklist (§48) — cheap now, painful retrofit later
3. Confirm exam-fidelity details with official CSC sources at build time (§50) —
   the CSC scope/timing can shift between administrations
4. Write a one-paragraph competitive positioning statement (§51)
5. Pick an MVP engine scope that resists premature generalization (§57)
6. Set up CI + error monitoring before the first real user, not after an incident (§55)
7. Everything else in the original plan (§1–46) can proceed largely as written
```