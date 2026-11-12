# Intake: [work title]

Rules, sequence, the no-human case and the open lists of kinds and axes: `docs/policies/intake-confirmation.md` (read it; this file does not repeat it).

Sequence: (a) section 1 approved -> (b) section 2 approved (may be the same reply) -> (c) build. Silence is not approval.

Status: `draft` | `shown` | `intake approved by <owner> on <date>` | `decomposition approved by <owner> on <date>` | `UNCONFIRMED (no human)` | `re-opened by correction on <date>`

## 0. TRIVIAL one-line intake

`Purpose: <one line> | Done check: <command or observable result>`. Shown before acting; if the TRIVIAL class is pre-approved (record: `<owner>, <date>, <where>`), shown with the result instead.

## 1. Intake block (shown to the owner as one block)

| 5W1H | item | value | source | marked |
|---|---|---|---|---|
| why | purpose | <one sentence> | <owner turn or file> | owner |
| why | done criteria | <observable checks> | <owner turn or file> | owner |
| who | users and their situation | <...> | <file:line, log, turn> | assumption |
| what | scope and non-goals | <in / out> | <file:line, log, turn> | assumption |
| when | deadline or timing | <date, window, trigger> | <file:line, log, turn> | assumption |
| where | platform, environment, location of the change | <...> | <file:line, log, turn> | assumption |
| how | approach and constraints | <one or two lines> | <file:line, log, turn> | assumption |

## 2. Decomposition (proposed after section 1, approved before build)

Chosen kinds: <list> · chosen axes: <list> · output shape: <one file with sections / one file per kind or axis>, because <size>. Layers: `docs/ROLES.md` § Delegation layers. Unit templates: `templates/feature-spec.md`, `templates/LIFECYCLE.md` (link, do not copy). Verify conditions: pick methods by risk and cost and give each a check id; an executable check's id is repeated in its LIFECYCLE row, a manual check's id in the final report's acceptance list with steps and observation (a reviewer check, not a machine check); name each method left out with a one-line reason (`docs/policies/choose-checks-by-risk-and-oracle.md`).

| unit | kind | axis | layer | owner of the decision | verify condition |
|---|---|---|---|---|---|
| <name> | <kind> | <axis> | <lead / domain coordinator / worker> | <owner / lead / coordinator> | <check id> <method from `docs/verification-methods.md`>: <command + expected exit code, or observable check> |

## 3. Corrections and direction changes

Each one re-opens this intake: re-show the changed items plus purpose and done criteria, and re-confirm before the touched units continue.

| date | changed items | units touched | re-confirmed by |
|---|---|---|---|
| <date> | <items> | <units> | <owner reply> |
