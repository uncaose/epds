---
source: https://docs.claude.com/en/docs/claude-code/skills
kind: doc
perspectives: [agent-ops]
patterns: [skill-frontmatter-format]
applies_to: [build, spec]
evidence_grade: official
captured: 2026-09-18
---

## Analysis

Official Anthropic docs for Claude Code Skills: SKILL.md frontmatter fields
(`name`, `description`, `argument-hint`) and description-based auto-trigger
discovery rules. Basis for EPDS's own `adapters/claude-code/commands` and
every SKILL.md this project ships.

## Measured

n/a — document/thread source (verified 2026-09-18: url reachable, HTTP 200)

## How EPDS uses it

Build/Spec — every EPDS command (`/epds-status`, `/epds-setup`, ...) is a
SKILL.md whose frontmatter follows this doc's format; `/epds-reference` and
the skill loader both depend on the description-based auto-trigger rule
documented here.
