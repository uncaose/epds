<!-- source: docs/INSTALL.md sha256:43821af1b54a -->
<!-- completed 2026-09-16 by harness orchestrator from Perplexity thread 6f74f459 (stub in original artifact) -->

# 安装指南

## 已验证的安装（2026-09-16）

下面两个命令都已运行并进行端到端检查（仓库检出、文件列表、`CLAUDE.md`/`AGENTS.md`/`settings.json` 在前后进行 diff —— 两种情况下均未改变）。

| 方法 | 命令 | 安装位置 | 包含内容 | Slash commands | 全局配置影响 | 验证 |
|---|---|---|---|---|---|---|
| `skills add` | `npx skills add uncaose/epds -a claude-code` | `./.claude/skills/epds/` | 完整仓库（SKILL.md、adapters、bin、docs、templates） | 5（`/epds-setup /epds-status /epds-audit /epds-upgrade /epds-reference`） | 无 | 见下文 |
| npx setup | `npx github:uncaose/epds setup --project` | `./.claude/skills/epds/` | SKILL.md、LICENSE、NOTICE、完整的 `templates/`（包括 arena.md/pr-landing.md/retro.md/experiment-brief.md/feature-spec.md/adr.md/gate-report.md/WORK-ROUTER.md/epds-\*.json，以及生成的 `templates/README.md`，不只是 README 指针）、`docs/*.md`（EPDS/ROLES/TESTS/LAYOUT/…）、完整的 `docs/references/`、`docs/policies/`、`.installed-from.json` | 0 | 无 | 见下文 |

建议：如果你想使用 slash commands，请使用 `skills add`；普通 npx setup 只提供最小技能文件。

在任一安装之后验证：

```bash
node bin/epds.mjs check --project
ls .claude/skills/epds
# in Claude Code:
/epds-status
```

## 选项 A：通过 npx 使用 GitHub 源

EPDS 最初设计为直接从 GitHub 运行，无需发布到 npm registry。

```bash
npx github:uncaose/epds setup
```

安装程序会询问 Claude Code skill 应放在哪里。

- 全局：`~/.claude/skills/epds/`
- 项目：`./.claude/skills/epds/`

使用标志进行非交互式或脚本化安装：

```bash
npx github:uncaose/epds setup --global
npx github:uncaose/epds setup --project
npx github:uncaose/epds setup --global --yes
```

安装程序只复制 EPDS Skill 包。它不会配置目标项目。要配置项目，请在安装后于 Claude Code 中打开该项目并说：

```text
EPDS seoljeonghaejwo.
```

## 选项 B：clone 并创建 symlink

```bash
git clone https://github.com/uncaose/epds.git ~/Developer/epds
mkdir -p ~/.claude/skills
ln -s ~/Developer/epds ~/.claude/skills/epds
```

更新方式：

```bash
cd ~/Developer/epds
git pull
```

## 选项 C：手动安装

```bash
mkdir -p ~/.claude/skills/epds
cp SKILL.md ~/.claude/skills/epds/SKILL.md
cp LICENSE ~/.claude/skills/epds/LICENSE
cp NOTICE ~/.claude/skills/epds/NOTICE
```

## 验证安装

```bash
npx github:uncaose/epds check
npx github:uncaose/epds check --global
npx github:uncaose/epds check --project
```

## 卸载

```bash
npx github:uncaose/epds uninstall --global
npx github:uncaose/epds uninstall --project
```

uninstall 命令只会移除所选 EPDS skill 目录。它不会删除之前由代理安装到目标项目中的 EPDS 文件。

## 可信公共源配置

项目根目录下的 `epds/trusted-sources.json` 列出了 EPDS 被允许优先搜索
和引用的公共源（见 `docs/EPDS.md` § Trusted public sources config）。使用以下命令管理：

```bash
node bin/epds.mjs sources list
node bin/epds.mjs sources add <url> --kind doc --name "Some Docs" --note "why it matters"
node bin/epds.mjs sources show <id>
node bin/epds.mjs sources remove <id|url>
```

`epds check` 会报告该文件是否存在且是否为有效 JSON。

## 故障排查

### `npx` 无法运行该包

检查 Node 版本：

```bash
node --version
```

EPDS 要求 Node.js 20 或更高版本。

### Claude Code 不显示 EPDS

- 确认文件存在于 `~/.claude/skills/epds/SKILL.md` 或 `./.claude/skills/epds/SKILL.md`。
- 在目标项目中启动新的 Claude Code 会话。
- 自然地提问：`EPDS seoljeonghaejwo.`
- 如果你的运行时没有列出 slash commands，只要技能已加载，自然语言触发仍然有效。

### 现有 EPDS skill 被替换

安装程序会在替换所选作用域中的 `epds` 前询问。如果你想保留完整历史并方便更新，请使用 Git clone + symlink。
