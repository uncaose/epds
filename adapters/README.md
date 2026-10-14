# End-of-turn gate (same rule on every runtime, any model)

The stop is blocked until `LIFECYCLE.md` exists in the working folder and `node bin/check.mjs LIFECYCLE.md` exits 0 (rows are re-run, not just read: `check.mjs ... .json` commands are executed again, a recorded non-zero exit or a failing re-run blocks, and "N rows not re-run" is printed); after 3 blocks in one session the next stop passes and is logged (`$EPDS_GATE_STATE/gate.log`, default `$TMPDIR/epds-gate`).

| runtime | gate | install |
|---|---|---|
| Claude Code | Stop hook | merge `claude-code/settings.snippet.json` into `.claude/settings.json` |
| Codex | Stop hook (`.codex/hooks.json`; review it once with `/hooks`) | copy `codex/hooks.json` to `<repo>/.codex/hooks.json` |
| opencode | plugin on `session.idle`: cannot block, so it re-prompts the same session (`client.session.promptAsync`, same check, cap 3) | copy `opencode/epds-gate.js` to `<repo>/.opencode/plugins/` and set `EPDS_DIR` to the epds skill dir; needs a session that outlives idle (TUI or `opencode serve`): one-shot `opencode run` exits at the first idle |

Docs: https://code.claude.com/docs/en/hooks · https://learn.chatgpt.com/docs/hooks · https://opencode.ai/docs/plugins/
