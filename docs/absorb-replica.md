# Absorb Replica — item-by-item disposition

Source: https://github.com/Jakeschincariol/replica-skill (MIT, 11 Claude skills, commit 77c9436). Read in full (every
`SKILL.md`, the six Python tools, templates and tests) and run once in an isolated project folder
(`.claude/skills/` inside a scratch directory, nothing installed globally; evidence in the operator's research
folder R0381). The 57 upstream unit tests pass; the tools use only the standard library and open no network
connection; no skill step was executed that deploys, pays, signs up or logs in.

## Lens

Replica exists to **copy an existing app**, so most of its weight is safety around copying (never take code, logo,
copy or names; rebrand sweep before launch; trademark checks). EPDS has a different purpose: take a request,
work out what the requester actually meant, and deliver something that was run and checked. So the question for
each Replica skill is only: *does it help EPDS understand the requester's intent and build the right thing
correctly?* Clone-specific safety rules are out of scope and not imported. General safety (secrets, personal data,
destructive actions, untrusted input) stays exactly as EPDS already has it in `docs/policies/`.

## Verdict vocabulary

Same as `docs/absorb-pstack.md`: **Built**, **Built (partial)**, **Reinforced** (EPDS already had it), **Rejected**
(out of scope or duplicate).

## The 11 skills

| # | Replica skill | What it does | EPDS counterpart | Already in EPDS? | Verdict |
|---|---|---|---|---|---|
| 1 | `replica-recon` | Maps an app: sources, screens S01.., flows F01.., components, inferred data model, feature matrix (must/should/could), "cannot be cloned" list, size S/M/L/XL. Step 1 defaults to **the core loop, the one flow users pay for**. | `/discover`, `/reference`, SKILL.md loop step 1-3 | Sources, flows and unknowns: yes (`/discover` evidence-first, assumptions recorded). Naming the core loop first: no | **Built (partial)**: SKILL.md step 3 now names the core loop in one line before writing checks. Screen/flow IDs, data-model inference and size classes: Rejected (clone-specific bookkeeping) |
| 2 | `replica-architect` | Stack defaults table, SQL schema rules, API table per flow, "parts that bite", build order with a thin vertical slice first. | `/spec`, `/build` | Slice first: yes ("smallest complete version"). Stack table: no, deliberately (EPDS is stack-neutral) | **Reinforced**; opinionated stack/SQL defaults **Rejected** |
| 3 | `replica-design` | Design tokens from screenshots, WCAG contrast checker, component specs with states. | none (EPDS is not a design-system tool) | no | **Rejected** (token extraction exists to match an original). One piece reused: the "works at 390px and 1440px" definition of done, see row 4 |
| 4 | `replica-build` | Screen by screen with a per-screen definition of done: every state (empty, loading, error, long content), 390px and 1440px, keyboard only, no console errors. "Not quietly shipping half" in a build log. | SKILL.md steps 4-7, `bin/check.mjs` | Console errors and reload: yes. Phone width and empty/invalid states: not checkable before | **Built**: `check.mjs` gets a `viewport` step and a `noOverflow` expect; step 3 lists the edge classes to cover. Clean-room/copy rules: **Rejected** |
| 5 | `replica-backend` | Auth, migrations, Stripe, email, jobs, security checklist (secrets in env, server-side validation, authz tested with a second user, webhook signatures). | `docs/policies/secrets-and-pii.md`, `untrusted-external-input.md`, `irreversible-actions-confirmation.md` | General security: yes. Vendor wiring (Stripe/Supabase): no, out of scope | **Reinforced**; vendor-specific steps **Rejected** |
| 6 | `replica-test` | Test plan per flow with an **edge-case list** (empty, very long, double submit, refresh mid-flow, offline, expired session, time zones and DST, mobile width, keyboard), bug severity S1-S4, failing test before the fix. | `/verify`, `test-first` and `evidence-before-completion-claims` policies | Failing-test-first and evidence: yes. A named edge-case list for the checker: no. Any way to check time-driven behaviour: no | **Built**: step 3 now asks for the edge cases the kind of app must survive (empty/invalid input, reload, time passing, 390px). `check.mjs` gets `advance` (simulated clock) so a 25-minute timer or a next-day rollover can be checked in milliseconds. This one goes past Replica, which names the time edge cases but gives no tool for them. Severity table: **Rejected** (gate report already classifies) |
| 7 | `replica-diff` | Feature parity score from the matrix (must 3 / should 2 / could 1, partial 0.5, skip excluded) plus a colour-blind layout diff of two screenshots; verdict "not shippable if any must-have missing"; "a clone at 62% is at 62%". | SKILL.md step 7 "Done means", Final report | Honest N-of-M and never writing "complete" while a check fails: yes | **Reinforced**. Run once: `imgdiff.py` scored a recoloured copy 93.2 in layout mode and listed only the structural change, ignoring the colour change; useful only when an original exists, so **Rejected** as a built-in |
| 8 | `replica-entrepreneur` | Reads public reviews (App Store, HN, Reddit), ranks complaints into hate / missing / unsolved lists, thin-theme labelling, verbatim quotes with links, never fabricates, states the sample size. | `/discover`, `/reference`, `evidence-before-assumption` | Verbatim-with-link and "no fabrication": yes (evidence policy). Review mining as a step: no | **Reinforced** for discovery. **Rejected** for the build path: it needs an existing product with reviews, and a build request from a one-liner has none. Run once on TodoMVC: 8 real HN comments, all thin, none about features, the skill said so rather than inventing themes |
| 9 | `replica-brand` | Name candidates, trademark/domain checks "to run, not assumed", palette, logo brief, voice, `sweep.py` for leftovers of the original's name/colours/domains. | none | no | **Rejected**: purpose is to stop a copy carrying the original's identity, which is not an EPDS goal |
| 10 | `replica-launch` | Landing page, pricing from the original's public page, store-listing linter (limits, copycat rule, `avoid` names). | `/release`, GROWTH route | Launch planning: yes at process level | **Rejected** as tooling (store limits are not EPDS scope); "no fake proof" already covered by evidence policy |
| 11 | `replica-deploy` | Preflight gate (tests green, must-haves done, rebrand sweep clean, listing linted), production services, DNS, monitoring; the user buys and signs in, Claude never pastes live keys. | `/release`, approval and irreversible-action policies | Preflight and "nothing goes live without the user's go": yes | **Reinforced**; the rebrand-sweep gate is **Rejected** (Replica-specific) |

## Added review: two official Anthropic plugins (same lens)

Read from the local plugin cache (read only, nothing installed or enabled): `feature-dev` (commands/feature-dev.md,
three agents) and `code-review` (commands/code-review.md).

| # | Source | What it does | EPDS counterpart | Verdict |
|---|---|---|---|---|
| 12 | `feature-dev` (7 phases: Discovery, Exploration, Clarifying Questions, Architecture, Implementation, Review, Summary) | Phase 3 is marked "do not skip": list every underspecified point (edge cases, error handling, scope boundaries, integration, performance) and **wait for the user's answers before designing**; "whatever you think is best" still needs an explicit confirmation. Phase 1 restates the understanding and confirms it. Phase 4 compares 2-3 architectures and asks which one. | SKILL.md steps 1-3 (take stock, questions never block, core loop + checks), `templates/arena.md` (N-way comparison), `/verify` panel | **Reinforced; blocking half Rejected.** Waiting for answers is the right move when a human is reachable and the opposite of what EPDS needs for a one-line request with nobody to answer (step 2 already says: ask only what a reachable human can answer, otherwise write the question with the default chosen under Assumptions). The non-blocking half (restate the understanding, list the underspecified points) is what step 3 now does with the core-loop line plus recorded assumptions. The v6 wording was written from Replica before this plugin was read; the overlap is convergence, not derivation. No further EPDS change |
| 13 | `code-review` (score every candidate issue 0-100 with a fixed rubric, keep only 80+; explicit false-positive list: pre-existing, linter-catchable, nitpicks, unchanged lines) | Precision filter for pull-request review, run by separate scoring agents. | `/verify` panel, `docs/policies/` (`negative-rule-suppression` pattern is already logged in `docs/references/open-code-review.md`) | **Reinforced; Rejected as a new step.** It targets noisy PR comments, not requester intent, and is tied to `gh pr comment`. Upgrade lead only: if the `/verify` panel ever returns noisy findings, adopt the 0-100 rubric with an 80 cut there (not done now: no demonstrated bottleneck) |

## What changed in EPDS

- `SKILL.md` step 3: name the core loop in one line, record the chosen reading as an assumption, write the core-loop
  check first, then the edge cases the kind of app must survive (empty or invalid input, reload, time passing, a
  390px-wide screen). Still 34 lines.
- `bin/check.mjs`: step `{"advance": ms}` (simulated clock via Playwright `clock`), step `{"viewport": [w, h]}`,
  expect `{"noOverflow": true}`. Documented in `docs/CHECK.md`; tested in `test/check.selftest.mjs` (failing first).

Effect on requester-intent fit is measured separately (operator's research folder R0381); this file records only
the disposition.
