# Tests are not weakened to pass

Do not delete or weaken tests merely to obtain a passing result.

**Why**: A test exists to catch a real regression; deleting or loosening it to turn a FAIL green removes the very evidence `/verify` depends on.

Referenced from: `SKILL.md` § Scope and safety rules (docs/absorb-pstack.md item 2 — split into
independent files, following pstack's principle-independent-files pattern once split was warranted
by this task's own acceptance criteria; see docs/LAYOUT.md for the layout mapping).
