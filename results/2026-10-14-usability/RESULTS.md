# EPDS usability evaluation of the v8 gate apps (2026-10-14)

Source: internal research R0385 (stage 1). Population: the 144 apps produced in the [v8 gate run](../2026-10-13-v8-gate/RESULTS.md) (EPDS v8 = commit `e80e0b8`). Verdict: **PASS** for stage 1 (all 144 apps judged by both blind lanes against a rubric sealed before any result; machine checks selftest exit 0).

## Conclusion
- The v8 arm raises mean usability for the Claude family (+1.0 to +1.5 of 20) and only slightly for the others (local +0.4, luna -0.3, sol +0.5, astra +0.6); it cuts machine-found defects sharply for the Claude family (haiku axe serious+critical 6.08 -> 0.33).
- The two judges (GPT sol, Claude sonnet-5-5) agree only moderately (Pearson 0.48), and the GPT judge does not see what the machine sees: GPT-family apps carry 15-37 failing-contrast nodes yet score about 15 of 20.
- Usability tracks intent (r 0.38) much more than function (r 0.16): an app that passes the functional rubric is not thereby usable.

## Method
| item | value |
|---|---|
| rubric | 10 items scored 0/1/2 (max 20), written by GPT (`codex exec -p astra`, effort medium, text only, read-only sandbox), sealed before any result. Item names: U1 Primary action clarity, U2 Visible action feedback, U3 Error prevention and recovery, U4 Text legibility and contrast, U5 Touch-target accessibility, U6 Phone layout fit, U7 Visual hierarchy and consistency, U8 First-use and empty-state guidance, U9 Labels and plain language, U10 User control and reversal. Per-item criteria are not reproduced here. SHA-256 `b83e5f8001d962c978adb391dbdb5b710645b26d856fcd4128e229cbb53911bf` |
| public bases | Nielsen 10 usability heuristics (nngroup.com), WCAG 2.2 (w3.org), Apple HIG accessibility, Material 3 structure |
| judges | GPT lane = `codex exec -p sol -c model_reasoning_effort=medium -s read-only --ephemeral` with the two screenshots attached; Claude lane = fresh `claude -p --model claude-sonnet-5-5 --effort medium`, Read tool only (Bash, Write, Edit, WebFetch, WebSearch denied). Same prompt and same input for both, random 8-hex ids, no model or arm names, neither lane sees the other |
| judge input | first-screen screenshot and after-action screenshot at 390x844 (simulated clock 2026-10-13 12:00; the action = type "Test" into the first text input, press Enter, move the clock one day), plus a DOM summary (title, headings, visible text, interactive elements with pixel sizes) |
| machine checks | axe-core 4.10.2 violations by impact, horizontal overflow at 390x844, interactive targets under 44x44 px, color-contrast (4.5:1) failing nodes, console errors, first-screen load time. Selftest on a good and a bad fixture written red first (module missing, exit 1), then green (exit 0) |
| n | 12 apps per model-arm cell (astra and opus 6), one judgment per judge per app |
| freeze | rubric, prompts and capture code unchanged after the first judged app; one GPT output with an unescaped quote broke JSON parsing and was re-run once, not re-scored |

## Execution prompt (judge, both lanes)
The same text is used in both lanes (GPT receives it on stdin followed by `rubric.json` and `dom.txt` contents; Claude receives it plus "Read first.png, after.png, dom.txt and rubric.json in the current folder first.").
```text
You are an independent usability judge. You are given one small web app (built from a one-line request, shown at a 390x844 phone viewport):
- first.png: the first screen.
- after.png: the screen after a typical action (typed "Test" into the first text input, pressed Enter, one day later).
- dom.txt: a DOM summary of both states (title, headings, visible text, interactive elements with their pixel sizes).
- rubric.json: 10 usability items, each scored 0, 1 or 2 using the observable criteria given.
You know nothing about how or by whom the app was made. Judge only what is visible in the two screenshots and dom.txt. Score every item strictly by its criteria; do not reward features or decoration the item does not ask for. If the evidence needed for an item is not visible, pick the lower score the criteria allow.
Output ONLY a JSON object, no prose, no code fence: {"items":[{"id":"U1","score":0,"note":"one short sentence of evidence"}, ...]} with one entry for each of U1..U10.
```
The apps themselves were produced by the prompts listed in the [v8 gate results](../2026-10-13-v8-gate/RESULTS.md#execution-prompts-exact-text-sent-to-the-model) (bare arm vs v8 arm, six one-line requests); no app was regenerated for this evaluation, so the bundle of apps is in that folder.

## Results (mean score of 20; model x arm)
Intent, function, turns and tokens of the same apps are in the v8 gate results; this evaluation produced no new model runs, so the columns that describe building (turns, build tokens, build time) do not apply here. Cost of this evaluation (judging only) is in the next table. Reasoning tokens: not recorded.

| model | arm | n | GPT judge | Claude judge | mean | judge r | axe ser+crit | overflow % | targets < 44 px | contrast fails | console errors | first screen ms |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| haiku | bare | 12 | 15.58 | 13.75 | 14.67 | 0.55 | 6.08 | 8.3 | 11.08 | 3.50 | 0 | 23 |
| haiku | v8 | 12 | 16.17 | 16.17 | 16.17 | 0.23 | 0.33 | 0 | 0.50 | 0.33 | 0 | 17 |
| sonnet | bare | 12 | 15.83 | 14.58 | 15.21 | 0.54 | 1.08 | 0 | 8.00 | 0.75 | 0 | 26 |
| sonnet | v8 | 12 | 16.50 | 16.00 | 16.25 | 0.59 | 0.08 | 0 | 0.33 | 0.08 | 0 | 16 |
| opus | bare | 6 | 16.17 | 14.67 | 15.42 | 0.66 | 2.83 | 0 | 5.50 | 2.50 | 0 | 22 |
| opus | v8 | 6 | 16.67 | 16.83 | 16.75 | 0.87 | 0.00 | 0 | 2.50 | 0.00 | 0 | 17 |
| local | bare | 12 | 14.33 | 13.50 | 13.92 | 0.23 | 5.00 | 8.3 | 11.83 | 4.50 | 0 | 28 |
| local | v8 | 12 | 15.17 | 13.50 | 14.33 | 0.22 | 7.67 | 8.3 | 5.58 | 7.50 | 0 | 19 |
| luna | bare | 12 | 15.75 | 13.58 | 14.67 | 0.08 | 23.75 | 0 | 11.83 | 23.67 | 0 | 35 |
| luna | v8 | 12 | 14.83 | 13.92 | 14.38 | 0.58 | 15.42 | 0 | 8.08 | 15.17 | 0 | 24 |
| sol | bare | 12 | 14.92 | 13.33 | 14.12 | 0.59 | 37.50 | 0 | 24.50 | 37.17 | 0 | 24 |
| sol | v8 | 12 | 15.33 | 14.00 | 14.67 | 0.09 | 22.58 | 0 | 13.58 | 22.50 | 0 | 22 |
| astra | bare | 6 | 14.67 | 14.17 | 14.42 | 0.83 | 32.33 | 0 | 21.50 | 32.33 | 0 | 46 |
| astra | v8 | 6 | 15.17 | 14.83 | 15.00 | 0.85 | 21.83 | 0 | 14.33 | 21.83 | 0 | 27 |

Judge agreement over all 144 apps: Pearson 0.48, Spearman 0.45, exact per-item agreement 68%; the GPT judge is more generous (15.48 vs 14.38). The GPT judge scores Claude-family apps 0.95 higher than GPT-family apps; the Claude judge scores Claude-family apps 1.38 higher; net self-preference 0.43 of 20, small against the 1-point noise floor.

Usability vs build scores (per app, judge mean): r with intent 0.38 (Spearman 0.37), r with function 0.16 (Spearman 0.13). Machine metrics vs judge mean (r): axe all -0.40, targets under 44 px -0.42, contrast fails -0.35.

### Cost of this evaluation
| item | value |
|---|---|
| GPT sol judging | 1,701,491 tokens total (input/output/reasoning split: not recorded), 2,369 judge-seconds (16.5 s per app, 4 in parallel) |
| Claude sonnet judging | 5,746,937 tokens total including cache reads (split: not recorded), 1,313 s (9.1 s per app) |
| rubric authoring (astra) | 13,577 tokens |
| capture + machine checks | 144 apps, about 12 s each, serial |
| time to first result | not recorded for the evaluation as a whole; the per-app first-screen load times are in the table above |

Top three by mean of the two judges: three Claude-family v8 apps with a single simple form (19/19, 19/19, 19/18). Bottom three: dense dashboards or scorecards with many small targets from local, luna and sol (about 9-12 of 20).

## Images
Contact sheet of all 144 apps, first screen (left) and after the generic action (right), phone width. Original PNG, 111,308 bytes, no compression.

![Contact sheet of all 144 apps, first screen and after action](contact-sheet.png)

## Limits
- Judges see two screenshots and DOM text, not the live app; the "after" action is a fixed script, which fits a minority of apps (many have no text input).
- One run per judge per app; per-cell n is 6-12, so cell means carry roughly +-1 point uncertainty.
- Both judges are LLMs; no human usability sample. A human spot check of the top and bottom three is cheap and recommended before relying on the ranking.
- Judge token counts are not comparable across lanes (the Claude count includes cache reads).
- Apps from later runs are not included; a later stage reuses the same scripts on a different run directory.
- Raw judge outputs, per-item scores and the machine log stay in the internal research archive (R0385).
