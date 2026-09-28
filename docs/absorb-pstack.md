# Absorb pstack (H154) — item-by-item disposition

H154 verbatim: "H154 y, 강점은 모두 흡수해라." (absorb all strengths). Source material: pstack's own
public README (https://github.com/cursor/plugins/blob/main/pstack/README.md, MIT license,
actively maintained — captured locally, offline, for citation stability, cited below as
`README.md:N`; the capture is a verbatim copy, 259 lines, matching the public source at capture
time) plus this operator's own internal working notes (a strengths/weaknesses self-audit and an
axis-by-axis re-examination against EPDS's actual code — internal notes, not part of this repo and
not cited by path below).

Full narrative + quotes: `docs/references/cursor-pstack.md` (same verdict vocabulary as below).
Gate check (G2, conflicts with approval gates): §"Conflicts checked" below.

## Verdict vocabulary

- **Built** — genuinely absent before; new code/file/template now exists.
- **Built (partial)** — genuinely absent before; a doc/template step now exists, not a full
  command or machine-enforced code path.
- **Reinforced** — EPDS already had an equivalent or stronger mechanism; documented the
  equivalence, no code change needed.
- **Deferred** — genuinely absent, logged as an upgrade lead, not implemented (upgrade gate not
  yet met: no demonstrated repeated bottleneck).
- **Rejected** — duplicate of an existing EPDS mechanism, or importing it would weaken a gate, or
  out of EPDS's own scope (agent-neutral delivery process, not a code-style/architecture linter).

## Item table

| # | pstack strength | pstack evidence | EPDS current state | 실제 상태 | Verdict | Acceptance criteria |
|---|---|---|---|---|---|---|
| 1 | Natural-language request auto-classified into 23 playbooks, no manual skill hunting | `README.md:38,51-77` (poteto-mode routing table) | `templates/WORK-ROUTER.md:1-59` — 7-way TRIVIAL/FEATURE/EXPLORATORY/STRATEGIC/SENSITIVE/RELEASE/GROWTH classification, text-matched (same enforcement level as pstack: `docs/EPDS.md:212` "LLM, no enforcement code"), plus `docs/ROLES.md:29-37` classification→role table pstack lacks | 완전(기존 동급) | **Reinforced** | `docs/references/cursor-pstack.md` "skill-router-natural-language" records the equivalence and why re-import would duplicate. No code change. |
| 2 | 23 design principles each an independent small file — small reference/edit unit | `README.md:194-225` | `docs/policies/*.md` (8 files, one per rule) — `SKILL.md` "Scope and safety rules" is now a one-sentence-per-rule index with a link per rule, no rule text left in only one place | 완전(이번 재작업으로 인덱스도 실동화) | **Built** | `docs/policies/approval-before-implementation.md`, `scope-discipline.md`, `smallest-reversible-change.md`, `untrusted-external-input.md`, `secrets-and-pii.md`, `irreversible-actions-confirmation.md`, `evidence-before-completion-claims.md`, `tests-not-weakened.md` all exist; `SKILL.md` "Scope and safety rules" carries each rule's own sentence plus its link (K1 rework — a prior pass had links only, no scannable sentence); `bin/epds.mjs` `setup()` copies `docs/policies/` into the installed skill; `docs/LAYOUT.md` row updated. |
| 3 | Session start auto-detects available models, assigns per role | `skills/setup-pstack/SKILL.md:12-39` | `bin/models.mjs` — full session model-detection + role-mapping framework | 신설(최초) + 재작업(이번 패스로 gitignore/panel-id/stale-role/effort 정합) | **Built** | `bin/models.mjs`: `detect --write` replaces `detected` wholesale each run (no stale merge) and, for any role whose id is no longer in the fresh set, warns on stderr and clears that role to `null` (K5 — never leaves a dangling reference). `setRole()` accepts one id or a comma-separated list (2+ stored as an array — `roles.reviewers` panel support, K4), validates every id against `detected` before writing any of them, rejects `__proto__`/`constructor`/`prototype` role names, and rejects any `env:*` id outright (K6 — an env var proves a key is reachable, not that it names something the panel can run). `setEffort()` records an optional, unvalidated-beyond-non-empty `effort[role]` self-report next to `roles` (K7). CLI detection uses `access(..., X_OK)` + `path.delimiter` + Windows `.exe`/`.cmd`/`.bat` fallback + an `isFile()` guard (a directory named like a CLI is not reported). `saveModels()` writes `epds/.gitignore` (one `models.json` line, idempotent) next to `epds/models.json` itself — `bin/epds.mjs setup()` no longer touches the target project's own root `.gitignore` (K2). `SKILL.md:110` Final report line: `epds/models.json` `detected`/`roles`/`effort` is "supplementary corroborating information... never replaces the self-report". Consumer: `docs/COMMANDS.md` `/verify` ↳ panel reads `roles.critic`/`roles.reviewers` to build a cross-verification panel, and now spells out what a `cli:<name>` role value means to run (K6). `test/models.selftest.mjs`: 57 assertions incl. CLI-level `set`/`list`/`detect --write`, validation failure, reserved-key rejection, stale-replace, isFile-guard, `epds/.gitignore` write+idempotency (K2), comma-list `roles.reviewers` (K4), `env:*` rejection (K6), stale-role null+warn (K5), effort self-report (K7). |
| 4 | 22 of 23 "serious work" playbooks converge on one standard exit (`opening-a-pr`) — predictable output shape | `README.md:77` | `SKILL.md` §Final report — 5-block contract, the convergence point for **all 14** commands (broader than pstack's 22/23 subset) | 완전(기존) + 부분(이번 확장) | **Reinforced, extended** | `docs/references/cursor-pstack.md` "standard-exit-convergence" records the existing equivalence. This pass adds `templates/pr-landing.md` (small ordered commits, project's own commit-title convention first / Conventional Commits as fallback — K9, briefing-style body) as the one level-down convergence point for `/build`, referenced from `docs/COMMANDS.md`. |
| 5 | Self-expansion: `automate-me` drafts new router skills from observed habits, no cap | `README.md:243-249` | `docs/COMMANDS.md` `/epds-upgrade` — adds commands/tools/agents/evals only after a *demonstrated repeated bottleneck* | 완전(게이트 유지) + 신설(채굴 초안 단계) | **Reinforced, deliberately stricter** | pstack's own weakness self-audit: uncapped skill growth (46-47 skills). `docs/COMMANDS.md` `/epds-upgrade` keeps the gate as-is and adds a "Self-expansion mining (draft only, gate unchanged)" step: scan retros/journal for a 2+ repeat, draft a proposal, stop — never auto-apply, never lowers the bottleneck requirement. |
| 6 | N-parallel comparison exploration (`arena`/`swarm`) — N attempts, human/cross-judge picks best | `README.md:97,118-119,171,173` (corrected — a prior citation of lines 63-64 landed on unrelated playbook-table rows) | Was: absent, logged as upgrade lead only. Now: `templates/arena.md` | 신설(이번 작업, 부분) | **Built (partial)** | `templates/arena.md` exists (N attempts, fixed judging criteria before judging, human/cross-model judge, human decides — ranking is not deciding, K10 rewording removed an internal-only citation). Referenced from `docs/COMMANDS.md` `/experiment`/`/decide` ↳ N-parallel — a template choice at an existing gate, not a new command (avoids repeating pstack's own weakness #1). `docs/references/INDEX.md` entry retained. |
| 7 | Lessons encoded in structure, not prose (`reflect`, principle `encode-lessons-in-structure`) | `README.md:124` (`/reflect` table row), `README.md:178` (usage example), `README.md:225` (principle definition) — corrected from a prior citation of lines 475/563, which do not exist in this 259-line file | `templates/retro.md` "Permanent learning" field ("What should be encoded in tests, tools, policies, templates, or instructions?") + forced Keep/Expand/Iterate/Stop decision | 완전(기존) + 신설(이번 필드 추가) | **Reinforced, extended** | `docs/references/cursor-pstack.md` "encode-lessons-in-structure" records the existing fixed-contract equivalence. This pass adds required "File diff / locator" and "Follow-up owner/date" sub-fields to `templates/retro.md` so a learning without a landed change is a tracked follow-up, not silently prose-only. |

## Additional cross-check items

| pstack item | 실제 상태 | Verdict | Disposition |
|---|---|---|---|
| `interrogate` — adversarial multi-model review before landing a diff (`README.md:104,120`) | 신설(이번 작업, 부분) | **Built (partial)** | `docs/COMMANDS.md` `/verify` ↳ panel: if `epds/models.json` `roles.critic`/`roles.reviewers` is set, each assigned id independently reviews for correctness/edge-cases/policy compliance before landing; falls back to single-pass self-review (and says so) if no roles are configured. A `cli:<name>` role value means: run that CLI non-interactively once (K6). LLM-guided step, not machine-enforced code. Logged in `docs/references/cursor-pstack.md` pattern `adversarial-review-panel`. |
| `bro` — plain-language re-explain of the final answer (`README.md:134`) | 신설(이번 작업, 부분) | **Built (partial)** | `SKILL.md` §Final report now has a required trailing `[Plain language]` one-line field instead of a dedicated command (cheaper than a 15th command, and can't be silently skipped the way an optional follow-up ask could be). Logged as `plain-language-reexplain`. |

## Full disposition — every pstack skill and principle (K8)

pstack ships 24 skills (`README.md:112-135`, the skills table, including the `poteto-mode` router
itself) and, separately, 23 one-rule-per-file design principles (`README.md:203-225`) that
`poteto-mode` applies while executing a playbook. Both lists happen to total near-23 each; they are
not the same list. This table accounts for every row of both — 24 + 23 = 47 — so nothing pstack
ships is left un-dispositioned. Items already covered above (item table / cross-check) are repeated
here with a pointer, not re-argued.

### Skills (24, `README.md:112-135`)

| # | Skill | README.md line | Verdict | EPDS path | Reason |
|---|---|---|---|---|---|
| 1 | `poteto-mode` | 112 | Rejected (duplicate) | `templates/WORK-ROUTER.md` | See item table row 1 — `skill-router-natural-language`, functionally equivalent, EPDS's version is stricter. |
| 2 | `how` | 113 | Deferred | — | No dedicated "explain how subsystem X works" command exists; `/discover`/`/epds-status` investigate but don't produce a standalone walkthrough artifact. No demonstrated repeated need yet. |
| 3 | `why` | 114 | Deferred | — | No dedicated fan-out-across-evidence-categories investigation command; `SKILL.md` §Evidence-first protocol already investigates sequentially (project artifacts → context → code/tests → trusted sources). A parallel-MCP-fan-out `/why` is a possible future upgrade, not yet warranted. |
| 4 | `recall` | 115 | Rejected (duplicate) | `docs/COMMANDS.md` `/epds-status` | Evidence-first protocol step 2 ("Conversation context and user-provided artifacts") plus `PROJECT-STATE.md` already is the "resume with current-state brief" mechanism `/epds-status` reads. A separate recall command would duplicate it. |
| 5 | `blast-radius` | 116 | Deferred | — | No dedicated change-impact-analysis command; `docs/policies/scope-discipline.md` + `smallest-reversible-change.md` bound scope but don't compute blast radius from running code. |
| 6 | `architect` | 117 | Reinforced | `templates/feature-spec.md`, `/spec` | `/spec` already settles interface/data shape before `/build` writes code — same gate, existing name. |
| 7 | `arena` | 118 | Built (partial) | `templates/arena.md` | See item table row 6. |
| 8 | `swarm` | 119 | Deferred | — | No N-parallel-workers-across-different-slices-with-one-aggregated-report mechanism exists; `templates/arena.md` covers N-attempts-at-the-same-thing, a different shape. Logged as an upgrade lead only. |
| 9 | `interrogate` | 120 | Built (partial) | `docs/COMMANDS.md` `/verify` ↳ panel | See cross-check table. |
| 10 | `automate-me` | 121 | Reinforced, deliberately stricter | `docs/COMMANDS.md` `/epds-upgrade` | See item table row 5. |
| 11 | `make-bot-ui` | 122 | Rejected | — | Product-specific (a bot-webhook + Tailscale UI generator); not a general delivery-loop concern EPDS owns. |
| 12 | `setup-pstack` | 123 | Built | `bin/models.mjs` | See item table row 3. Effort ladder specifically: see "Effort ladder" note below. |
| 13 | `reflect` | 124 | Reinforced, extended | `templates/retro.md` | See item table row 7. |
| 14 | `teach` | 125 | Deferred | — | Composite of `how` + `why` (both themselves Deferred above); no diagram-by-diagram explainer command exists. |
| 15 | `tdd` | 126 | Reinforced | `docs/policies/tests-not-weakened.md`, `docs/TESTS.md` | A failing-test-before-a-fix discipline is already a named policy + test-layer doc; no separate command needed to enforce one policy already stated. |
| 16 | `no-comments` | 127 | Rejected | — | Code-comment-hygiene linting is a project's own lint-config concern, not an evidence-and-gates process concern EPDS owns. |
| 17 | `typescript-best-practices` | 128 | Rejected | — | Language-specific; EPDS is deliberately agent- and stack-neutral (`docs/LAYOUT.md` "코어는 에이전트 중립"). |
| 18 | `figure-it-out` | 129 | Reinforced | `SKILL.md` §Work router | The Work router's classification (including EXPLORATORY/STRATEGIC) already is the "no bundled playbook fits, still route through the same gates" fallback; a bespoke ad hoc playbook per task risks bypassing those gates. |
| 19 | `show-me-your-work` | 130 | Deferred | — | No dedicated committable per-decision-trail log; `templates/retro.md`/`templates/adr.md` capture decisions at specific gates, not a running TSV. Logged as an upgrade lead only. |
| 20 | `create-verification-skill` | 131 | Deferred | — | `/verify` defines the evidence contract but does not generate a project-local runnable verification harness. A demonstrated recurring need would justify this under `/epds-upgrade`; none observed yet. |
| 21 | `maintain-verification-skill` | 132 | Deferred | — | Depends on item 20 existing first; same gate. |
| 22 | `unslop` | 133 | Rejected | — | Prose-polish/AI-tell removal is a writing-style concern, out of EPDS's evidence-and-delivery scope. |
| 23 | `bro` | 134 | Built (partial) | `SKILL.md` §Final report `[Plain language]` | See cross-check table. |
| 24 | `technical-writing` | 135 | Rejected | — | Diátaxis/Google-developer-style doc-layering standard is a prose-style concern; a target project's own docs/style guide is the right owner, not EPDS core. |

### Principles (23, `README.md:203-225`)

| # | Principle | README.md line | Verdict | EPDS path | Reason |
|---|---|---|---|---|---|
| 1 | `laziness-protocol` | 203 | Reinforced | `docs/policies/smallest-reversible-change.md` | Same rule: bias toward deletion and the smallest change. |
| 2 | `foundational-thinking` | 204 | Deferred | — | No explicit "settle data structures/types before feature code" gate beyond `/spec` (item "architect" above) settling interface shape; internal type/data-structure sequencing is not separately gated. Logged as an upgrade lead. |
| 3 | `redesign-from-first-principles` | 205 | Deferred | — | No rule triggers a from-scratch redesign framing when a requirement looks foundational; `docs/policies/scope-discipline.md` currently pulls toward the opposite (smallest change). Not adopted without a demonstrated conflict — logged as an upgrade lead only. |
| 4 | `attack-the-premise` | 206 | Deferred | — | No rule triggers a premise review after repeated fix failures on the same gate. Logged as an upgrade lead. |
| 5 | `subtract-before-you-add` | 207 | Reinforced | `docs/policies/smallest-reversible-change.md`, `scope-discipline.md` | Same direction: remove/shrink before adding. |
| 6 | `minimize-reader-load` | 208 | Rejected | — | Code-style concern; EPDS is process/evidence-focused, not a style linter (same reasoning as `no-comments`/`typescript-best-practices` above). |
| 7 | `outcome-oriented-execution` | 209 | Deferred | — | No explicit "no throwaway compatibility code during a scoped migration" rule; `smallest-reversible-change.md` could read as favoring incremental compat shims — a mild, unresolved tension. Not adopted without a demonstrated conflict; logged as an upgrade lead. |
| 8 | `experience-first` | 210 | Reinforced | `SKILL.md` §Delivery state model | EPDS's product/business track (DIRECTION→PROBLEM→HYPOTHESIS→EXPERIMENT→OBSERVE→RETRO) already prioritizes user-facing outcome evidence over implementation convenience. |
| 9 | `exhaust-the-design-space` | 211 | Built (partial) | `templates/arena.md` | Same mechanism as the `arena` skill (item 7 above) — the principle and the skill are one item; documented once, not duplicated as a second Built. |
| 10 | `build-the-lever` | 212 | Reinforced | `docs/policies/evidence-before-completion-claims.md` | The push toward tools/tests over manual verification claims exists one gate level up. |
| 11 | `model-the-domain` | 213 | Rejected | — | Architecture-style concern outside EPDS's process scope; a target project's own architecture docs own this. |
| 12 | `boundary-discipline` | 214 | Rejected | — | Same reasoning as `model-the-domain` — architecture-style, out of scope. |
| 13 | `type-system-discipline` | 215 | Rejected | — | Language-specific (TypeScript-centric); EPDS is agent/stack-neutral. |
| 14 | `make-operations-idempotent` | 216 | Reinforced | `bin/models.mjs` (`saveModels`/`ensureModelsGitignore`/`runDetect`) | Applied in code (K2/K5 — repeated writes/detects converge, never duplicate), not separately codified as a repo-wide rule. |
| 15 | `migrate-callers-then-delete-legacy-apis` | 217 | Rejected | — | Architecture-style; out of EPDS's process scope. |
| 16 | `separate-before-serializing-shared-state` | 218 | Rejected | — | Architecture-style; out of scope. |
| 17 | `prove-it-works` | 219 | Reinforced | `docs/policies/evidence-before-completion-claims.md` | Same rule, verbatim in spirit: verify the real artifact, don't self-report. |
| 18 | `fix-root-causes` | 220 | Deferred | — | No explicit EPDS rule demanding root-cause tracing over guard-clause patching. Logged as an upgrade lead. |
| 19 | `sequence-verifiable-units` | 221 | Reinforced | `templates/pr-landing.md` "Commit sequence" | Small, ordered, independently-verifiable commits — same rule (item table row 4). |
| 20 | `test-behavior-not-implementation` | 222 | Rejected | — | Test-authoring-style concern; `docs/policies/tests-not-weakened.md` governs not weakening a test, not how it is written. A target project's own test conventions own this. |
| 21 | `guard-the-context-window` | 223 | Deferred | — | No explicit EPDS rule about routing bulk work to subagents; EPDS is agent-neutral and does not prescribe any one runtime's subagent mechanism. Logged as an upgrade lead only if a runtime-specific adapter needs it. |
| 22 | `never-block-on-the-human` | 224 | Rejected | — | Directly conflicts with `WORK-ROUTER.md` STRATEGIC/SENSITIVE approval gates and `RELEASE`'s independent GO/NO-GO. Not imported anywhere — see "Conflicts checked" below. |
| 23 | `encode-lessons-in-structure` | 225 | Reinforced, extended | `templates/retro.md` "Permanent learning" | See item table row 7. |

**Row count check**: 24 skills + 23 principles = 47 rows above (24 in "Skills", 23 in "Principles").
`test/layout.selftest.mjs` case 8 counts both table bodies and asserts the total is exactly 47, so
this file cannot silently drop a row.

**Effort ladder (setup-pstack, `skills/setup-pstack/SKILL.md`)**: pstack's `setup-pstack` offers a
fixed 4-rung budget ladder — `unlimited (max)` / `large (xhigh)` / `medium (high)` / `small
(medium)` — and writes it into an always-applied rule mapping every role to an effort token from
that ladder. EPDS's `epds models set <role> <id> --effort <value>` (K7) absorbs the *shape*
(effort recorded per role, self-reported, not measured) but not the ladder's specific vocabulary:
`effort` accepts any non-empty string, unvalidated against a fixed token list. This is deliberate,
not an oversight — EPDS is agent-neutral (`docs/LAYOUT.md`) and does not know which provider's
effort vocabulary (`max`/`xhigh`/`high`/`medium`/`low`, or any other provider's own scale) a given
session is using, so it records whatever the caller reports rather than hardcoding one vendor's
ladder.

## Conflicts checked (G2)

- **`never-block-on-the-human`** (pstack: "reserve confirmation for irreversible actions" —
  everything else proceeds without asking, `README.md:224`) directly conflicts with EPDS's
  `WORK-ROUTER.md:29-43` STRATEGIC/SENSITIVE gates ("Implementation: not allowed before owner
  approval") and `RELEASE`'s independent GO/NO-GO. **Not imported anywhere.** No item above touches
  those gates; `bin/models.mjs` only reads local PATH/env-var-name signals and writes a
  session-local, gitignored file; the `/verify` panel and `templates/arena.md` are review/comparison
  steps that report to the owner, they do not themselves approve STRATEGIC/SENSITIVE/RELEASE work.
- **Unbounded skill/command growth** (pstack's own weakness #1) — items 6/7/9 and both cross-check
  items were built as templates/doc-steps inside EPDS's *existing* commands and reference mechanism
  (`docs/references/`), specifically to avoid adding new top-level commands the way pstack's
  uncapped growth did. `/epds-upgrade`'s new mining step (item 5) only drafts proposals; it does
  not auto-apply them. The 14 items marked Deferred above stay Deferred for the same reason: no
  command was added on the strength of this review alone.
- No approval gate, safety rule, or scope-discipline rule was weakened, removed, or bypassed by
  this work.

## Verification run

```text
$ npm test  # exit 0
status.selftest PASS (42 assertions, test/status.selftest.mjs)
status.selftest-h125 PASS (8 assertions, test/status.selftest-h125.mjs)
models.selftest PASS (57 assertions, test/models.selftest.mjs — CLI-level set/list/detect --write,
  validation failure, reserved-key rejection, stale-replace, isFile-guard, epds/.gitignore
  write+idempotency (K2), comma-list roles.reviewers (K4), env:* rejection (K6), stale-role
  null+warn (K5), effort self-report (K7))
layout.selftest PASS (61 assertions, test/layout.selftest.mjs — rule-sentence index in SKILL.md
  (K1), policy/template file+link existence, setup installs docs/policies/ + templates/{arena,
  pr-landing,retro}.md (K3), all SKILL.md/COMMANDS.md relative links resolve inside an install
  (K3), retro.md + SKILL.md field checks, 24+23=47-row disposition count (K8))
```

Total: 168 assertions across 4 files, exit 0.

Branch: `absorb-pstack`. Not pushed (local-only per instruction).
