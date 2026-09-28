# EPDS Commands

## System commands

### `/epds-setup`

Use once per target project when you want EPDS to inspect the repository and install a Minimal, Recommended, or Full project structure.

The command must:

1. Diagnose first in read-only mode.
2. Preserve existing project-specific rules.
3. Propose exact file changes.
4. If the target project has no runnable test command at all, propose the smallest one that fits
   its existing stack as part of the plan (not a prescribed framework — whatever the project's own
   language/tooling already implies) — `/verify` later checks this proposed command still runs
   (docs/absorb-pstack.md "Full disposition" table, pstack skills 20 `create-verification-skill`/
   21 `maintain-verification-skill`, N7 rework — not item 3, which is the separate `bin/models.mjs`
   session-detection item; L3 correction).
5. Ask for approval before writing.
6. Verify links, references, and safe existing tests afterward.

### `/epds-status`

Use when you ask “What should I do next?”

It reads product documents, state, metrics, code, tests, CI, issues, logs, analytics, feedback, and necessary public sources. It returns one bottleneck and one smallest next action.

When the bottleneck is a specific perspective (evidence, cost, UX, ...), check `docs/references/INDEX.md` first — a lead already captured there points at a file instead of re-deriving one from scratch. Also check `epds/trusted-sources.json` for up to 3 matching entries (managed with `epds sources list|add|remove|show`, see `docs/EPDS.md`).

If a gate returns UNMEASURED, report it as `environment` (dependency missing — install and rerun before it counts as evidence), `censored` (log exists but the tested event never occurred), or `corrupted` (artifact unreadable). Do not report a bare "UNMEASURED" without one of these three.

### `/epds-audit`

Use when the project has too many instructions, duplicated guidance, stale commands, missing tests, or unclear ownership between `AGENTS.md` and `CLAUDE.md`.

Default mode is report-only. Use patch mode only after reviewing the proposed change plan.

### `/epds-upgrade`

Use after recurring needs emerge. It should not add tools, agents, evals, or CI merely because they are fashionable. It must connect any addition to a repeated failure or demonstrated bottleneck.

**Self-expansion mining (draft only, gate unchanged).** Before proposing an addition, scan available
retros (`templates/retro.md` "Permanent learning" fields) and any project journal/log for a pattern
that recurred 2+ times — the same manual workaround, the same missing tool, the same question asked
repeatedly. Draft the addition as a proposal (what, why, which repeated instance justifies it) and
stop there: this step only produces a candidate for the owner to review, it does not lower or skip
the "demonstrated repeated bottleneck" requirement above, and it never adds anything unbounded
(pstack's own self-admitted weakness — 46-47 skills, no growth cap, docs/absorb-pstack.md item 5 —
is the reason this stays a gated draft step, not an auto-apply one).

### `/epds-reference <URL>`

Use before adopting an external repository, tool, framework, command pack, or agent library. It analyzes before copying and recommends Adopt, Adapt, Observe, or Reject.

When the analysis surfaces a reusable lead, it is saved as `docs/references/<slug>.md` (format:
`docs/references/README.md`) and indexed in `docs/references/INDEX.md`, so a later `/epds-status`
run stuck on the same perspective can point at it instead of re-deriving it from scratch. It also
adds or updates an entry in `epds/trusted-sources.json` (config-managed list of trusted public
sources, editable with `epds sources list|add|remove|show`; see `docs/EPDS.md` and
`templates/epds-trusted-sources.json`).

## Delivery commands

| Command | Main question |
|---|---|
| `/discover` | What user problem is worth solving? |
| `/decide` | Build now, experiment first, defer, or reject? |
| `/experiment` | What is the cheapest way to test the riskiest assumption? |
| ↳ N-parallel | When the riskiest assumption is *which design/approach*, not *whether one works*, `/decide` or `/experiment` may use `templates/arena.md` instead of a single-shot experiment brief: run N independent attempts, judge them with an independent (cross-model where available) judge, and hand the owner the comparison to pick from — not another new command, just a template choice at the same gate. The same template also covers the "different independent slices, one aggregated report" shape (pstack's `swarm`, distinct from N-attempts-at-the-same-thing): list each slice as its own row instead of each attempt, still one owner decision at the end, not a parallel-execution command of its own (docs/absorb-pstack.md item 6/skill 8). |
| `/spec` | What exactly will we build and not build? |
| `/build` | What is the smallest approved change? |
| ↳ landing | Every `/build` that reaches a commit or PR uses `templates/pr-landing.md` as its exit shape — small, ordered commits and a title that follows the project's own existing commit/PR title convention first, falling back to Conventional Commits only when no project convention exists — with a briefing-style body (facts/what-changed/verification, not a narrative) — the single convergence point every build lands through, regardless of which delivery command or work-router classification produced it. |
| `/verify` | What evidence proves behavior, quality, and policy compliance? |
| ↳ panel | If `epds/models.json` exists and `roles.critic` or `roles.reviewers` is set (`epds models list`), run an adversarial review pass with each assigned id: each independently tries to break the diff/claim (correctness, missed edge cases, policy compliance) before it lands — a rebuttal pass, not a rubber stamp. No roles configured → verify proceeds with a single-pass self-review and reports that no independent panel was available (do not silently skip the note). `roles.reviewers` may be a single id or an array of ids; each contributes independently. A `cli:<name>` role value means: run that CLI non-interactively once (a single one-shot invocation, no interactive session — see "CLI non-interactive invocation" below for the exact command per detected CLI) and treat its output as that reviewer's pass. An `env:*` id can never be a role value — `epds models set` rejects it — an API key signal only proves that key NAME is present in the environment (detection never reads the value, L4), not that it names an invokable reviewer the panel could actually run. If `/epds-setup` proposed a test command (see below), confirm it still runs before this gate passes — a broken or removed test command is not evidence. See `templates/arena.md` for the same N-way, cross-judged pattern applied earlier at `/experiment`/`/decide` time. |
| `/release` | Is staged release safe and reversible? |
| `/observe` | What happened in real behavior, reliability, and cost? |
| `/retro` | What should we keep, expand, iterate, or stop? |

### CLI non-interactive invocation

What a `cli:<name>` (or `cli:<name>:<model>`) role value in `epds/models.json` actually runs, one
non-interactive command per detected CLI (`bin/models.mjs` `KNOWN_CLIS`), sourced from each tool's
own official docs. `cli:ollama` and `cli:lms` run a *local* model the caller must name, so
`epds models set` requires the model id in the role value itself (`cli:ollama:<model>`,
`cli:lms:<model>`) — bare `cli:ollama`/`cli:lms` is rejected (docs/absorb-pstack.md item 3 N5
rework). A CLI with no documented non-interactive invocation is not eligible for a role at all.

| CLI | Non-interactive invocation | Source |
|---|---|---|
| `claude` | `claude -p "<prompt>"` | [Claude Code headless docs](https://code.claude.com/docs/en/headless) |
| `codex` | `codex exec "<prompt>"` | [Codex CLI non-interactive mode](https://developers.openai.com/codex/noninteractive) |
| `cursor-agent` / `agent` | `agent -p "<prompt>"` (Cursor's own current docs use the binary name `agent`; `cursor-agent` is also detected since the name on PATH can differ by install version — P10, uncertain which one a given install uses) | [Cursor CLI headless docs](https://cursor.com/docs/cli/headless) |
| `opencode` | `opencode run "<prompt>"` | [OpenCode CLI docs](https://opencode.ai/docs/cli/) |
| `gemini` | `gemini -p "<prompt>"` | [Gemini CLI headless mode](https://google-gemini.github.io/gemini-cli/docs/cli/headless.html) |
| `aider` | `aider --message "<prompt>" --yes` | [aider scripting docs](https://aider.chat/docs/scripting.html) |
| `ollama` | `ollama run <model> "<prompt>"` (model required) | [Ollama CLI reference](https://docs.ollama.com/cli) |
| `lms` | `lms chat <model> -p "<prompt>"` (model required by EPDS's own design choice — LM Studio's own docs list `[model]` as optional, prompting an interactive pick if omitted, which a non-interactive panel run cannot answer, so `epds models set` requires it in the role value instead) | [LM Studio `lms chat` docs](https://lmstudio.ai/docs/cli/local-models/chat) |

`agent` collides in name with unrelated tools (a monitoring agent, another package's own CLI, ...) — being on PATH as `agent` alone is not evidence it's Cursor's. Detection only trusts it when the resolved (symlink-followed) real path names "cursor" (case-insensitive); otherwise it's skipped. When `agent` and `cursor-agent` resolve to the same real path, only one is reported — check `epds models list`'s `signal` path before assigning a role if you need to know which name actually got detected (N2, `docs/absorb-pstack.md` item 3). If you assigned a role with `cli:agent` and detection later reports `cli:cursor-agent` instead (or vice versa), re-run `epds models set` with `cli:cursor-agent`.

## Natural-language examples

