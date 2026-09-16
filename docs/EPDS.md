<!-- rewritten 2026-09-16: 결론-압축본 → 근거 흐름. human 판정("결론만 있고 흐름이 없다") 반영.
     원 결론형(69줄, completed 2026-09-16 from Perplexity thread 6f74f459)의 §Components/Why는 §4로 이동, 삭제 없음. -->

# EPDS Architecture — 무엇을 막는가, 왜 이 형태인가

## §0. 두괄 — 무엇을 막나

EPDS는 "AI가 빨리, 많이 만든다"를 막지 않는다. **결론만 있고 그 결론에 이른 근거가 사라진 산출물**을 막는다
([tech-bridge-ai](references/tech-bridge-ai-code-quality.md): 코드가 완벽해도 제품이 부족할 수 있다 — 코드
정확성과 제품 증거는 별개 질문). 압축된 결론은 재검증할 수 없고, 재검증할 수 없는 결론은 다음 실패에서
그대로 반복된다. 그래서 EPDS의 모든 산출물은 "무엇을(what)"뿐 아니라 "왜 이것이고 다른 것이 아닌가(why not
the alternative)"를 같은 파일에 남긴다.

```text
Direction → Problem → Hypothesis → Minimum Experiment → Spec → Build → Verify → Release → Observe → Retro
```

## §1. 살펴본 관점 — 도구 비교와 그 이유

EPDS를 설계하기 전에 4가지 관점을 실제로 비교했다([gstack](references/gstack.md),
[superpowers](references/superpowers.md), [ouroboros](references/ouroboros.md), 직접 만든 라우터
= [argo](references/argo-internal.md) 실사례):

| 관점 | 핵심 역할 | 적합도 | 이유 |
|---|---|---|---|
| gstack | 역할 기반 제품 개발 스프린트(CEO→디자인→DX→엔지니어링→QA→보안→배포) | 매우 높음 | 순서가 커맨드로 고정돼 재현 가능 — 다만 명령 수 많고 초기 흐름 무거움 |
| Superpowers | 개발 방법론(TDD·디버깅·협업)을 습관화하는 스킬 | 높음 | 실행 규율은 강하나 사업 판단(무엇을 왜 만드는가)이 빠져 있다 — EPDS가 그 앞단(Direction~Hypothesis)을 채움 |
| Ouroboros | 명세-실행-평가-기억 에이전트 OS, 모호성 게이트+진화 루프 | 조건부 높음 | 개념(게이트·수렴)은 강하게 겹치나, 초기 MVP에 "에이전트 OS" 전체를 놓으면 제품 개발 자체가 멈춘다 |
| 직접 만든 라우터(argo류) | 사업·제품 지표(리텐션·전환·비용)를 판단 기준에 내재화 | 장기 매우 높음 | 범용 카탈로그로는 도메인 판단을 못한다 — 그러나 초기부터 이것만 만들면 과설계 |

**왜 EPDS는 이 넷 중 하나를 그대로 쓰지 않고 조합했는가**: gstack의 "순서가 커맨드"를 骨格로,
Superpowers의 "습관화된 검증 스킬"을 Build/Verify에, Ouroboros의 "게이트가 곧 진행 조건"을 evidence-first
프로토콜(질문 5개 이하)로 약화 차용하고, "직접 만든 라우터"는 프로젝트마다 PRODUCT.md/METRICS.md를 채우는
것으로 위임했다 — EPDS 자체가 사업 판단을 대신 내리지 않는다(Scope discipline, §5 참고).

## §2. 검토한 패턴 10 — 택한 조합과 버린 것

human이 제공한 대안·보완 패턴 10종 중, EPDS가 실제로 쓰는 것과 의도적으로 버린 것:

| 패턴 | 택함/버림 | 이유 |
|---|---|---|
| Spec-driven | 택함 | `templates/feature-spec.md`, `spec` 커맨드 — 복잡 기능엔 필요, 문서>구현 위험은 Scope discipline으로 상쇄 |
| Test-first/Proof-carrying | 택함(부분) | `verify` 커맨드가 담당하나 EPDS 자체는 테스트 프레임워크를 강제하지 않음 — `docs/TESTS.md` 참고 |
| Planner–Executor–Reviewer | 택함 | `build`(executor)와 `verify`(독립 reviewer 관점)를 분리한 커맨드 구조에 반영 |
| Router–Specialist | 택함 | 작업 분류(`WORK-ROUTER.md`: TRIVIAL/FEATURE/EXPLORATORY/STRATEGIC/SENSITIVE/RELEASE/GROWTH)가 라우터, 역할은 `docs/ROLES.md` |
| Artifact-first | 택함 | 모든 산출물=파일(PRODUCT.md/PROJECT-STATE.md/템플릿) — 채팅 결론만 남기지 않음 |
| Policy-as-code | 택함(약하게) | Scope/safety rules를 SKILL.md에 명문화, CI 강제는 프로젝트 몫(권장, 강제 아님) |
| Prompt-first | 버림 | 재현성·검증 부족이 EPDS가 정확히 막으려는 실패 |
| Command/Skill-first(단독) | 부분 채택 | 명령 과다 피로를 피하려 커맨드 수를 14개로 제한(SKILL.md 라우팅표) |
| Event-driven agent | 버림(이월) | 통제·비용 문제 — CI 실패/배포 감시 자동화는 프로젝트가 직접 얹을 몫, EPDS 코어에 넣지 않음 |
| Eval-driven | 부분 채택 | `docs/TESTS.md` "결과" 계층·`evals/`가 담당, 골든셋 설계는 upgrade 시점으로 미룸 |

## §3. 참고 저장소 구조 — ai-job-search에서 가져온 것

[ai-job-search](references/ai-job-search.md)는 human이 직접 "이게 일반적인 AI 이용 수준의 패턴인가"라고
물은 대상이다. 답: 아니다 — 대부분의 AI 이용 저장소는 프롬프트만 있고, ai-job-search는 **입력·절차·도구·
검증·안전 규칙을 저장소 구조로 분리**했다(표3, `docs/LAYOUT.md`에 전체 대응표). EPDS가 가져온 것:

- 헌법(CLAUDE.md/AGENTS.md)과 실행 절차(commands)를 분리 — "무엇을 항상 지키는가"와 "이번에 뭘 하는가"를
  같은 파일에 섞지 않는다.
- 검증 도구(`tools/verify_*`)는 "AI가 검토했다"가 아니라 실행 가능한 판정이어야 한다 — `verify` 커맨드의
  "독립 품질 증거 수집"이 이 원칙을 그대로 따른다.
- 템플릿은 AI가 채우는 안정된 골격이지, 매번 새로 설계하는 대상이 아니다.

## §4. EPDS 구성으로 수렴

```text
EPDS Skill
  ├── Evidence protocol
  ├── Delivery state model
  ├── Natural-language work router
  ├── Setup/status/audit/upgrade/reference operations
  ├── Delivery commands
  ├── Templates as output contracts
  ├── Specialist guidance
  └── Safety and approval rules

Target project after setup
  ├── PRODUCT.md  PROJECT-STATE.md  METRICS.md  AGENTS.md  CLAUDE.md
  ├── epds/  templates/  specs/  decisions/  docs/  tests/  evals/  tools/
```

### 두 트랙 진단

| Track | Core question | Examples of evidence |
|---|---|---|
| Product/business | Does this create a real, repeatable user outcome? | Behavior, interviews, experiments, retention, conversion, cost reduction |
| Technical/delivery | Does it work safely, reliably, and maintainably? | Tests, E2E, performance, security/privacy checks, staging, rollback |

다음 행동 = 두 트랙 중 더 약한 게이트를 가장 작은 단위로 미는 것.

### Evidence rules

리포지토리와 실제 사용자/운영 데이터가 일반 조언보다 우선한다. `epds/trusted-sources.json`(기반 항목 5개
+ §1~§3에서 인용한 8개, id는 `epds sources list` 참고)이 "공개 소스를 언제, 무엇으로 쓸지"의 config
정본이다. CLI: `epds sources list|add|remove|show` — 상세는 `README.md`.

**End-reason distribution.** When a simulation, replay, or drop-log artifact exists, its end-reason (or termination-cause) distribution is a required Facts line. If one value accounts for 100% of the sample, mark every verdict built on it as a "censored sample", not a clean pass.

### Templates/tests/tools/evals/policies가 존재하는 이유

- **Templates**: 중요 결정이 빠지는 것을 막고 세션/모델 간 인수인계를 만든다.
- **Tests**: 기대 동작을 증명하고 회귀를 막는다.
- **Evals**: AI 생성/판정 결과를 안정된 예시·실패 사례와 대조한다.
- **Tools**: "please check carefully" 대신 검증을 실행 가능하게 만든다.
- **Policies**: 에이전트가 급해도 개인정보·승인·릴리스 경계를 지킨다.

## §5. 계열별 최소 요소 — 있는 것/없는 것

표8(추가 참고 패턴 계열) 중 EPDS 코어에 이미 있는 것과 아직 없는 것:

| 계열 | EPDS에 있음 | 없음(프로젝트가 채우거나 upgrade 대상) |
|---|---|---|
| Spec-driven | `templates/feature-spec.md`, `spec` 커맨드 | 비목표·ADR은 `templates/adr.md`로 있으나 강제 아님 |
| Agent Skills 표준 | `adapters/claude-code/commands/`, SKILL.md | — |
| Eval frameworks | `docs/TESTS.md` "결과" 계층 | golden set·regression 스위트는 upgrade 시점 |
| Prompt/agent red teaming | SKILL.md Scope/safety rules(외부 입력 비신뢰) | `evals/adversarial` 없음 |
| CLI-first automation | `bin/epds.mjs check`(setup 검증) | `tools/validate-*` 프로젝트별 도구는 없음 |
| Policy-as-code | SKILL.md 명문 규칙 | CI 강제는 프로젝트 몫 |
| Observability | — | 이벤트 스키마·대시보드·롤백 알림 없음(이월) |
| Experiment OS | `experiment` 커맨드, `templates/experiment-brief.md` | 결과 저장소·결정 규칙 자동화 없음 |
| Content pipeline | — | 콘텐츠 lint·provenance 없음(도메인 특화, 코어 밖) |
| Replay/simulation | — | seed 고정·deterministic test 없음(도메인 특화) |

## Scope discipline

EPDS는 의도적으로 작게 시작한다. 프로젝트는 1일차에 모든 커맨드·역할·도구가 필요하지 않다. 관찰된 반복
간극이나 명확히 증명된 병목이 있을 때만 구성요소를 추가한다.
