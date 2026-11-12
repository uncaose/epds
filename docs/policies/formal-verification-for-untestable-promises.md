# Formal verification where tests cannot reach

When a promise the code makes can be broken by an ordering, retry, race, or input that tests rarely reach (concurrency, retries, locks, state machines, parsers, unsafe code), check that promise with a tool that covers every case in a stated scope (a model checker such as TLA+ for bad event orders, a code-level verifier or bounded checker for per-input properties, a proof only when a bound is not enough). Prefer the cheapest tool that answers the question and that the project's developers can run.

A verification counts only if:
- **It points at real code.** Every step in the model or harness maps to code a reviewer can open, and one indivisible step in the code stays one step in the model.
- **It has been seen to fail.** Each property is shown failing on a deliberately broken copy of the code it guards (a removed check, a reordered step), then the break is dropped.
- **Findings stay findings.** A counterexample on current code is reported as a bug, told as steps in the code's own words. Never weaken the property, the model, or the bound to get a pass, and do not change product code unless the user asks.
- **Its scope is stated.** Say what is covered, under which bounds and assumptions, and what is not. A pass covers the model or the bound, not the system.
- **It records what it describes.** Keep the covered files/functions and the commit at which the verification was last confirmed to describe them. When covered code changes after that commit, re-confirm before trusting a pass: a check that still passes on a stale description is the dangerous case. Classify each recheck as in sync, updated, bug, or blocked, and keep verification updates in a change separate from product fixes.

**Why**: Tests check the cases someone thought to write; ordering and retry bugs live in the cases nobody wrote, and they survive large green suites. A pass that has never failed, or that describes code which has since changed, proves nothing while looking like proof. (docs/absorb-pstack.md — pstack's `create-formal-verification-skill` and `maintain-formal-verification-skill`, `skills/*/SKILL.md` at `cursor/plugins` commit `34b1b7c`, 2026-10-27; restated in EPDS's own words, not copied.)

Referenced from: `docs/PROTOCOL.md` — see `docs/policies/README.md` for why these are separate files.
