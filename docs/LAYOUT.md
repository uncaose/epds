# EPDS Layout — 에이전트 중립 코어 + 얇은 어댑터

출처: human 제공 배치 다이어그램(`your-journey/` 예시) + [ai-job-search](references/ai-job-search.md)
구조(표3). EPDS 자체 트리와 대응을 명시한다 — "프롬프트 잘 쓰기 프로젝트"가 아니라 입력·절차·도구·검증·
안전 규칙이 저장소 구조로 분리된 로컬 에이전트 운영 시스템(ai-job-search 인용, README).

## human 제공 원형 (도메인 예시 — 원문 그대로 인용, 디렉터리명·스킬명은 예시일 뿐 EPDS 고유 구조 아님)

```text
your-journey/
├── AGENTS.md  CLAUDE.md  PRODUCT.md  METRICS.md  DECISIONS.md
├── agent/
│   ├── commands/ (discover feature experiment content-pack qa release retro).md
│   ├── skills/<name>/SKILL.md (product-discovery learning-content voice-feedback privacy flutter-delivery cbt-analysis)
│   └── policies/ (privacy release external-inputs).md
├── .claude/commands/ (얇은 포인터)  .claude/settings.json
├── .agents/skills/ (실행형 CLI 스킬)
├── templates/ evals/ tests/ tools/ docs/ design_handoff_your_journey/
```

## EPDS 자체 트리 대응

| 원형 구성 | EPDS 저장소 대응 | 역할 |
|---|---|---|
| `AGENTS.md CLAUDE.md PRODUCT.md METRICS.md DECISIONS.md` | 설치 후 프로젝트 루트에 생기는 `PRODUCT.md PROJECT-STATE.md METRICS.md AGENTS.md CLAUDE.md`(`templates/`가 원본) | 헌법·제품 맥락·절대 규칙 |
| `agent/commands/*.md` | `docs/COMMANDS.md` + `adapters/claude-code/commands/*.md` | 재현 가능한 절차(발견/기능/실험/콘텐츠팩/QA/릴리스/회고) |
| `agent/skills/<name>/SKILL.md` | 이 저장소 자체의 `SKILL.md`(EPDS 자신이 하나의 스킬) | 직무 규칙·라우팅 |
| `agent/policies/*.md` | `docs/policies/*.md`(현재 12개 파일, `SKILL.md` "Scope and safety rules" 절은 규칙 1문장+링크 인덱스) | 안전 경계 — pstack의 원칙-독립파일 구조를 따라 분리 완료(`docs/absorb-pstack.md` item 2 — 최초 판단(원문 그대로)은 "9개뿐이라 지금 쪼갤 만큼 반복 간극이 증명되지 않아 보류"(실제 8개, 2026-09-28 정정)였으나, 이후 판정에서 독립 파일 자체가 편집 단위를 좁혀 리뷰·수정을 쉽게 만든다는 근거로 상향 — test-first/root-cause-not-symptom/premise-review-after-repeated-failure/test-behavior-not-implementation 4개가 이후 패스에서 추가돼 8→12개, 위 과거 기록 문구는 그대로 보존) |
| `.claude/commands/` (얇은 포인터) | `adapters/claude-code/commands/*.md`(설치 시 `.claude/commands/`로 복사) | 런타임별 얇은 어댑터 |
| `.agents/skills/*/cli` | `bin/epds.mjs`(setup/status/check/sources/models 서브커맨드) | 실행 가능한 CLI |
| `templates/` | `templates/*.md`, `*.json` | AI가 채우는 안정된 출력 골격 |
| `evals/` | 없음(upgrade 대상, `EPDS.md` §5) | AI 판정 품질 회귀 방지 |
| `tests/` | 없음(EPDS 자체엔 없음, 설치 대상 프로젝트가 소유 — `docs/TESTS.md`) | 지속 검증 |
| `tools/` | `bin/epds.mjs check`(setup 산출물 존재·JSON 파싱 검증) | "생성됐다"가 아니라 "쓸 수 있다" 판정 |
| `docs/` | `docs/*.md`(이 파일 포함) | 근거 흐름·레퍼런스 |
| `design_handoff_*` | 없음(도메인 특화, 코어 밖) | — |

## 원칙: 코어는 에이전트 중립, 어댑터는 얇다

`SKILL.md`(무엇을 언제 하는가)는 어느 AI 런타임에도 종속되지 않는다. `adapters/claude-code/commands/`는
그 SKILL.md를 Claude Code의 슬래시 커맨드 형식으로 얇게 감싸기만 한다("Use the installed `epds` skill and
execute the `reference <URL>` procedure." — `adapters/claude-code/commands/epds-reference.md`). 새
런타임 어댑터를 추가할 때도 SKILL.md 본문은 건드리지 않는다 — 이것이 [ai-job-search](references/ai-job-search.md)
평가 기준 표7의 "이식성: 특정 모델/IDE 없이 핵심 생존"을 만족시키는 방법이다.
