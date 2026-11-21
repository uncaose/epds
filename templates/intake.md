# Intake: [work title]

Rules, sequence, the no-human case and the open lists of kinds and axes: `docs/policies/intake-confirmation.md` (read it; this file does not repeat it).

Sequence: (a) section 1 approved -> (b) section 2 approved (may be the same reply) -> (c) build. Silence is not approval.

Status: draft
Allowed: `draft` | `shown` | `intake approved by <owner> on <YYYY-MM-DD>` | `decomposition approved by <owner> on <YYYY-MM-DD>` | `UNCONFIRMED (no human)` | `re-opened by correction on <date>`. Check before build: `node <skill dir>/bin/intake-check.mjs intake.md` exits 0.

## 0. TRIVIAL one-line intake

`Purpose: <one line> | Done check: <command or observable result>`. Shown before acting; if the TRIVIAL class is pre-approved (record: `<owner>, <date>, <where>`), shown with the result instead.

## 1. Intake block (shown to the owner as one block; the agent drafts every cell from evidence)

Cells left as `<...>` or empty fail the check. `N/A: <reason>` is a valid cell; N/A without a reason is not.

### A. Why chain

| field | value |
|---|---|
| need | <why now; what happens if not done> |
| start | <current state as a number or an artifact> |
| purpose | <final purpose; no higher "why" above it> |
| goal | <what is true at the end; outcome, not method> |
| success/kill | <SUCCESS: date, result / KILL: condition> |
| preserve | <behavior or assets that must not change, or N/A: reason> |

| metric | current | target | deadline | how measured | done check (oracle outside the author) |
|---|---|---|---|---|---|
| <one row per metric> | <value> | <value> | <date> | <method> | <command, or two people judge the same> |

### B. Decision axes (class: required | optional | N/A; source: owner | assumption: <evidence>; state: decided | open | blocked)

| group | axis | value | class | source | state |
|---|---|---|---|---|---|
| target | target | <who, where, how many> | required | <source> | <state> |
| organization | organization | <company share, or N/A: reason> | <class> | <source> | <state> |
| end state | end-state | <service / release / open source / GitHub only / one-off concept> | required | <source> | <state> |
| form | form | <web server / desktop / game / standalone binary / other> | required | <source> | <state> |
| infra | infrastructure | <cloud choice, cost cap, or N/A: reason> | <required if end-state is service> | <source> | <state> |
| AI | ai-model | <none / cloud API / local model, or N/A: reason> | <class> | <source> | <state> |
| promotion | promotion | <channels, or N/A: reason> | <class> | <source> | <state> |
| feedback | feedback | <issues / form / metrics, or N/A: reason> | <required if end-state is open source, public release or public service> | <source> | <state> |
| operation | operation | <agent keeps managing / periodic: interval / none> | required | <source> | <state> |
| resources | resources | <time limit, money cap, devices, people, assets> | required | <source> | <state> |
| start | start | <size of stage 1 and how it is built> | required | <source> | <state> |

Fold rule: when a parent axis makes several rows N/A, one row may name them (`infrastructure+ai-model+promotion+feedback`) with `N/A: reason`. Ask only about `open` and `blocked` rows, with 2 to 4 concrete options each.

### C. Stages (always staged; one stage finishes in one pass)

| stage | goal (part of the final goal) | done check | resources (time, money) | end state | condition to go on |
|---|---|---|---|---|---|
| 1 | <usable alone> | <check> | <time, money> | <end state> | <condition> |

If the estimate for the whole goal exceeds the resources axis, propose the split here.

### D. Blocking (any hit marks that row `blocked`; blocked rows are not defaulted and their units are not built)

- Vague: reads two ways; adjective without a number; undefined term; who, where or when missing.
- Abstract: metric, current, target or deadline missing; no way to check; method instead of outcome; two judges disagree; two features in one sentence.
- Infeasible: no end owner (person, tool, system); not estimable (offer a time-boxed spike, not "infeasible"); goal exceeds resources; hidden assumption. Kinds: undecidable, over resources, conflicting conditions, no access (account, key, device, permission), rules or terms. Offer 4 options: lower the goal, add resources, short spike first, drop it. The human picks before that unit is built.
- Found during build: never substitute (no hard-coded stand-in reported as done). Re-open this intake and hand it to the human.

## 2. Decomposition = WBS (proposed after section 1, approved before build)

Chosen kinds: <list> · chosen axes: <list> · output shape: <one file with sections / one file per kind or axis>, because <size>. Layers: `docs/ROLES.md` § Delegation layers. Unit templates: `templates/feature-spec.md`, `templates/LIFECYCLE.md` (link, do not copy). Verify conditions: pick methods by risk and cost and give each a check id and repeat it where the completion path says (`docs/policies/choose-checks-by-risk-and-oracle.md` § Traceability; a reviewer check, not a machine check); name each method left out with a one-line reason (`docs/policies/choose-checks-by-risk-and-oracle.md`).

This table is the WBS: split every row down to the smallest unit, plan, schedule and report from it (`docs/policies/wbs-first-planning.md`; it lives here, not in a separate template, so one table is approved, delegated and reported). The lead writes the top rows; each coordinator adds its branch's child rows before dispatching; each worker confirms or splits its leaf before changing anything. Start a unit only when every id in `depends on` is `done`. TRIVIAL: one row (`1 | <unit> | <check id> | <status>`).

| id | parent | unit | kind | axis | layer | owner of the decision | depends on | size | tier | wait reason | verify condition | status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| <1.2.3> | <1.2> | <one verifiable change or deliverable> | <kind> | <axis> | <lead / domain coordinator / worker> | <owner / lead / coordinator> | <ids or -> | <S / M / L or estimate> | <cheap / mid / top; cheapest that passes the check> | <empty if running or done; else dependency / ownership overlap / serial shared commit / device budget> | <check id> <method from `docs/verification-methods.md`>: <command + expected exit code, or observable check> | <todo / doing / blocked / done / unverified> |

## 3. Corrections and direction changes

Each one re-opens this intake: re-show the changed items plus purpose and done criteria, and re-confirm before the touched units continue.

| date | changed items | units touched | re-confirmed by |
|---|---|---|---|
| <date> | <items> | <units> | <owner reply> |
