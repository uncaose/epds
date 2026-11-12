# Intake shown and approved before building

Before building, fill the intake (who, what, when, where, why, how, and done criteria) from evidence, show it to the owner and get explicit approval, then get the proposed decomposition approved before building; re-show and re-confirm the changed items plus purpose and done criteria on every mid-course correction or direction change, and show TRIVIAL work as a one-line intake.

**Sequence** (one order, in the policy and in `templates/intake.md` alike):

1. **Intake approved.** The agent fills the intake and shows it as one block. The owner approves it explicitly.
2. **Decomposition approved.** The agent proposes the decomposition (below) and the owner approves it explicitly. Steps 1 and 2 may be one message when the owner approves both in one reply.
3. **Build.** Only approved units are built. Child rows split inside an approved unit's scope and done criteria are parts of that unit (`docs/policies/wbs-first-planning.md`).

Silence is not approval. Approval is an explicit reply to what was shown.

**What the intake holds** (rows in `templates/intake.md`):

- Owner-only, marked `owner`: why (purpose) and done criteria (what counts as done). The agent may draft them; only the owner's approval settles them.
- Agent-filled, each marked `assumption` with its evidence (file, log, conversation turn): who (users), what (scope and non-goals), when (deadline or timing), where (platform, environment, location of the change), how (approach and constraints).

**No human available.** When no human can answer (SKILL.md step 2), the intake is recorded as `UNCONFIRMED` under `Assumptions`, never as approved. Building continues only for work the work router allows without owner approval, and the unconfirmed intake is the first thing shown when a human returns.

**Re-confirmation.** A mid-course correction or direction change re-opens the intake. Re-show only the changed items plus purpose and done criteria, name the decomposition units the change touches, and get explicit approval again before those units continue.

**Decomposition.**

- Artifact kinds, for example: PRD, spec, plan, design, security, test, proof and verify conditions.
- Separation axes, for example: domain, layer, module, common/shared, auth, infra, security, design system, design.
- Both lists are open examples, not a closed set. Kinds and axes are added or dropped according to the project's size, nature and constraints; the agent picks the set and shows it for approval.
- Output is one file with a section per kind or axis, or one file per kind or axis. Pick by size and say which was chosen.
- Each unit is assigned to a delegation layer as defined in `docs/ROLES.md` § Delegation layers, with the owner of its decision and its verify condition. Units reuse `templates/feature-spec.md` and `templates/LIFECYCLE.md` by link; nothing is copied.

**TRIVIAL work** (`templates/WORK-ROUTER.md`) uses a light path, not an exemption: show a one-line intake (purpose + done check) before acting. The owner may pre-approve the TRIVIAL class once; record that approval (who, date, where) in the project. After it, the one-line intake is shown together with the result instead of waiting for a reply. Everything that is not TRIVIAL uses the full block.

**The shown intake is the restatement**: showing the filled intake is how the agent restates, in its own words, the owner's goal and the problem being solved. A wrong reading shows up there, before anything is built. It is not a separate step; the intake block already does it. (docs/absorb-pstack.md — pstack's `in-your-own-words` skill.)

**Why**: Only the owner can say why the work exists and what counts as done; everything else the agent can fill from evidence. Showing the filled result once, explicitly, catches a wrong reading before it is built, and costs the owner one reply instead of many questions. A correction changes the premise of work already split and delegated, so the changed items must be confirmed again, not carried forward silently. A fixed list of documents or layers fits no project well, so the split scales with the project.

Referenced from: `docs/PROTOCOL.md` § Scope and safety rules — see `docs/policies/README.md` for why these are separate files.
