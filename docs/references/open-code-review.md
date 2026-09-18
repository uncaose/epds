---
source: https://github.com/alibaba/open-code-review
kind: tool
perspectives: [agent-ops, delivery]
patterns: [negative-rule-suppression, token-budget-fallback-bundling, isolated-subagent-fanout]
applies_to: [build, verify]
evidence_grade: community
captured: 2026-09-18
---

What: Alibaba's open-sourced AI code-review CLI (`ocr`), battle-tested internally for ~2 years
before release. Why trusted: Apache-2.0, single-vendor production track record at scale, and a
public benchmark (higher precision/F1, ~1/9 the tokens vs a generic review agent, at a deliberate
recall trade-off) — not just marketing copy. EPDS stage: Build/Verify — its split between a fixed
deterministic layer and a narrow LLM-judgment layer maps directly onto EPDS's producer≠verifier
separation.

**negative-rule-suppression**: prompts encode not just "detect X" but explicit "do not report when
Y" conditions, which is how it suppresses false positives instead of just adding more detection
rules. Lead: apply the same negative-rule list pattern to harness critic/gate prompts.

**token-budget-fallback-bundling**: bundling is not always LLM-driven semantic grouping — a harness
control layer picks `bundle_all` / `per_file` / LLM-grouped based on change size and a
`maxFilesPerGroup` + token-budget ceiling, auto-degrading to per-file when the ceiling is exceeded.
Lead: reference for merge-quality-check's own token-budget fallback design.

**isolated-subagent-fanout**: fan-out → isolated review → fan-in (map-reduce), not a swarm/debate
structure — each group reviews in its own context with no shared intermediate reasoning; only final
findings are merged, de-duplicated, and line-corrected centrally.

What not: a code-review tool only — no product/UX evidence track, no game-quality criteria, not a
general agent framework. Do not adopt the CLI itself without a separate precision/recall run;
borrow the design patterns above, not the binary.

Version: v1.12.5, Apache-2.0, 34944 stars (gh api verified 2026-09-18).

> "Fast, efficient, battle-tested at Alibaba's scale. Hybrid architecture code review tool:
> deterministic pipelines + LLM Agent, precise line-level comments..." — repo description
> (gh api, 2026-09-18). Source: R0295.
