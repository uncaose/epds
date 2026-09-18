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

MadsLorentzen/ai-job-search — Claude Code 기반 구직 자동화. human이 "templates, tests, tools 와 .claude
에 정리가 잘된 설정 — 이게 일반적인 AI 이용 수준의 패턴인가?" 라고 직접 질의한 대상. `docs/LAYOUT.md`
(에이전트 중립 코어+얇은 어댑터 트리)의 1차 원본.

**repo-layout-contract-driven**: CLAUDE.md/AGENTS.md(헌법) → .claude/commands(재현 절차) →
.claude/skills(직무 규칙) → .agents/skills/*/cli(실행형 도구) → templates(출력 골격) → tests/CI(지속
검증) → tools/verify_*.py("생성됐다"가 아니라 "쓸 수 있다" 판정) → SECURITY.md(외부 입력 비신뢰)로
분리된다. 리드: "프롬프트 잘 쓰기 프로젝트"가 아니라 입력·절차·도구·검증·안전 규칙이 저장소 구조 자체로
분리돼야 재현 가능하다 — EPDS.md §3, docs/LAYOUT.md의 직접 근거.

## Measured

n/a — document/thread source (verified 2026-09-18: url reachable, HTTP 200). 저장소 자체를 "설치·실행"
하는 개념이 없다(fork해서 본인 구직에 쓰는 템플릿) — 구조 레퍼런스로만 사용.

## How EPDS uses it

Spec/Build/Verify — `docs/LAYOUT.md`의 코어+어댑터 트리 구조 1차 원본. EPDS 자신의 디렉터리 분리
(adapters/·templates/·tests/·tools/)가 이 레이아웃을 그대로 따른다.

> "The job search that runs on your machine. AI job application framework built on Claude Code:
> evaluate postings, tailor CVs, write cover letters, prep interviews. Fork it and own it." — repo
> description(gh api 실측 2026-09-16, stars 43033; 재측정 2026-09-18: stars 43214, open_issues 5).
