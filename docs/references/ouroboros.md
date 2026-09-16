---
source: https://github.com/Q00/ouroboros
kind: tool
perspectives: [agent-ops, delivery]
patterns: [ambiguity-gate, evolve-loop]
applies_to: [direction, spec, retro]
evidence_grade: community
captured: 2026-09-16
---

Q00/ouroboros — 명세-실행-평가-기억을 도는 에이전트 OS(Python CLI `ooo`, 13개 런타임 어댑터). 선행 조사
= `~/Projects/research/R0229-ouroboros-agent-os-survey`(2026-08-29, gh api+WebFetch 실측). EPDS 어느
단계에 기여: Direction/Spec — 표1에서 "조건부 높음"(운영 복잡도·자율성 리스크로 초기 MVP엔 과도)으로
채점된 근거가 EPDS의 "작게 시작" 원칙(Scope discipline)을 강화한다.

**ambiguity-gate**: 모호성 점수가 임계값(≤0.2)을 넘지 못하면 실행을 막는다. 리드: EPDS의 "owner-only
질문 5개 이하" 규칙과 동형 목적(모호함을 실행 전에 소진) — 다만 ouroboros는 수치 게이트, EPDS는 질문 게이트.

**evolve-loop**: 세대(generation)마다 온톨로지 유사도 95% 수렴까지 반복 개선. 리드: EPDS의 retro 단계가
"keep/expand/iterate/stop" 결정 규칙으로 대응하지만, ouroboros처럼 자동 반복 종결 조건은 아직 없다 — 갭으로
남긴다.

> "Pins an acceptance spec and omits any verify command or expected output from the worker's
> contract." — pyproject.toml description(R0229 raw/c6, 2026-08-29 캡처).
