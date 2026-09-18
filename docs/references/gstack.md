---
source: https://github.com/garrytan/gstack
kind: skill
perspectives: [product, delivery, agent-ops]
patterns: [role-based-sprint-commands]
applies_to: [direction, spec, build]
evidence_grade: community
captured: 2026-09-16
---

## Analysis

Garry Tan의 Claude Code 설정 — CEO·디자이너·DX·엔지니어링·QA·보안·배포를 하나의 순서로 잇는 커맨드 모음
(카드 등록 시점 23개 → 실측 2026-09-18 시점 54개 SKILL.md 디렉터리, 빠르게 성장 중).

**role-based-sprint-commands**: `/office-hours`, `/plan-ceo-review`, `/autoplan` 처럼 역할이 아니라
"지금 이 순간 무엇을 결정해야 하는가"를 커맨드로 못박는다. 리드: EPDS의 단계(발견→판단→실험→...)도 역할
목록이 아니라 순서가 있는 커맨드 체인으로 남아야 재현 가능하다.

## Measured

격리 디렉터리 `~/Projects/go-work/epds-tools/gstack/`: `git clone --depth 1` exit 0 (2026-09-18,
~2.4s). `LICENSE` = MIT(Garry Tan, 2026) — 카드 등록 시 `meta.license: MIT`와 일치, 실물 확인.
최상위 `find . -maxdepth 2 -name SKILL.md` = 54개(자기자신 포함 실디렉터리 53개: autoplan, benchmark,
browse, canary, careful, codex, design*, devex-review, diagram, document-generate/-release, freeze,
guard, health, investigate, ios-*, land-and-deploy, landing-report, learn, make-pdf, office-hours,
pair-agent, plan-*, qa/qa-only, retro, review, scrape, setup-*, ship, skillify, spec, sync-gbrain,
unfreeze 등) — 등록 시점 "23개 커맨드" 대비 2배 이상 성장, `meta.activity` 갱신 필요. 실행(슬래시 커맨드
자체 실행)은 Claude Code 세션 내부 기능이라 이 CLI 격리 환경에서 재현 불가 — 구조 확인만.

## How EPDS uses it

Direction→Spec→Build — "역할이 아니라 순서"가 실행 단위라는 관점을 `docs/ROLES.md` 단계 순서 설계에
반영. `/epds-status`가 "다음 스텝"을 역할이 아니라 순서로 제안하는 설계의 1차 참조.

> "23 opinionated tools that serve as CEO, Designer, Eng Manager, Release Manager, Doc Engineer,
> and QA" — repo description(gh api 실측 2026-09-16; 실측 2026-09-18 기준 커맨드 수는 위 §Measured
> 참조 — description 문구는 갱신되지 않은 구값).
