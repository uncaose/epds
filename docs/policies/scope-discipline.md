# Scope discipline

Do not expand scope with unrelated refactors, dependency replacement, redesign, or speculative features. Propose those separately.

**Why**: Bundling unrelated changes into one diff makes review and rollback harder and hides the actual requested change.

Before editing a function, config key, or module other code depends on, check its callers first —
grep for every place that references it, not just the one path a report or request named. This is
the cheap, doc-level version of a blast-radius check: it doesn't compute anything automatically, it
just requires looking before editing shared code (docs/absorb-pstack.md Skills table #5 (N7 rework),
pstack's `blast-radius` skill, `README.md:116`).

Referenced from: `SKILL.md` § Scope and safety rules — see `docs/policies/README.md` for why these are separate files.
