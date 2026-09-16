<!-- completed 2026-09-16 by harness orchestrator from Perplexity thread 6f74f459 (stub in original artifact) -->

# EPDS Architecture

## Definition

EPDS is an Evidence-First Product Delivery System. It is a reusable operating layer for AI-assisted product work.

```text
Direction → Problem → Hypothesis → Minimum Experiment → Spec → Build → Verify → Release → Observe → Retro
```

Its output is not "more AI activity." Its output is a project that moves through the next most important evidence gate with the smallest appropriate action.

## Components

```text
EPDS Skill
  ├── Evidence protocol
  ├── Delivery state model
  ├── Natural-language work router
  ├── Setup/status/audit/upgrade/reference operations
  ├── Delivery commands
  ├── Templates as output contracts
  ├── Specialist guidance
  └── Safety and approval rules

Target project after setup
  ├── PRODUCT.md
  ├── PROJECT-STATE.md
  ├── METRICS.md
  ├── AGENTS.md
  ├── CLAUDE.md (when applicable)
  ├── epds/
  ├── templates/
  ├── specs/
  ├── decisions/
  ├── docs/
  ├── tests/
  ├── evals/
  └── tools/
```

## Two-track diagnosis

A project can be technically mature but product-immature, or product-valid but delivery-unsafe.

| Track | Core question | Examples of evidence |
|---|---|---|
| Product/business | Does this create a real, repeatable user outcome? | Behavior, interviews, experiments, retention, conversion, cost reduction |
| Technical/delivery | Does it work safely, reliably, and maintainably? | Tests, E2E, performance, security/privacy checks, staging, rollback |

The next action is the smallest action that advances the weakest relevant gate.

## Evidence rules

The repository and real user/operating data outrank generic advice. Public research is used to fill missing factual context, not as a substitute for observing the target product's users.

## Why templates, tests, and tools exist

- **Templates** stop important decisions from being omitted and create handoffs between sessions/models.
- **Tests** prove expected behavior and prevent regressions.
- **Evals** check AI-generated or AI-judged behavior against stable examples and failure cases.
- **Tools** make validation executable instead of asking an agent to "please check carefully."
- **Policies** preserve privacy, approval, and release boundaries even when an agent is eager to act.

## Scope discipline

EPDS is intentionally designed to start small. A project does not need all commands, roles, or tools on day one. Add a component only when it fixes an observed recurring gap or a clearly demonstrated bottleneck.
