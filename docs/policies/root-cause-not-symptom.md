# Fix root causes, not symptoms

Reproduce a reported symptom on the real surface, trace it to its root cause with evidence from the running system, and check every caller of the code you are about to touch before patching; revert what a refuted hypothesis motivated.

**Why**: A report names a symptom, not the cause. A guard clause added only on the one path the report named leaves every sibling caller still broken; the smaller diff and the correct fix are usually the same one — a guard in the shared function all callers route through, not a guard repeated in each caller. (docs/absorb-pstack.md — pstack's `fix-root-causes` principle, `README.md:220`.)

**Order**:

1. **Reproduce on the real surface**, where the bug shows (the running product, the real command line, the real page). If it will not reproduce, narrow the conditions or add instrumentation until it does. Ask a person to reproduce it only with a stated reason the surface cannot be reached.
2. **Take evidence from the running system**: logs, a profile for a slow or spinning process, a trace, a heap snapshot for a leak. When a capture already exists, read it as a fixed dataset. Without a paired before-and-after capture, call the finding the strongest hypothesis, not a confirmed cause.
3. **Find the cause.** List candidate causes and rule them out with that evidence until one survives, then map it to the file and line.
4. **Fix, then re-run the same reproduction on the same surface.** An inconclusive or wrong-surface result is not a pass.

**Revert what a refuted hypothesis motivated**: a change added because a hypothesis "might help" is removed when the evidence refutes that hypothesis. Only the smallest change the evidence justifies ships. (docs/absorb-pstack.md — pstack's `bug-fix`, `runtime-forensics` and `trace-forensics` playbooks; restated in EPDS's own words.)

Referenced from: `SKILL.md` § Scope and safety rules — see `docs/policies/README.md` for why these are separate files.
