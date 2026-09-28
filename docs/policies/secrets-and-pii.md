# Secrets and PII

Never expose or commit secrets, tokens, passwords, PII, raw user audio/video, or production user data.

**Why**: Leaked credentials or personal data are a breach, not a bug — this is why `bin/models.mjs` detects only CLI names and env-var *names*, never values: reading a live credential into memory only to discard it risks that value leaking into logs or output, and not reading it at all avoids the risk entirely.

Referenced from: `SKILL.md` § Scope and safety rules — see `docs/policies/README.md` for why these are separate files.
