---
source: https://github.com/product-on-purpose/pm-skills
kind: tool
perspectives: [product, agent-ops, evidence]
patterns: [instrumentation-event-spec, skill-trigger-fixtures, when-not-to-use-routing]
applies_to: [experiment, spec, verify, observe]
evidence_grade: community
captured: 2026-11-19
---

## Analysis

pm-skills is an Apache-2.0 library of 68 product-management skills (SKILL.md per skill, phase-tagged
define/discover/develop/deliver/measure/iterate, plus foundation, utility and tool groups), 12 workflows and 6 sub-agents.
Most of its skills overlap what EPDS already covers (hypothesis, experiment brief, PRD/spec, ADR, retro, critic review).
Three patterns are real gaps in EPDS:

1. Instrumentation event spec (`skills/measure-instrumentation-spec`): a contract naming which analytics events fire, when, and
   with which properties, written before build. EPDS states "No event schema" as a known gap (`docs/EPDS.md`, Observability row).
2. Per-skill trigger fixtures (`skills/*/evals/trigger-fixtures.json`): labelled should/should-not-trigger queries with a
   train/test split and a threshold, so a description change is regression-tested. EPDS `evals/` is a deferred upgrade target.
3. "When NOT to Use" sibling routing in each SKILL.md: each skill names the neighbouring skill to use instead.
   EPDS command files do not carry this section.

## Measured

2026-11-19: `git clone --depth 1` exit 0 (no code executed), LICENSE = Apache-2.0, `skill-manifest.json` lists 68 skills,
stars 822 (gh api). The full skill-to-stage mapping table was kept in private notes.

## How EPDS uses it

Experiment/Spec/Observe — pattern source for a future event-spec section in the experiment brief or feature spec.
Verify — pattern source for trigger fixtures once EPDS adopts `evals/`. Not adopted yet; this entry only records the lead.
