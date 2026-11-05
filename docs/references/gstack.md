---
source: https://github.com/garrytan/gstack
kind: skill
perspectives: [product, delivery, agent-ops]
patterns: [role-based-sprint-commands]
applies_to: [direction, spec, build]
evidence_grade: community
captured: 2026-09-16
---

## Analysis

Garry Tan's Claude Code setup — a collection of commands that chain CEO, designer, DX, engineering, QA, security and deployment into one sequence
(23 at card registration → 54 SKILL.md directories as measured 2026-09-18, growing fast).

**role-based-sprint-commands**: `/office-hours`, `/plan-ceo-review`, `/autoplan` pin down, as commands, not roles but
"what must be decided at this very moment". Lead: EPDS's stages (discovery→judgment→experiment→...) likewise must remain an ordered command chain,
not a list of roles, to be reproducible.

## Measured

isolated directory `~/Projects/go-work/epds-tools/gstack/`: `git clone --depth 1` exit 0 (2026-09-18,
~2.4s). `LICENSE` = MIT(Garry Tan, 2026) — matches `meta.license: MIT` at card registration, confirmed on the real file.
Top level `find . -maxdepth 2 -name SKILL.md` = 54 (53 real directories excluding itself: autoplan, benchmark,
browse, canary, careful, codex, design*, devex-review, diagram, document-generate/-release, freeze,
guard, health, investigate, ios-*, land-and-deploy, landing-report, learn, make-pdf, office-hours,
pair-agent, plan-*, qa/qa-only, retro, review, scrape, setup-*, ship, skillify, spec, sync-gbrain,
unfreeze, etc.) — more than double the "23 commands" at registration, so `meta.activity` needs updating. Execution (running the slash commands
themselves) is an internal Claude Code session feature and cannot be reproduced in this CLI-isolated environment — structure checked only.

## How EPDS uses it

Direction→Spec→Build — the view that "sequence, not role" is the unit of execution is reflected in the stage-order design of `docs/ROLES.md`.
The primary reference for the design in which `/epds-status` proposes the "next step" as a sequence, not a role.

> "23 opinionated tools that serve as CEO, Designer, Eng Manager, Release Manager, Doc Engineer,
> and QA" — repo description (gh api measured 2026-09-16; for the command count as of 2026-09-18 see §Measured above
> — the description wording is a stale old value that was not updated).
