# EPDS Commands

## System commands

### `/epds-setup`

Use once per target project when you want EPDS to inspect the repository and install a Minimal, Recommended, or Full project structure.

The command must:

1. Diagnose first in read-only mode.
2. Preserve existing project-specific rules.
3. Propose exact file changes.
4. Ask for approval before writing.
5. Verify links, references, and safe existing tests afterward.

### `/epds-status`

Use when you ask “What should I do next?”

It reads product documents, state, metrics, code, tests, CI, issues, logs, analytics, feedback, and necessary public sources. It returns one bottleneck and one smallest next action.

When the bottleneck is a specific perspective (evidence, cost, UX, ...), check `docs/references/INDEX.md` first — a lead already captured there points at a file instead of re-deriving one from scratch. Also check `epds/trusted-sources.json` for up to 3 matching entries (managed with `epds sources list|add|remove|show`, see `docs/EPDS.md`).

If a gate returns UNMEASURED, report it as `environment` (dependency missing — install and rerun before it counts as evidence), `censored` (log exists but the tested event never occurred), or `corrupted` (artifact unreadable). Do not report a bare "UNMEASURED" without one of these three.

### `/epds-audit`

Use when the project has too many instructions, duplicated guidance, stale commands, missing tests, or unclear ownership between `AGENTS.md` and `CLAUDE.md`.

Default mode is report-only. Use patch mode only after reviewing the proposed change plan.

### `/epds-upgrade`

Use after recurring needs emerge. It should not add tools, agents, evals, or CI merely because they are fashionable. It must connect any addition to a repeated failure or demonstrated bottleneck.

**Self-expansion mining (draft only, gate unchanged).** Before proposing an addition, scan available
retros (`templates/retro.md` "Permanent learning" fields) and any project journal/log for a pattern
that recurred 2+ times — the same manual workaround, the same missing tool, the same question asked
repeatedly. Draft the addition as a proposal (what, why, which repeated instance justifies it) and
stop there: this step only produces a candidate for the owner to review, it does not lower or skip
the "demonstrated repeated bottleneck" requirement above, and it never adds anything unbounded
(pstack's own self-admitted weakness — 46-47 skills, no growth cap, docs/absorb-pstack.md item 5 —
is the reason this stays a gated draft step, not an auto-apply one).

### `/epds-reference <URL>`

Use before adopting an external repository, tool, framework, command pack, or agent library. It analyzes before copying and recommends Adopt, Adapt, Observe, or Reject.

When the analysis surfaces a reusable lead, it is saved as `docs/references/<slug>.md` (format:
`docs/references/README.md`) and indexed in `docs/references/INDEX.md`, so a later `/epds-status`
run stuck on the same perspective can point at it instead of re-deriving it from scratch. It also
adds or updates an entry in `epds/trusted-sources.json` (config-managed list of trusted public
sources, editable with `epds sources list|add|remove|show`; see `docs/EPDS.md` and
`templates/epds-trusted-sources.json`).

## Delivery commands

| Command | Main question |
|---|---|
| `/discover` | What user problem is worth solving? |
| `/decide` | Build now, experiment first, defer, or reject? |
| `/experiment` | What is the cheapest way to test the riskiest assumption? |
| ↳ N-parallel | When the riskiest assumption is *which design/approach*, not *whether one works*, `/decide` or `/experiment` may use `templates/arena.md` instead of a single-shot experiment brief: run N independent attempts, judge them with an independent (cross-model where available) judge, and hand the owner the comparison to pick from — not another new command, just a template choice at the same gate. |
| `/spec` | What exactly will we build and not build? |
| `/build` | What is the smallest approved change? |
| ↳ landing | Every `/build` that reaches a commit or PR uses `templates/pr-landing.md` as its exit shape — small, ordered commits and a conventional-commits title with a briefing-style body (facts/what-changed/verification, not a narrative) — the single convergence point every build lands through, regardless of which delivery command or work-router classification produced it. |
| `/verify` | What evidence proves behavior, quality, and policy compliance? |
| ↳ panel | If `epds/models.json` exists and `roles.critic` or `roles.reviewers` is set (`epds models list`), run an adversarial review pass with each assigned id: each independently tries to break the diff/claim (correctness, missed edge cases, policy compliance) before it lands — a rebuttal pass, not a rubber stamp. No roles configured → verify proceeds with a single-pass self-review and reports that no independent panel was available (do not silently skip the note). `roles.reviewers` may be a single id or an array of ids; each contributes independently. See `templates/arena.md` for the same N-way, cross-judged pattern applied earlier at `/experiment`/`/decide` time. |
| `/release` | Is staged release safe and reversible? |
| `/observe` | What happened in real behavior, reliability, and cost? |
| `/retro` | What should we keep, expand, iterate, or stop? |

## Natural-language examples

