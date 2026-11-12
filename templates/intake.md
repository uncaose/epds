# Intake: [work title]

Fill every row from evidence, then show this whole block to the owner and get an explicit approval before building. Policy: `docs/policies/intake-confirmation.md`. TRIVIAL work (`templates/WORK-ROUTER.md`) is exempt and skips this file.

Status: `draft` | `shown` | `approved by <owner> on <date>` | `re-opened by correction on <date>`

## 1. Confirmation block (shown to the owner as one block)

| item | value | source | marked |
|---|---|---|---|
| purpose (why) | <one sentence> | <owner turn or file> | owner |
| done criteria (what counts as done) | <observable checks> | <owner turn or file> | owner |
| users | <who uses it, in what situation> | <file:line, log, turn> | assumption |
| scope and non-goals | <in / out> | <file:line, log, turn> | assumption |
| constraints | <time, budget, platform, policy, data> | <file:line, log, turn> | assumption |
| approach | <how, in one or two lines> | <file:line, log, turn> | assumption |
| artifact kinds chosen | <e.g. PRD, spec, plan, design, security, test, proof, verify conditions> | size and nature of this project | assumption |
| separation axes chosen | <e.g. domain, layer, module, common/shared, auth, infra, security, design system, design> | size and nature of this project | assumption |
| output shape | <one file with sections / one file per kind or axis> and why | size of this project | assumption |

The kind and axis lists above are open examples, not a closed set: add or drop kinds and axes as the project's size, nature and constraints require, and show the chosen set here for approval.

Approval: the owner replies explicitly to this block. Silence is not approval. If no human can answer, keep Status at `shown`, record the block under `Assumptions` as unconfirmed, and do only work the work router allows without owner approval.

## 2. Decomposition (after approval)

Layers are those of `docs/ROLES.md` § Delegation layers (lead, domain coordinator, worker). Each unit uses an existing template where one fits (`templates/feature-spec.md` for a spec, `templates/LIFECYCLE.md` for checks); do not copy them here.

| unit | kind | axis | layer | owner of the decision | verify condition |
|---|---|---|---|---|---|
| <name> | <PRD / spec / plan / ...> | <domain / layer / module / ...> | <lead / domain coordinator / worker> | <owner / lead / coordinator> | <command + expected exit code, or observable check> |

## 3. Corrections and direction changes

Every mid-course correction or direction change re-opens this intake. Re-show only the changed items plus purpose and done criteria, list the units the change touches, and re-confirm them explicitly before those units continue.

| date | changed items | units touched | re-confirmed by |
|---|---|---|---|
| <date> | <items> | <units> | <owner reply> |
