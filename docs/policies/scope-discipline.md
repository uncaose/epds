# Scope discipline

Do not expand scope with unrelated refactors, dependency replacement, redesign, or speculative features. Propose those separately.

**Why**: Bundling unrelated changes into one diff makes review and rollback harder and hides the actual requested change.

Referenced from: `SKILL.md` § Scope and safety rules (docs/absorb-pstack.md item 2 — split into
independent files, following pstack's principle-independent-files pattern once split was warranted
by this task's own acceptance criteria; see docs/LAYOUT.md for the layout mapping).
