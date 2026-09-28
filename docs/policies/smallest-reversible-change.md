# Smallest reversible change

Default to the smallest reversible change that can produce learning.

**Why**: Smaller changes are cheaper to verify, cheaper to revert, and produce a decision-relevant signal faster than a big-bang change.

Smallest reversible does not mean leaving a throwaway compatibility shim in place indefinitely.
When a change migrates every caller of an old path to a new one, delete the old path in the same
change or the very next one — a permanent compat shim is scope creep that never gets cleaned up
just as much as an unrelated refactor is (docs/absorb-pstack.md item 3 N7 rework, pstack's
`outcome-oriented-execution`/`migrate-callers-then-delete-legacy-apis` principles, `README.md:209`
and `README.md:217`).

A tool or script built to perform a change should converge to the same end state regardless of a
partial prior run — safe to re-run after an interrupted attempt, not just safe to run once
(docs/absorb-pstack.md item 14 P7 rework, pstack's `make-operations-idempotent` principle,
`README.md:216`).

Referenced from: `SKILL.md` § Scope and safety rules — see `docs/policies/README.md` for why these are separate files.
