# Intake shown and approved before building

Before building any work that is not TRIVIAL, fill the intake (purpose, done criteria, users, scope and non-goals, constraints, approach) from evidence, show the completed intake to the owner as one explicit block, and get explicit approval; on every mid-course correction or direction change, re-show the changed items plus purpose and done criteria and re-confirm them.

**What the intake holds** (`templates/intake.md`):

- Owner-only items: purpose (why) and done criteria (what counts as done). Mark them `owner`. The agent may draft them, but only the owner's approval settles them.
- Agent-filled items: users, scope and non-goals, constraints, approach. Mark each as an `assumption` with the evidence it came from (file, log, conversation turn).
- The decomposition the agent proposes (below). It is part of the same block, so the owner approves the split together with the goal.

Silence is not approval. Approval is an explicit reply to the shown block. If no human can answer (SKILL.md step 2), do not mark the intake approved: record it under `Assumptions` as unconfirmed, do only work the work router allows without owner approval, and show the intake at the next chance.

**Re-confirmation.** A mid-course correction or direction change re-opens the intake. Re-show only the changed items plus purpose and done criteria, mark which units of the decomposition the change touches, and get explicit approval again before continuing those units.

**Decompose the approved intake.**

- Artifact kinds, for example: PRD, spec, plan, design, security, test, proof and verify conditions.
- Separation axes, for example: domain, layer, module, common/shared, auth, infra, security, design system, design.
- Both lists are open examples, not a closed set. Kinds and axes are added or dropped according to the project's size, nature and constraints; the agent picks the set and shows it in the intake block for approval.
- Output is one file with a section per kind or axis, or one file per kind or axis. Pick by size and say which was chosen.
- Assign each unit to a delegation layer (lead, domain coordinator, worker) as defined in `docs/ROLES.md` § Delegation layers. Each unit carries the owner of its decision and its verify condition.
- Reuse existing templates for the units themselves (`templates/feature-spec.md`, `templates/LIFECYCLE.md`); the intake points to them and does not copy them.

**Exemption.** TRIVIAL work (`templates/WORK-ROUTER.md`) skips the intake: one file, one feature or one small change goes straight to its lifecycle checks.

**Why**: Only the owner can say why the work exists and what counts as done; everything else the agent can fill from evidence. Showing the filled result once, explicitly, catches a wrong reading before it is built, and costs the owner one reply instead of many questions. A correction changes the premise of work already split and delegated, so the changed items must be confirmed again, not carried forward silently. A fixed list of documents or layers fits no project well, so the split scales with the project.

Referenced from: `docs/PROTOCOL.md` § Scope and safety rules — see `docs/policies/README.md` for why these are separate files.
