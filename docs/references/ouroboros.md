---
source: https://github.com/Q00/ouroboros
kind: tool
perspectives: [agent-ops, delivery]
patterns: [ambiguity-gate, evolve-loop]
applies_to: [direction, spec, retro]
evidence_grade: community
captured: 2026-09-16
---

## Analysis

Q00/ouroboros — 명세-실행-평가-기억을 도는 에이전트 OS(Python CLI `ooo`, 13개 런타임 어댑터). 선행 조사
= `~/Projects/research/R0229-ouroboros-agent-os-survey`(2026-08-29, gh api+WebFetch 실측). 표1에서
"조건부 높음"(운영 복잡도·자율성 리스크로 초기 MVP엔 과도)으로 채점된 근거가 EPDS의 "작게 시작" 원칙
(Scope discipline)을 강화한다.

**ambiguity-gate**: 모호성 점수가 임계값(≤0.2)을 넘지 못하면 실행을 막는다. 리드: EPDS의 "owner-only
질문 5개 이하" 규칙과 동형 목적(모호함을 실행 전에 소진) — 다만 ouroboros는 수치 게이트, EPDS는 질문 게이트.

**evolve-loop**: 세대(generation)마다 온톨로지 유사도 95% 수렴까지 반복 개선. 리드: EPDS의 retro 단계가
"keep/expand/iterate/stop" 결정 규칙으로 대응하지만, ouroboros처럼 자동 반복 종결 조건은 아직 없다 — 갭으로
남긴다.

## Measured

기존 설치 확인(2026-09-18, `ooo --version` = 0.51.17, PyPI `ouroboros-ai`가 아니라 시스템 `pip3 show`엔
안 잡히는 격리 venv/pipx 설치 — `which ooo` = `/Users/uncaose/.local/bin/ooo`). `ooo qa
<b3.diff> -t code -q "..."` 실행: **codex 백엔드(기본) exit 1** — "You've hit your usage limit ...
try again at Sep 21st, 2026 3:14 AM"(코덱스 쿼터 소진, 실사용 불가 확인). `ooo config backend gemini`로
전환 후 재실행: **exit 1** — `ModelNotFoundError: models/claude-opus-5 is not found`(로컬 gemini-cli
설정이 잘못된 모델 ID를 상속 — 환경 오구성, ooo 자체 결함 아님). 백엔드를 `codex`로 원복해 세션 상태
복구(2026-09-18 19:36). 두 백엔드 모두 실측 QA 판정 미획득 — "환경 미충족"으로 기록.

## How EPDS uses it

Direction/Spec — ambiguity-gate·evolve-loop 패턴을 EPDS의 owner-question 게이트·retro 루프 설계에
참조용으로만 반영(런타임 의존 아님). `ooo qa`는 후보 QA 백엔드로 검토했으나, 이 환경에서는 두 백엔드
모두 즉시 사용 불가(쿼터/설정) — 채택 보류.

> "Pins an acceptance spec and omits any verify command or expected output from the worker's
> contract." — pyproject.toml description(R0229 raw/c6, 2026-08-29 캡처; stars 재측정 2026-09-18:
> 6020, 등록 시 5933).
