# EPDS results

Every verification run of EPDS gets its own folder here, with the method, the exact prompts, the numbers, the result images and the limits. Newest first.

| date | folder | what was measured | verdict |
|---|---|---|---|
| 2026-10-15 | [2026-10-15-weak-opencode](2026-10-15-weak-opencode/RESULTS.md) | EPDS v8 on weak models (local gamedev-coder, local 27B, luna, two Go flash models) under opencode 1.19, with usability of their apps (R0384, R0385 stage 2) | PARTIAL |
| 2026-10-14 | [2026-10-14-usability](2026-10-14-usability/RESULTS.md) | usability of the 144 v8 gate apps, two blind LLM judges plus machine checks (R0385) | PASS (stage 1) |
| 2026-10-13 | [2026-10-13-v8-gate](2026-10-13-v8-gate/RESULTS.md) | EPDS v8 against bare, 7 models x 6 one-line requests, 144 judged runs (R0383) | PARTIAL |

Earlier measurements (v2 to v7, tables only): [HISTORY.md](HISTORY.md).

## Update rules
1. Every new measurement gets a new dated folder with a `RESULTS.md` (conclusion first, method, exact prompts, results table, images, limits); never overwrite an old folder. Add a row above and to HISTORY.md once a run is superseded.
2. Hidden rubric text and answer keys are never published; item names and a SHA-256 seal are enough. No internal machine paths.
3. Every `RESULTS.md` embeds at least one result image (original PNG up to 2 MB, otherwise compressed and noted) and links it from the root README when it is the headline result.

This folder is not part of the installed skill: `package.json` `files` and `epds setup` do not copy it. `node test/results.selftest.mjs` checks links, image sizes and paths.
