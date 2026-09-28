---
source: https://github.com/cursor/plugins/tree/main/pstack
kind: skill
perspectives: [agent-ops, delivery]
patterns: [session-model-role-mapping, n-parallel-comparison, adversarial-review-panel, plain-language-reexplain, skill-router-natural-language, principle-independent-files, standard-exit-convergence, encode-lessons-in-structure]
applies_to: [build, verify, retro]
evidence_grade: community
captured: 2026-09-28
---

## Analysis

Cursor's `pstack` — poteto (Lauren Tan)'s personal Cursor workflow packaged as 46-47 skills (1
router `poteto-mode` + 23 playbooks-as-principles + ~22 individual skills + setup/automation).
MIT, ★8388, actively maintained (R0310 catalog). Reviewed twice (H154): once for wholesale
adoption/rejection, once (this pass, `~/.../h154-pstack-vs-epds.html`) axis-by-axis against EPDS's
actual code, not just its docs. Full origin material: `~/Projects/research/R0310-cursor-pstack/`.

**session-model-role-mapping** (adopted → built): `setup-pstack` detects which models a session can
actually use and writes a role→model rule file so every other skill reads a live answer instead of
guessing. EPDS had no counterpart at all — `SKILL.md` §Final report only recorded which model *was*
used, after the fact. Built as `bin/models.mjs` (`epds models detect|list|set`) — generic detection
(public CLI names + standard provider env-var names only, never values), role assignment left as an
explicit user/LLM step rather than auto-guessed, so no project-specific alias is hardcoded into a
portable public skill. See `docs/EPDS.md` §6 "세션 모델 감지".

**n-parallel-comparison** / **adversarial-review-panel** (observe, not built): `arena`/`swarm` run N
independent attempts and let a human pick the best (`raw-readme.md:63-64,118`); `interrogate` spawns
several models to try to break a diff before it lands (`raw-readme.md:104,120`). EPDS's own
`docs/COMMANDS.md:33-35` upgrade gate requires a demonstrated repeated bottleneck before adding a
command — no such gap has been observed yet in EPDS usage, so this is logged as an upgrade lead, not
implemented now (would otherwise repeat pstack's own weakness #1: unbounded skill growth, R0310 §8).

**plain-language-reexplain** (observe, low priority): `bro` restates the final answer in plain
language (`raw-readme.md:134`) — thin enough (~1 prompt) that it is not worth a dedicated command;
any EPDS command can already be asked to "explain that simply" in the same turn.

**skill-router-natural-language** (reject — duplicate): `poteto-mode`'s 23-way natural-language
classification is functionally equivalent to EPDS's `WORK-ROUTER.md` 7-way classification — both are
text-matched, neither is code-enforced (`docs/EPDS.md:213` "LLM, no enforcement code" self-admits
this for EPDS too). EPDS's version additionally carries a classification→role table
(`docs/ROLES.md`) and STRATEGIC/SENSITIVE approval gates pstack's router lacks. Re-importing would
duplicate, not add.

**principle-independent-files** (reject — already logged, not yet warranted): pstack's 23 design
principles are each their own small file (`raw-readme.md:196`). EPDS keeps its 9 scope/safety rules
as one list in `SKILL.md` — already flagged as an upgrade candidate in `docs/LAYOUT.md`
("agent/policies/\*.md" row) before this reference existed; 9 short rules don't yet show the repeated
edit-friction pstack's 23-principle scale would justify splitting for.

**standard-exit-convergence** (reject — already satisfied): pstack's `opening-a-pr` is the single
convergence point 22 of 23 playbooks end at, giving predictable output shape (`raw-readme.md:77`).
EPDS's `SKILL.md` §Final report already plays this role for *all 14* commands, not a subset, and is
a documented 5-block contract rather than a single playbook.

**encode-lessons-in-structure** (reject — already satisfied, more structured): pstack's `reflect`
turns a finished task's lessons into an ad hoc skill-file edit (`raw-readme.md:475,563`). EPDS's
`templates/retro.md` already has a dedicated "Permanent learning" field ("What should be encoded in
tests, tools, policies, templates, or instructions?") plus a forced Keep/Expand/Iterate/Stop
decision — a fixed contract, not a free-form file edit.

## How EPDS uses it

Full item-by-item disposition (pstack citation | EPDS citation | absorb method | acceptance
criteria) is `docs/absorb-pstack.md`. Only one pattern changed EPDS's code
(session-model-role-mapping → `bin/models.mjs`); the rest were either already structurally present
or deliberately deferred under EPDS's own upgrade-gate discipline (`docs/COMMANDS.md:33-35`) — never
by weakening an approval gate (`WORK-ROUTER.md` STRATEGIC/SENSITIVE stayed untouched; pstack's
`never-block-on-the-human` exception was not imported).

> "pstack (fka poteto stack) - it's the way I like to do agentic engineering with Cursor... a
> collection of workflows, principles and skills." — `raw-readme.md:1-4` (R0310).
