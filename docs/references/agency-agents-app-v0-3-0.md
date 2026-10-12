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

agency-agents-app v0.3.0(2026-07-05) — agency-agents katalrogeureul install·chujeokhaneun neitibeu aep, i rilriseueseo
"Runbooks"(sinariobyeol timeul wonkeulrik baepo) doip.

**scenario-runbook-deploy**: "Startup MVP", "Incident Response" gateun sinario hanareul goreumyeon geue matneun
yeokhal mukeum(Core/Growth/Support)i han beone installdoenda. rideu: EPDSdo work classification(WORK-ROUTER)mada "i bunryuen
eotteon roles/artifacts mukeumi butneunga"reul `docs/ROLES.md` useonsunwi yeolro myeongsihae gateun hyogwareul documentro naenda(byeoldo aep
eopsi).

## Measured

n/a — document/thread source (verified 2026-09-18: url reachable, HTTP 200). neitibeu aep(.dmg/.deb/.rpm/
.AppImage/.exe) install·runeun GUI aepira i CLI gyeokri hwangyeongeseo jaehyeon not a target — rilriseu noteuman evidencero sayong.

## How EPDS uses it

Build/Release — yeoreo yeokhaleul han beone dongwonhaneun "reonbuk"i EPDSui `WORK-ROUTER.md` bunryu
(TRIVIAL/FEATURE/STRATEGIC/...)wa daeeunghandaneun evidenceroman chamjo. aep itself adoptedhaji anhneunda(byeoldo aep eopsi
`docs/ROLES.md` documentro gateun hyogwareul naendaneun geoti EPDSui seontaek).

> "Runbooks turn the catalog's NEXUS scenario playbooks into one-click orchestrated deployments ...
> pick a scenario ... and the app assembles the proven agent team." — GitHub release body(gh api
> measured 2026-09-16, published_at 2026-07-05T22:59:16Z; repo stars remeasured 2026-09-18: 559, at registration
> 546).
