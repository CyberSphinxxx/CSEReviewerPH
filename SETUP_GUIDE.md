# Setup Guide — Autonomous Antigravity Build

This is set up for minimal interaction: one drop-in, one prompt, then Antigravity works unattended through bootstrap and the full MVP build, checking its own work as it goes.

## 1. Drop the files in (one time, ~10 seconds)

Unzip `antigravity-agent-setup.zip` directly into an empty project folder. It contains:

```text
your-repo/
├── AGENTS.md                          ← standing instructions, read automatically
├── scripts/
│   └── check-architecture.mjs         ← automated check, no human review needed
├── .agent/workflows/
│   ├── autopilot.md                   ← /autopilot — runs everything
│   ├── verify.md                      ← /verify — spot check anytime
│   ├── new-feature.md                 ← /new-feature — for work after the MVP
│   ├── new-questions.md               ← /new-questions — for adding real content later
│   └── add-exam.md                    ← /add-exam — for later, second exam
├── skills/
│   ├── testing/SKILL.md
│   ├── exam-engine/SKILL.md
│   ├── content-authoring/SKILL.md
│   └── database/SKILL.md
├── .github/workflows/ci.yml           ← independent safety net once you push to GitHub
└── docs/
    ├── product-plan.md                ← copy your plan here
    └── product-plan-addendum.md       ← copy the addendum here
```

Copy your two plan documents into `docs/` before starting — AGENTS.md tells the agent to read them.

**You do not need to touch package.json, husky, or any config by hand.** AGENTS.md §4a makes writing those the agent's own first task.

## 2. Set the autonomy profile once

In Antigravity's settings, set autonomy to **Agent-driven development** (minimal intervention). This project's safety nets are now automated rather than approval-gated:

```text
Risk                              How it's handled without a human checkpoint
──────────────────────────────────────────────────────────────────────────
Hardcoded exam-specific logic     Caught automatically by npm run check:architecture
Copied/scraped question content   Structurally avoided — agent authors from scratch,
                                   content stays in Draft status regardless
Bad database migration            Autonomous migrations are dev/local-only; agent
                                   is instructed never to touch a known-production DB
Silent failure                    npm run verify must pass before anything is
                                   reported done; failures are logged, not hidden
```

The one thing this setup deliberately does **not** automate: flipping content from `Draft` to `Published`. That stays a manual step you do on your own schedule — not because the run stops and waits for it, but because publishing exam content is the one place where a quick human glance is genuinely worth keeping (see product-plan-addendum.md §47).

## 3. The one prompt

Paste this once to kick off the whole build:

> Read AGENTS.md, everything in skills/, and docs/product-plan.md and docs/product-plan-addendum.md. Then run the /autopilot workflow: bootstrap the project fully yourself (installing dependencies and writing package.json scripts — don't ask me to do this), then build Phases 1 through 3 from the product plan, verifying and self-correcting after every step per AGENTS.md §9. Don't stop to ask me anything unless you hit something that truly requires a credential or account only I can provide — log those in PROGRESS.md and keep working on everything else. I'll check PROGRESS.md when I'm back.

## 4. What you'll come back to

`PROGRESS.md` at the repo root is the handoff artifact — read it first. It will show what's done and verified, what's blocked (with why, after 3 automatic retry attempts), and what genuinely needs you (almost always just: a real database URL and hosting account, since the agent can't sign up for services on your behalf).

If the session gets interrupted partway (e.g. you close the IDE), just re-invoke `/autopilot` — it reads `PROGRESS.md` first and resumes from the first incomplete item instead of starting over.

## 5. After the MVP build finishes

```text
/new-questions     → add real, reviewed content (stays in Draft — you publish when ready)
/new-feature        → anything beyond the MVP (Phase 4+: content platform, admin, monetization)
/verify             → spot-check the repo anytime
/add-exam           → much later, once CSE is mature and a second exam is greenlit
```

## One honest limit

Nothing here can create accounts or generate real credentials on your behalf — a hosted Postgres instance, a Vercel project, a domain. The agent will use local/dev-safe substitutes to keep building in the meantime and will list exactly what it needs from you in `PROGRESS.md` under "Needs Human." That's the one category of task that can't be automated away, by design — everything else can run without you in the room.
