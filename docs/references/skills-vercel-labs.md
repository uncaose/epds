---
source: https://github.com/vercel-labs/skills
kind: tool
perspectives: [agent-ops, cost]
patterns: [skill-installer-cli]
applies_to: [build]
evidence_grade: official
captured: 2026-09-18
---

## Analysis

Vercel Labs' `npx skills` CLI: installs a repo's SKILL.md (plus slash
commands) into Claude Code, Cursor, or other supported agent hosts in one
command. `docs/INSTALL.md`'s recommended install path for EPDS itself.

## Measured

n/a — document/thread source (verified 2026-09-18: url reachable, HTTP 200)

## How EPDS uses it

Build — `docs/INSTALL.md`'s verified-installs table names
`npx skills add uncaose/epds -a claude-code` as the primary install command;
not exercised here (would install EPDS into a foreign host, out of scope for
this measurement pass — url-reachability only).
