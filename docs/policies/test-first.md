# Write the failing test first

Write a failing test that reproduces the bug or missing behavior before writing the fix.

**Why**: A test written after the fix only proves the fix runs, not that it catches the thing it claims to fix — confirming it fails for the right reason first is what makes the later green result mean something. See `docs/policies/tests-not-weakened.md` for the companion rule against loosening that same test to force a pass. (docs/absorb-pstack.md — pstack's `tdd` skill/principle, `README.md:126`.)

Referenced from: `SKILL.md` § Scope and safety rules — see `docs/policies/README.md` for why these are separate files.
