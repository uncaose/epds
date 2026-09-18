---
source: https://github.com/mattpocock/skills
kind: skill
perspectives: [delivery, agent-ops]
patterns: [design-tree-interview, frontier-round-questioning]
applies_to: [direction, spec]
evidence_grade: community
captured: 2026-09-18
---

## Analysis

`grilling` (`/grill-me`, `/grill-with-docs`) interviews the owner as a **design tree**:
decisions branch into dependent decisions, worked in **rounds** — the **frontier**
(questions whose prerequisites are settled) asked as one batch with a recommended answer
(➡️) each, then waits for the owner before recomputing. Facts come from sub-agents, never
the owner; done when the frontier is empty.

vs `scripts/drill.sh`+`templates/drill-catalog.md` (DQ-nnn catalog), 3+1: grilling (1)
**reshapes each round**, (2) **dispatches sub-agents for facts**, (3) gives a **recommended
answer** — drill.sh has none of the 3 (static catalog, no fact-finding, no recommendation).
+1 (drill.sh only): **persistent write-back** — `ingest` writes into `req.md` 제1조 with a
receipt; grilling stays ephemeral until confirmed.

## Measured

`gh api repos/mattpocock/skills/contents/skills/productivity/grilling/SKILL.md` → exit 0, fetched
full original file (base64-decoded, 2026-09-18). Confirmed structure: frontmatter(name/description)
→ design-tree interview protocol → "frontier" round format (numbered `❓ **Qn**` + `➡️` recommended
answer per question, one round = whole frontier) → recompute-frontier-after-answers rule →
sub-agent-for-facts rule ("Finding facts is your job, never the user's ... dispatch a sub-agent")
→ termination condition (frontier empty). No `--help`/CLI invocation possible — it is a Claude
Code slash-command skill (`/grill-me`), not a standalone binary; install via `claude plugins
install mattpocock-skills` was not re-run here (plugin already resolvable via gh api content read).
vs `scripts/drill.sh`+`templates/drill-catalog.md`: metric = owner questions ≤5, not yet run
head-to-head (deferred — needs a real ambiguous artifact, not this measurement pass).

## How EPDS uses it

> "내가 원한건 현재 상태 위치 그리고 나아갈 방향을 결정하기 위해서 기존 자료가 있다면 분석을 해서 상태, 위치, 다음 방향, 그리고 그 외 나머지를 결정하기 위해서이다. 자료가 없다면 결국 결정을 위해서 네가 원하는게 뭐냐를 결정하기 위해서 이다." — human, 2026-09-18
> "2차 질문이 아니다. 결국 최종 결과물을 위해서 다음 스텝을 결정짓는데 질문의 방향에 따라서 전체 그림이 달라질수 있다. 전체 그림이 달라지는 이유는 그 결정 때문에 현재 위치와 상태가 달라지면 다음 스텝도 달라지게 때문이다." — human, 2026-09-18 (정정)

Loop: (1) evidence exists → analyze into state/position/direction; no evidence → grill
owner for "what you want" (grilling pattern). (2) owner question = **progressive
sharpening**, not a single decision — each answer makes state/position/direction sharper.
(3) re-compose the whole picture from the sharper state. (4) derive next step. Reuse = `scripts/drill.sh`(A11).
> "상태, 위치, 최종 결과물로 가는 방향이 계속 변할 수 있다." — human, 2026-09-18
> "한번의 질문으로 완성되는 게 아니라 상태, 위치, 최종 결과물과 그 방향이 점점 더 구체화 되기 때문이다." — human, 2026-09-18
timini/drill-me: not registered — FSRS tutor, opposite direction (R0298).

Stars re-measured 2026-09-18: 264922 (card registration 2026-09-18 same-day: 264753).
