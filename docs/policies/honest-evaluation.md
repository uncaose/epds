# Evaluate blind, change one thing at a time, quarantine flaky checks

Evaluate candidates without letting them tell they are being evaluated and grade their output rather than their self-report; improve a metric with one change and one measurement, then keep or revert, after proving the harness can tell cases apart; quarantine intermittent failures with re-run statistics instead of silently retrying them into a pass.

## Blind evaluation

- Nothing a candidate (an agent, prompt, model or variant) sees names the evaluation: no evaluation words in folder names, file names or the prompt. The prompt reads like an ordinary user request.
- Do not ask candidates to list the rules or files they applied; grade what they actually opened and produced.
- Write the rubric (a few concrete criteria) for the judge only. The judge sees outputs under neutral labels, never the candidate's identity, and scores all of them in one pass on one scale. `templates/arena.md` covers running and judging N candidates.
- Read every output yourself as well. A disagreement with the judge means the rubric is ambiguous or the judge is biased; resolve it before promoting anything.

## One change per measurement

- Fix one metric, its better direction, and a stop condition that pairs a target with a minimum number of attempts, so one lucky result cannot end the run. Never relax the condition to meet it.
- Before freezing the measuring harness, prove it can tell cases apart: the case that shows the problem must separate from easier cases. Vet it (`docs/policies/vet-measurements.md`) and make it print its error count and the amount of work done.
- Record the baseline and a green run of the regression checks before any change.
- Each attempt is one hypothesis naming a mechanism, one change, one measurement. Keep it only if the metric moves past noise and the regression checks stay green; otherwise revert it in full. Log every attempt, kept or reverted.

## Flaky-check quarantine

- A check that fails and passes on the same candidate with no change is intermittent. Re-run it enough times to count (for example 10 or more) and record passes, failures and the conditions.
- Record it as quarantined with its counts, date, owner and a reproduction, using whatever the project has for this (a tag, a list, a separate job, or a tracked issue). It keeps running and reporting; it is separated from real breakage, not deleted (`docs/policies/tests-not-weakened.md`).
- Quarantine only separates the signal; it never waives it. A quarantined check never counts as a pass and never counts toward a release GO: the release rule is unchanged (`docs/PROTOCOL.md` Evidence-first protocol step 3, the final candidate passes the full matrix and an independent GO; `templates/WORK-ROUTER.md` RELEASE).
- Where the test runner supports retries, never let a retry turn a failure into a pass without recording the failed attempts.

**Why**: Candidates that know they are being tested behave differently, and self-reports grade the report, not the work. Stacked changes and a harness that cannot separate cases make every win unattributable. Silent retries hide real intermittent bugs inside a green run, while leaving them mixed with real failures teaches everyone to ignore red. (docs/absorb-pstack.md — pstack's `eval` and `hillclimb` playbooks, `skills/poteto-mode/playbooks/{eval,hillclimb}.md` at `cursor/plugins` commit `a5539b1`, 2026-11-12, plus general flaky-test practice; restated in EPDS's own words, not copied.)

Referenced from: `docs/PROTOCOL.md` — see `docs/policies/README.md` for why these are separate files.
