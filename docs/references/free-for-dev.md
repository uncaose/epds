---
source: https://github.com/ripienaar/free-for-dev
kind: list
perspectives: [delivery, cost]
patterns: [curated-list, free-tier-directory]
applies_to: [direction, release]
evidence_grade: community
captured: 2026-09-18
---

## Analysis

A curated directory of free-tier developer infrastructure (hosting, CDN, email, monitoring, CI, ...
57 categories). Same shape as `public-apis` — a lookup table, not a tool. Relevant only when the
harness needs infra beyond its current single distribution channel (itch.io).

**curated-list / free-tier-directory**: first search stop for a free hosting/CDN/email tier before
signing up for a paid service or building custom infra.

What not: **no LICENSE file in the source repo** (`licenses` API 404s, `license` field is `null`).
Reference the URL and category names only — do not copy list entries verbatim into harness/EPDS
docs. No install/invoke; it is a README of links.

## Measured

`gh api repos/ripienaar/free-for-dev` 2026-09-18: stars 137722, `license: null` (no LICENSE file
found), pushed_at 2026-09-17 (very active).

## How EPDS uses it

Parked (JIT) — re-enter this list only when the harness's distribution actually needs
non-itch.io infra (hosting/CDN/email). **Reuse constraint: links/category names only, no verbatim
content copy** (no LICENSE file). Source: R0300 (`~/Projects/research/R0300-free-for-dev/catalog.md`).
Registered 2026-09-18, human H121 y.
