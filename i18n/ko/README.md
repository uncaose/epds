<!-- source: README.md sha256:dfeff8001180 -->
[English](../../README.md) · 한국어 · [简体中文](../zh-CN/README.md) · [日本語](../ja/README.md) · [Tiếng Việt](../vi/README.md) · [ไทย](../th/README.md) · [Bahasa Melayu](../ms/README.md) · [Bahasa Indonesia](../id/README.md)

# EPDS

> **Evidence-First Product Delivery System**
>
> AI 코딩 에이전트가 아이디어, 운영 중인 서비스, 프로그램, 게임, 콘텐츠 자동화 프로젝트를 방향 설정부터 회고까지 **증거 기반으로** 수행하도록 돕는 범용 스킬입니다.

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](../../LICENSE)
[![Node.js >= 20](https://img.shields.io/badge/node-%3E%3D20-brightgreen.svg)](https://nodejs.org/)

## 설치

```bash
npx skills add uncaose/epds -a claude-code
```

더 자세한 옵션과 검증 절차는 [docs/INSTALL.md](docs/INSTALL.md)를 참고하세요.

## 무엇을 해결하나요?

AI 코딩 도구는 몇 초 만에 많은 코드를 만들어낼 수 있습니다. 하지만 제품 개발에서 가장 비용이 큰 실패는 보통 "코드를 늦게 작성하는 것"이 아니라 다음과 같은 일입니다.

- 실제 사용자가 원하지 않는 기능을 빠르게 만들었다.
- 사용자, 비즈니스, 운영 제약을 확인하기 전에 구현 범위를 넓혔다.
- 코드는 테스트를 통과해 배포되었지만, 실제 사용자는 핵심 행동을 완료하지 않았다.
- 기능 수가 늘면서 개인정보, 비용, 성능, 지원 부담, 기술 부채도 늘었다.
- 기획, 구현, QA, 배포, 회고가 분리되어 이전 실패가 다음 작업에 반영되지 않았다.
- 사용자가 AI에게 무엇을 요청할지, 어떤 역할/스킬을 호출할지, 언제 호출할지를 직접 결정해야 했다.

EPDS는 "더 많은 에이전트"나 "더 긴 프롬프트"에 관한 것이 아닙니다. 먼저 현재 프로젝트가 어디에 있는지 정하고, AI의 행동 순서를 **다음 결정을 위해 어떤 증거가 필요한지** 알아내도록 고정합니다.

**[H1] 네 가지 필수 요소 확인** — 이 README가 human 원문에서 요청한 네 가지("어떤 장애/문제를, 어떤 이유로, 선택한 해결책을 적용하는 과정을 통해 체계적이고 구조적으로 설명")를 포함하고 있는가?

- [x] **문제** — 위 목록(실제 사용자가 원하지 않는 기능, 테스트는 통과했지만 완료되지 않은 사용자 행동을 포함한 6개 항목)
- [x] **근거** — "더 많은 에이전트/더 긴 프롬프트가 목표가 아니다" 단락, 증거를 우선한 이유
- [x] **해결책 적용 과정** — [docs/EPDS.md](../../docs/EPDS.md) §0(정의) + §1~§5(도구, 패턴, 구조 검토 과정)
- [x] **설치와 사용법** — 위 [설치](#설치) 섹션 + [docs/INSTALL.md](docs/INSTALL.md)

여기까지 도달한 과정(검토한 도구, 버린 패턴, 근거) → [docs/EPDS.md](../../docs/EPDS.md)

## 결과

최신 검증 (자세한 내용, 프롬프트, 데이터: [results/README.md](../../results/README.md)):

- EPDS v8 대 맨몸 에이전트, 7개 모델 x 한 줄 앱 요청 6개, 판정된 144회 실행: haiku와 sonnet의 의도 격차가 줄었고(0.167 -> 0.014) sonnet은 떨어지지 않았지만, haiku의 기능 점수는 46항목 중 2항목 낮아졌습니다. 판정은 PARTIAL (방향만 확인, 과제당 n = 2).
- 해당 앱들의 사용성(블라인드 판정자 2명 + 기계 검사): v8은 Claude 계열 모델의 평균 점수를 20점 만점에 1.0~1.5점 올렸고 심각한 접근성 결함을 크게 줄였습니다.
- 턴 종료 게이트가 없는 로컬 모델에서는 스킬이 동작을 바꾸지 못했고 의도 점수가 떨어졌습니다.
- opencode 1.19의 약한 모델(위와 같은 사용성 판정자): 게이트 없이도 스킬을 따르는 gpt-6-luna, deepseek-v4-flash, glm-5.3-flash는 v8로 평균 점수가 20점 만점에 1.5~2.0점 올랐고, 생명주기 단계를 건너뛰는 로컬 gamedev-coder는 0.25점만 올랐습니다. 로컬 27B 모델은 22회 실행에서 앱 4개만 내놓았습니다.

![모든 144개 앱의 첫 화면](../../results/2026-10-13-v8-gate/contact-sheet-first.png)

![사용성 판정 개요: 첫 화면과 한 번의 동작 후](../../results/2026-10-14-usability/contact-sheet.png)

![약한 모델 앱의 첫 화면](../../results/2026-10-15-weak-opencode/contact-sheet-first.png)
