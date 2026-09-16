# CLAUDE.md

## EPDS entry point

Common product, safety, and quality rules are defined by the repository-root `AGENTS.md`.

Before new work, read `PRODUCT.md`, `PROJECT-STATE.md`, `METRICS.md`, `AGENTS.md`, and relevant specifications/tests.

Classify natural-language requests using `epds/WORK-ROUTER.md` when it exists.

## EPDS commands

- `/epds-setup`: inspect and install EPDS in this repository
- `/epds-status`: diagnose state and next bottleneck
- `/epds-audit`: audit EPDS/instructions/verification structure
- `/epds-upgrade`: add only needed EPDS maturity layers
- `/epds-reference <URL>`: analyze an external pattern before adoption
- `/discover`, `/decide`, `/experiment`, `/spec`, `/build`, `/verify`, `/release`, `/observe`, `/retro`

Keep long workflow instructions in `epds/commands/`. Keep this file focused on Claude Code-specific entry points, project commands, and constraints.

## Claude-specific constraints

Add actual build, test, design, tool, permission, and deployment constraints for this repository below this line.

## Verification

Before claiming completion:

- Run relevant tests.
- Run relevant `tools/` checks when available.
- Report evidence, unverified items, and risks.
