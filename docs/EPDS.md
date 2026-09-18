<!-- rewritten 2026-09-16: 결론-압축본 → 근거 흐름. human 판정("결론만 있고 흐름이 없다") 반영.
     원 결론형(69줄, completed 2026-09-16 from Perplexity thread 6f74f459)의 §Components/Why는 §4로 이동, 삭제 없음.
     rebuild-2 (2026-09-18, H119 §0 주어 교체 y): 주어 = "결론만 있는 산출물 차단"(b) → "수집→비교→선택→정의 과정"(a).
     원 §0 문장은 삭제하지 않고 아래 "실패 인식" 절로 이동. 삭제 0 규율(journal/reports/20260918-epds-rebuild-v3.report.md §6). -->

# EPDS Architecture — 무엇을 막는가, 왜 이 형태인가

## §0. EPDS 가 무엇이고, 왜 이것인가

> **EPDS 는 — 사람이 스킬을 일일이 찾아 고르지 않고**`[H1]` **— 기존 자료가 있으면 분석해 "상태, 위치, 다음
> 방향"을 뽑고 없으면 "네가 원하는게 뭐냐"를 묻고**`[H13]`**, 그 질문 하나하나로 "상태, 위치, 최종 결과물과
> 그 방향"을 점점 더 구체화하며**`[H16]` **전체를 다시 구성해 다음 스텝을 뽑아**`[H14]`**, 그것을 "내가 손수
> 하는게 아니다" 직접 실행해**`[H11]` **제품을 "완주를 해서 제품을 만들어 내는"**`[H6]` **도구다. 근거가
> 동봉된 문서는 별도 규율이 아니라 "과정의 결과물로서" 생긴다**`[H41]`**.**
>
> *(English)* EPDS is a tool that — instead of a person hunting through skills one by one `[H1]` —
> analyzes existing evidence to produce "state, position, next direction" when material exists, or
> asks "what do you actually want" when it doesn't `[H13]`; sharpens "state, position, final outcome,
> and direction" with every single answered question `[H16]`; reassembles the whole picture to pick
> the next step `[H14]`; and then executes that itself rather than leaving it for the owner to do by
> hand `[H11]` — carrying the product through to completion `[H6]`. Evidence-attached documents are
> not a separate discipline — they fall out as a product of the process itself `[H41]`.

`[H]` 로케이터: `[H1]`·`[H6]`·`[H11]` = `journal/reports/20260918-epds-origin-v2.report.md` §2(하네스 저장소
`agent-game-harness`) / `[H13]`~`[H16]` = 같은 저장소 `journal/ctx.wal.jsonl:1956-1966` / `[H41]` = 같은 저장소
`journal/ctx.wal.jsonl:1967`(origin-v2 raw-thread 는 `[H1]`~`[H40]` 까지만 사용 — 충돌 회피로 `[H41]` 신규 부여).

1. **문제** `[H1]` — "위 관점에 따른 스킬을 일일이 내가 찾아서 상황에 맞게 사용한다는건 할 수는 있겠지만
   실제 적절히 사용한다는건 어려운 일이다. ..." 상황마다 사람이 스킬·하네스를 고르는 것이 병목이다.
2. **범위** `[H6]` — 게임·숏폼·영어학습 어디서 시작해도 같은 절차로 "완주를 해서 제품을 만들어 내는" 하나의
   방법. 그래서 EPDS 는 도메인 스킬 묶음이 아니다.
3. **방법** `[P6]`(raw-thread-full.md:2027, 제안) → `[H8]`(raw-thread-full.md:2440, 채택) — `방향 → 문제 →
   가설 → 최소 실험 → 명세 → 구현 → 검증 → 출시 → 관측 → 회고`. 각 단계는 "문서가 있나"가 아니라 "다음
   단계로 갈 만큼 믿을 수 있는 증거가 있나"로 판정한다.
4. **증거 우선** `[H9]` 지시 → `[P9]`(raw-thread-full.md:3007-3016) 정식화 — 저장소·테스트·지표를 먼저 읽고,
   부족하면 공개 자료를 조사하고, 외부에서 알 수 없는 것만 최대 5개 묻는다. 8단계 전문 = 아래 "증거 우선순위".
5. **두 트랙** `[P8]`(raw-thread-full.md:2628) + `[H10]` 승인("`최종 정의`는 맞다") — 제품/사업(사용자가
   정말 원하고 다시 오는가)과 기술/전달(안전·신뢰·유지 가능한가)을 따로 진단한다. 다음 행동 = 더 약한
   트랙을 미는 가장 작은 행동 하나.
6. **실행 형태** `[H11]` → `[H36]`(2회차 재확인) — "내가 손수 하는게 아니다 … 최소/적합/전체 설정을 진행해
   주기를 원한다"(H11) / "지시서에 가깝다. 이럴거면 네가 직접 처리하는게 맞다"(H36). 사람이 따라할 지시서 금지.
7. **승인된 최종 정의** `[H10]`("`최종 정의`는 맞다") — `[P9]` verbatim: "아이디어 또는 진행 중인 프로젝트의
   현재 증거 상태를 먼저 진단하고, 저장소·문서·테스트·지표·사용자 자료와 필요 시 신뢰 가능한 인터넷 자료에서
   정보를 수집하며, 외부에서 알 수 없는 사업적 결정만 사용자에게 물어보고, 현재 병목을 통과하는 데 필요한
   최소 스킬·에이전트·도구를 선택하여 제품을 방향부터 회고까지 완주시키는 범용 AI 제품 전달 하네스."
8. **이름** `[H13]`·`[H14]`·`[H15]` — "Playbook → EPDS". harness 라는 일반 용어와 충돌하지 않는 고유 명칭 요구.

근거: [tech-bridge-ai](references/tech-bridge-ai-code-quality.md) — 원점 계기가 된 유튜브 영상 자막(`[H1]`
발화 직전 첨부). 코드가 완벽해도 제품이 부족할 수 있다 — 코드 정확성과 제품 증거는 별개 질문.

### 증거 우선순위 (8단계, `[P9]` 복원)

`raw-thread-full.md:3007-3015` verbatim — EPDS 4항목의 "증거 우선"을 정식화한 8단계. 최하위(8) = AI 추론.

1. 실제 사용자 행동 데이터·매출/비용·장애 기록·인터뷰 관찰
2. 실제 배포 환경의 E2E·CI·성능·보안·프라이버시 검사
3. 저장소의 코드·명세·ADR·이슈·커밋
4. 사용자가 명시한 제약과 의도
5. 공식 문서·공식 정책·원저자 자료
6. 신뢰 가능한 연구·벤치마크·산업 자료
7. 커뮤니티·블로그·경험담
8. AI 추론

### 실패 인식 (구 §0, 2026-09-16 작성 — 이동됨, 삭제 아님)

EPDS는 "AI가 빨리, 많이 만든다"를 막지 않는다. **결론만 있고 그 결론에 이른 근거가 사라진 산출물**을 막는다
([tech-bridge-ai](references/tech-bridge-ai-code-quality.md): 코드가 완벽해도 제품이 부족할 수 있다 — 코드
정확성과 제품 증거는 별개 질문). 압축된 결론은 재검증할 수 없고, 재검증할 수 없는 결론은 다음 실패에서
그대로 반복된다. 그래서 EPDS의 모든 산출물은 "무엇을(what)"뿐 아니라 "왜 이것이고 다른 것이 아닌가(why not
the alternative)"를 같은 파일에 남긴다.

`[O]` 표기 원칙: 원점([H])에 없는 것(결정론/LLM 경계·file:line 의무·UNMEASURED 3분화·exit 대조)은 `[O]` 로
명시하고 이 §0 에 올리지 않는다 — 전문 = "Harness extensions (not in origin)"(§6).

```text
Direction → Problem → Hypothesis → Minimum Experiment → Spec → Build → Verify → Release → Observe → Retro
```
`[P6]`(raw-thread-full.md:2027, 제안) → `[H8]`(raw-thread-full.md:2440, 채택).

## §1. 살펴본 관점 — 도구 비교와 그 이유

*대응 표: 표1 도구 비교(`journal/reports/20260918-epds-rebuild-plan.report.md` §1-b).*

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

*대응 표: 표4 대안·보완 패턴 10종(`journal/reports/20260918-epds-rebuild-plan.report.md` §1-b).*

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

*대응 표: 표3 ai-job-search 구조 대응 + 표7 참고 저장소 평가 기준(`journal/reports/20260918-epds-rebuild-plan.report.md` §1-b).*

[ai-job-search](references/ai-job-search.md)는 human이 직접 "이게 일반적인 AI 이용 수준의 패턴인가"라고
물은 대상이다. 답: 아니다 — 대부분의 AI 이용 저장소는 프롬프트만 있고, ai-job-search는 **입력·절차·도구·
검증·안전 규칙을 저장소 구조로 분리**했다(표3, `docs/LAYOUT.md`에 전체 대응표). EPDS가 가져온 것:

- 헌법(CLAUDE.md/AGENTS.md)과 실행 절차(commands)를 분리 — "무엇을 항상 지키는가"와 "이번에 뭘 하는가"를
  같은 파일에 섞지 않는다.
- 검증 도구(`tools/verify_*`)는 "AI가 검토했다"가 아니라 실행 가능한 판정이어야 한다 — `verify` 커맨드의
  "독립 품질 증거 수집"이 이 원칙을 그대로 따른다.
- 템플릿은 AI가 채우는 안정된 골격이지, 매번 새로 설계하는 대상이 아니다.

## §4. EPDS 구성으로 수렴

*대응 표: 표2 agency-agents 역할·산출물 + 표6 단계별 역할·산출물 9단계(`journal/reports/20260918-epds-rebuild-plan.report.md` §1-b) — 표6 이 §0 10단계 루프의 직접 원형.*

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

Provenance: `[P8]`(raw-thread-full.md:2628 "즉 하네스는 기술 트랙과 제품 트랙을 분리해 봐야 합니다") + `[H10]`
승인("`최종 정의`는 맞다" — 두 트랙을 포함한 §0 정의 전체를 승인). 구 표기 `[O] 하네스 오케 작성`은 철회
(`journal/reports/20260918-epds-origin-v2.report.md` D-12).

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

*대응 표: 표8 추가 참고 패턴 계열 10 × 최소요소(`journal/reports/20260918-epds-rebuild-plan.report.md` §1-b).*

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

## §6. Harness extensions (not in origin)

전 스레드([H1]~[H40], `raw-thread-full.md` 40+40턴) 근거 **0건** — 하네스 오케가 원점 인용 없이 추가한 4개.
`[O]` 태그. 원점 밖 확장이므로 §0 정의에는 올리지 않는다(`journal/reports/20260918-epds-origin-v2.report.md`
D-15, 기본안 = 유지하되 이 절로 분리).

### Deterministic vs LLM boundary `[O]`

| Stage | EPDS element | Character | Why not left to LLM judgment alone |
|---|---|---|---|
| Input | Evidence-first 5-step order (`SKILL.md` §Evidence-first protocol) | deterministic-by-doc | Fixed order so no evidence source is skipped by habit |
| Triage | WORK-ROUTER 7-way classification (`SKILL.md` §Work router) | LLM | No enforcement code; natural-language classification |
| Rule | Classification→role mapping (`docs/ROLES.md`) | deterministic-by-doc | Fixed table so the same request always routes to the same role |
| Judgment | Facts/Interpretation/Assumptions/Owner-decision split (`SKILL.md` §Evidence-first protocol) | LLM | Separating known from inferred requires reading judgment |
| Output | Final report 5 blocks + exit code + model/effort header (`SKILL.md` §Final report) | deterministic-by-doc | Fixed contract keeps results reproducible and comparable |
| Feedback | Retro keep/expand/iterate/stop (`docs/COMMANDS.md`) | LLM | Choosing the next cycle's direction is a judgment call |

`deterministic-by-doc` means the order/contract is fixed in protocol text, not enforced by executable code — unlike open-code-review's code-enforced layers (R0295 turn[8]).

### file:line 의무 `[O]`

모든 Fact 에 file:line 로케이터를 의무화한다(`SKILL.md` §Final report, H111 `09e64dd` — open-code-review 의
"line correction" 패턴 차용). 로케이터 없는 문장은 쓰지 않는다.

### UNMEASURED 3분화 `[O]`

측정 실패를 environment(환경 문제) / censored(표본 편향) / corrupted(데이터 손상) 3가지로 나눠 기록한다
(`SKILL.md` §Evidence-first protocol, H106 `7b92c30`). 뭉뚱그린 "측정 못함" 1개로 합치지 않는다.

### exit code 기계 대조 `[O]`

모든 명령은 exit code + 모델/effort 헤더를 남긴다(`SKILL.md` §Final report, H106). FAIL 은 반드시 비영
exit 여야 게이트로 작동한다 — "했다" 주장만으로는 PASS 가 아니다.

## Scope discipline

EPDS는 의도적으로 작게 시작한다. 프로젝트는 1일차에 모든 커맨드·역할·도구가 필요하지 않다. 관찰된 반복
간극이나 명확히 증명된 병목이 있을 때만 구성요소를 추가한다.
