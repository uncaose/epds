<!-- source: docs/INSTALL.md sha256:43821af1b54a -->
<!-- harness orchestrator가 Perplexity thread 6f74f459에서 2026-09-16에 완료함(원본 artifact의 stub) -->

# 설치 가이드

## 검증된 설치 (2026-09-16)

아래 두 명령은 처음부터 끝까지 실행하고 검사했습니다(repo checkout, file listing, `CLAUDE.md`/`AGENTS.md`/`settings.json` diffed before/after — 두 경우 모두 변경 없음).

| 방법 | 명령 | 설치 위치 | 포함 항목 | Slash commands | Global config 영향 | 검증 |
|---|---|---|---|---|---|---|
| `skills add` | `npx skills add uncaose/epds -a claude-code` | `./.claude/skills/epds/` | 전체 repo (SKILL.md, adapters, bin, docs, templates) | 5 (`/epds-setup /epds-status /epds-audit /epds-upgrade /epds-reference`) | 없음 | 아래 참조 |
| npx setup | `npx github:uncaose/epds setup --project` | `./.claude/skills/epds/` | SKILL.md, LICENSE, NOTICE, `templates/` 전체(arena.md/pr-landing.md/retro.md/experiment-brief.md/feature-spec.md/adr.md/gate-report.md/WORK-ROUTER.md/epds-\*.json 전체와 생성된 `templates/README.md` 포함, README pointer만이 아님), `docs/*.md` (EPDS/ROLES/TESTS/LAYOUT/…), `docs/references/`, `docs/policies/` 전체, `.installed-from.json` | 0 | 없음 | 아래 참조 |

권장: slash commands가 필요하면 `skills add`를 사용하세요. 일반 npx setup은 최소 skill files만 제공합니다.

어느 쪽으로 설치하든 설치 후 검증:

```bash
node bin/epds.mjs check --project
ls .claude/skills/epds
# in Claude Code:
/epds-status
```

## 옵션 A: npx로 GitHub source 사용

EPDS는 처음에는 npm registry publication 없이 GitHub에서 직접 실행하도록 의도되어 있습니다.

```bash
npx github:uncaose/epds setup
```

설치 프로그램은 Claude Code skill을 어디에 둘지 묻습니다.

- Global: `~/.claude/skills/epds/`
- Project: `./.claude/skills/epds/`

비대화형 또는 스크립트 설치에는 flags를 사용하세요.

```bash
npx github:uncaose/epds setup --global
npx github:uncaose/epds setup --project
npx github:uncaose/epds setup --global --yes
```

설치 프로그램은 EPDS Skill package만 복사합니다. 대상 프로젝트를 설정하지는 않습니다. 프로젝트를 설정하려면 설치 후 Claude Code에서 해당 프로젝트를 열고 다음처럼 말하세요.

```text
EPDS seoljeonghaejwo.
```

## 옵션 B: clone과 symlink

```bash
git clone https://github.com/uncaose/epds.git ~/Developer/epds
mkdir -p ~/.claude/skills
ln -s ~/Developer/epds ~/.claude/skills/epds
```

다음으로 업데이트하세요.

```bash
cd ~/Developer/epds
git pull
```

## 옵션 C: 수동 설치

```bash
mkdir -p ~/.claude/skills/epds
cp SKILL.md ~/.claude/skills/epds/SKILL.md
cp LICENSE ~/.claude/skills/epds/LICENSE
cp NOTICE ~/.claude/skills/epds/NOTICE
```

## 설치 검증

```bash
npx github:uncaose/epds check
npx github:uncaose/epds check --global
npx github:uncaose/epds check --project
```

## 제거

```bash
npx github:uncaose/epds uninstall --global
npx github:uncaose/epds uninstall --project
```

uninstall 명령은 선택한 EPDS skill directory만 제거합니다. 에이전트가 이전에 대상 프로젝트에 설치한 EPDS files는 삭제하지 않습니다.

## 신뢰할 수 있는 public sources 설정

프로젝트 root의 `epds/trusted-sources.json`은 EPDS가 검색하고
우선 인용할 수 있는 public sources를 나열합니다([docs/EPDS.md](../../../docs/EPDS.md) § Trusted public sources config 참조). 다음으로 관리하세요.

```bash
node bin/epds.mjs sources list
node bin/epds.mjs sources add <url> --kind doc --name "Some Docs" --note "why it matters"
node bin/epds.mjs sources show <id>
node bin/epds.mjs sources remove <id|url>
```

`epds check`는 파일이 존재하고 유효한 JSON인지 보고합니다.

## 문제 해결

### `npx`가 package를 실행할 수 없음

Node version을 확인하세요.

```bash
node --version
```

EPDS에는 Node.js 20 이상이 필요합니다.

### Claude Code에 EPDS가 표시되지 않음

- 파일이 `~/.claude/skills/epds/SKILL.md` 또는 `./.claude/skills/epds/SKILL.md`에 있는지 확인하세요.
- 대상 프로젝트에서 새 Claude Code session을 시작하세요.
- 자연스럽게 요청하세요: `EPDS seoljeonghaejwo.`
- runtime에 slash commands가 표시되지 않더라도, skill이 로드되어 있으면 natural-language triggering은 계속 작동합니다.

### 기존 EPDS skill이 교체됨

설치 프로그램은 선택한 scope의 `epds`를 교체하기 전에 물어봅니다. 전체 history와 쉬운 updates가 필요하면 Git clone + symlink를 사용하세요.
