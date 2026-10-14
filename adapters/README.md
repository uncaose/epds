# End-of-turn gate (same rule on every runtime, any model)

The stop is blocked until `LIFECYCLE.md` exists in the working folder and `node bin/check.mjs LIFECYCLE.md` exits 0 (rows are re-run, not just read: `check.mjs ... .json` commands are executed again, a recorded non-zero exit or a failing re-run blocks, and "N rows not re-run" is printed); after 3 blocks in one session the next stop passes and is logged (`$EPDS_GATE_STATE/gate.log`, default `$TMPDIR/epds-gate`).

| runtime | gate | install |
|---|---|---|
| Claude Code | Stop hook | merge `claude-code/settings.snippet.json` into `.claude/settings.json` |
| Codex | Stop hook (`.codex/hooks.json`; review it once with `/hooks`) | copy `codex/hooks.json` to `<repo>/.codex/hooks.json` |
| opencode | none: its documented plugin events (`session.idle`) cannot block or continue a session | no gate; do not replace it with instruction text |

Docs: https://code.claude.com/docs/en/hooks · https://learn.chatgpt.com/docs/hooks · https://opencode.ai/docs/plugins/
