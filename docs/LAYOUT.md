# EPDS Layout — Agent-neutral core + thin adapters

Source: the layout diagram provided by the human (`example-app/` example) + [ai-job-search](references/ai-job-search.md)
structure (table 3). This file states how EPDS's own tree maps to it — not a "project that writes good prompts" but a local agent operating system in which inputs, procedures, tools, verification and
safety rules are separated into the repository structure (quoted from ai-job-search, README).

## Original provided by the human (domain example — quoted verbatim; directory and skill names are examples only, not part of EPDS's own structure)

```text
example-app/
├── AGENTS.md  CLAUDE.md  PRODUCT.md  METRICS.md  DECISIONS.md
├── agent/
│   ├── commands/ (discover feature experiment content-pack qa release retro).md
│   ├── skills/<name>/SKILL.md (product-discovery learning-content voice-feedback privacy flutter-delivery cbt-analysis)
│   └── policies/ (privacy release external-inputs).md
├── .claude/commands/ (thin pointers)  .claude/settings.json
├── .agents/skills/ (runnable CLI skills)
├── templates/ evals/ tests/ tools/ docs/ design_handoff_example_app/
```

## Mapping to EPDS's own tree

| Original component | EPDS repository counterpart | Role |
|---|---|---|
| `AGENTS.md CLAUDE.md PRODUCT.md METRICS.md DECISIONS.md` | `PRODUCT.md PROJECT-STATE.md METRICS.md AGENTS.md CLAUDE.md` created in the project root after install (`templates/` holds the originals) | Constitution, product context, absolute rules |
| `agent/commands/*.md` | `docs/COMMANDS.md` + `adapters/claude-code/commands/*.md` | Reproducible procedures (discover/feature/experiment/content pack/QA/release/retro) |
| `agent/skills/<name>/SKILL.md` | This repository's own `SKILL.md` (EPDS itself is one skill) | Job rules, routing |
| `agent/policies/*.md` | `docs/policies/*.md` (currently 12 files; the "Scope and safety rules" section of `SKILL.md` is one rule sentence + a link index) | Safety boundary — split out, following pstack's principle-per-file structure (`docs/absorb-pstack.md` item 2 — the first judgment (quoted verbatim) was "only 9 files, so the repeated gap that would justify splitting is not yet proven; defer" (actually 8, corrected 2026-09-28), but a later judgment upgraded it on the evidence that an independent file itself narrows the unit of editing and makes review and revision easier — 4 policies (test-first/root-cause-not-symptom/premise-review-after-repeated-failure/test-behavior-not-implementation) were added in later passes, taking 8→12; the past-record wording above is preserved as is) |
| `.claude/commands/` (thin pointers) | `adapters/claude-code/commands/*.md` (copied to `.claude/commands/` on install) | Thin per-runtime adapter |
| `.agents/skills/*/cli` | `bin/epds.mjs` (setup/status/check/sources/models subcommands) | Runnable CLI |
| `templates/` | `templates/*.md`, `*.json` | Stable output skeletons that the AI fills in |
| `evals/` | None (upgrade target, `EPDS.md` §5) | Prevent regressions in AI judgment quality |
| `tests/` | None (EPDS itself has none; the install-target project owns them — `docs/TESTS.md`) | Continuous verification |
| `tools/` | `bin/epds.mjs check` (verifies setup artifacts exist and JSON parses) | Judges "usable", not just "generated" |
| `docs/` | `docs/*.md` (including this file) | Evidence flow, references |
| `design_handoff_*` | None (domain-specific, outside the core) | — |

## Principle: the core is agent-neutral, the adapters are thin

`SKILL.md` (what to do and when) is not tied to any AI runtime. `adapters/claude-code/commands/` only
wraps that SKILL.md thinly in Claude Code's slash-command format ("Use the installed `epds` skill and
execute the `reference <URL>` procedure." — `adapters/claude-code/commands/epds-reference.md`). When a new
runtime adapter is added, the SKILL.md body is not touched — this is how the "Portability: the core survives without a specific model/IDE" item of the
[ai-job-search](references/ai-job-search.md) evaluation criteria (table 7) is satisfied.
