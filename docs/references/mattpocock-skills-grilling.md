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
+1 (drill.sh only): **persistent write-back** — `ingest` writes into `req.md` je1jo with a
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

> "naega wonhangeon hyeonjae Status wichi geurigo naagal directioneul gyeoljeonghagi wihaeseo gijon jaryoga itdamyeon bunseokeul haeseo state, position, next direction, geurigo geu oe nameojireul gyeoljeonghagi wihaeseoida. jaryoga eopsdamyeon gyeolguk gyeoljeongeul wihaeseo what do you wantreul gyeoljeonghagi wihaeseo ida." — human, 2026-09-18
> "2cha jilmuni no. gyeolguk choetypes Outcomemuleul wihaeseo next seutepeul gyeoljeongjitneunde jilmunui directione ttaraseo jeonche geurimi dalrajilsu itda. jeonche geurimi dalrajineun reasonneun geu gyeoljeong ttaemune hyeonjae wichiwa Statusga dalrajimyeon next seutepdo dalrajige ttaemunida." — human, 2026-09-18 (jeongjeong)

Loop: (1) evidence exists → analyze into state/position/direction; no evidence → grill
owner for "what you want" (grilling pattern). (2) owner question = **progressive
sharpening**, not a single decision — each answer makes state/position/direction sharper.
(3) re-compose the whole picture from the sharper state. (4) derive next step. Reuse = `scripts/drill.sh`(A11).
> "Status, wichi, choetypes Outcomemulro ganeun directioni gyesok byeonhal su itda." — human, 2026-09-18
> "hanbeonui jilmuneuro wanseongdoeneun ge anira Status, wichi, the final outcome and that directioni jeomjeom deo guchehwa doegi ttaemunida." — human, 2026-09-18
timini/drill-me: not registered — FSRS tutor, opposite direction (R0298).

Stars re-measured 2026-09-18: 264922 (card registration 2026-09-18 same-day: 264753).
