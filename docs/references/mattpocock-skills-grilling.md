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
+1 (drill.sh only): **persistent write-back** — `ingest` writes into `req.md` Article 1 with a
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

> "What I wanted was this: to decide the current state, position and the direction to move in, analyze the existing material if there is any, and use it to decide the state, position, next direction, and everything else. If there is no material, then in the end it is to decide what it is that you want, for the sake of the decision." — human, 2026-09-18
> "It is not a second-order question. In the end we decide the next step for the sake of the final outcome, and depending on the direction of the question the whole picture can change. The whole picture changes because that decision changes the current position and state, and when those change the next step changes too." — human, 2026-09-18 (correction)

Loop: (1) evidence exists → analyze into state/position/direction; no evidence → grill
owner for "what you want" (grilling pattern). (2) owner question = **progressive
sharpening**, not a single decision — each answer makes state/position/direction sharper.
(3) re-compose the whole picture from the sharper state. (4) derive next step. Reuse = `scripts/drill.sh`(A11).
> "The state, the position, and the direction toward the final outcome can keep changing." — human, 2026-09-18
> "It is not completed by a single question; the state, the position, the final outcome and its direction become more and more concrete." — human, 2026-09-18
timini/drill-me: not registered — FSRS tutor, opposite direction (R0298).

Stars re-measured 2026-09-18: 264922 (card registration 2026-09-18 same-day: 264753).
