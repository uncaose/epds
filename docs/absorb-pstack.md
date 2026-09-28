# Absorb pstack (H154) — item-by-item disposition

H154 verbatim: "H154 y, 강점은 모두 흡수해라." (absorb all strengths). Source material: pstack's own
strengths/weaknesses self-audit (`.../scratchpad/h154-pstack-flow.html` §8), the axis-by-axis
re-examination against EPDS's actual code (`.../scratchpad/h154-pstack-vs-epds.html`), and R0310 raw
material (`~/Projects/research/R0310-cursor-pstack/`). "Absorb" is read literally for each item, not
as "copy the skill file": where EPDS already has an equivalent or a stricter version, absorption
means recording that equivalence (reinforce); only where EPDS had nothing does it mean new code.

Full narrative + quotes: `docs/references/cursor-pstack.md`. Gate check (G2, conflicts with
approval gates): §"Conflicts checked" below.

## Item table

| # | pstack strength | pstack evidence | EPDS current state | Absorb method | Acceptance criteria |
|---|---|---|---|---|---|
| 1 | Natural-language request auto-classified into 23 branches, no manual skill hunting | `raw-readme.md:36-91` (poteto-mode routing) | `templates/WORK-ROUTER.md:1-59` — 7-way TRIVIAL/FEATURE/EXPLORATORY/STRATEGIC/SENSITIVE/RELEASE/GROWTH classification, text-matched (same enforcement level as pstack: `docs/EPDS.md:212` "LLM, no enforcement code"), plus `docs/ROLES.md:29-37` classification→role table pstack lacks | **Already present — reinforce (doc only)** | `docs/references/cursor-pstack.md` "skill-router-natural-language" records the equivalence and why re-import would duplicate. No code change. |
| 2 | 23 design principles each an independent small file — small reference/edit unit | `raw-readme.md:196` | `SKILL.md:75-84` "Scope and safety rules" — 9 rules, one list, one file. Already flagged as an upgrade candidate in `docs/LAYOUT.md` ("agent/policies/\*.md" row) before this task | **Already logged, not yet warranted — reinforce (doc only)** | `docs/LAYOUT.md` row updated to cite `docs/absorb-pstack.md` item 2 as additional evidence; not split into files now (9 rules show no repeated edit-friction that would justify the split — EPDS's own `docs/COMMANDS.md:33-35` upgrade gate requires a demonstrated bottleneck, not "the other project does it this way"). |
| 3 | Session start auto-detects available models, assigns per role | `excerpts/setup-pstack-SKILL.md:12-39` | None. `SKILL.md:98` only records which model *was* used, after the fact (post-hoc self-report) | **Absent — new code** | `bin/models.mjs` (`epds models detect [--write]\|list\|set`) exists, detects public CLI names + standard provider env-var *names* only (no value read/logged — A19), writes `epds/models.json` (gitignored, session-local, role map left for explicit `epds models set`). `npm test` includes `test/models.selftest.mjs` (7 cases) and passes. `SKILL.md` Final report line updated to prefer `epds/models.json` over guessing when present. |
| 4 | 22 of 23 "serious work" playbooks converge on one standard exit (`opening-a-pr`) — predictable output shape | `raw-readme.md:77` | `SKILL.md:86-96` Final report — 5-block contract, the convergence point for **all 14** commands (broader than pstack's 22/23 subset) | **Already present, broader — reinforce (doc only)** | `docs/references/cursor-pstack.md` "standard-exit-convergence" records this. No code change. |
| 5 | Self-expansion: `automate-me` drafts new router skills from observed habits, no cap | `raw-readme.md:243-249` | `docs/COMMANDS.md:33-35` `upgrade` — adds commands/tools/agents/evals only after a *demonstrated repeated bottleneck* | **Already present, deliberately stricter — do not weaken** | pstack's own weakness #1 self-admits "46-47 skills, no cap on growth" (`h154-pstack-flow.html` §8 약점1). `docs/references/cursor-pstack.md` records this as the reason EPDS's gated version is kept as-is; the gate is not loosened to match pstack's uncapped version. |
| 6 | N-parallel comparison exploration (`arena`/`swarm`) — N attempts, human/cross-judge picks best | `raw-readme.md:63-64,118` | None (confirmed absent in `h154-pstack-vs-epds.html` §4 cross-table and independently here) | **Absent — logged as upgrade lead, not built** | `docs/references/cursor-pstack.md` pattern `n-parallel-comparison` + `docs/references/INDEX.md` entry exist, so a future `/epds-status` run stuck on "need to compare N approaches" points here instead of re-deriving from scratch. Not implemented now: no repeated EPDS bottleneck observed yet, and EPDS's own `docs/COMMANDS.md:33-35` upgrade gate requires one before adding a command — adding it speculatively would repeat pstack's own weakness #1. |
| 7 | Lessons encoded in structure, not prose (`reflect`, principle `encode-lessons-in-structure`) | `raw-readme.md:475,563` | `templates/retro.md` "Permanent learning" field ("What should be encoded in tests, tools, policies, templates, or instructions?") + forced Keep/Expand/Iterate/Stop decision | **Already present, more structured — reinforce (doc only)** | `docs/references/cursor-pstack.md` "encode-lessons-in-structure" records this: pstack's `reflect` is an ad hoc skill-file edit; EPDS's `retro.md` is a fixed contract field. No code change. |

## Additional cross-check items (from `h154-pstack-vs-epds.html` §4, folded in for completeness)

| pstack item | Disposition |
|---|---|
| `interrogate` — adversarial multi-model review before landing a diff | Observe, not built. Same upgrade-gate reasoning as item 6. Logged in `docs/references/cursor-pstack.md` pattern `adversarial-review-panel`. |
| `bro` — plain-language re-explain of the final answer | Observe, low priority — thin enough (~1 prompt) that any EPDS command can already be asked to re-explain in the same turn; not worth a dedicated command. Logged as `plain-language-reexplain`. |

## Conflicts checked (G2)

- **`never-block-on-the-human`** (pstack: "reserve confirmation for irreversible actions" — everything
  else proceeds without asking, `raw-readme.md:224`) directly conflicts with EPDS's
  `WORK-ROUTER.md:29-43` STRATEGIC/SENSITIVE gates ("Implementation: not allowed before owner
  approval") and `RELEASE`'s independent GO/NO-GO. **Not imported anywhere.** No item above touches
  those gates; `bin/models.mjs` only reads local PATH/env-var-name signals and writes a
  session-local, gitignored file — it makes no approval-gated decision and needs no gate.
- **Unbounded skill/command growth** (pstack's own weakness #1) — the two genuinely-absent patterns
  (items 6, N-parallel/adversarial-review) were deliberately *not* implemented as new commands,
  specifically to avoid reproducing this weakness. They were routed through EPDS's existing
  reference-lead mechanism (`docs/references/`) instead, which exists precisely so a lead can be
  captured without expanding the command surface (`docs/references/README.md:3-7`).
- No approval gate, safety rule, or scope-discipline rule was weakened, removed, or bypassed by this
  work.

## Verification run

```text
$ npm test  # exit 0
status.selftest PASS (42 assertions)
status.selftest-h125 PASS (8 assertions)
models.selftest PASS (17 assertions, new — test/models.selftest.mjs)
```

Branch: `absorb-pstack`. Not pushed (local-only per instruction).
