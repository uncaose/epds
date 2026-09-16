---
source: https://github.com/msitarzewski/agency-agents-app/releases/tag/v0.3.0
kind: repo
perspectives: [agent-ops, delivery]
patterns: [scenario-runbook-deploy]
applies_to: [build, release]
evidence_grade: community
captured: 2026-09-16
---

agency-agents-app v0.3.0(2026-07-05) — agency-agents 카탈로그를 설치·추적하는 네이티브 앱, 이 릴리스에서
"Runbooks"(시나리오별 팀을 원클릭 배포) 도입. EPDS 어느 단계에 기여: Build/Release — 여러 역할을 한 번에
동원하는 "런북"이 EPDS의 `WORK-ROUTER.md` 분류(TRIVIAL/FEATURE/STRATEGIC/...)와 대응한다는 근거.

**scenario-runbook-deploy**: "Startup MVP", "Incident Response" 같은 시나리오 하나를 고르면 그에 맞는
역할 묶음(Core/Growth/Support)이 한 번에 설치된다. 리드: EPDS도 작업 분류(WORK-ROUTER)마다 "이 분류엔
어떤 역할·산출물 묶음이 붙는가"를 `docs/ROLES.md` 우선순위 열로 명시해 같은 효과를 문서로 낸다(별도 앱
없이).

> "Runbooks turn the catalog's NEXUS scenario playbooks into one-click orchestrated deployments ...
> pick a scenario ... and the app assembles the proven agent team." — GitHub release body(gh api
> 실측 2026-09-16, published_at 2026-07-05T22:59:16Z).
