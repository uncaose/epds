<!-- source: docs/INSTALL.md sha256:43821af1b54a -->
<!-- harness orchestrator が Perplexity thread 6f74f459（元アーティファクト内の stub）から 2026-09-16 に完了 -->

# インストールガイド

## 検証済みインストール (2026-09-16)

以下の両方のコマンドは実行され、エンドツーエンドで検査済みです（repo checkout、file listing、`CLAUDE.md`/`AGENTS.md`/`settings.json` は前後で diff 済み — どちらの場合も変更なし）。

| 方法 | コマンド | インストール先 | 含まれるもの | Slash commands | グローバル設定への影響 | 検証 |
|---|---|---|---|---|---|---|
| `skills add` | `npx skills add uncaose/epds -a claude-code` | `./.claude/skills/epds/` | full repo (SKILL.md, adapters, bin, docs, templates) | 5 (`/epds-setup /epds-status /epds-audit /epds-upgrade /epds-reference`) | なし | 下記参照 |
| npx setup | `npx github:uncaose/epds setup --project` | `./.claude/skills/epds/` | SKILL.md, LICENSE, NOTICE, `templates/` in full (all of arena.md/pr-landing.md/retro.md/experiment-brief.md/feature-spec.md/adr.md/gate-report.md/WORK-ROUTER.md/epds-\*.json plus a generated `templates/README.md`, not just the README pointer), `docs/*.md` (EPDS/ROLES/TESTS/LAYOUT/…), `docs/references/`, `docs/policies/` in full, `.installed-from.json` | 0 | なし | 下記参照 |

推奨: slash commands が必要な場合は `skills add` を使用してください。通常の npx setup は最小限のスキルファイルのみを提供します。

どちらのインストール後も検証します:

```bash
node bin/epds.mjs check --project
ls .claude/skills/epds
# in Claude Code:
/epds-status
```

## Option A: GitHub source with npx

EPDS は当初、npm registry で公開せず、GitHub から直接実行することを想定しています。

```bash
npx github:uncaose/epds setup
```

インストーラーは Claude Code skill をどこに配置するかを尋ねます。

- Global: `~/.claude/skills/epds/`
- Project: `./.claude/skills/epds/`

非対話またはスクリプトによるインストールには flags を使用します:

```bash
npx github:uncaose/epds setup --global
npx github:uncaose/epds setup --project
npx github:uncaose/epds setup --global --yes
```

インストーラーは EPDS Skill package だけをコピーします。対象プロジェクトの設定は行いません。プロジェクトを設定するには、インストール後にそのプロジェクトを Claude Code で開き、次のように伝えてください:

```text
EPDS seoljeonghaejwo.
```

## Option B: clone and symlink

```bash
git clone https://github.com/uncaose/epds.git ~/Developer/epds
mkdir -p ~/.claude/skills
ln -s ~/Developer/epds ~/.claude/skills/epds
```

更新するには:

```bash
cd ~/Developer/epds
git pull
```

## Option C: manual installation

```bash
mkdir -p ~/.claude/skills/epds
cp SKILL.md ~/.claude/skills/epds/SKILL.md
cp LICENSE ~/.claude/skills/epds/LICENSE
cp NOTICE ~/.claude/skills/epds/NOTICE
```

## インストールを検証する

```bash
npx github:uncaose/epds check
npx github:uncaose/epds check --global
npx github:uncaose/epds check --project
```

## アンインストール

```bash
npx github:uncaose/epds uninstall --global
npx github:uncaose/epds uninstall --project
```

uninstall command は、選択された EPDS skill directory のみを削除します。agent によって以前に対象プロジェクトへインストールされた EPDS files は削除しません。

## Trusted public sources config

プロジェクトルートの `epds/trusted-sources.json` には、EPDS が検索を許可され、
優先的に引用する public sources が一覧化されています（`docs/EPDS.md` § Trusted public sources config を参照）。次のコマンドで管理します:

```bash
node bin/epds.mjs sources list
node bin/epds.mjs sources add <url> --kind doc --name "Some Docs" --note "why it matters"
node bin/epds.mjs sources show <id>
node bin/epds.mjs sources remove <id|url>
```

`epds check` は、ファイルが存在し、有効な JSON であるかを報告します。

## トラブルシューティング

### `npx` cannot run the package

Node version を確認します:

```bash
node --version
```

EPDS には Node.js 20 以降が必要です。

### Claude Code does not show EPDS

- ファイルが `~/.claude/skills/epds/SKILL.md` または `./.claude/skills/epds/SKILL.md` に存在することを確認します。
- 対象プロジェクトで新しい Claude Code session を開始します。
- 自然に尋ねます: `EPDS seoljeonghaejwo.`
- slash commands が runtime に一覧表示されない場合でも、skill が読み込まれていれば自然言語によるトリガーは機能します。

### Existing EPDS skill was replaced

インストーラーは、選択された scope にある `epds` を置き換える前に確認します。完全な履歴と簡単な更新が必要な場合は、Git clone + symlink を使用してください。
