# Intake: [work title]

Rules, sequence, no-human case: `docs/policies/intake-confirmation.md`. Sequence: section 1 approved -> section 2 approved (may be the same reply) -> build. Silence is not approval.

Status: draft
Allowed: `draft` | `shown` | `intake approved by <owner> on <YYYY-MM-DD>` | `decomposition approved by <owner> on <YYYY-MM-DD>` | `UNCONFIRMED (no human)` | `re-opened by correction on <date>`. Before build: `node <skill dir>/bin/intake-check.mjs intake.md` exits 0 (catches honest omissions, not forgery).

## 0. TRIVIAL one-line intake

`Purpose: <one line> | Done check: <command or observable result>`. Shown before acting (or with the result if the class is pre-approved: `<owner>, <date>, <where>`).

## 1. Intake block (the agent drafts every cell from evidence)

Cells left as `<...>` or empty fail the check. `N/A: <reason>` is valid; N/A without a reason is not.

### A. Why chain (required)

| field | value |
|---|---|
| need | <why now; what if not done> |
| start | <current state, a number or artifact> |
| purpose | <final purpose> |
| goal | <what is true at the end; outcome, not method> |
| success/kill | <SUCCESS: date, result / KILL: condition> |
| preserve | <what must not change, or N/A: reason> |

| metric | current | target | deadline | how measured | done check (oracle outside the author) |
|---|---|---|---|---|---|
| <one row per metric> | <value> | <value> | <date> | <method> | <command, or two people judge the same> |

### B. Decision axes (optional: delete this section, or keep only rows that are open, blocked or change the build)

Axes: target, organization, end-state, form, infrastructure, ai-model, promotion, feedback, operation, resources, start. Add a row only for service infra, public release feedback, AI model, money or time cap, or any axis still open. Rows kept are checked.

| group | axis | value | class (required / optional / N/A) | source (owner / assumption: <evidence>) | state (decided / open / blocked) |
|---|---|---|---|---|---|
| <group> | <axis> | <value or N/A: reason> | <class> | <source> | <state> |

### C. Stages (required; one stage finishes in one pass)

| stage | goal (part of the final goal) | done check | resources (time, money) | end state | condition to go on |
|---|---|---|---|---|---|
| 1 | <usable alone> | <check> | <time, money> | <end state> | <condition> |

### D. Blocking (a hit marks the row `blocked`; blocked rows are not built)

- Vague: two readings, adjective without a number, undefined term, who/where/when missing.
- Abstract: metric, current, target or deadline missing; no way to check; method instead of outcome.
- Infeasible: no end owner, not estimable, over resources, hidden assumption, no access, rules or terms. Offer: lower the goal, add resources, short spike, drop it.
- Found during build: never substitute; re-open this intake.

## 2. Decomposition = WBS (proposed after section 1, approved before build)

Kinds: <list> · axes: <list> · output: <one file / one per kind>. Layers: `docs/ROLES.md`. Units: `templates/feature-spec.md`, `templates/LIFECYCLE.md`. Verify methods: `docs/policies/choose-checks-by-risk-and-oracle.md`. Split to the smallest unit (`docs/policies/wbs-first-planning.md`); start a unit only when its `depends on` ids are `done`. TRIVIAL: one row.

| id | parent | unit | kind | axis | layer | owner of the decision | depends on | size | tier | wait reason | verify condition | status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| <1.2.3> | <1.2> | <one verifiable change> | <kind> | <axis> | <layer> | <owner> | <ids or -> | <S/M/L> | <cheap/mid/top> | <empty if running> | <check id> <method>: <command + exit code> | <todo/doing/blocked/done/unverified> |

## 3. Corrections

Each re-opens this intake: re-show changed items plus purpose and done criteria; re-confirm before touched units continue.

| date | changed items | units touched | re-confirmed by |
|---|---|---|---|
| <date> | <items> | <units> | <owner reply> |
