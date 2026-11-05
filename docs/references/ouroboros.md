---
source: https://github.com/Q00/ouroboros
kind: tool
perspectives: [agent-ops, delivery]
patterns: [ambiguity-gate, evolve-loop]
applies_to: [direction, spec, retro]
evidence_grade: community
captured: 2026-09-16
---

## Analysis

Q00/ouroboros — an agent OS that cycles through spec, execute, evaluate and memory (Python CLI `ooo`, 13 runtime adapters). Prior survey
= `~/Projects/research/R0229-ouroboros-agent-os-survey` (2026-08-29, gh api + WebFetch measured). The basis on which table 1 scored it
"conditionally high" (too much for an initial MVP given operating complexity and autonomy risk) reinforces EPDS's "start small" principle
(Scope discipline).

**ambiguity-gate**: blocks execution if the ambiguity score does not get under a threshold (<=0.2). Lead: same purpose as EPDS's "at most 5 owner-only
questions" rule (burn off ambiguity before running) — only ouroboros uses a numeric gate, EPDS a question gate.

**evolve-loop**: per generation, repeats improvement until ontology similarity converges at 95%. Lead: EPDS's retro stage answers with the
"keep/expand/iterate/stop" decision rule, but has no automatic loop-termination condition like ouroboros — left as a
gap.

## Measured

Existing install checked (2026-09-18, `ooo --version` = 0.51.17, not PyPI `ouroboros-ai` but an isolated venv/pipx install that
`pip3 show` does not pick up in the system — `which ooo` = a user-local `~/.local/bin/ooo`, not a system path). `ooo qa
<b3.diff> -t code -q "..."` run: **codex backend (default) exit 1** — "You've hit your usage limit ...
try again at Sep 21st, 2026 3:14 AM" (Codex quota exhausted, real use confirmed impossible). After switching with `ooo config backend gemini`,
rerun: **exit 1** — `ModelNotFoundError: models/claude-opus-5 is not found` (the local gemini-cli
settings inherited a wrong model ID — a misconfigured environment, not a defect of ooo itself). Restored the backend to `codex` to recover the session state
(2026-09-18 19:36). Neither backend obtained a measured QA verdict — recorded as "environment not met".

## How EPDS uses it

Direction/Spec — the ambiguity-gate and evolve-loop patterns are reflected only as references in the design of EPDS's owner-question gate and retro loop
(no runtime dependency). `ooo qa` was reviewed as a candidate QA backend, but in this environment both backends
are immediately unusable (quota/settings) — adoption on hold.

> "Pins an acceptance spec and omits any verify command or expected output from the worker's
> contract." — pyproject.toml description (R0229 raw/c6, captured 2026-08-29; stars remeasured 2026-09-18:
> 6020, 5933 at registration).
