# EPDS Tests — The 4 layers and their placement

Source: table 5 provided by the human (4 test layers). The failure "we deployed code that passed the tests, but real users could not complete the core
action" (README "What It Solves") is not caught by code-layer tests alone — each of the 4 layers answers a different question.

## 4 layers

| Layer | Question | Example (domain example) | `templates/` · `tests/` placement |
|---|---|---|---|
| Code | Does the function behave correctly? | Core calculation logic, selection/routing algorithms | `tests/unit/` — the standard test runner for each language, always run in CI |
| Contract | Is the data format valid? | Schemas for config/content files, schema for AI response JSON | `tests/contract/` + `tools/verify_*` (schema validator), build stops on failure |
| Experience | Does the user complete the core flow? | Onboarding → core feature → completion, E2E | `tests/e2e/` (browser/device automation), `templates/experiment-brief.md` pins the flow definition |
| Outcome | Is the product promise kept? | Offline behavior, no personal data stored, performance budget, fallback when a dependency is not installed | `tests/promise/` or `evals/` (manual checklist → automate where possible), `gate-report.md` records the evidence for passing |

### Do not report when (negative-rule suppression)

| Layer | Do not report when |
|---|---|
| Code | The deviation is in generated, vendored, or unreachable fixture code |
| Contract | The schema change is inside a documented, in-progress dual-read/dual-write migration window |
| Experience | The flow sits behind an inactive feature flag or an explicitly out-of-scope entry point |
| Outcome | The promise was explicitly descoped for this release in `PROJECT-STATE.md` |

Adopt a suppression rule only after verifying on real samples that it does not hide a real defect (open-code-review principle 4, R0295 turn[6]). Never suppress data-loss, permission, or payment-path findings regardless of confidence (principle 5). Record every suppression on `templates/gate-report.md`'s "Suppressed" line.

## What happens when you skip a layer

With only the code layer: compile and unit tests are green, but a broken config file makes the deployment fail (no contract layer).
With only up to the contract layer: the schema is valid, but the user gets stuck on the third screen and cannot complete the flow (no experience
layer). With only up to the experience layer: the flow completes, but the app crashes offline or personal data lands in the log
(no outcome layer) — the README's "we deployed code that passed the tests..." failure is exactly this last gap.

## Relation to the verify command

The `verify` command (SKILL.md routing table) collects "independent quality evidence" across all 4 layers — from a perspective other than the
session that implemented it (producer ≠ verifier). `templates/gate-report.md` is the contract that records, for each of the 4 layers, pass/fail and the path of the evidence
file.

When verify fans out across multiple reviewers, each reviewer's intermediate reasoning/scratchpad stays local — only concluded findings are shared (context isolation, R0295 turn[12]).

## Minimum start

A new project does not need to have all 4 layers at once (Scope discipline, `EPDS.md` §5). The code layer is almost always needed from
day 1; the contract layer from the moment data files appear; the experience layer from the moment the core flow is settled; the outcome
layer starts with at least 1 item (the single riskiest promise) before the real release.
