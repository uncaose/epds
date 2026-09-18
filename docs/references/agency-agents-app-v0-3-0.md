---
source: https://github.com/msitarzewski/agency-agents-app/releases/tag/v0.3.0
kind: repo
perspectives: [agent-ops, delivery]
patterns: [scenario-runbook-deploy]
applies_to: [build, release]
evidence_grade: community
captured: 2026-09-16
---

## Analysis

agency-agents-app v0.3.0(2026-07-05) — agency-agents 카탈로그를 설치·추적하는 네이티브 앱, 이 릴리스에서
"Runbooks"(시나리오별 팀을 원클릭 배포) 도입.

**scenario-runbook-deploy**: "Startup MVP", "Incident Response" 같은 시나리오 하나를 고르면 그에 맞는
역할 묶음(Core/Growth/Support)이 한 번에 설치된다. 리드: EPDS도 작업 분류(WORK-ROUTER)마다 "이 분류엔
어떤 역할·산출물 묶음이 붙는가"를 `docs/ROLES.md` 우선순위 열로 명시해 같은 효과를 문서로 낸다(별도 앱
없이).

## Measured

n/a — document/thread source (verified 2026-09-18: url reachable, HTTP 200). 네이티브 앱(.dmg/.deb/.rpm/
.AppImage/.exe) 설치·실행은 GUI 앱이라 이 CLI 격리 환경에서 재현 대상 아님 — 릴리스 노트만 근거로 사용.

## How EPDS uses it

Build/Release — 여러 역할을 한 번에 동원하는 "런북"이 EPDS의 `WORK-ROUTER.md` 분류
(TRIVIAL/FEATURE/STRATEGIC/...)와 대응한다는 근거로만 참조. 앱 자체는 채택하지 않는다(별도 앱 없이
`docs/ROLES.md` 문서로 같은 효과를 낸다는 것이 EPDS의 선택).

> "Runbooks turn the catalog's NEXUS scenario playbooks into one-click orchestrated deployments ...
> pick a scenario ... and the app assembles the proven agent team." — GitHub release body(gh api
> 실측 2026-09-16, published_at 2026-07-05T22:59:16Z; repo stars 재측정 2026-09-18: 559, 등록 시
> 546).
