# Translations

English is the default. Translations of the intro docs (README.md, docs/INSTALL.md) live in `i18n/<lang>/<same path>`: ko, zh-CN, ja, vi, th, ms (Malay), id (Indonesian). Line 1 of each file pins the English source (`sha256` prefix); `test/i18n.selftest.mjs` fails with "stale translation" if the source changed — refresh the translation.

Not translated (EPDS itself / model-facing / internal): SKILL.md, adapters, docs/EPDS.md, docs/COMMANDS.md, docs/CHECK.md, docs/references, docs/policies, LAYOUT, TESTS, ROLES, PROTOCOL, bin output strings.

Translator: Codex gpt-5.5 (`reasoning_effort=medium`), one session per language. Back-translation spot check (README per language, by a separate Claude Sonnet 5.5 session, read against the English source):

| Lang | Checker | Result |
|---|---|---|
| ko | Claude Sonnet 5.5 | PASS — all sections/list items present, meaning preserved |
| zh-CN | Claude Sonnet 5.5 | PASS — same |
| ja | Claude Sonnet 5.5 | PASS — some source phrases left in English (as in source) |
| vi | Claude Sonnet 5.5 | PASS — same |
| th | Claude Sonnet 5.5 | PASS — some terms kept in English |
| ms | Claude Sonnet 5.5 | PASS — same |
| id | Claude Sonnet 5.5 | PASS — same |
