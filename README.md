# 🇵🇭 CSEReviewerPH — Philippine Civil Service Exam Reviewer Platform

> A modern, high-fidelity exam preparation platform built specifically for Filipino civil service aspirants. Designed with a modular, extensible engine capable of powering future Philippine licensure and professional exams (LET, Nursing, NAPOLCOM, BFP).

[![Verification Suite](https://img.shields.io/badge/verify-passing-emerald.svg)](#verification--quality-gates)
[![Next.js](https://img.shields.io/badge/Next.js-15_(App_Router)-black.svg)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-336791.svg)](https://www.postgresql.org/)
[![Drizzle ORM](https://img.shields.io/badge/ORM-Drizzle-C5F74F.svg)](https://orm.drizzle.team/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3-38B2AC.svg)](https://tailwindcss.com/)

---

## 📌 Overview

**CSEReviewerPH** provides Filipino examinees with a realistic, high-fidelity practice environment modeled directly after the **Civil Service Examination - Pen and Paper Test (CSE-PPT)** administered by the Civil Service Commission (CSC). 

Unlike generic quiz platforms, CSEReviewerPH mirrors actual Philippine exam constraints:
- **Continuous Timer Format:** Real CSE tests do not divide time per-section. The Full Mock Exam gives examinees a single continuous timer (3h 10m for Professional, 2h 40m for Subprofessional).
- **Official Subtest Exclusivity:** Properly partitions subtests—**Analytical Ability** is exclusive to Professional, while **Clerical Ability** is exclusive to Subprofessional.
- **Diagnostic Feedback & Recommendations:** Detailed breakdowns by subject and topic with rationale, explanations, and personalized next-step practice recommendations.
- **Mistake Bank & Bookmarks:** Automatically saves incorrectly answered items to personal study queues for targeted drills.
- **Data Privacy Act (RA 10173) Compliant:** User consent-first architecture with self-hostable telemetry support and clear data rights.

---

## 🏛️ Architecture & Philosophy

The platform is designed around **clean domain-driven separation**:

```text
src/
├── app/                      # Next.js 15 App Router
│   ├── (public)/             # SEO landing pages, guides, FAQs, exam specs
│   ├── (app)/                # Interactive exam runner, dashboard, mistake bank
│   └── api/                  # Route handlers (auth, telemetry, export)
├── features/
│   ├── exam-engine/          # Generic engine: selector, timer, scoring, state machine
│   ├── practice/             # Exam runner UI, topic drill views, question palette
│   ├── results/              # Score breakdown, analytics, explanation review
│   └── dashboard/            # Progress charts, readiness radar, mistake bank
├── db/
│   ├── schema/               # Drizzle schema definitions (multi-level exam entities)
│   └── migrations/           # Automated SQL migration history
└── lib/                      # Auth, telemetry, utilities
```

### 🔒 Zero-Branching Engine Principle
Engine code inside `src/features/exam-engine/` has **strictly zero hardcoded exam slugs** (`if (exam === 'CSE')`). All rules, subject distributions, time allotments, and scoring thresholds are injected dynamically via generic exam configuration models. This guarantees future Philippine exams can be onboarded solely by adding content configuration without rewriting the core engine.

An automated architecture check (`npm run check:architecture`) enforces this rule in CI.

---

## 📚 Civil Service Exam Coverage

| Exam Level | Total Items | Time Allotment | Subtests Included | Passing Benchmark |
| :--- | :---: | :---: | :--- | :---: |
| **Professional** | 170 items | 3 hours 10 mins (190m) | • Verbal Ability (English & Filipino)<br>• Numerical Ability<br>• **Analytical Ability**<br>• General Information | 80.00% |
| **Subprofessional** | 165 items | 2 hours 40 mins (160m) | • Verbal Ability (English & Filipino)<br>• Numerical Ability<br>• **Clerical Ability**<br>• General Information | 80.00% |

### Practice Modes
- ⚡ **Quick Test:** 10 items / 10 minutes — Rapid diagnostic session with immediate explanations.
- 🎯 **Medium Test:** 30 items / 30 minutes — Balanced cross-section across all active subtests.
- 🏆 **Full Mock Exam:** 170 items (Pro) / 165 items (Subpro) with continuous countdown timer and timeout auto-submit.
- 📖 **Topic Practice:** Drill specific focus areas (e.g., *Philippine Constitution*, *Number Series*, *Spelling & Idioms*).

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [Next.js 15 (App Router)](https://nextjs.org/) + React 19 | Server & client rendering, streaming UI, API routes |
| **Language** | [TypeScript 5.7](https://www.typescriptlang.org/) | End-to-end static typing |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) | Clean design system & mobile-responsive layouts |
| **Database** | [PostgreSQL 16+](https://www.postgresql.org/) | Relational database engine |
| **ORM** | [Drizzle ORM](https://orm.drizzle.team/) + `drizzle-kit` | Type-safe migrations and relational queries |
| **In-Memory Postgres**| [`@electric-sql/pglite`](https://pglite.electric-sql.com/) | Real C-compiled Postgres WASM engine for fast, reproducible integration tests |
| **Unit Testing** | [Vitest](https://vitest.dev/) + React Testing Library | Fast unit and component testing |
| **E2E Testing** | [Playwright](https://playwright.dev/) | End-to-end browser flows (timer, navigation, auto-submit) |
| **Code Quality** | ESLint 9 + Prettier + Husky | Strict linting, formatting, and pre-commit hooks |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ (LTS recommended)
- npm 10+
- PostgreSQL instance (optional for local testing; integration tests run on PGlite WASM)

### 1. Clone & Install
```bash
git clone https://github.com/CyberSphinxxx/CSEReviewerPH.git
cd CSEReviewerPH
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Populate the database credentials in `.env.local`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/csereviewer"
BETTER_AUTH_SECRET="your-development-secret-key-min-32-chars"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Run Database Migrations & Seeds
```bash
# Apply migrations
npm run db:migrate

# Seed exam levels, subjects, topics, and initial draft question bank
npm run db:seed
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Verification & Quality Gates

This repository enforces strict code quality and behavioral contracts. Every change must pass the non-negotiable verification pipeline:

```bash
npm run verify
```

`npm run verify` executes:
1. `npm run typecheck` — Static TypeScript verification (`tsc --noEmit`).
2. `npm run lint` — ESLint rules with zero tolerance for warnings/errors.
3. `npm run check:architecture` — AST/regex scanner ensuring `src/features/exam-engine/` stays exam-agnostic.
4. `npm run test` — Vitest unit tests & real PostgreSQL integration tests.
5. `npm run build` — Next.js production build compiler.

### Running End-to-End Tests
```bash
npm run test:e2e
```
Runs Playwright automated browser test scenarios:
- Complete test runner navigation (Next, Prev, Question Palette jump).
- Question bookmarking and review flags.
- **Timer auto-submission:** Confirms that when the timer expires, the test automatically finalizes, computes score breakdowns, and redirects to results without user input.
- Score transparency and CSC official rating notice rendering.

---

## ⚖️ Legal & CSC Disclaimer

**CSEReviewerPH is an independent, non-affiliated educational study platform.** 

It is **not** endorsed by, associated with, or affiliated with the **Civil Service Commission (CSC)** of the Philippines or any Philippine government agency. All practice materials, diagnostic questions, and explanations are original educational content authored for review and preparation purposes. 

Calculated scores represent diagnostic raw percentages for study guidance and do not guarantee or represent an official CSC rating or Certificate of Eligibility.

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
