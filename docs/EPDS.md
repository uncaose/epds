<!-- rewritten 2026-09-16: conclusion-compressed version → evidence flow. Reflects the human's verdict ("only conclusions, no flow").
     The §Components/Why of the original conclusion form (69 lines, completed 2026-09-16 from Perplexity thread 6f74f459) moved to §4, nothing deleted.
     rebuild-2 (2026-09-18, H119 §0 subject replacement y): subject = "blocking conclusion-only artifacts"(b) → "the collect→compare→select→define process"(a).
     The original §0 sentence was not deleted and was moved to the "Failure Recognition" section below. Zero-deletion discipline (internal rebuild retrospective §6, private orchestrating-project notes not part of this public repo). -->

# EPDS Architecture — what it blocks and why this form

## §0. what EPDS is and why this

> **EPDS is a tool that — instead of a person hunting through skills one by one**`[H1]` **— analyzes existing material, if any, to extract "state, position, next
> direction", and if there is none, asks "what do you want"**`[H13]`**, makes "state, position, final outcome and
> that direction" progressively more concrete with each of those questions**`[H16]` **recomposes the whole to derive the next step**`[H14]`**, executes that directly
> rather than "me doing it by hand"**`[H11]` **and carries the product "through to completion"**`[H6]`**. The evidence-
> attached documents are not a separate discipline but arise "as a result of the process"**`[H41]`**.**
>
> *(English)* EPDS is a tool that — instead of a person hunting through skills one by one `[H1]` —
> analyzes existing evidence to produce "state, position, next direction" when material exists, or
> asks "what do you actually want" when it doesn't `[H13]`; sharpens "state, position, final outcome,
> and direction" with every single answered question `[H16]`; reassembles the whole picture to pick
> the next step `[H14]`; and then executes that itself rather than leaving it for the owner to do by
> hand `[H11]` — carrying the product through to completion `[H6]`. Evidence-attached documents are
> not a separate discipline — they fall out as a product of the process itself `[H41]`.

`[H]` Locator: a source tag pointing to the internal origin threads/task logs of the separate orchestrating harness project
(private, outside this public EPDS repository) that produced this document — that project is not a public repository, so paths are not cited
(the origin-v2 raw-thread is used only through `[H1]`~`[H40]` — `[H41]` newly assigned to avoid collision).

1. **Problem** `[H1]` — "Finding the skills for the perspectives above one by one myself and using them to fit each situation is something I could do, but
   actually using them appropriately is hard. ..." The bottleneck is that a person has to pick the skills and harnesses in every situation.
2. **Scope** `[H6]` — one method that "carries the product through to completion" with the same procedure whether it starts from games, short-form content, or English learning.
   Therefore EPDS is not a domain skill bundle.
3. **Method** `[P6]`(raw-thread-full.md:2027, proposal) → `[H8]`(raw-thread-full.md:2440, adopted) — `direction → problem →
   hypothesis → minimum experiment → spec → build → verify → release → observe → retro`. Each stage is judged not by "whether a document exists" but by "whether
   there is evidence reliable enough to move to the next stage".
4. **Evidence first** `[H9]` instruction → `[P9]`(raw-thread-full.md:3007-3016) formalized — read repositories, tests, and metrics first,
   if insufficient, research public material, and ask at most five things that cannot be known externally. The full eight-stage text = "Evidence Priority" below.
5. **Two tracks** `[P8]`(raw-thread-full.md:2628) + `[H10]` approval ("the `final definition` is right") — diagnose product/business (do users
   really want it and come back) and technical/delivery (is it safe, reliable, and maintainable) separately. Next action = the single smallest action that advances the weaker
   track.
6. **Form of execution** `[H11]` → `[H36]` (2nd reconfirmation) — "I don't want to do it by hand … I want you to proceed with the minimum/fit/full setup"
   (H11) / "it is close to an instruction sheet. If so, you should handle it directly" (H36). No instruction sheet for a person to follow.
7. **Approved final definition** `[H10]` ("the `final definition` is right") — `[P9]` verbatim: "A general-purpose AI product delivery harness that first
   diagnoses the current evidence state of an idea or ongoing project, collects information from repositories, documents, tests, metrics, user material and, when needed, reliable internet material,
   asks the user only for business decisions that cannot be known externally, and
   selects the minimum skills, agents, and tools needed to pass the current bottleneck, carrying the product through complete delivery from direction to retro."
8. **Name** `[H13]`·`[H14]`·`[H15]` — "Playbook → EPDS". A unique name that does not collide with the generic term harness was required.

Evidence: [tech-bridge-ai](references/tech-bridge-ai-code-quality.md) — subtitles of the YouTube video that triggered the origin (`[H1]`
attached just before the utterance). Even perfect code can leave the product insufficient — code correctness and product evidence are separate questions.

### Evidence Priority (8 stages, `[P9]` restored)

`raw-thread-full.md:3007-3015` verbatim — the 8 stages that formalize the "evidence first" of EPDS item 4. Lowest (8) = AI inference.

1. Actual user behavior data, revenue/cost, incident records, interview observations
2. E2E, CI, performance, security, and privacy checks in the real deployment environment
3. Repository code, specs, ADRs, issues, and commits
4. Constraints and intent explicitly stated by the user
5. Official docs, official policies, and original-author material
6. Reliable research, benchmarks, and industry material
7. Community, blogs, and experience reports
8. AI inference

### Failure Recognition (old §0, written 2026-09-16 — moved, not deleted)

EPDS does not block "AI making things fast and in large quantity". It blocks **artifacts that have only conclusions, with the evidence leading to them lost**
([tech-bridge-ai](references/tech-bridge-ai-code-quality.md): even perfect code can leave the product insufficient — code
correctness and product evidence are separate questions). Compressed conclusions cannot be re-verified, and conclusions that cannot be re-verified are
repeated as is in the next failure. That is why all EPDS artifacts leave not only the "what" but also "why this and not the alternative (why not
the alternative)" in the same file.

`[O]` notation principle: things not in the origin ([H]) (determinism/LLM boundary, file:line requirement, UNMEASURED three-way split, exit comparison) are
marked `[O]` and are not placed in this §0 — full text = "Harness extensions (not in origin)" (§6).

```text
Direction → Problem → Hypothesis → Minimum Experiment → Spec → Build → Verify → Release → Observe → Retro
```
`[P6]`(raw-thread-full.md:2027, proposal) → `[H8]`(raw-thread-full.md:2440, adopted).

## §1. Reviewed Perspectives — tool comparison and rationale

*Corresponding table: table 1 tool comparison (internal rebuild-planning notes (private orchestrating-project, not in this repo) §1-b).*

Before designing EPDS, four perspectives were actually compared ([gstack](references/gstack.md),
[superpowers](references/superpowers.md), [ouroboros](references/ouroboros.md), custom-built router
= the real case of [argo](references/argo-internal.md)):

| Perspective | Core role | Fit | Reason |
|---|---|---|---|
| gstack | Role-based product development sprint (CEO→design→DX→engineering→QA→security→deployment) | Very high | Reproducible because the order is fixed as commands — but many commands and a heavy initial flow |
| Superpowers | Skills that turn development methodology (TDD, debugging, collaboration) into habit | High | Execution discipline is strong, but business judgment (what to build and why) is missing — EPDS fills that front end (Direction~Hypothesis) |
| Ouroboros | Spec-execute-evaluate-memory agent OS, ambiguity gate + evolution loop | Conditionally high | Concepts (gate, convergence) overlap strongly, but putting a whole "agent OS" in place for an initial MVP stops product development itself |
| Custom-built router (argo type) | Builds business/product metrics (retention, conversion, cost) into the decision criteria | Very high long-term | A general catalog cannot make domain judgments — but building only this from the beginning is over-design |

**Why EPDS combined these four instead of using one of them as is**: it takes gstack's "order is the command" as the skeleton,
Superpowers' "habituated verification skills" for Build/Verify, and Ouroboros' "the gate is the condition to proceed" in a weakened form as the evidence-first
protocol (at most 5 questions), and delegates the "custom-built router" to each project filling in PRODUCT.md/METRICS.md
— EPDS itself does not make business judgments on its behalf (Scope discipline, see §5).

## §2. Ten patterns reviewed — the chosen combination and what was dropped

*Corresponding table: table 4, ten alternative/supplementary patterns (internal rebuild-planning notes (private orchestrating-project, not in this repo) §1-b).*

Of the ten alternative/supplementary patterns provided by the human, what EPDS actually uses and what it deliberately dropped:

| Pattern | Chosen/dropped | Reason |
|---|---|---|
| Spec-driven | Chosen | `templates/feature-spec.md`, `spec` command — needed for complex features; the document>implementation risk is offset by Scope discipline |
| Test-first/Proof-carrying | Chosen (partial) | The `verify` command handles it, but EPDS itself does not force a test framework — see `docs/TESTS.md` |
| Planner–Executor–Reviewer | Chosen | Reflected in the command structure that separates `build` (executor) from `verify` (independent reviewer perspective) |
| Router–Specialist | Chosen | The work classification (`WORK-ROUTER.md`: TRIVIAL/FEATURE/EXPLORATORY/STRATEGIC/SENSITIVE/RELEASE/GROWTH) is the router; roles are in `docs/ROLES.md` |
| Artifact-first | Chosen | All artifacts = files (PRODUCT.md/PROJECT-STATE.md/templates) — chat-only conclusions are not left |
| Policy-as-code | Chosen (weakly) | Scope/safety rules are written explicitly in SKILL.md; CI enforcement is up to the project (recommended, not mandatory) |
| Prompt-first | Dropped | Lack of reproducibility and verification is exactly the failure EPDS tries to prevent |
| Command/Skill-first (standalone) | Partly adopted | To avoid too-many-commands fatigue, the command count is limited to 14 (SKILL.md routing table) |
| Event-driven agent | Dropped (carried over) | Control/cost issue — CI failure/deployment monitoring automation is for the project to add directly, not placed in the EPDS core |
| Eval-driven | Partly adopted | Handled by the `docs/TESTS.md` "Outcome" layer and `evals/`; golden set design is deferred until upgrade time |

## §3. Reference repository structure — what was taken from ai-job-search

*Corresponding table: table 3 ai-job-search structure mapping + table 7 reference repository evaluation criteria (internal rebuild-planning notes (private orchestrating-project, not in this repo) §1-b).*

[ai-job-search](references/ai-job-search.md) is what the human directly asked about: "is this a normal level pattern for AI use".
Answer: no — most AI-use repositories only have prompts, while ai-job-search **separated inputs, procedures, tools,
verification and safety rules into the repository structure** (table 3, full mapping table in `docs/LAYOUT.md`). What EPDS took:

- Separate the constitution (CLAUDE.md/AGENTS.md) from the execution procedures (commands) — do not mix "what is always followed" and "what is done this time"
  in the same file.
- Verification tools (`tools/verify_*`) must be executable judgments, not "the AI reviewed it" — the `verify` command's
  "independent quality evidence collection" follows this principle directly.
- Templates are stable skeletons filled in by the AI, not something redesigned each time.

## §4. Converging into the EPDS composition

*Corresponding table: table 2 agency-agents roles/artifacts + table 6 roles/artifacts by stage, 9 stages (internal rebuild-planning notes (private orchestrating-project, not in this repo) §1-b) — table 6 is the direct prototype of the 10-stage loop in this §0.*

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
  ├── PRODUCT.md  PROJECT-STATE.md  METRICS.md  AGENTS.md  CLAUDE.md
  ├── epds/  templates/  specs/  decisions/  docs/  tests/  evals/  tools/
```

### Two-track diagnosis

Provenance: `[P8]`(raw-thread-full.md:2628 "In other words, the harness should be looked at by separating the technical track and the product track") + `[H10]`
approval ("the `final definition` is right" — approval of the entire §0 definition, including the two tracks). The old notation `[O] written by the harness orchestrator` was withdrawn
(internal origin-analysis notes (private orchestrating-project, not in this repo) D-12).

| Track | Core question | Examples of evidence |
|---|---|---|
| Product/business | Does this create a real, repeatable user outcome? | Behavior, interviews, experiments, retention, conversion, cost reduction |
| Technical/delivery | Does it work safely, reliably, and maintainably? | Tests, E2E, performance, security/privacy checks, staging, rollback |

Next action = push the weaker of the two tracks' gates, in the smallest possible unit.

### Evidence rules

The repository and real user/operational data outrank general advice. `epds/trusted-sources.json` (5 base entries
+ 8 cited in §1~§3; ids via `epds sources list`) is the config
canonical source of "when and for what public sources are used". CLI: `epds sources list|add|remove|show` — details in `README.md`.

**End-reason distribution.** When a simulation, replay, or drop-log artifact exists, its end-reason (or termination-cause) distribution is a required Facts line. If one value accounts for 100% of the sample, mark every verdict built on it as a "censored sample", not a clean pass.

### Why templates/tests/tools/evals/policies exist

- **Templates**: prevent important decisions from being omitted and create handoff between sessions/models.
- **Tests**: prove expected behavior and prevent regressions.
- **Evals**: compare AI generation/judgment results against stable examples and failure cases.
- **Tools**: make verification executable instead of "please check carefully".
- **Policies**: keep privacy, approval, and release boundaries even when the agent is rushed.

## §5. Minimum elements by family — present/missing

*Corresponding table: table 8, 10 additional reference pattern families × minimum elements (internal rebuild-planning notes (private orchestrating-project, not in this repo) §1-b).*

Of table 8 (additional reference pattern families), what already exists in the EPDS core and what is still missing:

| Family | Present in EPDS | Missing (filled by the project or an upgrade target) |
|---|---|---|
| Spec-driven | `templates/feature-spec.md`, `spec` command | Non-goals and ADRs exist as `templates/adr.md` but are not mandatory |
| Agent Skills standard | `adapters/claude-code/commands/`, SKILL.md | — |
| Eval frameworks | `docs/TESTS.md` "Outcome" layer | Golden set and regression suite are for upgrade time |
| Prompt/agent red teaming | SKILL.md Scope/safety rules (distrust external input) | No `evals/adversarial` |
| CLI-first automation | `bin/epds.mjs check` (setup verification), `epds models detect` (session model detection, §6) | No project-specific `tools/validate-*` tools |
| Policy-as-code | SKILL.md explicit rules | CI enforcement belongs to the project |
| Observability | — | No event schema, dashboard, or rollback alerts (carried over) |
| Experiment OS | `experiment` command, `templates/experiment-brief.md` | No result store or decision-rule automation |
| Content pipeline | — | No content lint or provenance (domain-specific, outside the core) |
| Replay/simulation | — | No fixed seed or deterministic test (domain-specific) |

## §6. Harness extensions (not in origin)

**0** pieces of evidence in the whole thread ([H1]~[H40], `raw-thread-full.md` 40+40 turns) — 4 items added by the harness orchestrator without an origin citation.
Tagged `[O]`. Because they are extensions outside the origin, they are not placed in the §0 definition (internal origin-analysis notes (private orchestrating-project, not in this repo)
D-15, default plan = keep them but split them into this section).

### Deterministic vs LLM boundary `[O]`

| Stage | EPDS element | Character | Why not left to LLM judgment alone |
|---|---|---|---|
| Input | Evidence-first 5-step order (`SKILL.md` §Evidence-first protocol) | deterministic-by-doc | Fixed order so no evidence source is skipped by habit |
| Triage | WORK-ROUTER 7-way classification (`SKILL.md` §Work router) | LLM | No enforcement code; natural-language classification |
| Rule | Classification→role mapping (`docs/ROLES.md`) | deterministic-by-doc | Fixed table so the same request always routes to the same role |
| Judgment | Facts/Interpretation/Assumptions/Owner-decision split (`SKILL.md` §Evidence-first protocol) | LLM | Separating known from inferred requires reading judgment |
| Output | Final report 5 blocks + `[Plain language]` line + exit code + model/effort header (`SKILL.md` §Final report) | deterministic-by-doc | Fixed contract keeps results reproducible and comparable |
| Feedback | Retro keep/expand/iterate/stop (`docs/COMMANDS.md`) | LLM | Choosing the next cycle's direction is a judgment call |

`deterministic-by-doc` means the order/contract is fixed in protocol text, not enforced by executable code — unlike open-code-review's code-enforced layers (R0295 turn[8]).

### file:line requirement `[O]`

Make file:line locators mandatory for every Fact (`SKILL.md` §Final report, H111 `09e64dd` — borrowed open-code-review's
"line correction" pattern). Do not write sentences without locators.

### UNMEASURED three-way split `[O]`

Record measurement failure in three categories: environment (environment issue) / censored (sample bias) / corrupted (data corruption)
(`SKILL.md` §Evidence-first protocol, H106 `7b92c30`). Do not merge them into one lumped "could not measure".

### Mechanical exit code comparison `[O]`

Every command leaves an exit code + model/effort header (`SKILL.md` §Final report, H106). FAIL must be a non-zero
exit to work as a gate — a "done" claim alone is not a PASS.

### Session model detection `[O]`

`bin/models.mjs` (`epds models detect [--write]|list|set`, H154) — fills with code the conclusion of the re-review that pstack's setup-pstack (detect the models
usable in the session by itself and assign them by role) was a real gap that EPDS lacked
(`docs/absorb-pstack.md` item 3). Detection looks only at public CLI names (`claude`/`codex`/`cursor-agent`/`agent` (conditional — only when the actual path includes "cursor",
because the name overlaps with another tool, N2)/`opencode`/`gemini`/`aider`/`ollama`/`lms`, PATH presence only) and the standard
provider env var *names* — values are never
read (the very act of reading a live credential into memory and discarding it creates a risk of leaking through logs or output, and
not reading it at all blocks that risk at the source). Local aliases of a specific project (e.g. `gamedev-coder`) are
not hardcoded (EPDS is a portable public skill, SKILL.md:24). The role↔model mapping (`roles`) is not filled in automatically by detection but
set explicitly with `epds models set <role> <id>[,<id>...] [--effort <value>]` — pstack's
"assignment by role" is left as data that a person/LLM fills in, not code ("put in only the frame"). `set` validates that each `id` is in the current
`detected` list (a comma list of 2 or more is stored as an array), rejects `__proto__`/`constructor`/
`prototype` as a role name and `env:*` ids as a role value (non-zero exit — `env:*` only proves "a usable key
exists", not an identity a panel can actually run). `--effort <value>` records that role's reasoning
effort as a self-report in `effort[role]` (no value validation — EPDS does not force a particular provider's effort vocabulary).
`detect --write` replaces `detected` entirely each time (so stale entries from an old machine/session do not
remain forever through a merge), and a role that pointed to an id no longer detected is warned about and then handled as `null`. The result goes to
`epds/models.json` (session/machine-local state — `saveModels()` writes `epds/.gitignore` (the single line `models.json`)
alongside it on the spot, and does not touch the target project's root `.gitignore` — unlike `epds/trusted-sources.json`, it is not a
"canonical source" that a project commits and shares). First consumer: `/verify` reads `roles.critic`/`roles.reviewers`
to build a cross-verification panel (`docs/COMMANDS.md` `/verify` ↳ panel).

Router auto-classification (poteto-mode) is not brought in — the 7-way WORK-ROUTER classification (§Work router) is already an equivalent function and
`docs/ROLES.md` goes further with the classification→role mapping (re-importing = duplication, `docs/absorb-pstack.md` item 1).

## Scope discipline

EPDS deliberately starts small. A project does not need every command, role and tool on day 1. Components are added only when there is an observed repeated
gap or a clearly proven bottleneck.
