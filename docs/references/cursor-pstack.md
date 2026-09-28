---
source: https://github.com/cursor/plugins/tree/main/pstack
kind: skill
perspectives: [agent-ops, delivery]
patterns: [session-model-role-mapping, n-parallel-comparison, adversarial-review-panel, plain-language-reexplain, skill-router-natural-language, principle-independent-files, standard-exit-convergence, encode-lessons-in-structure]
applies_to: [build, verify, retro]
evidence_grade: community
captured: 2026-09-28
---

## Verdict vocabulary (shared with `docs/absorb-pstack.md`)

- **Built** — EPDS had no counterpart; new code/file/template now exists.
- **Built (partial)** — EPDS had no counterpart; a doc/template step now exists, but not a
  full command or enforced code path (still LLM-guided, not machine-gated).
- **Reinforced** — EPDS already had an equivalent or stronger mechanism; only documented the
  equivalence, no code change.
- **Deferred** — genuinely absent, logged as an upgrade lead (`docs/references/INDEX.md`), not
  implemented — EPDS's own upgrade gate (`docs/COMMANDS.md` `/epds-upgrade`) requires a
  demonstrated repeated bottleneck first, and none has been observed yet.
- **Rejected** — duplicate of an existing EPDS mechanism, or importing it would weaken a gate.

## Analysis

Cursor's `pstack` — poteto (Lauren Tan)'s personal Cursor workflow packaged as 47 skills+principles:
24 skills total (`README.md:112-135`, the skills table — `poteto-mode` itself is one of the 24, not
an additional 25th; it's the router that in turn indexes two *separate* 23-item lists — 23 playbooks
it routes a request to, and, independently, the 23 one-rule-per-file design principles it applies
while executing one). Both lists happen to total 23-24 items each; they are not the same list
(README.md:38-77 = playbooks, README.md:194-225 = principles).
MIT, ★8388, actively maintained. Public source:
https://github.com/cursor/plugins/tree/main/pstack (the whole `pstack` plugin) —
https://github.com/cursor/plugins/blob/main/pstack/README.md specifically for the file this page
cites as `README.md:N`. Reviewed twice (H154): once for wholesale adoption/rejection, once
axis-by-axis against EPDS's actual code, not just its docs. Citations below use `README.md:N` for
that public file (captured locally, offline, as R0310 for citation stability — the capture is a
verbatim copy, 259 lines, matching the public source at time of capture; any citation past that
line count is wrong and was corrected in this pass), and `<path>:N` for any other file inside the
same public plugin directory (e.g. `skills/setup-pstack/SKILL.md:N`).

**session-model-role-mapping** (Built): `setup-pstack` detects which models a session can
actually use and writes a role→model rule file so every other skill reads a live answer instead of
guessing (`skills/setup-pstack/SKILL.md:12-39`). EPDS had no counterpart at all — `SKILL.md`
§Final report only recorded which model *was* used, after the fact. Built as `bin/models.mjs`
(`epds models detect|list|set`) — generic detection (public CLI names + standard provider env-var
names only, never values), role assignment left as an explicit user/LLM step rather than
auto-guessed, so no project-specific alias is hardcoded into a portable public skill. `set`
validates the id against the current `detected` list and rejects `__proto__`/`constructor`/
`prototype` role names; `detect --write` replaces `detected` wholesale each run instead of merging
in stale entries. `/verify` now reads `roles.critic`/`roles.reviewers` to build its review panel
(see adversarial-review-panel below) — the first real consumer. See `docs/EPDS.md` §6 "세션 모델
감지".

**n-parallel-comparison** (Built (partial)): `arena`/`swarm` run N independent attempts and let a
human pick the best (`README.md:97,118-119,171,173`, corrected from a prior mis-citation of
lines 63-64, which land on unrelated playbook-table rows). EPDS now has `templates/arena.md` (N attempts,
fixed judging criteria, human/cross-model judge, decision = human picks), referenced from
`/experiment`/`/decide` in `docs/COMMANDS.md`. Not a new command — routed through the existing
delivery commands as a template choice, so it doesn't add to the command surface (avoiding
pstack's own weakness #1: unbounded skill growth, R0310 §8).

**adversarial-review-panel** (Built (partial)): `interrogate` spawns several models to try to break
a diff before it lands (`README.md:104,120`). `docs/COMMANDS.md` `/verify` now has a panel step:
if `epds/models.json` `roles.critic`/`roles.reviewers` is set, each assigned id independently
reviews for correctness/edge-cases/policy compliance before landing; no roles configured falls back
to single-pass self-review (and says so). This is a documented LLM-guided step, not
machine-enforced code — EPDS's `deterministic-by-doc` vs `LLM` distinction (`docs/EPDS.md` §6)
still applies.

**plain-language-reexplain** (Built (partial)): `bro` restates the final answer in plain language
(`README.md:134`). EPDS's `SKILL.md` §Final report now has a required trailing
`[Plain language]` one-line field instead of a dedicated command — the cost of one mandatory line is
lower than the cost of a 15th command, and it can't be skipped the way an optional "explain that
simply" follow-up ask could be.

**skill-router-natural-language** (Reinforced): `poteto-mode`'s 23-way natural-language
playbook classification is functionally equivalent to EPDS's `WORK-ROUTER.md` 7-way classification —
both are text-matched, neither is code-enforced (`docs/EPDS.md:212` "LLM, no enforcement code"
self-admits this for EPDS too). EPDS's version additionally carries a classification→role table
(`docs/ROLES.md`) and STRATEGIC/SENSITIVE approval gates pstack's router lacks. Re-importing would
duplicate, not add.

**principle-independent-files** (Built): pstack's 23 design principles are each their own small
file (`README.md:196-225`). EPDS's 8 scope/safety rules were one list in `SKILL.md`; first
pass logged this as "not yet warranted" (only 8 rules, no observed edit-friction). This pass split
them into `docs/policies/*.md` (one file per rule, `SKILL.md` now a 1문장+링크 list) — the
independent-file unit itself is the point (narrower diff per edit, per-rule linkability from other
docs), not a rule count threshold. `docs/LAYOUT.md` "agent/policies/\*.md" row updated to match.

**standard-exit-convergence** (Reinforced, extended): pstack's `opening-a-pr` is the single
convergence point 22 of 23 playbooks end at, giving predictable output shape (`README.md:77`).
EPDS's `SKILL.md` §Final report already played this role for *all 14* commands as a documented
5-block contract. This pass adds `templates/pr-landing.md` — the same convergence idea applied one
level down, at the commit/PR shape (small ordered commits, 프로젝트 관례 우선 없으면 Conventional
Commits title, briefing-style body), referenced from `/build` in `docs/COMMANDS.md`.

**encode-lessons-in-structure** (Reinforced, extended): pstack's `reflect` turns a finished task's
lessons into an ad hoc skill-file edit (`README.md:124` `/reflect` table row, `README.md:178`
usage example, `README.md:225` the `encode-lessons-in-structure` principle definition — corrected
from a prior mis-citation of lines 475/563, which don't exist in this 259-line file). EPDS's
`templates/retro.md` already had a dedicated "Permanent learning" field plus a forced
Keep/Expand/Iterate/Stop decision — a fixed contract, not a free-form file edit. This pass adds
required "File diff / locator" and "Follow-up owner/date" sub-fields so a learning without a landed
change is flagged as a tracked follow-up instead of silently staying prose-only.

## How EPDS uses it

Full item-by-item disposition (pstack citation | EPDS citation | absorb method | acceptance
criteria) is `docs/absorb-pstack.md` — same verdict vocabulary as this file. No approval gate was
weakened, removed, or bypassed by any of the above (`WORK-ROUTER.md` STRATEGIC/SENSITIVE stayed
untouched; pstack's `never-block-on-the-human` exception was not imported — see
`docs/absorb-pstack.md` § Conflicts checked).

> "pstack (fka poteto stack) - it's the way I like to do agentic engineering with Cursor... a
> collection of workflows, principles and skills." — `README.md:1-4` (R0310).
