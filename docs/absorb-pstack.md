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
| 2 | 23 design principles each an independent small file — small reference/edit unit | `README.md:194-225` | `docs/policies/*.md` (12 files, one per rule) — `SKILL.md` "Scope and safety rules" is now a one-sentence-per-rule index with a link per rule, no rule text left in only one place | 완전(이번 재작업으로 인덱스도 실동화) | **Built** | `docs/policies/approval-before-implementation.md`, `scope-discipline.md`, `smallest-reversible-change.md`, `untrusted-external-input.md`, `secrets-and-pii.md`, `irreversible-actions-confirmation.md`, `evidence-before-completion-claims.md`, `tests-not-weakened.md`, `test-first.md`, `root-cause-not-symptom.md`, `premise-review-after-repeated-failure.md`, `test-behavior-not-implementation.md` all exist; `SKILL.md` "Scope and safety rules" carries each rule's own sentence plus its link (K1 rework — a prior pass had links only, no scannable sentence); `bin/epds.mjs` `setup()` copies `docs/policies/` into the installed skill; `docs/LAYOUT.md` row updated. |
| 3 | Session start auto-detects available models, assigns per role | `skills/setup-pstack/SKILL.md:12-39` | `bin/models.mjs` — full session model-detection + role-mapping framework | 신설(최초) + 재작업(이번 패스로 gitignore/panel-id/stale-role/effort 정합) | **Built** | `bin/models.mjs`: `detect --write` replaces `detected` wholesale each run (no stale merge). `reconcileRoles()` narrows an array role by dropping only the ids that are actually missing (an id still detected stays), and only clears the whole role to `null` when every id in it is missing (N3 — a 2-reviewer panel losing one reviewer doesn't also silently drop the other); a role newly cleared to `null` (whether fully cleared here or already `null`-bound with a missing id) also has its `effort[role]` self-report deleted (a self-report for an identity that no longer exists is stale, not corroborating), and a role already `null` is left alone with no warning (N2). `setRole()` accepts one id or a comma-separated list (2+ stored as an array — `roles.reviewers` panel support, K4), rejects a duplicate id within the same list (L1), validates every id against `detected` before writing any of them, rejects `__proto__`/`constructor`/`prototype` role names, rejects any `env:*` id outright (K6 — an env var signal only proves the key NAME is present, not that it names something the panel can run), and requires `cli:ollama`/`cli:lms` to carry a model as `cli:<name>:<model>` — colon-bearing model tags included (N5) — since the bare CLI id alone doesn't say which local model answers; reassigning a role also deletes any `effort[role]` self-report tied to its previous identity. `setEffort()` records an optional, unvalidated-beyond-non-empty `effort[role]` self-report next to `roles` (K7). CLI detection uses `access(..., X_OK)` + `path.delimiter` + Windows `.exe`/`.cmd`/`.bat` fallback + an `isFile()` guard (a directory named like a CLI is not reported), and an env key is detected by name-presence only (`k in env`), never by reading its value (L4). `saveModels()` writes `epds/.gitignore` (one `models.json` line, appended not overwritten, idempotent) next to `epds/models.json` itself — `bin/epds.mjs setup()` no longer touches the target project's own root `.gitignore` (K2). `SKILL.md:110` Final report line: `epds/models.json` `detected`/`roles`/`effort` is "supplementary corroborating information... never replaces the self-report". Consumer: `docs/COMMANDS.md` `/verify` ↳ panel reads `roles.critic`/`roles.reviewers` to build a cross-verification panel, and now spells out what a `cli:<name>` role value means to run (K6). `test/models.selftest.mjs`: 86 assertions (actual run count, `npm test`) incl. CLI-level `set`/`list`/`detect --write`, validation failure, reserved-key rejection, stale-replace, isFile-guard, `epds/.gitignore` write+idempotency (K2), comma-list `roles.reviewers` (K4), `env:*` rejection (K6), stale-role null+warn (K5), array partial-narrow + effort cleanup (N3), duplicate-id rejection + `--effort=value` CLI parsing (L1), `cli:ollama`/`cli:lms` model-suffix requirement (N5), env-key-presence-only detection (L4), effort self-report (K7). |
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
`poteto-mode` applies while executing a playbook. Both lists happen to total near-23/24 each; they
are not the same list. This table accounts for every row of both — 24 + 23 = 47 — so nothing pstack
ships is left un-dispositioned. Items already covered above (item table / cross-check) are repeated
here with a pointer, not re-argued.

**N7 rework (re-judgment pass)**: every row below that a prior pass had left as `Deferred` was
re-judged against one question — "is this a strength within EPDS's own scope (evidence-first
delivery process), yes or no?" — and resolved to a definitive verdict: `Built`/`Built (partial)`
when yes (absorbed this pass, however small), `Reinforced` when EPDS's existing mechanism already
covers it, or `Rejected` with a concrete scope/duplication/conflict reason when no. "No current rule
exists yet" and "the upgrade gate hasn't been met" are explicitly **not** accepted as a `Rejected`
reason on their own (that was the old `Deferred` escape hatch) — every reason below names the actual
mechanism that already covers the concern, the actual scope boundary it crosses, or the actual gate
it would weaken. No row below is `Deferred`.

### Skills (24, `README.md:112-135`)

| # | Skill | README.md line | Verdict | EPDS path | Reason |
|---|---|---|---|---|---|
| 1 | `poteto-mode` | 112 | Reinforced | `templates/WORK-ROUTER.md` | See item table row 1 — `skill-router-natural-language`, functionally equivalent, EPDS's version is stricter. |
| 2 | `how` | 113 | Built (partial) (P7 re-judgment) | `SKILL.md` §Work router | Any "explain how subsystem X works" request is EXPLORATORY under `WORK-ROUTER.md` and produces the same 5-block Final report contract as every other command, but a prior pass called this `Reinforced` on the strength of the classification alone — the classification doesn't say the discovery step must actually be a walkthrough (it could be discovered-but-summarized prose). This pass adds that line explicitly, hence `Built (partial)`, not `Reinforced`. |
| 3 | `why` | 114 | Reinforced (P7 re-judgment) | `SKILL.md` §Evidence-first protocol | `why`'s actual concern is decision-archaeology — investigate why something was built this way by querying multiple evidence categories (`README.md:114`: source control, issue tracker, long-form docs, chat, observability, error tracking, analytics) — not the parallel-MCP-fan-out mechanism it happens to use for speed. `SKILL.md` §Evidence-first protocol already forces the same investigate-before-recommend shape across its own evidence categories (project artifacts → context → code/tests/CI/metrics → trusted sources) before any direction is proposed. Running that lookup sequentially vs. in parallel is a runtime-mechanics choice EPDS's agent-neutral core deliberately does not prescribe (`docs/LAYOUT.md` "코어는 에이전트 중립" — same reasoning as `guard-the-context-window` below), not a gap in evidence coverage. |
| 4 | `recall` | 115 | Reinforced (L4 correction) | `docs/COMMANDS.md` `/epds-status` | Evidence-first protocol step 2 ("Conversation context and user-provided artifacts") plus `PROJECT-STATE.md` already is the "resume with current-state brief" mechanism `/epds-status` reads — the same functional shape as pstack's `recall`, under an existing name, not a separate command duplicating it. A prior pass called this `Rejected (duplicate)`, which is the wrong verdict for "EPDS already has an equivalent mechanism" (the `Verdict vocabulary` above reserves `Rejected` for a genuine duplicate/scope conflict/gate-weakening import, not for "already covered" — that's `Reinforced`), inconsistent with `poteto-mode` (skill 1) getting `Reinforced` for the identical reasoning shape. |
| 5 | `blast-radius` | 116 | Built (partial) (N7) | `docs/policies/scope-discipline.md` | Extended with a line requiring the callers of a function/module to be checked before editing shared code — the cheap, doc-level version of "compute impact before changing something"; no automated call-graph tool added. |
| 6 | `architect` | 117 | Reinforced | `templates/feature-spec.md`, `/spec` | `/spec` already settles interface/data shape before `/build` writes code — same gate, existing name. |
| 7 | `arena` | 118 | Built (partial) | `templates/arena.md` | See item table row 6. |
| 8 | `swarm` | 119 | Built (partial) (N7) | `docs/COMMANDS.md` ↳ N-parallel note | `templates/arena.md`'s N-parallel note now explicitly also covers the "different independent slices, one aggregated report" shape (list each slice as its own row instead of each attempt) — still one owner decision at the end, not a new parallel-execution command. |
| 9 | `interrogate` | 120 | Built (partial) | `docs/COMMANDS.md` `/verify` ↳ panel | See cross-check table. |
| 10 | `automate-me` | 121 | Reinforced, deliberately stricter | `docs/COMMANDS.md` `/epds-upgrade` | See item table row 5. |
| 11 | `make-bot-ui` | 122 | Rejected | — | Product-specific (a bot-webhook + Tailscale UI generator); not a general delivery-loop concern EPDS owns. |
| 12 | `setup-pstack` | 123 | Built | `bin/models.mjs` | See item table row 3. Effort ladder specifically: see "Effort ladder" note below. |
| 13 | `reflect` | 124 | Reinforced, extended | `templates/retro.md` | See item table row 7. |
| 14 | `teach` | 125 | Built (partial) (P7 re-judgment) | `SKILL.md` §Work router | Composite of `how` (now Built (partial)) + `why` (now Reinforced) — this pass's `SKILL.md` §Work router addition states the composite explicitly: a "teach me this" request's Final report combines the walkthrough with the evidence-sourced rationale in one pass. A genuinely new doc-level line, not just a re-derivation of two already-resolved halves, hence `Built (partial)`. |
| 15 | `tdd` | 126 | Built (N7) | `docs/policies/test-first.md` | A prior pass called this Reinforced by pointing at `tests-not-weakened.md` (don't loosen an *existing* test) — a genuinely different rule from "write the failing test before the fix." This pass adds the actual missing policy file, indexed in `SKILL.md` §Scope and safety rules. |
| 16 | `no-comments` | 127 | Rejected | — | Code-comment-hygiene linting is a project's own lint-config concern, not an evidence-and-gates process concern EPDS owns. |
| 17 | `typescript-best-practices` | 128 | Rejected | — | Language-specific; EPDS is deliberately agent- and stack-neutral (`docs/LAYOUT.md` "코어는 에이전트 중립"). |
| 18 | `figure-it-out` | 129 | Reinforced | `SKILL.md` §Work router | The Work router's classification (including EXPLORATORY/STRATEGIC) already is the "no bundled playbook fits, still route through the same gates" fallback; a bespoke ad hoc playbook per task risks bypassing those gates. |
| 19 | `show-me-your-work` | 130 | Reinforced (P7 re-judgment) | `templates/adr.md` | pstack's `show-me-your-work` is "a reviewable decision trail you can commit" (`README.md:130`) — `templates/adr.md`'s Context/Decision/Alternatives considered/Consequences/Evidence fields, one file per significant decision, already is that reviewable, committable trail; `templates/retro.md` covers the second, reflection-after-the-fact granularity. A prior pass rejected this as "a third artifact type would duplicate" — but that framed pstack's request as a *third* format when it is in fact the *same* format as `adr.md` already provides, just under a different name; the correct verdict is equivalence, not scope creep. |
| 20 | `create-verification-skill` | 131 | Built (partial) (N7) | `docs/COMMANDS.md` `/epds-setup` step 4 | `/epds-setup` now proposes the smallest fitting test command when the target project has none, as part of its plan (not a generated bespoke harness). |
| 21 | `maintain-verification-skill` | 132 | Built (partial) (N7) | `docs/COMMANDS.md` `/verify` ↳ panel | `/verify` now confirms a test command `/epds-setup` proposed still runs before the gate passes — the "keep it working" half of item 20. |
| 22 | `unslop` | 133 | Rejected | — | Prose-polish/AI-tell removal is a writing-style concern, out of EPDS's evidence-and-delivery scope. |
| 23 | `bro` | 134 | Built (partial) | `SKILL.md` §Final report `[Plain language]` | See cross-check table. |
| 24 | `technical-writing` | 135 | Rejected | — | Diátaxis/Google-developer-style doc-layering standard is a prose-style concern; a target project's own docs/style guide is the right owner, not EPDS core. |

**Correction (N3) — commit `cc6ce04` message overstated items 11/12/16**: that commit's message says
`model-the-domain`/`boundary-discipline`/`separate-before-serializing-shared-state` were all
"brought in line with `foundational-thinking`'s existing Reinforced verdict" — true for items 11
and 12 (both landed as `Reinforced`), but item 16 landed as `Built (partial)`, not `Reinforced`: its
own row text explicitly said `/spec` had no line covering the "is this state actually shared"
question, so it was a genuinely smaller equivalence than 11/12, not the same one. The commit message
lumped three rows into one claim; the table itself was already correct. This pass also closes the
gap the row named (see item 16 above), so the distinction is now moot going forward, but the
message text as written remains a record of that overstatement.

### Principles (23, `README.md:203-225`)

| # | Principle | README.md line | Verdict | EPDS path | Reason |
|---|---|---|---|---|---|
| 1 | `laziness-protocol` | 203 | Reinforced | `docs/policies/smallest-reversible-change.md` | Same rule: bias toward deletion and the smallest change. |
| 2 | `foundational-thinking` | 204 | Reinforced (N7) | `/spec` (see skill 6 `architect`) | `/spec`'s "interface/data shape before `/build`" step already forces settling structure before code; no separate gate needed for the same concern under a different name. |
| 3 | `redesign-from-first-principles` | 205 | Rejected (N7) | — | Deciding when a requirement is "foundational enough" to warrant a from-scratch redesign is an architecture-authority judgment call that belongs to the target project's own architecture ownership, and it directly competes with `smallest-reversible-change.md`, a default EPDS does own and is not overriding on an imported principle's say-so — unlike `model-the-domain`/`boundary-discipline`/`separate-before-serializing-shared-state` below, which settle a data/domain *shape* through `/spec` before code (same mechanism as `foundational-thinking`, item 2), this principle is about *when to discard and rebuild* an already-shipped structure, a strictly bigger and riskier call `/spec`'s pre-code step does not make. |
| 4 | `attack-the-premise` | 206 | Built (N7) | `docs/policies/premise-review-after-repeated-failure.md` | New policy: two failures at the same gate stops further patching and forces a premise re-examination before a third attempt. |
| 5 | `subtract-before-you-add` | 207 | Reinforced | `docs/policies/smallest-reversible-change.md`, `scope-discipline.md` | Same direction: remove/shrink before adding. |
| 6 | `minimize-reader-load` | 208 | Built (partial) (L4 correction) | `docs/policies/smallest-reversible-change.md` | Unlike `no-comments`/`typescript-best-practices` (language/comment-style linting, genuinely out of scope), this principle's own wording — "count layers between question and answer... collapse one-caller wrappers and shrink mutable scope" — is the same "bias toward the smallest change" domain as `laziness-protocol`/`subtract-before-you-add` above, both `Reinforced` via this same file; a prior pass lumped it into the style-linter `Rejected` bucket, which was inconsistent. This pass adds a line to `docs/policies/smallest-reversible-change.md` making the layers/hidden-state angle explicit (not previously stated), hence `Built (partial)`, not a full `Reinforced` equivalence. |
| 7 | `outcome-oriented-execution` | 209 | Built (partial) (N7) | `docs/policies/smallest-reversible-change.md` | Extended with a clarifying line: smallest-reversible does not mean leaving a throwaway compatibility shim in place after a migration completes — once every caller has moved, delete the old path in the same change or the very next one. Resolves the tension the prior pass only flagged. |
| 8 | `experience-first` | 210 | Reinforced | `SKILL.md` §Delivery state model | EPDS's product/business track (DIRECTION→PROBLEM→HYPOTHESIS→EXPERIMENT→OBSERVE→RETRO) already prioritizes user-facing outcome evidence over implementation convenience. |
| 9 | `exhaust-the-design-space` | 211 | Built (partial) | `templates/arena.md` | Same mechanism as the `arena` skill (item 7 above) — the principle and the skill are one item; documented once, not duplicated as a second Built. |
| 10 | `build-the-lever` | 212 | Built (partial) (P7 re-judgment) | `docs/policies/evidence-before-completion-claims.md` | EPDS's own `test/*.selftest.mjs` files (run non-interactively via `npm test`) are a pre-existing instance of the same idea, but that alone is EPDS proving itself, not a rule a target project reading EPDS's policies is told to follow — citing it as `Reinforced` overstated the equivalence. This pass adds an explicit line to `docs/policies/evidence-before-completion-claims.md`: for non-trivial repeated work, build or reuse the small script/test that performs or verifies it, so the check is a rerunnable artifact rather than a one-time hand-check — a genuinely new doc-level instruction, hence `Built (partial)`, not `Reinforced`. |
| 11 | `model-the-domain` | 213 | Reinforced (P7 re-judgment) | `/spec` "Data contract" (see skill 6 `architect`), `templates/adr.md` when significant | A prior pass called this "architecture-style, out of scope" — inconsistent with item 2 (`foundational-thinking`) above, which is the same "settle structure before code" concern and was let in via `/spec`. `/spec`'s "Data contract" step already forces settling the domain's data shape before `/build` writes code, and a significant domain-encoding choice routes through `templates/adr.md` ("Decision"/"Alternatives considered"). Same reasoning as item 2, no separate gate needed. |
| 12 | `boundary-discipline` | 214 | Reinforced (P7 re-judgment) | `/spec` "Data contract" + "Failure and recovery" (see skill 6 `architect`), `templates/adr.md` when significant | Same correction as item 11 above: `/spec`'s "Data contract" and "Failure and recovery" sections force deciding, before code, where external input is parsed/validated — the "boundary" this principle asks to concentrate guards at — and a significant boundary-placement choice routes through `templates/adr.md`. |
| 13 | `type-system-discipline` | 215 | Rejected | — | Language-specific (TypeScript-centric); EPDS is agent/stack-neutral. |
| 14 | `make-operations-idempotent` | 216 | Built (partial) (P7 re-judgment) | `docs/policies/smallest-reversible-change.md` | `bin/epds.mjs` `sourcesAdd`/`setup` and `bin/models.mjs` are EPDS's own code behaving idempotently, not a rule stated anywhere for a target project's own tools to follow — citing only EPDS's own code as `Reinforced` evidence for a principle about how operations *should* be designed conflates "EPDS happens to do this" with "EPDS tells you to do this." This pass adds an explicit line to `docs/policies/smallest-reversible-change.md`: a tool/script built to perform a change should converge to the same end state regardless of a partial prior run — a genuinely new doc-level instruction, hence `Built (partial)`. |
| 15 | `migrate-callers-then-delete-legacy-apis` | 217 | Reinforced (N7, corrected) | `docs/policies/smallest-reversible-change.md` | A prior pass called this "architecture-style, out of scope" — on re-examination that was imprecise: "migrate every caller, then delete the old path" is the exact same concern as `outcome-oriented-execution` above (item 7), which this pass resolved by extending `smallest-reversible-change.md`. Corrected from Rejected to Reinforced rather than left inconsistent with item 7. |
| 16 | `separate-before-serializing-shared-state` | 218 | Built (partial) (N3 rework) | `templates/feature-spec.md` "Data contract" (see skill 6 `architect`), `templates/adr.md` when significant | Same correction direction as items 11/12 above: `/spec`'s "Data contract" step forces settling what gets persisted/serialized before `/build`, and a significant shared-state-ownership choice routes through `templates/adr.md`. A prior pass left this Built (partial) while noting `/spec` had no line asking "is this state actually shared, and should the sharing be eliminated first" — that gap was itself the missing piece; this pass adds that exact line to `templates/feature-spec.md` "Data contract". Left as `Built (partial)`, not escalated to `Reinforced`, because the line is new this pass, not a pre-existing equivalence. |
| 17 | `prove-it-works` | 219 | Reinforced | `docs/policies/evidence-before-completion-claims.md` | Same rule, verbatim in spirit: verify the real artifact, don't self-report. |
| 18 | `fix-root-causes` | 220 | Built (N7) | `docs/policies/root-cause-not-symptom.md` | New policy: trace a symptom to its root cause and check every caller of the code being touched before patching, rather than guarding only the path a report named. |
| 19 | `sequence-verifiable-units` | 221 | Reinforced | `templates/pr-landing.md` "Commit sequence" | Small, ordered, independently-verifiable commits — same rule (item table row 4). |
| 20 | `test-behavior-not-implementation` | 222 | Built (N7) | `docs/policies/test-behavior-not-implementation.md` | New policy: assert on observable behavior (inputs/outputs, exit codes, files written), not internal implementation shape. A prior pass called this "the target project's own test-convention concern" — on re-examination, EPDS's own `test/*.selftest.mjs` files already practice this (assert on CLI exit codes and files written, never on internal function shape), so stating it as a policy documents EPDS's own existing practice rather than importing a foreign style rule. |
| 21 | `guard-the-context-window` | 223 | Rejected (N7, corrected) | — | EPDS is agent-neutral (`docs/LAYOUT.md`) and does not prescribe any one runtime's subagent/context-management mechanism. A prior pass hedged this with "unless a runtime-specific adapter needs it," which reads as a soft `Deferred` in disguise — removed; the agent-neutral scope boundary is the reason on its own, not a placeholder for a future exception. |
| 22 | `never-block-on-the-human` | 224 | Rejected | — | Directly conflicts with `WORK-ROUTER.md` STRATEGIC/SENSITIVE approval gates and `RELEASE`'s independent GO/NO-GO. Not imported anywhere — see "Conflicts checked" below. |
| 23 | `encode-lessons-in-structure` | 225 | Reinforced, extended | `templates/retro.md` "Permanent learning" | See item table row 7. |

**Row count check**: 24 skills + 23 principles = 47 rows above (24 in "Skills", 23 in "Principles").
`test/layout.selftest.mjs` case 8 counts both table bodies and asserts the total is exactly 47, so
this file cannot silently drop a row.

**Disposition tally (L4 recount)**: Skills — Built 2, Built (partial) 9, Reinforced 8, Rejected 5
(= 24). Principles — Built 3, Built (partial) 6, Reinforced 10, Rejected 4 (= 23). Combined across
all 47 rows: **Built 5, Built (partial) 15, Reinforced 18, Rejected 9** — zero rows left `Deferred`
(`recall` corrected `Rejected`→`Reinforced`, `minimize-reader-load` corrected `Rejected`→`Built
(partial)`, both for consistency with same-domain rows already resolved the other way — see their
own rows above).

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
  not auto-apply them, and no new top-level command was added on the strength of this review
  alone — every Built/Built (partial) row above landed inside an existing command, template, or
  policy file (see the N7 rework note: zero rows are left `Deferred`).
- No approval gate, safety rule, or scope-discipline rule was weakened, removed, or bypassed by
  this work.

## Verification run

```text
$ npm test  # exit 0
status.selftest PASS (42 assertions, test/status.selftest.mjs)
status.selftest-h125 PASS (8 assertions, test/status.selftest-h125.mjs)
models.selftest PASS (89 assertions, test/models.selftest.mjs — CLI-level set/list/detect --write,
  validation failure, reserved-key rejection, stale-replace, isFile-guard, epds/.gitignore
  write+idempotency (K2)/APPEND not overwrite (N1), comma-list roles.reviewers (K4), env:*
  rejection (K6), stale-role null+warn (K5), already-null role warns 0 times (N2), array role
  partial-narrow + effort[role] cleanup on full-clear/reassignment (N3), duplicate-id rejection +
  `--effort=value`/missing-value CLI parsing (L1), cli:ollama/cli:lms model-suffix requirement incl.
  colon-bearing Ollama tags (N5), env-key-presence-only detection via `k in env` (L4), effort
  self-report (K7), already-null role with stale effort[role] cleared on next detect --write (P8))
sources.selftest PASS (6 assertions, test/sources.selftest.mjs — `sources add` value flags
  (--kind/--name/--note) exit non-zero when given with no value, real values still succeed (P11))
layout.selftest PASS (93 assertions, test/layout.selftest.mjs — rule-sentence index in SKILL.md
  (K1), exact line-3-of-policy-file match incl. punctuation (L3), rule sentence on the SAME bullet
  line as its own policy link (P15), policy/template file+link existence (12 policy files), setup
  installs docs/policies/ + templates/{arena,pr-landing,retro}.md (K3), all SKILL.md/COMMANDS.md
  relative links resolve inside an install (K3), retro.md + SKILL.md field checks,
  24+23=47-row disposition count (K8))
```

Total: 238 assertions across 5 files, exit 0. SKILL.md: see `wc -l SKILL.md` (L7 — index stays one
sentence + link per rule regardless of policy-file count; the file itself is checked not to have
grown into full rule text inline). Public-path grep (P14): internal path pattern 3종 grep 0건 — 0
matches for a home-directory absolute path, the internal harness repo name, or its journal reports
directory, excluding `.git` (pattern strings deliberately not spelled out here so this sentence
cannot match its own grep).

Branch: `absorb-pstack`. Not pushed (local-only per instruction).
