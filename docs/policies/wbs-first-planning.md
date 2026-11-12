# Plan with a WBS first, at every layer

Before working, every layer (lead, domain coordinator, worker) first plans with a WBS that takes the intake decomposition down to the smallest unit, one that a single worker can finish in one pass and whose required checks can prove on its own (otherwise split it); then run units in dependency order within the real budget, never start a unit before every unit it depends on is done, keep each unit's status current, re-plan the affected branch when a unit is blocked or a correction changes scope, and report every row of the WBS with its status and check evidence; TRIVIAL work uses a one-line WBS.

**The WBS is the decomposition, not a second table.** It is the decomposition table in `templates/intake.md` § 2, extended with the columns `id` (hierarchical: 1, 1.2, 1.2.3), `parent`, `depends on` (ids), `size` (S/M/L or an estimate) and `status` (`todo` / `doing` / `blocked` / `done` / `unverified`). The `unit`, `layer` and verify-condition cells keep their meaning; the verify condition starts with the check id (`docs/policies/choose-checks-by-risk-and-oracle.md` § Traceability).

**Smallest-unit rule.** A unit is small enough when one worker can finish it in one pass and its required checks (chosen per `docs/policies/choose-checks-by-risk-and-oracle.md`) can prove it on its own, without the result of another unit. If either is false, split it into child rows (`1.2` -> `1.2.1`, `1.2.2`) until both are true. Only leaves are executed; a parent's status is derived from its children: `done` only when all children are `done`, `blocked` if any child is `blocked`.

**Each layer plans at its own scope, before it works** (layers: `docs/ROLES.md` § Delegation layers):

1. The lead writes the top WBS from the approved intake; it is the decomposition the owner approves (`docs/policies/intake-confirmation.md`).
2. Each domain coordinator expands its own branch into child rows before dispatching any of them.
3. Each worker confirms its leaf, or splits it into child rows, before changing anything.

**Rows added below the approved decomposition.** A coordinator's or worker's split that stays inside the approved unit's scope and done criteria needs no re-approval; record it in the WBS. A split that adds scope, adds a new deliverable, or changes an owner decision goes back through `docs/policies/intake-confirmation.md` before the touched units continue.

**Proportionate.** TRIVIAL work uses a one-line WBS (`1 | <unit> | <check id> | <status>`, the same line as the one-line intake's done check). Work with no delegation has no coordinator rows; work done by one agent has lead and worker rows only where the split helps.

**Scheduling.**

- Order units by `depends on` (topological order). A unit whose dependencies are not all `done` stays `todo`; it is never started early.
- Run independent units in parallel only within the budget you actually have: usage limits, device and disk limits, and one writer per file. Two units that write the same file are not independent.
- Update `status` when a unit starts (`doing`), stops on a dependency or a failure (`blocked`, with one line why), and finishes (`done` only with its check evidence; a finished unit whose check did not run is `unverified`).
- When a unit is blocked or a correction changes scope, re-plan the affected branch: update its rows, dependencies and order, then continue. Re-confirm through the intake whenever `docs/policies/intake-confirmation.md` § Re-confirmation requires it (recorded in § 3 of `templates/intake.md`) before the touched units continue.

**Report.** The final report lists every row of the WBS with its status (a parent's status derived from its children as above) and, for each leaf, its check evidence (command and exit code, or the steps of a manual check). A unit that is not `done` is never reported as done. A worker's handoff is its own leaf rows in the lean-handoff form (`docs/policies/lean-handoff.md`).

**Why**: Work started before it is broken down gets sized by guesswork, delegated in pieces nobody can check, and run in an order that breaks on a missing prerequisite. Splitting to units one pass can finish and one check can prove makes every piece verifiable, and dependency order plus a live status shows what can run now, what waits, and what is truly finished. Keeping the WBS inside the intake decomposition means one table is approved, delegated and reported, instead of two that drift apart. Re-planning only the affected branch keeps a block or correction from silently invalidating work already done. (Source: the project owner's directive that every layer writes a WBS to the smallest unit before working, with scheduling management on top; work breakdown structures as general project-management practice; restated in EPDS's own words.)

Referenced from: `docs/PROTOCOL.md` § Scope and safety rules — see `docs/policies/README.md` for why these are separate files.
