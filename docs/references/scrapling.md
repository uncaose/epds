---
source: https://github.com/D4Vinci/Scrapling
kind: tool
perspectives: [agent-ops, delivery]
patterns: [stealth-fetcher, markdown-extraction]
applies_to: [build, verify]
evidence_grade: community
captured: 2026-09-18
---

## Analysis

Python web-scraping library (BeautifulSoup-like selector API + stealth/undetectable fetchers:
static, dynamic/Playwright-driven, StealthyFetcher). Already the concrete implementation of
collection pipe ② ("Scrapling built-in") in `knowledge/notes/scrapling-agent-browser-research.md`
— not a new adoption, this card formalizes an already-live dependency as a trusted source.

**stealth-fetcher**: `DynamicFetcher` drives a real browser context for JS-rendered pages without
tripping basic bot detection — the harness's fallback when a plain HTTP fetch (①) is blocked.

**markdown-extraction**: `Response.markdown()` (new since 0.4.x) converts a fetched page straight
to Markdown — a direct fit for the harness's raw-capture-then-Markdown workflow (A05/A09).

What not: not a general browser-automation replacement for `agent-browser`'s persistent-profile
login flows (③) — Scrapling has no persistent session/profile concept; it is the stateless
fetch layer, not the logged-in-session layer.

## Measured

`gh api repos/D4Vinci/Scrapling` 2026-09-18: stars 81981, license BSD-3-Clause, pushed_at
2026-09-18 (same day, very active).

`pip install scrapling==0.4.15` — real: `pip index versions scrapling` (2026-09-18, research venv
`.venv-scrapling`) lists `0.4.15` as latest and already `INSTALLED: 0.4.15` (env already at
current, past the 0.4.11 pin recorded in `knowledge/notes/scrapling-agent-browser-research.md` —
that pin is stale and due for a separate update, tracked under H122).

Collection pipe ② real usage, 2026-09-18 (`.venv-scrapling`, installed 0.4.15):

```
from scrapling.fetchers import DynamicFetcher
page = DynamicFetcher.fetch('https://example.com', headless=True)
```

→ exit 0, `page.status` = 200, `page.find('title').text` = "Example Domain",
`page.markdown()` len 196. Confirms both the fetch path and the new `Response.markdown()` method
(§Analysis) work end-to-end on the currently installed version.

## How EPDS uses it

Build/Verify — this is the runtime for collection pipe ② in the harness's research-collection
plumbing (`knowledge/notes/scrapling-agent-browser-research.md`), used whenever plain
`WebFetch`/sub-agent fetch (①) is insufficient and a full persistent-profile browser (③,
`agent-browser`) is overkill. Source: R0302 (`~/Projects/research/R0302-scrapling-update/catalog.md`).
Registered 2026-09-18, human H121 y.
