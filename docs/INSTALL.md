<!-- completed 2026-09-16 by harness orchestrator from Perplexity thread 6f74f459 (stub in original artifact) -->

# Installation Guide

## Verified installs (2026-09-16)

Both commands below were run and inspected end-to-end (repo checkout, file listing, `CLAUDE.md`/`AGENTS.md`/`settings.json` diffed before/after — unchanged in both cases).

| Method | Command | Install location | Includes | Slash commands | Global config impact | Verify |
|---|---|---|---|---|---|---|
| `skills add` | `npx skills add uncaose/epds -a claude-code` | `./.claude/skills/epds/` | full repo (SKILL.md, adapters, bin, docs, templates) | 5 (`/epds-setup /epds-status /epds-audit /epds-upgrade /epds-reference`) | none | see below |
| npx setup | `npx github:uncaose/epds setup --project` | `./.claude/skills/epds/` | SKILL.md, LICENSE, NOTICE, `templates/README.md`, `.installed-from.json` | 0 | none | see below |

Recommendation: use `skills add` if you want the slash commands; the plain npx setup gives the minimal skill files only.

Verify after either install:

```bash
node bin/epds.mjs check --project
ls .claude/skills/epds
# in Claude Code:
/epds-status
```

## Option A: GitHub source with npx

EPDS is initially intended to run directly from GitHub, without npm registry publication.

```bash
npx github:uncaose/epds setup
```

The installer asks where the Claude Code skill should live.

- Global: `~/.claude/skills/epds/`
- Project: `./.claude/skills/epds/`

Use flags for non-interactive or scripted installation:

```bash
npx github:uncaose/epds setup --global
npx github:uncaose/epds setup --project
npx github:uncaose/epds setup --global --yes
```

The installer only copies the EPDS Skill package. It does not configure a target project. To configure a project, open it in Claude Code after installation and say:

```text
EPDS 설정해줘.
```

## Option B: clone and symlink

```bash
git clone https://github.com/uncaose/epds.git ~/Developer/epds
mkdir -p ~/.claude/skills
ln -s ~/Developer/epds ~/.claude/skills/epds
```

Update with:

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

## Verify installation

```bash
npx github:uncaose/epds check
npx github:uncaose/epds check --global
npx github:uncaose/epds check --project
```

## Uninstall

```bash
npx github:uncaose/epds uninstall --global
npx github:uncaose/epds uninstall --project
```

The uninstall command removes only the selected EPDS skill directory. It does not delete EPDS files that were previously installed into a target project by an agent.

## Troubleshooting

### `npx` cannot run the package

Check Node version:

```bash
node --version
```

EPDS requires Node.js 20 or newer.

### Claude Code does not show EPDS

- Confirm the file exists at `~/.claude/skills/epds/SKILL.md` or `./.claude/skills/epds/SKILL.md`.
- Start a new Claude Code session in the target project.
- Ask naturally: `EPDS 설정해줘.`
- If slash commands are not listed in your runtime, natural-language triggering still works when the skill is loaded.

### Existing EPDS skill was replaced

The installer asks before replacing `epds` at the selected scope. Use Git clone + symlink if you want full history and easy updates.
