# Absorb pstack (H154) — item-by-item disposition

H154 verbatim: "H154 y, 강점은 모두 흡수해라." (absorb all strengths). Source material: pstack's own
strengths/weaknesses self-audit and an axis-by-axis re-examination against EPDS's actual code
(both harness-side working notes, not part of this repo), plus R0310 raw material
(`~/Projects/research/R0310-cursor-pstack/` — `raw-readme.md`, `deep-dive.md`,
`harness-comparison.md`, `meta.md`, `excerpts/`). "Absorb" is read literally for each item, not as
"copy the skill file": where EPDS already has an equivalent or a stricter version, absorption means
recording that equivalence (Reinforced); only where EPDS had nothing does it mean new code (Built).

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
- **Rejected** — duplicate of an existing EPDS mechanism, or importing it would weaken a gate.

## Item table

| # | pstack strength | pstack evidence | EPDS current state | 실제 상태 | Verdict | Acceptance criteria |
|---|---|---|---|---|---|---|
| 1 | Natural-language request auto-classified into 23 playbooks, no manual skill hunting | `raw-readme.md:38,51-77` (poteto-mode routing table) | `templates/WORK-ROUTER.md:1-59` — 7-way TRIVIAL/FEATURE/EXPLORATORY/STRATEGIC/SENSITIVE/RELEASE/GROWTH classification, text-matched (same enforcement level as pstack: `docs/EPDS.md:212` "LLM, no enforcement code"), plus `docs/ROLES.md:29-37` classification→role table pstack lacks | 완전(기존 동급) | **Reinforced** | `docs/references/cursor-pstack.md` "skill-router-natural-language" records the equivalence and why re-import would duplicate. No code change. |
| 2 | 23 design principles each an independent small file — small reference/edit unit | `raw-readme.md:194-225` | `docs/policies/*.md` (8 files, one per rule) — `SKILL.md` "Scope and safety rules" is now an index+links list, no rule text duplicated there | 신설(이번 작업) | **Built** | `docs/policies/approval-before-implementation.md`, `scope-discipline.md`, `smallest-reversible-change.md`, `untrusted-external-input.md`, `secrets-and-pii.md`, `irreversible-actions-confirmation.md`, `evidence-before-completion-claims.md`, `tests-not-weakened.md` all exist; `SKILL.md:75-88` links to each, no rule prose left inline; `bin/epds.mjs` `setup()` copies `docs/policies/` into the installed skill (was missing before this pass — SKILL.md's links would have 404'd post-install otherwise); `docs/LAYOUT.md` row updated. |
| 3 | Session start auto-detects available models, assigns per role | `excerpts/setup-pstack-SKILL.md:12-39` | Was: `bin/models.mjs` existed but merged/deduped `detected` instead of replacing it, `set` had no validation, CLI detection used bare existence + hardcoded `:` delimiter. Now: full rework (this pass) | 신설(최초) + 부분(이번 재작업으로 실동화) | **Built** | `bin/models.mjs`: `detect --write` replaces `detected` wholesale each run (no stale merge); `setRole()` validates the id is in `detected` and rejects `__proto__`/`constructor`/`prototype` role names (non-zero exit via CLI); CLI detection uses `access(..., X_OK)` + `path.delimiter` + Windows `.exe`/`.cmd`/`.bat` fallback. `bin/epds.mjs setup()` adds `epds/models.json` to the target project's `.gitignore` (idempotent). `SKILL.md:98` Final report line changed to "supplementary corroborating information... never replaces the self-report" (was ambiguous about which took precedence). Consumer: `docs/COMMANDS.md` `/verify` ↳ panel reads `roles.critic`/`roles.reviewers` to build a cross-verification panel. `test/models.selftest.mjs`: 34 assertions incl. CLI-level `set`/`list`/`detect --write`, validation failure, reserved-key rejection, stale-replace. |
| 4 | 22 of 23 "serious work" playbooks converge on one standard exit (`opening-a-pr`) — predictable output shape | `raw-readme.md:77` | `SKILL.md` §Final report — 5-block contract, the convergence point for **all 14** commands (broader than pstack's 22/23 subset) | 완전(기존) + 부분(이번 확장) | **Reinforced, extended** | `docs/references/cursor-pstack.md` "standard-exit-convergence" records the existing equivalence. This pass adds `templates/pr-landing.md` (small ordered commits, conventional-commits title, briefing-style body) as the one level-down convergence point for `/build`, referenced from `docs/COMMANDS.md`. |
| 5 | Self-expansion: `automate-me` drafts new router skills from observed habits, no cap | `raw-readme.md:243-249` | `docs/COMMANDS.md` `/epds-upgrade` — adds commands/tools/agents/evals only after a *demonstrated repeated bottleneck* | 완전(게이트 유지) + 신설(채굴 초안 단계) | **Reinforced, deliberately stricter** | pstack's own weakness self-audit: uncapped skill growth (46-47 skills, R0310 §8). `docs/COMMANDS.md` `/epds-upgrade` keeps the gate as-is and adds a "Self-expansion mining (draft only, gate unchanged)" step: scan retros/journal for a 2+ repeat, draft a proposal, stop — never auto-apply, never lowers the bottleneck requirement. |
| 6 | N-parallel comparison exploration (`arena`/`swarm`) — N attempts, human/cross-judge picks best | `raw-readme.md:97,118-119,171,173` (corrected — a prior citation of lines 63-64 landed on unrelated playbook-table rows) | Was: absent, logged as upgrade lead only. Now: `templates/arena.md` | 신설(이번 작업, 부분) | **Built (partial)** | `templates/arena.md` exists (N attempts, fixed judging criteria before judging, human/cross-model judge, human decides). Referenced from `docs/COMMANDS.md` `/experiment`/`/decide` ↳ N-parallel — a template choice at an existing gate, not a new command (avoids repeating pstack's own weakness #1). `docs/references/INDEX.md` entry retained. |
| 7 | Lessons encoded in structure, not prose (`reflect`, principle `encode-lessons-in-structure`) | `raw-readme.md:124` (`/reflect` table row), `raw-readme.md:178` (usage example), `raw-readme.md:225` (principle definition) — corrected from a prior citation of lines 475/563, which do not exist in this 259-line file | `templates/retro.md` "Permanent learning" field ("What should be encoded in tests, tools, policies, templates, or instructions?") + forced Keep/Expand/Iterate/Stop decision | 완전(기존) + 신설(이번 필드 추가) | **Reinforced, extended** | `docs/references/cursor-pstack.md` "encode-lessons-in-structure" records the existing fixed-contract equivalence. This pass adds required "File diff / locator" and "Follow-up owner/date" sub-fields to `templates/retro.md` so a learning without a landed change is a tracked follow-up, not silently prose-only. |

## Additional cross-check items

| pstack item | 실제 상태 | Verdict | Disposition |
|---|---|---|---|
| `interrogate` — adversarial multi-model review before landing a diff (`raw-readme.md:104,120`) | 신설(이번 작업, 부분) | **Built (partial)** | `docs/COMMANDS.md` `/verify` ↳ panel: if `epds/models.json` `roles.critic`/`roles.reviewers` is set, each assigned id independently reviews for correctness/edge-cases/policy compliance before landing; falls back to single-pass self-review (and says so) if no roles are configured. LLM-guided step, not machine-enforced code. Logged in `docs/references/cursor-pstack.md` pattern `adversarial-review-panel`. |
| `bro` — plain-language re-explain of the final answer (`raw-readme.md:134`) | 신설(이번 작업, 부분) | **Built (partial)** | `SKILL.md` §Final report now has a required trailing `[Plain language]` one-line field instead of a dedicated command (cheaper than a 15th command, and can't be silently skipped the way an optional follow-up ask could be). Logged as `plain-language-reexplain`. |

## Conflicts checked (G2)

- **`never-block-on-the-human`** (pstack: "reserve confirmation for irreversible actions" —
  everything else proceeds without asking, `raw-readme.md:224`) directly conflicts with EPDS's
  `WORK-ROUTER.md:29-43` STRATEGIC/SENSITIVE gates ("Implementation: not allowed before owner
  approval") and `RELEASE`'s independent GO/NO-GO. **Not imported anywhere.** No item above touches
  those gates; `bin/models.mjs` only reads local PATH/env-var-name signals and writes a
  session-local, gitignored file; the `/verify` panel and `templates/arena.md` are review/comparison
  steps that report to the owner, they do not themselves approve STRATEGIC/SENSITIVE/RELEASE work.
- **Unbounded skill/command growth** (pstack's own weakness #1) — items 6 and the `interrogate`
  cross-check were built as templates/doc-steps inside EPDS's *existing* commands and reference
  mechanism (`docs/references/`), specifically to avoid adding new top-level commands the way
  pstack's uncapped growth did. `/epds-upgrade`'s new mining step (item 5) only drafts proposals;
  it does not auto-apply them.
- No approval gate, safety rule, or scope-discipline rule was weakened, removed, or bypassed by
  this work.

## Verification run

```text
$ npm test  # exit 0
status.selftest PASS (42 assertions)
status.selftest-h125 PASS (8 assertions)
models.selftest PASS (34 assertions, test/models.selftest.mjs — includes CLI-level set/list/detect
  --write, validation failure, reserved-key rejection, stale-replace)
layout.selftest PASS (34 assertions, test/layout.selftest.mjs — policy/template file+link
  existence, setup installs docs/policies/, retro.md + SKILL.md field checks)
```

Branch: `absorb-pstack`. Not pushed (local-only per instruction).
