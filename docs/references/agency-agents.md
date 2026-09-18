---
source: https://github.com/msitarzewski/agency-agents
kind: repo
perspectives: [product, agent-ops]
patterns: [persona-catalog]
applies_to: [direction, spec, build]
evidence_grade: community
captured: 2026-09-16
---

## Analysis

msitarzewski/agency-agents — Product Manager·UX Researcher·Privacy Engineer·Test Automation
Engineer 등 역할별 페르소나 카탈로그(언제 호출·산출물·우선순위 명시). `docs/ROLES.md`(표2+표6 병합)의
"단계 → 핵심 질문 → 권장 역할 → 산출물 → 우선순위" 구조의 1차 원본.

**persona-catalog**: 역할마다 "언제 호출하는가"와 "반드시 남길 산출물"을 못박아, 역할을 부르는 것 자체가
산출물 계약이 되게 한다. 리드: EPDS의 스킬 라우팅도 "이 명령이 언제 트리거되는가"뿐 아니라 "무엇을 파일로
남겨야 완료인가"를 명시해야 한다 — `docs/ROLES.md`에 그대로 반영.

## Measured

n/a — document/thread source (verified 2026-09-18: url reachable, HTTP 200). 카탈로그 자체는 마크다운
페르소나 파일 모음이라 "설치·실행" 개념이 없음(카탈로그를 클론하거나 `agency-agents-app`으로 설치하는
것은 별도 항목, 아래 `agency-agents-app-v0-3-0.md` 참조).

## How EPDS uses it

Direction/Spec/Build — `docs/ROLES.md`의 표 구조 1차 원본. EPDS가 역할을 호출할 때 산출물을 함께
못박는 설계(호출=계약)가 이 카탈로그의 페르소나 파일 형식을 그대로 따른다.

> "A complete AI agency at your fingertips ... Each agent is a specialized expert with personality,
> processes, and proven deliverables." — repo description(gh api 실측 2026-09-16, stars 152679;
> 재측정 2026-09-18: stars 153256, open_issues 149).
