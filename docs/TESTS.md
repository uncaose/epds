# EPDS Tests — 4계층과 배치

출처: human 제공 표5(tests 4계층). "테스트를 통과한 코드를 배포했지만 실제 사용자는 핵심 행동을 완료하지
못했다"(README "무엇을 해결하나")는 실패는 코드 계층 테스트만으로는 안 잡힌다 — 4계층이 각각 다른 질문에
답한다.

## 4계층

| 계층 | 질문 | 예시(도메인 예시) | `templates/`·`tests/` 배치 |
|---|---|---|---|
| 코드 | 함수가 맞게 동작하는가 | 핵심 계산 로직, 선택/라우팅 알고리즘 | `tests/unit/` — 언어별 표준 테스트 러너, CI에서 항상 실행 |
| 계약 | 데이터 형식이 유효한가 | 설정/콘텐츠 파일 스키마, AI 응답 JSON 스키마 | `tests/contract/` + `tools/verify_*`(스키마 검증기), 실패 시 빌드 중단 |
| 경험 | 사용자가 핵심 흐름을 완주하는가 | 온보딩→핵심 기능→완료까지 E2E | `tests/e2e/`(브라우저/디바이스 자동화), `templates/experiment-brief.md`가 흐름 정의를 고정 |
| 결과 | 제품 약속이 지켜지는가 | 오프라인 동작, 개인정보 미저장, 성능 예산, 의존성 미설치 시 폴백 | `tests/promise/` 또는 `evals/`(수동 체크리스트 → 가능하면 자동화), `gate-report.md`가 통과 근거를 남김 |

### Do not report when (negative-rule suppression)

| Layer | Do not report when |
|---|---|
| Code | The deviation is in generated, vendored, or unreachable fixture code |
| Contract | The schema change is inside a documented, in-progress dual-read/dual-write migration window |
| Experience | The flow sits behind an inactive feature flag or an explicitly out-of-scope entry point |
| Outcome | The promise was explicitly descoped for this release in `PROJECT-STATE.md` |

Adopt a suppression rule only after verifying on real samples that it does not hide a real defect (open-code-review principle 4, R0295 turn[6]). Never suppress data-loss, permission, or payment-path findings regardless of confidence (principle 5). Record every suppression on `templates/gate-report.md`'s "Suppressed" line.

## 계층을 건너뛰면 생기는 일

코드 계층만 있으면: 컴파일/단위 테스트는 초록인데 설정 파일이 깨져 배포가 실패한다(계약 계층 부재).
계약 계층까지만 있으면: 스키마는 유효한데 사용자가 3번째 화면에서 막혀 흐름을 완주 못 한다(경험 계층
부재). 경험 계층까지만 있으면: 흐름은 완주되는데 오프라인에서 크래시하거나 개인정보가 로그에 남는다
(결과 계층 부재) — README의 "테스트를 통과한 코드를 배포했지만..." 실패가 정확히 이 마지막 간극이다.

## verify 커맨드와의 관계

`verify` 커맨드(SKILL.md 라우팅표)는 4계층 전부에서 "독립 품질 증거"를 모은다 — 구현한 사람과 같은
세션이 아닌 관점에서(생산자≠검증자). `templates/gate-report.md`가 4계층 각각의 통과/미통과와 근거 파일
경로를 기록하는 계약이다.

When verify fans out across multiple reviewers, each reviewer's intermediate reasoning/scratchpad stays local — only concluded findings are shared (context isolation, R0295 turn[12]).

## 최소 시작

새 프로젝트는 4계층을 한 번에 다 갖출 필요가 없다(Scope discipline, `EPDS.md` §5). 코드 계층은 거의 항상
day 1부터; 계약 계층은 데이터 파일이 생기는 순간부터; 경험 계층은 핵심 흐름이 확정되는 순간부터; 결과
계층은 실제 배포 전 최소 1개(가장 위험한 약속 하나)부터 시작한다.
