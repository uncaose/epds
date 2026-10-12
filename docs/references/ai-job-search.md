---
source: https://github.com/MadsLorentzen/ai-job-search
kind: repo
perspectives: [delivery, agent-ops]
patterns: [repo-layout-contract-driven]
applies_to: [spec, build, verify]
evidence_grade: community
captured: 2026-09-16
---

## Analysis

MadsLorentzen/ai-job-search — Claude Code giban gujik jadonghwa. humani "templates, tests, tools wa .claude
e jeongriga jaldoen seoljeong — is this a normal level pattern for AI use?" rago directly questionhan target. `docs/LAYOUT.md`
(eijeonteu jungrip koeo+yalbeun eodaepteo teuri)ui 1cha wonbon.

**repo-layout-contract-driven**: CLAUDE.md/AGENTS.md(constitution) → .claude/commands(jaehyeon jeolcha) →
.claude/skills(jikmu gyuchik) → .agents/skills/*/cli(runhyeong dogu) → templates(chulryeok golgyeok) → tests/CI(jisok
Verification) → tools/verify_*.py("saengseongdwaetda"ga anira "usable itda" panjeong) → SECURITY.md(distrust external input)ro
separatedoenda. rideu: "peurompeuteu jal sseugi peurojekteu"ga anira ipryeok·jeolcha·dogu·Verification·anjeon gyuchiki jeojangso structure jachero
separatedwaeya jaehyeon ganeunghada — EPDS.md §3, docs/LAYOUT.mdui directly evidence.

## Measured

n/a — document/thread source (verified 2026-09-18: url reachable, HTTP 200). jeojangso jachereul "install·run"
haneun conceptsi eopsda(forkhaeseo bonin gujike sseuneun tempeulrit) — structure repeoreonseuroman sayong.

## How EPDS uses it

Spec/Build/Verify — `docs/LAYOUT.md`ui koeo+eodaepteo teuri structure 1cha wonbon. EPDS jasinui direkteori separate
(adapters/·templates/·tests/·tools/)ga i reiauteul geudaero ttareunda.

> "The job search that runs on your machine. AI job application framework built on Claude Code:
> evaluate postings, tailor CVs, write cover letters, prep interviews. Fork it and own it." — repo
> description(gh api measured 2026-09-16, stars 43033; remeasured 2026-09-18: stars 43214, open_issues 5).
