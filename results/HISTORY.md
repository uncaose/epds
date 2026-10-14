# EPDS measurement history

Earlier measurements, newest first, copied from each internal report (no image exists for these unless stated). Latest detail: [2026-10-14 usability](2026-10-14-usability/RESULTS.md), [2026-10-13 v8 gate](2026-10-13-v8-gate/RESULTS.md).

| date | internal ref | EPDS version | models | n | main result | image |
|---|---|---|---|---|---|---|
| 2026-10-13 | R0382 | v7 (`2d3e28e`) | haiku, sonnet, local | 48 runs (3 models x 2 arms x 4 tasks x 2) | FAIL: sonnet-haiku intent gap 0.062 -> 0.104 (did not shrink); intent haiku 0.708 -> 0.833, sonnet 0.771 -> 0.938, local 0.708 -> 0.604; haiku function 29/32 -> 31/32 | no image |
| 2026-10-13 | R0381 | v5 (`64aaa30`) vs v6 (`a2b8b44`) | haiku | 16 runs (4 tasks x 2 x 2 arms) | PARTIAL: intent median 0.67 -> 0.75; function 21/22 -> 19/22 and median cost x1.52 (limit x1.20) failed two of three pass lines | no image |
| 2026-10-12 | R0375 | v4 (`faa73f4`) | sonnet, haiku | 80 runs (10 DeepSWE tasks x 2 models x 2 arms x 2) | not proven: f2p pair difference -0.001 (Wilcoxon p 0.59); passes sonnet 10 -> 13 of 20, haiku 9 -> 11 of 20 (direction only); effective input -47k | no image |
| 2026-10-11 | R0374 | v4 (`faa73f4`) vs v3 | haiku, sonnet | 16 runs (4 tasks x 2 models x 2) | PARTIAL: turns before build 2.5 (limit 2); input tokens 209k vs bare 191k (x1.09); pass rate 16/16 vs bare 14/16 | no image |
| 2026-10-10 | R0372 | v3 (`823fbff`) | haiku, sonnet, glm | 24 runs per arm (4 tasks x 3 models x 2) | PARTIAL: pass rate 22/24 vs bare 21/24; input tokens median 411k vs bare 317k (+30%, limit +10% missed) | no image |
| 2026-10-09 | R0368 | v2 | haiku, sonnet, glm (pass-rate cells); the full run also had luna, sol, mimo, dsv, local | 66 runs per arm in the haiku/sonnet/glm cells (674 runs in the full run) | v2 below bare: pass rate 56/66 (84%) vs bare 61/66 (92%); all-model paired rate difference -0.045, token ratio x1.51 | no image |
