# Secrets and PII

Never expose or commit secrets, tokens, passwords, PII, raw user audio/video, or production user data.

**Why**: Leaked credentials or personal data are a breach, not a bug — this is why `bin/models.mjs` detects only CLI names and env-var *names*, never values (A19).

Referenced from: `SKILL.md` § Scope and safety rules (docs/absorb-pstack.md item 2 — split into
independent files, following pstack's principle-independent-files pattern once split was warranted
by this task's own acceptance criteria; see docs/LAYOUT.md for the layout mapping).
