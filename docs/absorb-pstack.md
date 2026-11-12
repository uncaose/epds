# Absorb pstack (H154) — item-by-item disposition

H154 verbatim: "H154 y, absorb all strengths." (absorb all strengths). Source material: pstack's own
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

| # | pstack strength | pstack evidence | EPDS current state | Actual status | Verdict | Acceptance criteria |
|---|---|---|---|---|---|---|
| 1 | Natural-language request auto-classified into 23 playbooks, no manual skill hunting | `README.md:38,51-77` (poteto-mode routing table) | `templates/WORK-ROUTER.md:1-59` — 7-way TRIVIAL/FEATURE/EXPLORATORY/STRATEGIC/SENSITIVE/RELEASE/GROWTH classification, text-matched (same enforcement level as pstack: `docs/EPDS.md:212` "LLM, no enforcement code"), plus `docs/ROLES.md:29-37` classification→role table pstack lacks | Complete (existing, equivalent) | **Built (partial) (H789 audit)** | `docs/references/cursor-pstack.md` "skill-router-natural-language" records the equivalence and why re-import would duplicate. No code change. H789 audit: the router classifies but does not require the route's steps as a checklist; see Skills row 1. |
| 2 | 23 design principles each an independent small file — small reference/edit unit | `README.md:194-225` | `docs/policies/*.md` (12 files, one per rule) — `SKILL.md` "Scope and safety rules" is now a one-sentence-per-rule index with a link per rule, no rule text left in only one place | Complete (index also made live in this rework) | **Built** | `docs/policies/approval-before-implementation.md`, `scope-discipline.md`, `smallest-reversible-change.md`, `untrusted-external-input.md`, `secrets-and-pii.md`, `irreversible-actions-confirmation.md`, `evidence-before-completion-claims.md`, `tests-not-weakened.md`, `test-first.md`, `root-cause-not-symptom.md`, `premise-review-after-repeated-failure.md`, `test-behavior-not-implementation.md` all exist; `SKILL.md` "Scope and safety rules" carries each rule's own sentence plus its link (K1 rework — a prior pass had links only, no scannable sentence); `bin/epds.mjs` `setup()` copies `docs/policies/` into the installed skill; `docs/LAYOUT.md` row updated. |
| 3 | Session start auto-detects available models, assigns per role | `skills/setup-pstack/SKILL.md:12-39` | `bin/models.mjs` — full session model-detection + role-mapping framework | New (initial) + rework (this pass aligned gitignore/panel-id/stale-role/effort) | **Built** | `bin/models.mjs`: `detect --write` replaces `detected` wholesale each run (no stale merge). `reconcileRoles()` narrows an array role by dropping only the ids that are actually missing (an id still detected stays), and only clears the whole role to `null` when every id in it is missing (N3 — a 2-reviewer panel losing one reviewer doesn't also silently drop the other); a role newly cleared to `null` (whether fully cleared here or already `null`-bound with a missing id) also has its `effort[role]` self-report deleted (a self-report for an identity that no longer exists is stale, not corroborating), and a role already `null` is left alone with no warning (N2). `setRole()` accepts one id or a comma-separated list (2+ stored as an array — `roles.reviewers` panel support, K4), rejects a duplicate id within the same list (L1), validates every id against `detected` before writing any of them, rejects `__proto__`/`constructor`/`prototype` role names, rejects any `env:*` id outright (K6 — an env var signal only proves the key NAME is present, not that it names something the panel can run), and requires `cli:ollama`/`cli:lms` to carry a model as `cli:<name>:<model>` — colon-bearing model tags included (N5) — since the bare CLI id alone doesn't say which local model answers; reassigning a role also deletes any `effort[role]` self-report tied to its previous identity. `setEffort()` records an optional, unvalidated-beyond-non-empty `effort[role]` self-report next to `roles` (K7). CLI detection uses `access(..., X_OK)` + `path.delimiter` + Windows `.exe`/`.cmd`/`.bat` fallback + an `isFile()` guard (a directory named like a CLI is not reported), and an env key is detected by name-presence only (`k in env`), never by reading its value (L4). `saveModels()` writes `epds/.gitignore` (one `models.json` line, appended not overwritten, idempotent) next to `epds/models.json` itself — `bin/epds.mjs setup()` no longer touches the target project's own root `.gitignore` (K2). `SKILL.md:116` Final report line: `epds/models.json` `detected`/`roles`/`effort` is "supplementary corroborating information... never replaces the self-report". Consumer: `docs/COMMANDS.md` `/verify` ↳ panel reads `roles.critic`/`roles.reviewers` to build a cross-verification panel, and now spells out what a `cli:<name>` role value means to run (K6). `test/models.selftest.mjs`: 97 assertions (actual run count, `npm test`, after N1/N2 regression cases 25-28) incl. CLI-level `set`/`list`/`detect --write`, validation failure, reserved-key rejection, stale-replace, isFile-guard, `epds/.gitignore` write+idempotency (K2), comma-list `roles.reviewers` (K4), `env:*` rejection (K6), stale-role null+warn (K5), array partial-narrow + effort cleanup (N3), duplicate-id rejection + `--effort=value` CLI parsing (L1), `cli:ollama`/`cli:lms` model-suffix requirement (N5), env-key-presence-only detection (L4), effort self-report (K7). |
| 4 | 22 of 23 "serious work" playbooks converge on one standard exit (`opening-a-pr`) — predictable output shape | `README.md:77` | `SKILL.md` §Final report — 5-block contract, the convergence point for **all 14** commands (broader than pstack's 22/23 subset) | Complete (existing) + partial (this extension) | **Reinforced, extended** | `docs/references/cursor-pstack.md` "standard-exit-convergence" records the existing equivalence. This pass adds `templates/pr-landing.md` (small ordered commits, project's own commit-title convention first / Conventional Commits as fallback — K9, briefing-style body) as the one level-down convergence point for `/build`, referenced from `docs/COMMANDS.md`. |
| 5 | Self-expansion: `automate-me` drafts new router skills from observed habits, no cap | `README.md:243-249` | `docs/COMMANDS.md` `/epds-upgrade` — adds commands/tools/agents/evals only after a *demonstrated repeated bottleneck* | Complete (gate kept) + New (mining draft step) | **Built (partial) (H789 audit)** | pstack's own weakness self-audit: uncapped skill growth (46-47 skills). `docs/COMMANDS.md` `/epds-upgrade` keeps the gate as-is and adds a "Self-expansion mining (draft only, gate unchanged)" step: scan retros/journal for a 2+ repeat, draft a proposal, stop — never auto-apply, never lowers the bottleneck requirement. H789 audit: preference discovery and personal-mode authoring are not covered; see Skills row 10. |
| 6 | N-parallel comparison exploration (`arena`/`swarm`) — N attempts, human/cross-judge picks best | `README.md:97,118-119,171,173` (corrected — a prior citation of lines 63-64 landed on unrelated playbook-table rows) | Was: absent, logged as upgrade lead only. Now: `templates/arena.md` | New (this work, partial) | **Built (partial)** | `templates/arena.md` exists (N attempts, fixed judging criteria before judging, human/cross-model judge, human decides — ranking is not deciding, K10 rewording removed an internal-only citation). Referenced from `docs/COMMANDS.md` `/experiment`/`/decide` ↳ N-parallel — a template choice at an existing gate, not a new command (avoids repeating pstack's own weakness #1). `docs/references/INDEX.md` entry retained. |
| 7 | Lessons encoded in structure, not prose (`reflect`, principle `encode-lessons-in-structure`) | `README.md:124` (`/reflect` table row), `README.md:178` (usage example), `README.md:225` (principle definition) — corrected from a prior citation of lines 475/563, which do not exist in this 259-line file | `templates/retro.md` "Permanent learning" field ("What should be encoded in tests, tools, policies, templates, or instructions?") + forced Keep/Expand/Iterate/Stop decision | Complete (existing) + New (this field added) | **Built (partial) (H789 audit)** | `docs/references/cursor-pstack.md` "encode-lessons-in-structure" records the existing fixed-contract equivalence. This pass adds required "File diff / locator" and "Follow-up owner/date" sub-fields to `templates/retro.md` so a learning without a landed change is a tracked follow-up, not silently prose-only. H789 audit: no conversation review and no preference for enforceable structure over prose; see Skills row 13 and Principles row 23. |

## Additional cross-check items

| pstack item | Actual status | Verdict | Disposition |
|---|---|---|---|
| `interrogate` — adversarial multi-model review before landing a diff (`README.md:104,120`) | New (this work, partial) | **Built (partial)** | `docs/COMMANDS.md` `/verify` ↳ panel: if `epds/models.json` `roles.critic`/`roles.reviewers` is set, each assigned id independently reviews for correctness/edge-cases/policy compliance before landing; falls back to single-pass self-review (and says so) if no roles are configured. A `cli:<name>` role value means: run that CLI non-interactively once (K6). LLM-guided step, not machine-enforced code. Logged in `docs/references/cursor-pstack.md` pattern `adversarial-review-panel`. |
| `bro` — plain-language re-explain of the final answer (`README.md:134`) | New (this work, partial) | **Built (partial)** | `SKILL.md` §Final report now has a required trailing `[Plain language]` one-line field instead of a dedicated command (cheaper than a 15th command, and can't be silently skipped the way an optional follow-up ask could be). Logged as `plain-language-reexplain`. |

## Full disposition — every pstack skill and principle (K8)

pstack ships 24 skills (`README.md:112-135`, the skills table, including the `poteto-mode` router
itself) and, separately, 23 one-rule-per-file design principles (`README.md:203-225`) that
`poteto-mode` applies while executing a playbook. Both lists happen to total near-23/24 each; they
are not the same list. This table accounts for every row of both — 24 + 23 = 47 at the README capture, 81 rows with the later upstream skills and the playbooks — so nothing pstack
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

### Skills (24 in the README capture, `README.md:112-135`; rows 25-34 added upstream later)

| # | Skill | README.md line | Verdict | EPDS path | Reason |
|---|---|---|---|---|---|
| 1 | `poteto-mode` | 112 | Built (partial) (H789 audit) | `templates/WORK-ROUTER.md` | `templates/WORK-ROUTER.md` classifies every request into one of seven routes. Missing: copying the chosen route's steps into a checklist and accounting for every skipped step. |
| 2 | `how` | 113 | Built (partial) (P7 re-judgment) | `SKILL.md` §Work router | Any "explain how subsystem X works" request is EXPLORATORY under `WORK-ROUTER.md` and produces the same 5-block Final report contract as every other command, but a prior pass called this `Reinforced` on the strength of the classification alone — the classification doesn't say the discovery step must actually be a walkthrough (it could be discovered-but-summarized prose). This pass adds that line explicitly, hence `Built (partial)`, not `Reinforced`. |
| 3 | `why` | 114 | Built (partial) (H789 audit) | `SKILL.md` §Evidence-first protocol | The evidence-first protocol investigates project evidence before any recommendation. Missing: a required code or history anchor, and a coverage map across evidence categories that also reports null results. |
| 4 | `recall` | 115 | Built (partial) (H789 audit) | `docs/COMMANDS.md` `/epds-status` | `/epds-status` reads `PROJECT-STATE.md` and conversation context to return the bottleneck and next action. Missing: scoped reconstruction from prior conversations, a sweep of shared records, and a check of surfaced items against live state. |
| 5 | `blast-radius` | 116 | Built (partial) (N7) | `docs/policies/scope-discipline.md` | Extended with a line requiring the callers of a function/module to be checked before editing shared code — the cheap, doc-level version of "compute impact before changing something"; no automated call-graph tool added. |
| 6 | `architect` | 117 | Built (partial) (H789 audit) | `templates/feature-spec.md`, `/spec` | `/spec` with `templates/feature-spec.md` settles failure handling and the data contract before `/build`. Missing: at least two structurally distinct design candidates, a synthesis of them, and building against a type or signature sketch. |
| 7 | `arena` | 118 | Built (partial) | `templates/arena.md` | See item table row 6. |
| 8 | `swarm` | 119 | Built (partial) (N7) | `docs/COMMANDS.md` ↳ N-parallel note | `templates/arena.md`'s N-parallel note now explicitly also covers the "different independent slices, one aggregated report" shape (list each slice as its own row instead of each attempt) — still one owner decision at the end, not a new parallel-execution command. |
| 9 | `interrogate` | 120 | Built (partial) | `docs/COMMANDS.md` `/verify` ↳ panel | See cross-check table. |
| 10 | `automate-me` | 121 | Built (partial) (H789 audit) | `docs/COMMANDS.md` `/epds-upgrade` | `/epds-upgrade` mines retros for a repeated bottleneck and drafts a gated proposal (item table row 5). Missing: discovery of the owner's working preferences and authoring a personal mode from them. |
| 11 | `make-bot-ui` | 122 | Rejected | — | Product-specific (a bot-webhook + Tailscale UI generator); not a general delivery-loop concern EPDS owns. |
| 12 | `setup-pstack` | 123 | Built | `bin/models.mjs` | See item table row 3. Effort ladder specifically: see "Effort ladder" note below. |
| 13 | `reflect` | 124 | Built (partial) (H789 audit) | `templates/retro.md` | `templates/retro.md` asks what learning to encode and tracks it as a follow-up (item table row 7). Missing: a review of the active conversation that sorts findings into accepted, rejected and backlog, then routes the approved edits. |
| 14 | `teach` | 125 | Built (partial) (P7 re-judgment) | `SKILL.md` §Work router | Composite of `how` (now Built (partial)) + `why` (now Reinforced) — this pass's `SKILL.md` §Work router addition states the composite explicitly: a "teach me this" request's Final report combines the walkthrough with the evidence-sourced rationale in one pass. A genuinely new doc-level line, not just a re-derivation of two already-resolved halves, hence `Built (partial)`. |
| 15 | `tdd` | 126 | Built (N7) | `docs/policies/test-first.md` | A prior pass called this Reinforced by pointing at `tests-not-weakened.md` (don't loosen an *existing* test) — a genuinely different rule from "write the failing test before the fix." This pass adds the actual missing policy file, indexed in `SKILL.md` §Scope and safety rules. |
| 16 | `no-comments` | 127 | Rejected | — | Code-comment-hygiene linting is a project's own lint-config concern, not an evidence-and-gates process concern EPDS owns. |
| 17 | `typescript-best-practices` | 128 | Rejected | — | Language-specific; EPDS is deliberately agent- and stack-neutral (`docs/LAYOUT.md` "The core is agent-neutral"). |
| 18 | `figure-it-out` | 129 | Built (partial) (H789 audit) | `SKILL.md` §Work router | The Work router sends a request no route fits (EXPLORATORY/STRATEGIC) through the same gates. Missing: a phased workflow designed for the task, with a baseline and a per-unit hypothesis loop. |
| 19 | `show-me-your-work` | 130 | Built (partial) (H789 audit) | `templates/adr.md` | `templates/adr.md` records each significant decision with alternatives and evidence. Missing: an append-only run trail of checkpoints, pivots and results that is audited and independently reviewed. |
| 20 | `create-verification-skill` | 131 | Built (partial) (N7) | `docs/COMMANDS.md` `/epds-setup` step 4 | `/epds-setup` now proposes the smallest fitting test command when the target project has none, as part of its plan (not a generated bespoke harness). |
| 21 | `maintain-verification-skill` | 132 | Built (partial) (N7) | `docs/COMMANDS.md` `/verify` ↳ panel | `/verify` now confirms a test command `/epds-setup` proposed still runs before the gate passes — the "keep it working" half of item 20. |
| 22 | `unslop` | 133 | Rejected | — | Prose-polish/AI-tell removal is a writing-style concern, out of EPDS's evidence-and-delivery scope. |
| 23 | `bro` | 134 | Built (partial) | `SKILL.md` §Final report `[Plain language]` | See cross-check table. |
| 24 | `technical-writing` | 135 | Rejected | — | Diátaxis/Google-developer-style doc-layering standard is a prose-style concern; a target project's own docs/style guide is the right owner, not EPDS core. |
| 25 | `create-formal-verification-skill` | — (added upstream after the README capture; `skills/create-formal-verification-skill/SKILL.md` @ `34b1b7c`) | Built (partial) (H710) | `docs/policies/formal-verification-for-untestable-promises.md` | EPDS stays agent- and tool-neutral, so it does not generate a project-local verify skill or pick TLA+ by default; it absorbs the rules that make such a check trustworthy (maps to real code, seen to fail, findings stay findings, stated bounds, recorded sync commit) as a policy the `/verify` stage applies when tests cannot reach the promise. |
| 26 | `maintain-formal-verification-skill` | — (added upstream after the README capture; `skills/maintain-formal-verification-skill/SKILL.md` @ `34b1b7c`) | Built (partial) (H710) | same policy, last bullet | Absorbed the drift rule: a pass on a stale description is the dangerous case; re-confirm against the recorded commit, classify each recheck as in sync / updated / bug / blocked, and keep verification updates separate from product fixes. The step-by-step upkeep procedure stays with the runtime that owns the verify skill. |
| 27 | `benchmark-checklist` | — (added upstream after the README capture; `skills/benchmark-checklist/SKILL.md` @ `a5539b1`) | Built (H775) | `docs/policies/vet-measurements.md` | Genuinely absent before: EPDS asked for evidence but had no rule for vetting a measured number. New policy restates the seven questions (limiter, settings, limits, errors, repeatability, relevance, did the work run), the four-way verdict, and adds the shared-host rule that unattributable contention is recorded as inconclusive. The tool-specific commands in the source (profilers, `uptime`) are left to the project. |
| 28 | `statechart` | — (added upstream after the README capture; `skills/statechart/SKILL.md` @ `a5539b1`) | Built (partial) (H775) | `docs/policies/state-flow-and-visual-baselines.md` § Multi-step flows | EPDS stays tool-neutral, so it does not ship the TLA+/TLC runner or the Mermaid chart generator; it absorbs the rules: owner-agreed rules as invariants never weakened, a stated bound, shortest path to each broken rule in the reader's words, end states marked rather than hiding deadlock, and replaying each path against real code. Trust rules link to the formal-verification policy (rows 25-26) instead of repeating them. |
| 29 | `correct` | — (added upstream after the README capture; `skills/correct/SKILL.md` @ `a5539b1`) | Built (H775) | `docs/policies/make-repeated-mistakes-impossible.md`, `docs/policies/every-check-seen-to-fail.md` | Genuinely absent before: root-cause and premise-review policies say how to diagnose, not how to stop a recurrence. New policy restates the prevention ladder (structure, types, lint naming the fix, test, docs last), the two-occurrence threshold, line-level exceptions with expiry and approver, and the rule-to-enforcer table. Its "prove each check fails on a real past mistake" line, together with rows 25-26, is generalised into its own policy for every new or changed check. |
| 30 | `in-your-own-words` | — (added upstream after the README capture; `skills/in-your-own-words/SKILL.md` @ `c742dd6`) | Reinforced (H782) | `docs/policies/intake-confirmation.md` § The shown intake is the restatement | The skill asks the agent to restate the user's goal and problem in its own words. EPDS's intake, filled from evidence and shown for explicit approval before building, already is that restatement; this pass states the equivalence in the policy instead of adding a separate step. |
| 31 | `ketchup` | — (added upstream after the README capture; `skills/ketchup/SKILL.md` @ `c742dd6`) | Built (partial) (H789 audit) | `docs/PROTOCOL.md` § Final report, `docs/COMMANDS.md` `/epds-status` | The Final report's `[Risks and next step]` and `[Plain language]` blocks plus `/epds-status` give a plain status with risks. Missing: what changed since the owner's last message, and every pending owner decision with enough evidence and risk to decide it. |
| 32 | `ketchup-video` | — (added upstream after the README capture; `skills/ketchup-video/SKILL.md` @ `c742dd6`) | Rejected (H782) | — | Rendering a subtitled slide video is a media-production feature that needs rendering tools EPDS does not assume (`docs/LAYOUT.md` "The core is agent-neutral"); the text catch-up it wraps is covered by row 31. |
| 33 | `poteto-help` | — (added upstream after the README capture; `skills/poteto-help/SKILL.md` @ `c742dd6`) | Built (partial) (H789 audit) | `docs/COMMANDS.md`, `docs/INSTALL.md` | `docs/COMMANDS.md` maps questions to commands and `docs/INSTALL.md` covers setup. Missing: answering the specific help question with a linked source, after checking the setup state that changes the answer. |
| 34 | `sharpen` | — (added upstream after the README capture; `skills/sharpen/SKILL.md` @ `c742dd6`) | Built (partial) (H789 audit) | `docs/PROTOCOL.md` § Evidence-first protocol, `docs/policies/choose-checks-by-risk-and-oracle.md` | The evidence-first protocol and `choose-checks-by-risk-and-oracle.md` start from raw evidence and name the checks. Missing: asking what a top professional would add, and rewriting the prompt while leaving owner choices open. |

**Correction (N3) — commit `cc6ce04` message overstated items 11/12/16**: that commit's message says
`model-the-domain`/`boundary-discipline`/`separate-before-serializing-shared-state` were all
"brought in line with `foundational-thinking`'s existing Reinforced verdict" — true for items 11
and 12 (both landed as `Reinforced`), but item 16 landed as `Built (partial)`, not `Reinforced`: its
own row text explicitly said `/spec` had no line covering the "is this state actually shared"
question, so it was a genuinely smaller equivalence than 11/12, not the same one. The commit message
lumped three rows into one claim; the table itself was already correct. This pass also closes the
gap the row named (see item 16 above), so the distinction is now moot going forward, but the
message text as written remains a record of that overstatement.

### Principles (24: 23 in the README capture, `README.md:203-225`; row 24 added upstream later)

| # | Principle | README.md line | Verdict | EPDS path | Reason |
|---|---|---|---|---|---|
| 1 | `laziness-protocol` | 203 | Built (partial) (H789 audit) | `docs/policies/smallest-reversible-change.md` | `smallest-reversible-change.md` asks for the smallest reversible change. Missing: consolidating a decision repeated in several places into one source of truth. |
| 2 | `foundational-thinking` | 204 | Built (partial) (H789 audit) | `/spec` (see skill 6 `architect`) | `/spec` settles the data contract and asks whether state is really shared before code. Missing: choosing structures by access pattern, and building shared scaffolding before features. |
| 3 | `redesign-from-first-principles` | 205 | Rejected (N7) | — | Deciding when a requirement is "foundational enough" to warrant a from-scratch redesign is an architecture-authority judgment call that belongs to the target project's own architecture ownership, and it directly competes with `smallest-reversible-change.md`, a default EPDS does own and is not overriding on an imported principle's say-so — unlike `model-the-domain`/`boundary-discipline`/`separate-before-serializing-shared-state` below, which settle a data/domain *shape* through `/spec` before code (same mechanism as `foundational-thinking`, item 2), this principle is about *when to discard and rebuild* an already-shipped structure, a strictly bigger and riskier call `/spec`'s pre-code step does not make. |
| 4 | `attack-the-premise` | 206 | Built (N7) | `docs/policies/premise-review-after-repeated-failure.md` | New policy: two failures at the same gate stops further patching and forces a premise re-examination before a third attempt. |
| 5 | `subtract-before-you-add` | 207 | Built (partial) (H789 audit) | `docs/policies/smallest-reversible-change.md`, `scope-discipline.md` | `smallest-reversible-change.md` and `scope-discipline.md` keep changes small and in scope. Missing: an explicit order that removes or shrinks before anything is added. |
| 6 | `minimize-reader-load` | 208 | Built (partial) (L4 correction) | `docs/policies/smallest-reversible-change.md` | Unlike `no-comments`/`typescript-best-practices` (language/comment-style linting, genuinely out of scope), this principle's own wording — "count layers between question and answer... collapse one-caller wrappers and shrink mutable scope" — is the same "bias toward the smallest change" domain as `laziness-protocol`/`subtract-before-you-add` above, both `Reinforced` via this same file; a prior pass lumped it into the style-linter `Rejected` bucket, which was inconsistent. This pass adds a line to `docs/policies/smallest-reversible-change.md` making the layers/hidden-state angle explicit (not previously stated), hence `Built (partial)`, not a full `Reinforced` equivalence. |
| 7 | `outcome-oriented-execution` | 209 | Built (partial) (N7) | `docs/policies/smallest-reversible-change.md` | Extended with a clarifying line: smallest-reversible does not mean leaving a throwaway compatibility shim in place after a migration completes — once every caller has moved, delete the old path in the same change or the very next one. Resolves the tension the prior pass only flagged. |
| 8 | `experience-first` | 210 | Built (partial) (H789 audit) | `SKILL.md` §Delivery state model | The product track (DIRECTION→PROBLEM→HYPOTHESIS→EXPERIMENT→OBSERVE→RETRO) weighs user-outcome evidence. Missing: a rule that settles convenience-versus-experience tradeoffs for the user, with library consumers and maintainers counted as users. |
| 9 | `exhaust-the-design-space` | 211 | Built (partial) | `templates/arena.md` | Same mechanism as the `arena` skill (item 7 above) — the principle and the skill are one item; documented once, not duplicated as a second Built. |
| 10 | `build-the-lever` | 212 | Built (partial) (P7 re-judgment) | `docs/policies/evidence-before-completion-claims.md` | EPDS's own `test/*.selftest.mjs` files (run non-interactively via `npm test`) are a pre-existing instance of the same idea, but that alone is EPDS proving itself, not a rule a target project reading EPDS's policies is told to follow — citing it as `Reinforced` overstated the equivalence. This pass adds an explicit line to `docs/policies/evidence-before-completion-claims.md`: for non-trivial repeated work, build or reuse the small script/test that performs or verifies it, so the check is a rerunnable artifact rather than a one-time hand-check — a genuinely new doc-level instruction, hence `Built (partial)`, not `Reinforced`. |
| 11 | `model-the-domain` | 213 | Built (partial) (H789 audit) | `/spec` "Data contract" (see skill 6 `architect`), `templates/adr.md` when significant | `/spec` "Data contract" settles the data shape before code, with `templates/adr.md` for significant choices. Missing: choosing structures that encode invariants so invalid states cannot be represented, instead of scattered conditionals. |
| 12 | `boundary-discipline` | 214 | Built (partial) (H789 audit) | `/spec` "Data contract" + "Failure and recovery" (see skill 6 `architect`), `templates/adr.md` when significant | `/spec` "Data contract" and "Failure and recovery" are settled before code. Missing: guards placed at the system boundary, trust in internal types past it, and a pure business-logic core. |
| 13 | `type-system-discipline` | 215 | Rejected | — | Language-specific (TypeScript-centric); EPDS is agent/stack-neutral. |
| 14 | `make-operations-idempotent` | 216 | Built (partial) (P7 re-judgment) | `docs/policies/smallest-reversible-change.md` | `bin/epds.mjs` `sourcesAdd`/`setup` and `bin/models.mjs` are EPDS's own code behaving idempotently, not a rule stated anywhere for a target project's own tools to follow — citing only EPDS's own code as `Reinforced` evidence for a principle about how operations *should* be designed conflates "EPDS happens to do this" with "EPDS tells you to do this." This pass adds an explicit line to `docs/policies/smallest-reversible-change.md`: a tool/script built to perform a change should converge to the same end state regardless of a partial prior run — a genuinely new doc-level instruction, hence `Built (partial)`. |
| 15 | `migrate-callers-then-delete-legacy-apis` | 217 | Built (partial) (H789 audit) | `docs/policies/smallest-reversible-change.md` | `smallest-reversible-change.md` deletes the old path once every caller has migrated. Missing: the obligation to migrate existing internal callers in the same wave and to update the contract tests. |
| 16 | `separate-before-serializing-shared-state` | 218 | Built (partial) (N3 rework) | `templates/feature-spec.md` "Data contract" (see skill 6 `architect`), `templates/adr.md` when significant | Same correction direction as items 11/12 above: `/spec`'s "Data contract" step forces settling what gets persisted/serialized before `/build`, and a significant shared-state-ownership choice routes through `templates/adr.md`. A prior pass left this Built (partial) while noting `/spec` had no line asking "is this state actually shared, and should the sharing be eliminated first" — that gap was itself the missing piece; this pass adds that exact line to `templates/feature-spec.md` "Data contract". Left as `Built (partial)`, not escalated to `Reinforced`, because the line is new this pass, not a pre-existing equivalence. |
| 17 | `prove-it-works` | 219 | Built (partial) (H789 audit) | `docs/policies/evidence-before-completion-claims.md` | `evidence-before-completion-claims.md` requires evidence such as files and exit codes before a done claim. Missing: direct inspection of the real output for every task (executed lifecycle checks are level-dependent), and a repeatable scripted check whenever possible. |
| 18 | `fix-root-causes` | 220 | Built (N7) | `docs/policies/root-cause-not-symptom.md` | New policy: trace a symptom to its root cause and check every caller of the code being touched before patching, rather than guarding only the path a report named. |
| 19 | `sequence-verifiable-units` | 221 | Built (partial) (H789 audit) | `templates/pr-landing.md` "Commit sequence" | `templates/pr-landing.md` asks for small ordered commits that a reviewer could verify. Missing: actually checking each unit before starting the next one. |
| 20 | `test-behavior-not-implementation` | 222 | Built (N7) | `docs/policies/test-behavior-not-implementation.md` | New policy: assert on observable behavior (inputs/outputs, exit codes, files written), not internal implementation shape. A prior pass called this "the target project's own test-convention concern" — on re-examination, EPDS's own `test/*.selftest.mjs` files already practice this (assert on CLI exit codes and files written, never on internal function shape), so stating it as a policy documents EPDS's own existing practice rather than importing a foreign style rule. |
| 21 | `guard-the-context-window` | 223 | Rejected (N7, corrected) | — | EPDS is agent-neutral (`docs/LAYOUT.md`) and does not prescribe any one runtime's subagent/context-management mechanism. A prior pass hedged this with "unless a runtime-specific adapter needs it," which reads as a soft `Deferred` in disguise — removed; the agent-neutral scope boundary is the reason on its own, not a placeholder for a future exception. |
| 22 | `never-block-on-the-human` | 224 | Rejected | — | Directly conflicts with `WORK-ROUTER.md` STRATEGIC/SENSITIVE approval gates and `RELEASE`'s independent GO/NO-GO. Not imported anywhere — see "Conflicts checked" below. |
| 23 | `encode-lessons-in-structure` | 225 | Built (partial) (H789 audit) | `templates/retro.md` "Permanent learning" | `templates/retro.md` lists tests, tools, policies, templates and instructions as destinations and tracks a follow-up (item table row 7). Missing: a preference for enforceable structure over prose, with prose only where judgment prevents encoding. |
| 24 | `explain-the-number` | — (added upstream after the README capture; `skills/principle-explain-the-number/SKILL.md` @ `c742dd6`) | Built (partial) (H789 audit) | `docs/policies/vet-measurements.md`, `docs/policies/honest-evaluation.md` | `vet-measurements.md` and `honest-evaluation.md` vet measured numbers and evaluations. Missing: declaring the decision-changing result and the noise floor before measuring, evidence for the named limiter, and the same scrutiny for evaluation trials. |

### Playbooks (23, `skills/poteto-mode/playbooks/*.md`; rows 1-3 @ `a5539b1` H775, rows 4-23 @ `c742dd6` H782)

pstack's router also ships playbooks it follows for a classified request. Rows 1-3 were reviewed for
the verification-hardening pass (H775); rows 4-23 complete the list (H782), each source read in full
from the public repository, none marked `Unverified`.

| # | Playbook | Source path | Verdict | EPDS path | Reason |
|---|---|---|---|---|---|
| 1 | `eval` | `skills/poteto-mode/playbooks/eval.md` | Built (partial) (H775) | `docs/policies/honest-evaluation.md` § Blind evaluation | Absorbed the blinding rules (no evaluation words a candidate can see, organic prompt, no self-report grading, rubric for the judge only, neutral labels, one judge in one pass, read outputs yourself). Spawning candidates and judges on specific runtimes and reading runtime transcripts stays with the runtime; `templates/arena.md` remains the run-and-judge template. |
| 2 | `visual-parity` | `skills/poteto-mode/playbooks/visual-parity.md` | Built (partial) (H775) | `docs/policies/state-flow-and-visual-baselines.md` § UI changes | Absorbed baseline-first, image diff with nonzero as failure, no baseline/harness/structure tampering, ask the owner when the baseline looks wrong, one component at a time. No screenshot harness is shipped; the project owns that tool. |
| 3 | `hillclimb` | `skills/poteto-mode/playbooks/hillclimb.md` | Built (partial) (H775) | `docs/policies/honest-evaluation.md` § One change per measurement | Absorbed one change / one measurement / keep or revert, a stop condition with a minimum attempt count, proving harness sensitivity before freezing it, baseline plus green regression checks first, and logging every attempt. Model choice, worktree fan-out and the decision-log file format stay with the runtime. Flaky-check quarantine was added to the same policy from general practice (no pstack source). |
| 4 | `authoring-a-skill` | `skills/poteto-mode/playbooks/authoring-a-skill.md` | Built (partial) (H789 audit) | `docs/COMMANDS.md` `/epds-upgrade`, `docs/policies/honest-evaluation.md` | `/epds-upgrade` gates proposals on a repeated need and `honest-evaluation.md` blind-evaluates the change. Missing: validating the new skill's frontmatter and links, and requiring structural test cases for it. |
| 5 | `autonomous-run` | `skills/poteto-mode/playbooks/autonomous-run.md` | Built (partial) (H789 audit) | SKILL.md "Done means", `templates/LIFECYCLE.md` gate, `docs/policies/tests-not-weakened.md` | SKILL.md "Done means", the LIFECYCLE gate and `tests-not-weakened.md` set and protect the exit predicate. Missing: checking every iteration against the predicate, discarding failed attempts and checkpointing each iteration; the do-not-park-for-the-human line stays rejected (Principles row 22). |
| 6 | `autopilot-full` | `skills/poteto-mode/playbooks/autopilot-full.md` | Rejected (H782) | — | A cloud-agent fleet that builds and merges PRs on a forge is runtime and forge machinery outside EPDS's agent-neutral core. Its verification content duplicates rows already absorbed: verdict per patch (row 21 `shipping`), independent verifier (row 14 `orchestrate`), and the release full matrix with independent GO. |
| 7 | `autopilot-stack` | `skills/poteto-mode/playbooks/autopilot-stack.md` | Rejected (H782) | — | Same as row 6 without the merge; the stacking rule is forge mechanics, and its "unchanged patch keeps its verdict" line is absorbed through row 21. |
| 8 | `babysit` | `skills/poteto-mode/playbooks/babysit.md` | Built (partial) (H789 audit) | `docs/policies/honest-evaluation.md` § Flaky-check quarantine, `docs/policies/premise-review-after-repeated-failure.md` | `honest-evaluation.md` § Flaky-check quarantine and `premise-review-after-repeated-failure.md` cover intermittent checks and repeated failed fixes. Missing: classifying a CI failure before any retry, and a limit of one fresh retry. |
| 9 | `bug-fix` | `skills/poteto-mode/playbooks/bug-fix.md` | Built (partial) (H782) | `docs/policies/root-cause-not-symptom.md` § Order | Absorbed: reproduce on the real surface first, evidence from the running system, rule out candidate causes, re-run the same repro after the fix, and revert what a refuted hypothesis motivated. Failing repro before the fix was already `test-first.md`. |
| 10 | `feature` | `skills/poteto-mode/playbooks/feature.md` | Built (partial) (H789 audit) | `docs/COMMANDS.md` `/spec`, `/build`, `templates/arena.md`, `templates/pr-landing.md` | `/spec`, `/build`, `templates/arena.md` and `templates/pr-landing.md` cover design, an optional comparison and landing. Missing: the four-part throughput checkpoint, and a required arena when several implementation shapes are valid. |
| 11 | `investigation` | `skills/poteto-mode/playbooks/investigation.md` | Reinforced (H782) | `docs/PROTOCOL.md` § Work router (EXPLORATORY) | Read-only, cited walkthrough or a recommendation with tradeoffs is the EXPLORATORY route (Skills rows 2-3, 14). |
| 12 | `multi-phase-plan` | `skills/poteto-mode/playbooks/multi-phase-plan.md` | Built (partial) (H782) | `docs/policies/choose-checks-by-risk-and-oracle.md` § Traceability | A plan where every box names the evidence that checks it now maps to EPDS's traceability rule: every done criterion has a check id carried from the intake verify condition to the LIFECYCLE row, and one without a check is `Unverified`. Plan-file skeletons and its checker script are tool-specific. |
| 13 | `opening-a-pr` | `skills/poteto-mode/playbooks/opening-a-pr.md` | Built (partial) (H789 audit) | `templates/pr-landing.md` | `templates/pr-landing.md` covers ordered commits and a body with the change, why, verification and risks. Missing: explicit scope and omissions, and a blast-radius assessment. |
| 14 | `orchestrate` | `skills/poteto-mode/playbooks/orchestrate.md` | Built (partial) (H789 audit) | `docs/ROLES.md` § Delegation layers, `docs/policies/lean-handoff.md`, `docs/COMMANDS.md` `/verify` panel | `docs/ROLES.md` delegation layers, `lean-handoff.md` and the `/verify` panel cover delegation and review by a non-author. Missing: one writer per PR, a verifier from a different model family, and a pilot unit before fan-out. |
| 15 | `pause-safely` | `skills/poteto-mode/playbooks/pause-safely.md` | Built (partial) (H789 audit) | `docs/policies/lean-handoff.md`, `templates/PROJECT-STATE.md` | `lean-handoff.md` and `templates/PROJECT-STATE.md` record the next action for a handoff. Missing: finishing or backing out the current atomic step, making edits durable, and a cold-start resume note. |
| 16 | `perf-issue` | `skills/poteto-mode/playbooks/perf-issue.md` | Built (partial) (H789 audit) | `docs/policies/vet-measurements.md` | `vet-measurements.md` vets each performance number. Missing: a required baseline trace, a fix planned from it, and a post-fix trace compared with the baseline. |
| 17 | `prototype` | `skills/poteto-mode/playbooks/prototype.md` | Built (partial) (H789 audit) | `docs/COMMANDS.md` `/experiment`, `templates/arena.md` | `/experiment` and `templates/arena.md` give a cheap experiment and a side-by-side comparison. Missing: isolated throwaway artifacts, and observation on the surface that matches the decision. |
| 18 | `refactoring` | `skills/poteto-mode/playbooks/refactoring.md` | Built (partial) (H782) | `docs/policies/test-behavior-not-implementation.md` § Pin before a structural change | Absorbed: pin current behavior with a characterization test, snapshot or equivalence check before structure moves; type check and lint are not a pin; split out found bugs. Caller migration was already Principles row 15. |
| 19 | `runtime-forensics` | `skills/poteto-mode/playbooks/runtime-forensics.md` | Built (partial) (H782) | `docs/policies/root-cause-not-symptom.md` § Order step 2 | Absorbed: take a profile, trace or heap snapshot from the running system and map the finding to source. Live-injection tooling is runtime-specific. |
| 20 | `session-pickup` | `skills/poteto-mode/playbooks/session-pickup.md` | Built (partial) (H782) | `docs/policies/verify-resolved-artifact.md` § A verdict covers exactly the code it checked | Absorbed: reuse an earlier pass only when what it checked is unchanged, and re-check inherited claims on the real artifact rather than trusting a prior self-report. Transcript locations are runtime-specific. |
| 21 | `shipping` | `skills/poteto-mode/playbooks/shipping.md` | Built (partial) (H782) | `docs/policies/verify-resolved-artifact.md` § A verdict covers exactly the code it checked | Absorbed: a verdict holds only for the code it checked. EPDS is stricter than the source: reuse needs every input the check read (covered code, configuration and data, the built artifact, the check's own inputs) unchanged; patch comparison only spots the same change and never alone justifies reuse. Bottom-up landing of a PR stack is forge mechanics. |
| 22 | `trace-forensics` | `skills/poteto-mode/playbooks/trace-forensics.md` | Built (partial) (H782) | `docs/policies/root-cause-not-symptom.md` § Order step 2 | Absorbed: read an existing capture as a fixed dataset, and without a paired before-and-after capture call the finding the strongest hypothesis, not a confirmed cause. |
| 23 | `worktree-cleanup` | `skills/poteto-mode/playbooks/worktree-cleanup.md` | Rejected (H782) | — | Reclaiming disk from worktrees, simulators and editor state is machine housekeeping, not delivery-process scope. Deletion stays under `irreversible-actions-confirmation.md`, and candidate-copy retention is already in `verify-resolved-artifact.md`. |

**Row count check**: 34 skills + 24 principles + 23 playbooks = 81 rows above (34 in "Skills", 24 in
"Principles", 23 in "Playbooks"). `test/layout.selftest.mjs` case 8 counts all three table bodies and
asserts the total is exactly 81, so this file cannot silently drop a row.

**Disposition tally (H789 recount)**: Skills — Built 4, Built (partial) 23, Reinforced 1, Rejected 6
(= 34). Principles — Built 3, Built (partial) 17, Reinforced 0, Rejected 4
(= 24). Playbooks — Built 0, Built (partial) 19, Reinforced 1, Rejected 3
(= 23). Combined across
all 81 rows: **Built 7, Built (partial) 59, Reinforced 2, Rejected 13** — zero rows left `Deferred`
(`recall` corrected `Rejected`→`Reinforced`, `minimize-reader-load` corrected `Rejected`→`Built
(partial)`, both for consistency with same-domain rows already resolved the other way — see their
own rows above; `recall` is now `Built (partial)` after the audit below).

**Audit 2026-11-13 (H789)**: an independent reviewer, not the author of the original verdicts,
re-checked every `Reinforced` row. Method: each row's cited EPDS file and line was compared with the
pstack item's own source text, counting only missing substance, not wording. Result: 31 of 33
`Reinforced` rows were overclaimed — EPDS covers the topic but omits a required step, applies it in
fewer cases, or leaves it optional — and are now `Built (partial) (H789 audit)`, each reason naming
the gap after "Missing:". Two rows hold: Skills row 30 `in-your-own-words` and Playbooks row 11
`investigation`. The gaps are listed, not adopted: no policy was added for them in this pass. Which
gaps to adopt is proposed separately in `docs/absorb-gaps-2026-11.md`.

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
models.selftest PASS (97 assertions, test/models.selftest.mjs — CLI-level set/list/detect --write,
  validation failure, reserved-key rejection, stale-replace, isFile-guard, epds/.gitignore
  write+idempotency (K2)/APPEND not overwrite (N1), comma-list roles.reviewers (K4), env:*
  rejection (K6), stale-role null+warn (K5), already-null role warns 0 times (N2), array role
  partial-narrow + effort[role] cleanup on full-clear/reassignment (N3), duplicate-id rejection +
  `--effort=value`/missing-value CLI parsing (L1), cli:ollama/cli:lms model-suffix requirement incl.
  colon-bearing Ollama tags (N5), env-key-presence-only detection via `k in env` (L4), effort
  self-report (K7), already-null role with stale effort[role] cleared on next detect --write (P8),
  model-qualified role id survives re-detect via base-id comparison (N1 case25), `agent` only
  detected when its realpath names cursor + merged with cursor-agent on a shared realpath (N2
  cases26-28))
sources.selftest PASS (6 assertions, test/sources.selftest.mjs — `sources add` value flags
  (--kind/--name/--note) exit non-zero when given with no value, real values still succeed (P11))
layout.selftest PASS (97 assertions, test/layout.selftest.mjs — rule-sentence index in SKILL.md
  (K1), exact line-3-of-policy-file match incl. punctuation (L3), rule sentence on the SAME bullet
  line as its own policy link (P15), policy/template file+link existence (12 policy files), setup
  installs docs/policies/ + templates/{arena,pr-landing,retro}.md (K3), all SKILL.md/COMMANDS.md
  relative links resolve inside an install (K3), retro.md + SKILL.md field checks,
  disposition-table verdict tally cross-checked against the "Disposition tally" prose (L6),
  24+23=47-row disposition count (K8))
```

Total: 250 assertions across 5 files, exit 0. SKILL.md: see `wc -l SKILL.md` (L7 — index stays one
sentence + link per rule regardless of policy-file count; the file itself is checked not to have
grown into full rule text inline). Public-path grep (P14): internal path pattern 3 types grep 0 hits — 0
matches for a home-directory absolute path, the internal harness repo name, or its journal reports
directory, excluding `.git` (pattern strings deliberately not spelled out here so this sentence
cannot match its own grep).

Branch: `absorb-pstack`. Not pushed (local-only per instruction).
