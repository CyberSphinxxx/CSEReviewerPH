# Settings and site-page recommendations

Date: 2026-09-13
Status: Recommendation guide for implementation; no settings UI has been implemented in this task.
Related direction: [.design/review-report.md](../.design/review-report.md).

## 1. Product direction

Build a calm, accessible Settings area that lets learners personalize their study routine, reading comfort, and data choices. Keep useful defaults so a learner can start studying without opening Settings. Settings should express meaningful choices; typography, contrast, clear feedback, keyboard access, and sensible mobile layout must already work by default.

The dashboard answers “What should I study today?” Settings answers “How should this site work for me?” Exam setup answers “What session am I starting now?” Keep those three responsibilities distinct.

This guide follows the existing product plan and addendum, especially guest access, actionable progress, mobile access, data controls, bilingual exam fidelity, and configuration-driven exam behavior. It preserves the existing Next.js/React/TypeScript/Tailwind/Better Auth/Drizzle stack. Do not add a competing library or a second preference system per page.

## 2. Existing capabilities and implementation gaps

Current repository inspection found:
- Local exam target/date/daily-goal preferences and activity storage.
- Account-menu actions for syncing local progress, account export, deletion, and sign-out.
- Local backup export/import/reset functions.
- A consent banner with separate analytics/ad controls and an event for reopening it.
- Theme CSS variables and a dark class, but numerous fixed light surface classes; these do not establish a finished dark theme.
- Public About, Contact, FAQ, Privacy, Terms, Disclaimer, exam-information, guide, and article routes.
- Service-worker/install-prompt plumbing. This does not prove every resource or exam is available offline.
- No dedicated settings routes found during inspection.

The workspace contains ongoing dashboard changes. This guide does not replace them or claim a stable deployment snapshot.

Important prerequisites for implementation:
1. The sync route accepts more categories than it demonstrably persists. Some database catches still increment counts and report success. Do not advertise comprehensive backup, two-way sync, synced preferences, or a successful restore until each category is persisted and read back correctly.
2. The account deletion route catches a database failure and can still return success. Correct this before presenting a reliable deletion flow. Verify cascades, sessions, local copies, and account ownership separately.
3. Account export currently exposes a narrower set than the local backup shape. Label exactly what each export contains; a privacy/data export and an importable backup are different products.
4. Local storage helpers can swallow write errors. Settings needs a reliable result so it can say “Could not save” rather than silently losing a preference.
5. Optional consent choices should begin unselected/off. Current customization state initializes analytics and ads to true; reconcile this with the project's explicit opt-in intent.

These are source observations, not a new exhaustive backend/security audit. No endpoint was mutated or account data deleted for this guide.

## 3. Recommended information architecture

Use a small overview and stable section URLs. On desktop, a quiet left navigation and a readable content panel. On mobile, an overview list leading to full-width section pages with a clear “Settings” back link. Avoid a wide row of horizontally scrolling tabs.

| Page | Proposed URL | Purpose | Release |
|---|---|---|---|
| Settings overview | /settings | Category links with concise current-value summaries | First release |
| Study plan | /settings/study | Exam, level, target date, daily goal, calendar preferences | First release |
| Appearance | /settings/appearance | Theme and reduced motion | First release; only expose tested themes |
| Text & reading | /settings/reading | Text size, line spacing, reading width, live preview | First release |
| Dashboard layout | /settings/dashboard | Comfortable density and optional dashboard sections | First release; minimal controls |
| Account & security | /settings/account | Identity, sign-in methods, sign-out; secure account maintenance | First release for existing supported capabilities |
| Data & storage | /settings/data | Storage status, accurate sync, backup, restore, local reset | First release after persistence prerequisites |
| Privacy | /settings/privacy | Optional consent and data-use explanations | First release |
| Help & about | /settings/help | Help, feedback, public policy links, application version | First release |
| Reminders | /settings/reminders | Opt-in schedule, channel, delivery status | Later, after delivery infrastructure exists |

This is eight functional sections plus an overview. Do not ship empty sections for future features. Group the navigation under “Study,” “Comfort,” “Account & data,” and “Help” if grouping improves scanning. Do not add Settings to the main header as a bright primary button.

Entry points:
- Account menu: Dashboard, Settings, Help, Sign out.
- Guest navigation: Settings remains accessible without sign-in.
- Dashboard: Change date → Study plan, Customize view → Dashboard layout, Manage data → Data & storage.
- Exam/guide reading controls: compact text-size access with “More reading settings.”
- Footer: Help, About, Privacy, Terms, Disclaimer, and Cookie preferences. Cookie preferences must remain directly reachable.

## 4. Study plan

Personalization should start with the learner's exam, not account demographics.

| Setting | Options / control | Recommended default | Scope and behavior |
|---|---|---|---|
| Exam and level | Existing configured exams and levels | Existing explicit choice; otherwise ask during first session setup | Changes future recommendations and launches; never relabel old attempts |
| Target date | Verified schedule, custom date, or no date | No assumed official date | Show source/checked date for official choices; label custom as personal target |
| Daily question goal | 10 / 25 / 50 presets plus bounded custom field | Preserve existing; 25 for new users, easily changed | Match supported limits; question goal does not change test length |
| Show daily goal | On / off | On | Hides goal display only; does not delete activity |
| Week starts on | Monday / Sunday | Monday, as a product choice | Affects calendars, not recorded facts |
| Study time zone | Named time zone | Asia/Manila, visibly stated | Governs new daily grouping; separate from official event time zone |

An exam change should display its consequences and preserve data. A target-date change should not reset history or streaks. A goal reduction may complete today's goal; say that clearly instead of retroactively rewriting earlier days.

Keep timezone semantics stable: record instants where available, retain the date/time-zone context of historical activity, and apply a changed study zone prospectively. Do not fabricate precise instants for old date-only records or silently regroup the entire streak history.

Streak rules should be stable product rules, not an editable score manipulation setting. Explain activity/check-in versus studying. If both series are implemented, allow a display choice labeled accurately. A “Hide streak” option is useful; a “Choose how many missed days count” option is not.

A tentative official schedule should never silently replace a personal target. A verified schedule change may prompt the learner to adopt the new date.

## 5. Appearance

| Setting | Options | Default | Scope |
|---|---|---|---|
| Color theme | System / Light / Dark | System once both themes are verified | Device/browser; honors operating-system preference in System mode |
| Motion | Follow device / Reduce motion | Follow device | Device/browser; never force motion against an OS reduced-motion request |
| Reset appearance | Reset this section | Not automatic | Appearance preferences only |

Theme preview should include a heading, paragraph, button, input, selected state, and a subject-progress row. Every choice needs a name and selected indicator; color swatches alone are insufficient.

Keep the site's navy/gold character in both themes. A dark theme needs actual surface, text, chart, focus, border, disabled, and error-state tokens. Do not claim “eye protection” or health benefits. Avoid custom color pickers, wallpaper uploads, animated backgrounds, six decorative themes, and a high-contrast switch that compensates for unreadable defaults. Support browser/OS forced colors in the baseline implementation.

Resolve theme before first visible paint where practical and without exposing account preferences in public cached HTML. A theme update must not reload an active exam or reset answers/timer.

## 6. Text & reading

| Setting | Options / proposed values | Default | Applies to |
|---|---|---|---|
| Reading text size | Standard 16px / Large 18px / Extra large 20px base size | Standard | Questions, choices, explanations, guides, articles; browser zoom remains available |
| Line spacing | Standard 1.6 / Spacious 1.8 | Standard | Reading text; not rigid navbar/button heights |
| Reading width | Standard about 65ch / Narrow about 52ch | Standard | Explanations/guides; both shrink to fit the viewport |
| Reset reading | Reset this section | Not automatic | Reading preferences only |

The values are starting design tokens, not accessibility limits. Use scalable units and reflow. A visible preview uses ordinary UI prose, not newly authored exam content. Show the effect before persistence; use a predictable autosave status.

Preserve all punctuation, equations, tables, English/Filipino content, choice order, and language metadata. Do not simplify or translate exam content through a display toggle.

UI language is a later setting, only when a complete reviewed interface translation exists. Prefer “English / Filipino” then; leave no nonfunctional Filipino option in the first release. Explain that interface language does not replace the required bilingual exam material. Content-language filters belong in practice setup when appropriate, not in Full Test settings.

Do not add font-weight, letter-spacing, paragraph-spacing, and typeface sliders initially. Respect user styles without requiring a special app setting. Font preferences can be revisited with evidence; avoid claims that one font treats dyslexia.

## 7. Dashboard layout

Personalization should improve focus while preserving a dependable layout.

| Setting | Options | Default | Guardrail |
|---|---|---|---|
| Spacing | Comfortable / Compact | Comfortable | Compact reduces panel spacing, not minimum text readability or control targets |
| Exam calendar | Show / Hide | Show when a target exists | Target remains stored and accessible in Study plan |
| Activity calendar | Show / Hide | Show after activity exists | Visibility is distinct from collection/deletion |
| Streak summary | Show / Hide | Show | Hiding does not reset activity |
| Subject progress | Show / Hide | Show | Progress remains available through its destination |
| Recent sessions | Show / Hide | Show | History stays accessible |
| Reset dashboard view | Restore defaults | Explicit action | Does not change exam/date or delete progress |

Keep today's action and clear navigation as stable anchors. In the first release, use a fixed useful order rather than drag-and-drop widgets. Responsive layout should adapt automatically; do not ask users to choose a column count or configure mobile breakpoints.

Offer a tiny schematic preview if it materially explains hidden sections. Do not add a large animated dashboard editor. Hiding all optional sections should still leave a useful study-start view with an obvious way to restore defaults.

## 8. Account & security

| Control | Guest | Signed in | Requirement |
|---|---|---|---|
| Identity | “Using this device as a guest” | Display name and email | Do not assume email local-part is a preferred name |
| Display name | Optional later local nickname; no requirement | Edit using validated authenticated update | Show only supported fields; no extra demographic collection |
| Email | Sign-in entry | Read-only initially | Only expose Change email once verification/recovery exists |
| Password | Sign-in entry | Change password for applicable sign-in method | Reauthentication, rate limiting, clear success/failure; verify Better Auth integration |
| Active sessions | Not applicable | Later: current/other sessions, revoke others | Actual session inventory and revocation required |
| Sign out | Not applicable | Explicit action | Clear account-bound local data appropriately; protect unrelated guest progress |
| Delete account | Not applicable | Clear labeled action in a separated deletion section | Secure confirmed deletion; distinguish cloud and device scope |

Do not introduce profile photos, age, address, occupation, government ID, civil-service eligibility documents, or a public profile just to make Settings feel complete. Do not show two-factor authentication or passkey switches unless fully implemented.

Account deletion should identify exactly what will be removed, offer export, require one proportionate confirmation/reauthentication, and report actual completion. A database error must remain a failure. Explain treatment of the current device copy and any deferred cleanup accurately; never infer all other devices are cleared. Keep a discoverable link from Data & storage and Privacy to this single deletion flow.

Account settings should not be a barrier to guest reading or exam practice.

## 9. Data & storage

Use three clear groups: **Where your progress is saved**, **Backup and restore**, and **Reset or remove data**.

### Storage status

Display only observed status: “Saved on this device,” “Last synced at …,” “Changes waiting to sync,” “Sync failed,” or “Storage unavailable.” Show the last successful timestamp rather than updating it merely because a request was sent. If sync covers only some categories, identify them. Do not equate localStorage with encrypted storage or an account login with a full backup.

Proposed controls:
- Sync now: signed-in only, backed by real persistence/readback. Guest sees a short optional sign-in explanation.
- Download device backup: versioned importable JSON; show included categories and any missing detailed attempt history.
- Restore device backup: validate size/schema/version, show date and counts, then ask for confirmation of scope. Imported question records must never publish content to the question bank.
- Download account data: authenticated export of actual cloud categories, with partial failure surfaced. Label separately from an importable device backup.
- Storage details: optional compact disclosure showing known data categories and approximate usage when measurable.

### Import and conflict policy

Prefer additive merge for immutable attempt records using stable IDs, without double-counting. Preserve existing preferences by default; offer an explicit option to import preferences. Bookmarks/deletions and mutable records require conflict/tombstone handling; do not promise a lossless merge until it exists. A reviewed “Replace device study data” option can be provided with a preview and backup offer. Validate before changing anything, stage the import, and avoid partial destructive writes.

Do not restore consent, authentication tokens, sessions, notification permissions, or browser-specific settings from a study backup. Preserve errors as recoverable; invalid files must leave current data intact. No active-exam reset/import while a session is running without a safe, explicit exit flow.

### Distinct reset actions

| Action | Removes/resets | Preserves |
|---|---|---|
| Reset appearance | Theme/motion preferences | Progress, account, privacy consent |
| Reset reading | Reading overrides | Exam, history, account |
| Reset dashboard view | Layout visibility/density | Stored activity and scores |
| Reset all preferences | Explicitly enumerated study/display preferences | Progress, account, consent, notification permission; do not quietly enable anything |
| Clear downloaded/offline files | Managed resource caches only | Answers, local history, preferences, active sessions |
| Clear study data on this device | Defined local progress categories | Cloud data unless explicitly included; privacy choices |
| Delete account and cloud data | Verified account-owned cloud data | Other-device local copies cannot be claimed erased without actual capability |

Use explicit verbs and scope, not a single “Reset everything” button. Offer a backup before destructive study-data operations. Local reset must not automatically re-upload deleted data or immediately rehydrate it from cloud without an explained choice.

## 10. Privacy

Keep the privacy page understandable without legal jargon:
- Essential storage: explain what is needed for sessions, preferences, and saving practice. Display as required information, not an editable off switch that breaks the app.
- Optional analytics: off until an explicit choice; independent from ads.
- Optional advertising consent: off until an explicit choice; do not imply that rejecting consent purchases an ad-free product.
- Local daily check-in tracking: explain purpose and proposed on/off choice if visit logging is implemented. Off stops future visit-only logging; ordinary saved attempts still support learning history. Hiding the grid is a separate display choice.
- Link to data export/deletion and the public Privacy Notice.

Use the existing consent source of truth; Settings, footer, and banner must read/write the same validated record and react immediately. A consent withdrawal must stop relevant optional processing and perform supported cleanup; do not show an “off” switch while scripts continue collecting. Do not import consent from backups or silently re-enable it when signing in.

These are product requirements drawn from the repository's privacy contract, not a claim of legal certification. Any new categories such as reminder destinations, delivery tokens, time zone, or check-ins must be covered by the actual notice and retention/deletion behavior before collection.

## 11. Reminders — later, when delivery is real

Begin with optional calendar export for a chosen exam date if useful, labeled with its date provenance and supported time-zone semantics. Do not add notification settings before implementing their delivery path.

| Setting | Default | Behavior |
|---|---|---|
| Study reminders | Off | Enable intentionally |
| Days and time | Learner chooses on enable | Show study time zone |
| Channel | Only supported channels | Email requires verified destination/provider; browser push requires support and permission |
| Quiet hours | User-configurable when needed | Suppress scheduled reminders in that interval |
| Review reminders | Off, or explicitly bundled on enable | Avoid multiple notifications for the same daily task |
| Exam-date updates | Off | Only verified changes, with source |
| Reminder test | Explicit action | Send only to the learner after channel authorization |

Ask browser notification permission only from the learner's explicit enable action. Browser permission may be denied, unsupported, or later revoked; show the corresponding state and recovery instructions. Page timers alone cannot promise reminders when the site is closed. Push/service-worker delivery or another reliable service is a separate implementation requirement. See [MDN Notifications guidance](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API).

Suppress or defer unnecessary reminders after today's goal is met, and prevent duplicates across channels/devices. No streak-loss guilt, countdown pressure, marketing opt-in disguised as study reminders, or browser permission prompt on initial page load.

## 12. Help & about

Use a lightweight index rather than duplicating public articles:
- FAQ and using the reviewer.
- Contact support / report a technical issue, with an optional description and explicit attachments.
- Report a question problem from that question/result context, where its ID is known.
- Accessibility help and feedback route; publish an accessibility statement only with an honest tested scope and known limitations.
- About csereviewph.com and the independence/non-affiliation disclosure.
- Privacy, Terms, and Disclaimer links.
- App version/release identifier and optional changelog when maintained.
- Install app entry where supported; otherwise accurate browser-specific instructions.
- Offline status and a truthful list of available downloads, when implemented.

Diagnostics should show version/browser basics with a preview before the user shares them. Never include tokens, cookies, email, stored questions, or history automatically. Do not add “100% secure,” “official,” or compliance-certification badges unsupported by evidence.

## 13. Which pages belong elsewhere on the site?

| Destination | Recommendation | Placement |
|---|---|---|
| Home | Public explanation and start action | Main navigation/logo |
| Dashboard | Personal next step, calendar/activity, compact progress | Main navigation for returning learners |
| Practice | Topic/subject directory and per-session setup | Main navigation |
| Mock exams | Existing level/mode routes; add a directory only if selection becomes hard | Practice/exam entry, not Settings |
| Results | Per-attempt score, answers, explanations | After submission/history |
| History | Existing /dashboard/history | Dashboard secondary navigation |
| Mistake bank | Existing /dashboard/mistakes | Dashboard/Practice contextual links |
| Saved questions | Existing /dashboard/bookmarks | Dashboard secondary navigation |
| Study guides | Existing /guides and guide detail | Main navigation |
| Articles | Existing /articles | Guides/resources; avoid crowding header |
| Exam information & dates | Existing /exam-info; a /exam-info/schedule page when a verified schedule is maintained | Public resources + Study plan link |
| FAQ, About, Contact | Reuse existing routes | Footer + Help & about |
| Privacy, Terms, Disclaimer | Reuse existing routes | Public footer + Privacy/Help |
| Account recovery | Add only with a functioning auth/email recovery flow | Sign-in + Account & security |
| Accessibility statement | Add after a scoped audit and maintained support process | Footer + Help |
| Changelog / service status | Later only if maintained and useful | Help; not a placeholder navigation item |
| Billing | Later, when paid features exist | Account; never a dead Upgrade page |
| Admin/content authoring | Separate authorized staff area per build phase | Never learner Settings |

Do not rename existing history/bookmark URLs solely for neatness; preserve bookmarks and use redirects if a later navigation change warrants new canonical routes. Personal settings/account/history pages should not be search-indexed or expose user data through shared caching; public About/help/policy pages remain available without authentication.

## 14. Interaction and visual system

Proposed desktop layout: 1100px maximum overall width, 220px navigation, 32px gap, a flexible content column whose explanatory text generally stays below 70 characters per line. On phones use a single column with 16px side padding and controls stacked under labels as necessary.

Use 28–32px page titles, 18–20px section titles, 16px form labels/body, and readable supporting text. Settings rows have a label, one short explanatory line only when needed, and a control. Use spacing and dividers rather than a card around every toggle. Theme choices may use preview cards; destructive actions get a separated section. Navy text, white/pale neutral surfaces, restrained gold, and brand-blue actions carry the existing identity.

Save contract:
- Appearance/reading/layout: apply immediately, persist automatically, show quiet “Saved on this device” feedback. On failure, say it applied temporarily and offer retry; never lie about persistence.
- Exam/date/goal, account details, and consent: grouped Save changes/Cancel. Preview where useful; warn about unsaved changes only when there are actual pending edits.
- Data import/reset/deletion: preview scope → explicit confirmation → pending → genuine success or recoverable error. Prevent double submission.
- Reset-this-section stays distinct from deleting progress. Do not put a Save button beneath controls that already autosave without explaining it.

Every page needs loading, loaded, dirty, saving, saved, failure, offline, unavailable storage, and signed-out/session-expired states when relevant. Do not overwrite unsaved edits when a background update arrives; present the conflict with a clear choice.

Accessibility is default behavior: associated labels, keyboard operation, visible focus, semantic groups, accessible status messages, clear errors, and accessible names for icon buttons. Main mobile controls should aim for comfortable 44px targets. Test 320 CSS-pixel reflow, 200% text resizing and 400% zoom where applicable, and user spacing overrides. [W3C reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) and [text spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html) constrain the implementation; custom controls must not block browser adjustments.

Follow system reduced-motion preferences by default. A site Reduce motion setting can further reduce movement; it should not cancel an OS preference. Avoid animated page slides and live layout rearrangement. [MDN reduced-motion guidance](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion).

## 15. Persistence and ownership

Use one versioned, validated preference model with explicit defaults, safe migrations, and reset scopes. UI components consume it rather than inventing their own localStorage keys. User-facing names remain generic; exam IDs and level IDs are configuration references.

| Preference/data | Guest | Signed in | Sync recommendation |
|---|---|---|---|
| Theme/motion/reading comfort | Current device | Current device | Device-local first; optional explicit preference portability later |
| Exam, level, target, goal | Device | Account-backed after supported persistence | Preserve guest choice at sign-in; resolve conflicts explicitly |
| Dashboard visibility | Device | Account-backed later | No automatic overwrite of active local edits |
| Consent | Current browser/device | Current browser/device | Never silently imported or enabled from another device |
| Notification permission | Browser-controlled | Browser-controlled | Cannot be synced as permission |
| Reminder schedule | None until implemented | Account or supported local delivery configuration | Delivery tokens and schedules need explicit lifecycle/deletion |
| Study history/bookmarks/activity | Existing local storage | Supported cloud categories | Confirm categories and readback; no blanket “everything synced” claim |

Define guest-to-account migration: if cloud preferences are absent, import the learner's explicit local study choices; if both exist, show a concise comparison and offer Keep account / Use this device. Keep device display choices separate. Use revisions or equivalent server conflict handling for mutable account preferences. Never upload another user's cached records after account switching.

New database preferences require Drizzle schema/migrations, authenticated ownership validation, and tests. Do not hand-edit a production database for Settings. Backend details belong in implementation work, not normal user copy.

## 16. Things that must never become general settings

- Official Full Test duration, per-section timers, question distribution, passing formula, or answer-reveal behavior. Full Test retains the configured continuous timer and fidelity requirements.
- Changing exam rules midway through an active test.
- Automatically advancing on answer selection by default; learners need confidence in their selection and navigation.
- A switch to turn accessibility on, mute essential error/status information, or hide the timer entirely in an official-format simulation.
- Publishing/approving question content or adjusting moderation in learner settings.
- Streak score editing, fake baseline accuracy, or deleting mistakes to claim mastery.

Per-session question count, subject filters, and supported practice modes belong in session setup. Appearance and text adjustments can apply during a session without altering scoring, answer order, timer, or progress.

## 17. Phased delivery

**Phase A — foundations and useful first release:** settings shell, guest entry, Study plan, Text & reading, minimal Appearance, minimal Dashboard layout, Privacy, Help & about, and supported account/data controls. Repair false success/error handling before exposing data actions as reliable. Persist local preferences with tests. Ship Dark only after token coverage and browser verification; otherwise leave the selector out until it works rather than shipping a broken choice.

**Phase B — dependable account portability:** preference schema/migrations, secure profile/password operations where supported, category-accurate sync/download/restore, conflict handling, account switching, deletion verification, and reliable offline feedback.

**Phase C — optional conveniences:** reminders with actual delivery, reviewed Filipino UI, managed offline downloads, maintained accessibility/changelog pages, and more advanced layout controls only after observed demand.

The full guide does not mean every listed feature should launch simultaneously. Avoid disabled future-feature clutter and paid-service dependencies in the first release.

## 18. Acceptance and test plan for implementation

| Area | Required proof |
|---|---|
| Preference model | Defaults, malformed/old storage, migration, bounded values, category resets, failed writes |
| Study plan | Exam/level references, custom date, no date, today/past date, verified provenance, time-zone changes, preservation of attempts |
| Display | Light/dark/system first paint, OS changes, text resizing, spacing overrides, stable active exam, compact layout with usable targets |
| Dashboard | All optional sections hidden, reset defaults, visibility does not delete/disable collection, meaningful empty state |
| Account | Session expiry, user isolation, real mutation failure, sign-out/cache handling, deletion cascades and failed deletion |
| Sync and backup | Persistence/readback by category, duplicate requests, partial failure, malformed file, atomic restore, version incompatibility, conflicts, preference and consent separation |
| Privacy | Optional processing off before choice, independent toggles, withdrawal, shared banner/settings state, no false saved status |
| Reminder delivery | Denied/unsupported/revoked permission, explicit enable, timezone/DST scheduling, quiet hours, deduplication, disable and deletion |
| Browser | Guest and signed-in flows; desktop, 390px and 320px; keyboard/focus, zoom, screen-reader labels/status; offline/storage unavailable |
| Regression | npm run verify exit 0 and npm run test:e2e for new settings navigation and any affected exam flow |

Measure success with short observed tasks: change exam date, increase reading size, find a backup, and explain where progress is stored. Learners should complete these without understanding database/cloud terminology. Use existing consented product metrics only when needed; do not introduce analytics just to validate the guide.

## 19. Handoff and current verification

This document is the complete recommendations deliverable. It creates no settings routes, modifies no account, sends no reminder, and introduces no personal-data collection. Existing application edits were left untouched.

Repository verification for this documentation task is recorded in walkthrough.md and .design/evidence/settings-guide-verify.log. Passing the existing suite does not prove any proposed settings functionality; each implementation phase needs its own tests and actual browser walkthrough.

Verification result for this guide: npm run verify passed on the final retry (exit 0), including 179 tests in 36 files and the production build. Initial build failure and final pass are both documented in walkthrough.md; no proposed settings functionality is claimed implemented.
