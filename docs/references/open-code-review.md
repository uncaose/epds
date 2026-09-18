---
source: https://github.com/alibaba/open-code-review
kind: tool
perspectives: [agent-ops, delivery]
patterns: [negative-rule-suppression, token-budget-fallback-bundling, isolated-subagent-fanout]
applies_to: [build, verify]
evidence_grade: community
captured: 2026-09-18
---

## Analysis

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
general agent framework. Borrow the design patterns above, not the binary without its own
precision/recall run against a larger corpus (this run = 1 file-set, exploratory only).

## Measured

Install: `npm i -g open-code-review` (as previously recorded in this card) **404s — wrong package
name**. Correct: `npm i -g @alibaba-group/open-code-review` (npm view confirms `@alibaba-group/open-code-review@1.12.5`,
bin `ocr`) — exit 0, ~2s, 2 packages added (2026-09-18). `ocr --version` = v1.12.5 (189be5b02),
darwin/arm64.

Config: no cloud LLM key available (DATA_TIER B, no API keys entered) — pointed `ocr` at a local
LM Studio OpenAI-compatible endpoint instead: `ocr config set provider lmstudio`,
`custom_providers.lmstudio.url=http://localhost:1234/v1`, `protocol=openai`,
`model=gamedev-coder`. `ocr llm test` → "Connection test successful", exit 0.

Run: `ocr review -c 82513f3 --format json --audience agent` against a real 896-line, 4-file diff
in the `~/Projects/go-work/epds-verify-b3` bench worktree (I-2 merge-invariant fix commit) — **exit
0**, elapsed 2m24s, 181190 total tokens, 9 tool calls (2 code_search, 7 file_read, 0 failures),
result `"Review complete: 0 finding(s) across 4 selected item(s)."`. Full manifest (input hash,
coverage, per-file fingerprints) included in JSON output — matches the "deterministic pre-pass +
narrow LLM judgment, JSON manifest for reproducibility" claim in §Analysis.

## How EPDS uses it

Build/Verify — its producer≠verifier split (deterministic file-selection layer + isolated LLM
judgment layer) is a direct reference for `merge-quality-check`'s own critic separation; the
JSON manifest's `coverage.{selected,completed,failed}` shape is a candidate schema for EPDS's own
evidence records. Not adopted as a runtime dependency — used as a design-pattern source and as one
data point that a local (non-cloud) LLM endpoint can drive a real review to completion.

> "Fast, efficient, battle-tested at Alibaba's scale. Hybrid architecture code review tool:
> deterministic pipelines + LLM Agent, precise line-level comments..." — repo description
> (gh api, 2026-09-18). Source: R0295. Stars re-measured 2026-09-18: 36071 (card registration:
> 34944).
