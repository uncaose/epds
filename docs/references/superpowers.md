---
source: https://github.com/obra/superpowers
kind: skill
perspectives: [delivery, agent-ops]
patterns: [skill-habit-framework, tdd-first]
applies_to: [build, verify]
evidence_grade: community
captured: 2026-09-16
---

## Analysis

obra/superpowers — a framework that turns TDD, debugging, collaboration, planning, code review and verification into habits through skills. It is also loaded in this session as a Claude
Code plugin (local cache v6.3.0 measured).

**skill-habit-framework**: packages methodology not as documents but as trigger-type skills (`test-driven-development`,
`systematic-debugging`, `verification-before-completion`) that remind automatically on every task.
Lead: EPDS's evidence-first protocol too must be a procedure enforced at the front of every command, not "a good article to have read".

**tdd-first**: write the failing test before implementing — `docs/TESTS.md` "Layer: Code" is the minimum
element of this pattern.

## Measured

`verification-before-completion/SKILL.md` (local plugin cache
`~/.claude/plugins/cache/claude-plugins-official/superpowers/6.3.0/skills/verification-before-completion/SKILL.md`,
checked 2026-09-18) structure: frontmatter(name/description) → "Iron Law"(`NO COMPLETION CLAIMS WITHOUT
FRESH VERIFICATION EVIDENCE`) → 5-step Gate Function(IDENTIFY→RUN→READ→VERIFY→claim) → Common
Failures table (7 rows: "what counts as sufficient evidence" per tests/linter/build/bug-fix/regression/agent/requirements) → Red Flags → Rationalization Prevention table → Key Patterns(✅/❌ contrast) → When To Apply.
Only the file was checked; running the skill itself (the trigger) cannot be reproduced in this CLI-isolated environment.

## How EPDS uses it

Build/Verify — the yardstick for contrasting the EPDS table 1 warning "business judgment is missing and only execution discipline is there" with the `docs/TESTS.md` 4 layers.
The Common Failures table's "evidence vs insufficient" dichotomy is directly isomorphic to the EPDS `evidence-first` protocol (no claiming "done" without
exit codes, logs or checking the real artifact).

> "An agentic skills framework & software development methodology that works." — repo
> description(gh api measured 2026-09-16, stars 287306; remeasured 2026-09-18: stars 288320).
