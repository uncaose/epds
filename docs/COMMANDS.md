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

### `/epds-audit`

Use when the project has too many instructions, duplicated guidance, stale commands, missing tests, or unclear ownership between `AGENTS.md` and `CLAUDE.md`.

Default mode is report-only. Use patch mode only after reviewing the proposed change plan.

### `/epds-upgrade`

Use after recurring needs emerge. It should not add tools, agents, evals, or CI merely because they are fashionable. It must connect any addition to a repeated failure or demonstrated bottleneck.

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
| `/spec` | What exactly will we build and not build? |
| `/build` | What is the smallest approved change? |
| `/verify` | What evidence proves behavior, quality, and policy compliance? |
| `/release` | Is staged release safe and reversible? |
| `/observe` | What happened in real behavior, reliability, and cost? |
| `/retro` | What should we keep, expand, iterate, or stop? |

## Natural-language examples

