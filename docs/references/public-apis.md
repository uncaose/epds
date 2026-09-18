---
source: https://github.com/public-apis/public-apis
kind: list
perspectives: [product, delivery]
patterns: [curated-list, api-directory]
applies_to: [direction, build]
evidence_grade: community
captured: 2026-09-18
---

## Analysis

A curated directory of free public APIs, organized into 52 categories (weather, maps, trivia,
anime, finance, ...). Not a tool or framework — a lookup table. Relevant to EPDS/harness only at
the moment a new game or feature needs live external data; until then it is a parked reference,
not an active dependency.

**curated-list / api-directory**: when a game design calls for real-world data (weather-driven
mechanics, a trivia mode, a map overlay), this is the first place to check for a free-tier API
before building a custom scraper or paying for a data provider.

What not: no code, no install, no runtime behavior to verify. MIT license means content and
category names can be copied/quoted freely — unlike `free-for-dev` (no LICENSE), reuse here is
unrestricted.

## Measured

`gh api repos/public-apis/public-apis` 2026-09-18: stars 481311, license MIT, pushed_at
2026-09-17 (very active). No install/invoke — this is a Markdown README of links, not a package.

## How EPDS uses it

Parked (JIT) — re-enter this list as the first search stop only when a specific game or harness
feature actually needs an external live-data API. Source: R0301 (`~/Projects/research/R0301-public-apis/catalog.md`).
Registered 2026-09-18, human H121 y.
