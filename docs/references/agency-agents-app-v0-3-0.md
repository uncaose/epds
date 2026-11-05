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

agency-agents-app v0.3.0(2026-07-05) — a native app that installs and tracks the agency-agents catalog; this release
introduces "Runbooks" (one-click deployment of a team per scenario).

**scenario-runbook-deploy**: pick one scenario such as "Startup MVP" or "Incident Response" and the matching
role bundle (Core/Growth/Support) is installed at once. Lead: EPDS likewise states, for each work classification (WORK-ROUTER), "which
roles/artifacts bundle attaches to this classification" in the priority column of `docs/ROLES.md`, getting the same effect through a document (no separate app
needed).

## Measured

n/a — document/thread source (verified 2026-09-18: url reachable, HTTP 200). Installing and running the native app (.dmg/.deb/.rpm/
.AppImage/.exe) is a GUI app, so it is not a target for reproduction in this CLI-isolated environment — only the release notes are used as evidence.

## How EPDS uses it

Build/Release — referenced only as evidence that a "runbook" mobilizing several roles at once corresponds to EPDS's `WORK-ROUTER.md` classification
(TRIVIAL/FEATURE/STRATEGIC/...). The app itself is not adopted (EPDS's choice is to get the same effect through the
`docs/ROLES.md` document, without a separate app).

> "Runbooks turn the catalog's NEXUS scenario playbooks into one-click orchestrated deployments ...
> pick a scenario ... and the app assembles the proven agent team." — GitHub release body(gh api
> measured 2026-09-16, published_at 2026-07-05T22:59:16Z; repo stars remeasured 2026-09-18: 559, at registration
> 546).
