---
source: https://github.com/garrytan/gstack
kind: skill
perspectives: [product, delivery, agent-ops]
patterns: [role-based-sprint-commands]
applies_to: [direction, spec, build]
evidence_grade: community
captured: 2026-09-16
---

Garry Tan의 Claude Code 설정 — CEO·디자이너·DX·엔지니어링·QA·보안·배포를 하나의 순서로 잇는 23개 커맨드.
EPDS 어느 단계에 기여: Direction→Spec→Build — "역할이 아니라 순서"가 실행 단위라는 관점을 `docs/ROLES.md`
단계 순서 설계에 반영.

**role-based-sprint-commands**: `/office-hours`, `/plan-ceo-review`, `/autoplan` 처럼 역할이 아니라
"지금 이 순간 무엇을 결정해야 하는가"를 커맨드로 못박는다. 리드: EPDS의 단계(발견→판단→실험→...)도 역할
목록이 아니라 순서가 있는 커맨드 체인으로 남아야 재현 가능하다.

> "23 opinionated tools that serve as CEO, Designer, Eng Manager, Release Manager, Doc Engineer,
> and QA" — repo description(gh api 실측 2026-09-16).
