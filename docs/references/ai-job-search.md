---
source: https://github.com/MadsLorentzen/ai-job-search
kind: repo
perspectives: [delivery, agent-ops]
patterns: [repo-layout-contract-driven]
applies_to: [spec, build, verify]
evidence_grade: community
captured: 2026-09-16
---

## Analysis

MadsLorentzen/ai-job-search — job-search automation based on Claude Code. The target the human asked about directly: "a well-organized setup in templates, tests, tools and .claude
— is this a normal level pattern for AI use?". The primary source of `docs/LAYOUT.md`
(agent-neutral core + thin adapter tree).

**repo-layout-contract-driven**: CLAUDE.md/AGENTS.md (constitution) → .claude/commands (reproducible procedures) →
.claude/skills (job rules) → .agents/skills/*/cli (runnable tools) → templates (output skeletons) → tests/CI (continuous
verification) → tools/verify_*.py (judges "usable", not just "generated") → SECURITY.md (distrust external input) are
separated. Lead: it is not a "project that writes good prompts"; inputs, procedures, tools, verification and safety rules must be separated into the repository structure itself
to be reproducible — direct evidence for EPDS.md §3 and docs/LAYOUT.md.

## Measured

n/a — document/thread source (verified 2026-09-18: url reachable, HTTP 200). The repository itself has no concept of "install/run"
(it is a template you fork and use for your own job search) — used only as a structure reference.

## How EPDS uses it

Spec/Build/Verify — the primary source of the core + adapter tree structure of `docs/LAYOUT.md`. EPDS's own directory separation
(adapters/·templates/·tests/·tools/) follows this layout as is.

> "The job search that runs on your machine. AI job application framework built on Claude Code:
> evaluate postings, tailor CVs, write cover letters, prep interviews. Fork it and own it." — repo
> description(gh api measured 2026-09-16, stars 43033; remeasured 2026-09-18: stars 43214, open_issues 5).
