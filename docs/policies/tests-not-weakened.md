# Tests are not weakened to pass

Do not delete or weaken tests merely to obtain a passing result.

**Why**: A test exists to catch a real regression; deleting or loosening it to turn a FAIL green removes the very evidence `/verify` depends on.

Referenced from: `SKILL.md` § Scope and safety rules — see `docs/policies/README.md` for why these are separate files.
