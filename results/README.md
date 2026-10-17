# EPDS results

Every verification run of EPDS gets its own folder here, with the method, the exact prompts, the numbers, the result images and the limits. Newest first.

| date | folder | what was measured | verdict |
|---|---|---|---|
| 2026-10-17 | [2026-10-17-local-audit-lines](2026-10-17-local-audit-lines/RESULTS.md) | local gamedev-coder: three observable checks vs a design audit (Codex) with 0, 1 or 3 lines, 48 runs (R0398) | no firm effect |
| 2026-10-17 | [2026-10-17-usability-prompt-gate](2026-10-17-usability-prompt-gate/RESULTS.md) | making the usability line stick: observable checks in the prompt vs a machine Stop gate, sonnet, 48 runs (R0396) | prompt enough (direction only) |
| 2026-10-16 | [2026-10-16-effort-low](2026-10-16-effort-low/RESULTS.md) | reasoning effort low vs medium, bare and medium level, haiku and sonnet, 48 new runs against 96 (R0393) | low enough, direction only |
| 2026-10-16 | [2026-10-16-limits-resolved](2026-10-16-limits-resolved/RESULTS.md) | the same line with the open limits closed: n doubled to 48 per cell, a Codex third usability lane and second intent lane, judge agreement, bootstrap CIs (R0391) | keep current |
| 2026-10-16 | [2026-10-16-ui-principle-proper](2026-10-16-ui-principle-proper/RESULTS.md) | the same usability line re-tested with CDN libraries allowed and a checker on the PATH, 96 runs, plus the haiku high-level intent drop diagnosed (R0390) | keep current |
| 2026-10-15 | [2026-10-15-ui-principle](2026-10-15-ui-principle/RESULTS.md) | one general usability line added to the medium level vs the high level, 24 runs plus re-judging (R0389) | keep current |
| 2026-10-15 | [2026-10-15-gain-source](2026-10-15-gain-source/RESULTS.md) | where the gain comes from: bare vs checks before writing vs + lifecycle table vs v9.1 full with gate, haiku and sonnet, 96 runs (R0388) | PARTIAL |
| 2026-10-15 | [2026-10-15-weak-opencode](2026-10-15-weak-opencode/RESULTS.md) | EPDS v8 on weak models (local gamedev-coder, local 27B, luna, two Go flash models) under opencode 1.19, with usability of their apps, plus a glm-5.3 ceiling cell (R0384, R0385 stage 2, R0386) | PARTIAL |
| 2026-10-14 | [2026-10-14-usability](2026-10-14-usability/RESULTS.md) | usability of the 144 v8 gate apps, two blind LLM judges plus machine checks (R0385) | PASS (stage 1) |
| 2026-10-13 | [2026-10-13-v8-gate](2026-10-13-v8-gate/RESULTS.md) | EPDS v8 against bare, 7 models x 6 one-line requests, 144 judged runs (R0383) | PARTIAL |

Earlier measurements (v2 to v7, tables only): [HISTORY.md](HISTORY.md).

## Update rules
1. Every new measurement gets a new dated folder with a `RESULTS.md` (conclusion first, method, exact prompts, results table, images, limits); never overwrite an old folder. Add a row above and to HISTORY.md once a run is superseded.
2. Hidden rubric text and answer keys are never published; item names and a SHA-256 seal are enough. No internal machine paths.
3. Every `RESULTS.md` embeds at least one result image (original PNG up to 2 MB, otherwise compressed and noted) and links it from the root README when it is the headline result.

This folder is not part of the installed skill: `package.json` `files` and `epds setup` do not copy it. `node test/results.selftest.mjs` checks links, image sizes and paths.
