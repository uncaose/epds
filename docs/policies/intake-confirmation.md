# Intake shown and approved before building

Before building, fill the intake (who, what, when, where, why, how, and done criteria) from evidence, show it to the owner and get explicit approval, then get the proposed decomposition approved before building; re-show and re-confirm the changed items plus purpose and done criteria on every mid-course correction or direction change, and show TRIVIAL work as a one-line intake.

**Sequence** (same order in `templates/intake.md`): (1) the agent fills the intake from evidence and shows it as one block; the owner approves it explicitly. (2) The agent proposes the decomposition; the owner approves it (steps 1 and 2 may share one reply). (3) Build only approved units; child rows inside an approved unit's scope and done criteria belong to it (`docs/policies/wbs-first-planning.md`). Silence is not approval.

**Defaults.** Rows classed `required` and rows `blocked` are never defaulted: the owner decides them. `optional` rows and rows marked `assumption` keep a stated default with its evidence. The checker enforces fill, class, N/A reasons, stages and approval: `node <skill dir>/bin/intake-check.mjs intake.md` must exit 0 before building.

**No human available.** Record the intake as `UNCONFIRMED`, never approved. Units behind a required or blocked row are not built; other units continue only where the work router allows without owner approval. Show the unconfirmed intake first when a human returns.

**Re-confirmation.** A correction or direction change re-opens the intake: re-show the changed items plus purpose and done criteria, name the touched units, and get approval again before they continue. A problem found during build is a re-opening, never a silent substitution.

**Decomposition.** Kinds (for example PRD, spec, plan, design, security, test, proof, verify conditions) and axes (for example domain, layer, module, shared, auth, infra, security, design system) are open examples; the agent picks the set for the project's size and shows it. Output is one file with sections or one file per kind or axis. Each unit gets a delegation layer (`docs/ROLES.md` § Delegation layers), a decision owner and a verify condition, reusing `templates/feature-spec.md` and `templates/LIFECYCLE.md` by link.

**TRIVIAL work** (`templates/WORK-ROUTER.md`) shows a one-line intake (purpose + done check) before acting. The owner may pre-approve the class once (record who, date, where); then the line is shown with the result. Everything else uses the full block.

**The shown intake is the restatement** of the owner's goal in the agent's own words; a wrong reading shows up before anything is built (docs/absorb-pstack.md, pstack's `in-your-own-words`).

**Why**: Only the owner can say why the work exists and what counts as done; the rest comes from evidence. One explicit showing costs one reply instead of many questions, and a correction changes the premise of work already split, so it is confirmed again.

Referenced from: `docs/PROTOCOL.md` § Scope and safety rules; see `docs/policies/README.md`.
