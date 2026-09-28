# Fix root causes, not symptoms

Trace a reported symptom to its root cause before patching — check every caller of the code you are about to touch.

**Why**: A report names a symptom, not the cause. A guard clause added only on the one path the report named leaves every sibling caller still broken; the smaller diff and the correct fix are usually the same one — a guard in the shared function all callers route through, not a guard repeated in each caller. (docs/absorb-pstack.md — pstack's `fix-root-causes` principle, `README.md:220`.)

Referenced from: `SKILL.md` § Scope and safety rules — see `docs/policies/README.md` for why these are separate files.
