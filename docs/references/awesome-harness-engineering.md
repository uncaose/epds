---
source: https://github.com/walkinglabs/awesome-harness-engineering
kind: list
perspectives: [agent-ops, delivery]
patterns: [curated-list, harness-taxonomy]
applies_to: [direction, spec, build, verify]
evidence_grade: community
captured: 2026-09-18
---

## Analysis

Curated awesome-list (CC0-1.0, 141 items) covering context/memory, guardrails,
specs, evals/observability, benchmarks, and runtime/harness reference
implementations. Curator = walkinglabs org; CONTRIBUTING.md enforces a
3-point bar (specific to agent constraint/eval/resume/observe/orchestrate,
primary-source, practitioner-useful over generic commentary). ~34/141 items
are vendor 1st-party engineering posts (Anthropic 11, LangChain 6,
Thoughtworks 7, OpenAI 4, HumanLayer 6) rather than 2nd-hand blogspam.
GitHub's license auto-detect misreports `other`/NOASSERTION — verified
actual LICENSE file = CC0 1.0 Universal. 4101 stars, 356 forks, 19 open
issues (gh api, 2026-09-18).

## Measured

not executed — list repository; measurement targets = 5 candidates:
AgentPlane, Better Harness, AGENTS.md, OTel GenAI semconv, Anthropic
infra-noise post. Each is measured individually (install/run/exit) before
any promotion to a standalone trusted source; this entry stays an index.

## How EPDS uses it

Entry point for hypothesis-driven tool discovery, not a direct dependency.
Five extracted candidates (R0297 catalog.md §3): AgentPlane → G6 evidence
self-collection reference; Better Harness → G1/G4 deterministic+LLM split
and "unobserved behavior explicit" (matches UNMEASURED banding); AGENTS.md →
H0 portability baseline metric M7; OpenTelemetry GenAI semconv → G5 evidence
schema (reuse over reinventing exit/facts[] format); Anthropic infra-noise
post → G4's UNMEASURED-environment band's grounding citation. Discovery
entry point via `/epds-reference`; re-scan periodically, not a runtime dep.
