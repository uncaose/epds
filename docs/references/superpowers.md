---
source: https://github.com/obra/superpowers
kind: skill
perspectives: [delivery, agent-ops]
patterns: [skill-habit-framework, tdd-first]
applies_to: [build, verify]
evidence_grade: community
captured: 2026-09-16
---

obra/superpowers — TDD·디버깅·협업·계획·코드리뷰·검증을 스킬로 습관화하는 프레임워크. 이 세션에도 Claude
Code 플러그인으로 로드돼 있다(로컬 캐시 v6.3.0 실측). EPDS 어느 단계에 기여: Build/Verify — "사업 판단은
빠지고 실행 규율만 있다"는 EPDS 표1의 경고를 `docs/TESTS.md` 4계층과 대조하는 기준.

**skill-habit-framework**: 방법론을 문서가 아니라 트리거형 스킬(`test-driven-development`,
`systematic-debugging`, `verification-before-completion`)로 패키징해 매 작업마다 자동 상기시킨다.
리드: EPDS의 evidence-first 프로토콜도 "읽어두면 좋은 글"이 아니라 매 명령 앞단에 강제되는 절차여야 한다.

**tdd-first**: 구현 전에 실패하는 테스트를 먼저 쓴다 — `docs/TESTS.md` "계층: 코드"가 이 패턴의 최소
요소.

> "An agentic skills framework & software development methodology that works." — repo
> description(gh api 실측 2026-09-16, stars 287306).
