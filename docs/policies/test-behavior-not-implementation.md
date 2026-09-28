# Test behavior, not implementation

Write and evaluate tests against observable behavior, not internal implementation details that can change without changing behavior.

**Why**: A test coupled to implementation details (private field names, call order, internal function shape) breaks on a harmless refactor and can stay green through an actual behavior regression if the refactor happens to preserve the wrong internals — the opposite of what a test is supposed to catch. Assert on inputs/outputs, exit codes, and files written, the same evidence `/verify` itself relies on. (docs/absorb-pstack.md — pstack's `test-behavior-not-implementation` principle, `README.md:222`.)

Referenced from: `SKILL.md` § Scope and safety rules — see `docs/policies/README.md` for why these are separate files.
