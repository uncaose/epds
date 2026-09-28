---
source: private (this operator's own separate project; not publicly hosted — self-reported only, not independently verifiable by other EPDS users)
kind: thread
perspectives: [self, agent-ops]
patterns: [custom-router-long-term]
applies_to: [direction, observe]
evidence_grade: self
captured: 2026-09-16
---

## Analysis

argo — a custom orchestration concept this EPDS operator runs in a separate, non-public project:
roughly "crew (planning) × harness (execution) × human (approval gate)". No public URL exists for
it, so this entry is `kind: thread`, `evidence_grade: self` (a self-reported worked example, not a
citable public source) — EPDS 표1에서 "직접 만든 라우터"(사업/게임/콘텐츠 지표 판단 기준 내재화, 장기
적합도 매우 높음)의 실제 운영 사례.

**custom-router-long-term**: 범용 에이전트 OS(예: Ouroboros)를 그대로 들여오지 않고, 도메인 지표(리텐션·
전환·비용)를 판단 기준에 박아 넣은 자체 오케스트레이터를 쓴다. 리드: EPDS도 "도구/역할 카탈로그"에서
멈추지 않고, 프로젝트마다 PRODUCT.md/METRICS.md에 그 프로젝트 고유 판단 기준을 채워야 이 패턴이 완성된다
— 채우지 않으면 표1의 "직접 만든 라우터"가 아니라 범용 카탈로그에 머문다.

## Measured

n/a — self-reported worked example, not a public document. No URL or local file path is cited here
(unlike EPDS's other `docs/references/*.md` entries, which verify a public URL or a locally
captured copy of one) because the source is this operator's own private project, not something
another EPDS user could independently check. Treat this entry's weight accordingly — it argues for
a *pattern* (build your own domain-aware router instead of a generic one), not for a specific
implementation EPDS could adopt.

## How EPDS uses it

Direction/Observe — argues for the "직접 만든 라우터" pattern's long-term fit in EPDS's own §1
comparison table. PRODUCT.md/METRICS.md에 프로젝트 고유 판단 기준을 채우는 설계 근거로만 인용, 실행
의존성 없음.
