# Reference Evaluation Rubric — `/epds-reference` 10항

출처: human 제공 표7("ai-job-search처럼 완성도 높은 저장소를 찾아 녹여라"의 평가 기준). `/epds-reference
<URL>` (`adapters/claude-code/commands/epds-reference.md`)이 외부 저장소·도구·프레임워크를 분석할 때 이
루브릭으로 채점하고, 최종 추천(Adopt/Adapt/Observe/Reject)의 근거로 각 항목의 좋은/경고 신호를 인용한다.

## 10항

| # | 평가 항목 | 확인 질문 | 좋은 신호 | 경고 신호 |
|---|---|---|---|---|
| 1 | 실제 문제 | 어떤 반복 업무/리스크를 해결하나 | 사용 사례·목표 사용자 선명 | "AI 팀"만 있고 산출물 불명 |
| 2 | 산출물 계약 | 결과가 어떤 파일·스키마·템플릿으로 남나 | YAML/JSON/MD/코드 계약 | 채팅 출력만 |
| 3 | 검증 | AI 결과를 무엇으로 판정하나 | lint·test·E2E·컴파일·eval·CI | "AI가 검토했다" |
| 4 | 도구화 | 반복 검증을 코드로 했나 | tools/scripts/CLI/CI | 프롬프트에만 "확인하라" |
| 5 | 실패 처리 | 멈춤·재시도·폴백이 정의됐나 | 오류 메시지, 회귀, 롤백 | 성공 경로 데모만 |
| 6 | 유지보수 | 변경 이력·기여가 건강한가 | 릴리스·이슈·테스트·문서 갱신 | 오래된 문서·깨진 예제 |
| 7 | 보안 | 비밀·개인정보·외부 입력 처리 | 최소 권한, `.env.example`, 스캔, 정책 | 키를 파일에, 외부 프롬프트 신뢰 |
| 8 | 이식성 | 특정 모델/IDE 없이 핵심이 생존하나 | 도구 중립 문서·CLI·테스트 | 특정 채팅 UI 종속 |
| 9 | 비용 | 호출·API·운영 비용이 통제되나 | 캐시·예산·폴백·로컬 실행 | 무제한 호출 가정 |
| 10 | 제품 연결 | 사용자 가치/사업 지표가 개선되나 | 성공 지표·시나리오 | 개발자 생산성 주장만 |

## 배선

`adapters/claude-code/commands/epds-reference.md` step 4("Report the recommendation")는 이 10항 중
경고 신호가 확인된 항목을 명시하고, Adopt/Adapt/Observe/Reject 판단을 그 항목에 근거해 쓴다 — 근거 없는
등급만 있는 보고는 반려 대상(§0 원칙과 동일: 결론만 있고 흐름이 없는 산출물 금지).

## 채점 예시(이번 8개 소스, 요약)

| 소스 | 강한 항목 | 약한/미확인 항목 |
|---|---|---|
| [gstack](gstack.md) | 1(실제 문제), 6(유지보수: 890 open issues=활발) | 9(비용: 명령 다수, 초기 흐름 무거움) |
| [superpowers](superpowers.md) | 3(검증: TDD/디버깅 스킬 내장), 8(이식성: 6개 런타임 지원) | 10(제품 연결: 엔지니어링 실행 품질 한정) |
| [ouroboros](ouroboros.md) | 4(도구화: CLI+MCP), 2(계약: acceptance spec) | 9(비용: 멀티 LLM 프로바이더, 예산 미확인), 7(보안: PostHog 텔레메트리 opt-out 미확인 — R0229) |
| [ai-job-search](ai-job-search.md) | 2,3,4,7(README 표3 전체) | 6(스타 수 대비 실사용 활동 미검증) |

각 소스의 전체 근거는 `docs/references/<slug>.md` 참고.
