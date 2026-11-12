# Test behavior, not implementation

Write and evaluate tests against observable behavior, not internal implementation details that can change without changing behavior; before a structural change, pin current behavior with a characterization test, snapshot or equivalence check.

**Why**: A test coupled to implementation details (private field names, call order, internal function shape) breaks on a harmless refactor and can stay green through an actual behavior regression if the refactor happens to preserve the wrong internals — the opposite of what a test is supposed to catch. Assert on inputs/outputs, exit codes, and files written, the same evidence `/verify` itself relies on. (docs/absorb-pstack.md — pstack's `test-behavior-not-implementation` principle, `README.md:222`.)

**Pin before a structural change**: before moving structure (a refactor, rename or reshape), capture what the code does now: a characterization test, a snapshot, or an equivalence check that compares old and new outputs on the same inputs. Where the area has no coverage, write the pin first. A type check or lint is not a pin. Keep the pin green after each small step. A cleanup that reveals a bug or a missing feature is split out and shipped separately, after the structural change lands against the pin. (docs/absorb-pstack.md — pstack's `refactoring` playbook; restated in EPDS's own words.)

Referenced from: `SKILL.md` § Scope and safety rules — see `docs/policies/README.md` for why these are separate files.
