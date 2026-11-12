# EPDS Roles — Key question, role and artifact per stage

Source: the role catalog of [agency-agents](references/agency-agents.md) (when, artifacts, priority) +
table 6 provided by the human (roles and artifacts per stage), merged into one. EPDS uses this table not as a "fixed role assignment" but as the
"perspective to consult when answering this question at this stage". If the project has no dedicated staff or agent, the owner answers that question
directly.

## Stage → question → role → artifact

| Stage | Key question | Reference role (domain example) | Artifact | Priority |
|---|---|---|---|---|
| Discovery (Direction/Problem) | Is this a real problem that can be solved even without this feature? | Product planning, user research | Problem definition, JTBD, hypotheses, alternatives | Very high |
| Judgment (Hypothesis) | Is it worth building now? | Product planning, Reality Checker | Priority, scope, success/stop criteria | Very high |
| Experiment | What is the cheapest and fastest verification? | Experiment tracking, user research | Experiment brief, events, interview plan | High |
| Design (Spec) | Does it keep the core user flow intact? | UX, platform implementation (domain example: mobile/voice) | Flow, fallback, non-goals | High |
| Build | What is the smallest safe change? | Implementation owner, minimal-change principle owner | Implementation plan, change list | High |
| Protection (Build/Verify) | Are personal data, keys, recordings and sync safe? | Privacy/security owner | Data flow, forbidden storage, check items | High (projects that handle sensitive data) |
| Verification (Verify) | Does the user complete the flow end to end? | Test automation | E2E/regression/performance | Very high |
| Release | Did it pass the real deployment environment? | Reality Checker (independent verdict) | GO / CONDITIONAL GO / NO-GO | Very high |
| Learning (Observe/Retro) | What actually worked? | Experiment tracking, product planning | Metrics summary, next decision | High |
| Growth (optional) | How do we increase acquisition and conversion? | Content/acquisition owner | Landing/messaging, content experiments, acquisition metrics | Later (after public beta) |

## Delegation layers for larger work

For work too large for one pass, split responsibility into three layers. This is a delegation pattern, not a fixed staffing model; a solo owner can play every layer.

| Layer | Does | Does not |
|---|---|---|
| Lead | Checks the plan against the request, writes briefs for coordinators, runs gates, merges results, reports to the owner | Implement or write the deliverables directly |
| Domain coordinator | Breaks one domain's work into confirmed tasks, writes the domain spec, integrates and checks worker results | Do bulk implementation |
| Worker | Executes one small, fully specified task and returns evidence | Make design decisions |

Domains: 1 Planning, 2 Product definition (requirements and decisions), 3 Infrastructure and release (build, CI, deployment, install guides, devices), 4 Design, 5 Engineering design, 6 Security, 7 Implementation, 8 Documentation and manuals.

- Small, already-specified work goes from the lead straight to a worker; do not add a coordinator for it.
- Review stays independent: the reviewer of any layer's output is not its author (see `/verify` panel).
- Concurrency is set by the budget you actually have (usage limits, device and disk limits), not by the number of domains.

## When to "call" a role — the persona-catalog pattern

The lead of [agency-agents](references/agency-agents.md): calling a role should itself become an artifact contract.
In EPDS this pairs with the work classification in `WORK-ROUTER.md` — if the classification is STRATEGIC/SENSITIVE, the questions in the
"Judgment" and "Protection" rows of the table above must be answered first before moving on to BUILD.

| WORK-ROUTER classification | Table row to answer first |
|---|---|
| TRIVIAL | None (implement and test right away) |
| FEATURE | Design (confirm non-goals) |
| EXPLORATORY | Discovery (no implementation; start from the problem definition) |
| STRATEGIC | Judgment (no implementation before owner approval) |
| SENSITIVE | Protection (risk review + owner approval) |
| RELEASE | Release (independent GO/NO-GO) |
| GROWTH | Growth (measurable experiment first) |

## Note on domain examples

The concrete names in the "Reference role" column above (mobile/voice/content, etc.) are examples. EPDS is not tied to any particular platform or industry
— each project fills in the concrete role names of its own domain in PRODUCT.md.
