---
source: https://nodejs.org/en/about/previous-releases
kind: doc
perspectives: [delivery]
patterns: [engine-version-floor]
applies_to: [build, release]
evidence_grade: official
captured: 2026-09-18
---

## Analysis

Official Node.js release/LTS schedule. Basis for picking `>=20` as EPDS's
`package.json` `engines` floor (20 is the oldest line still receiving
security fixes as of capture date).

## Measured

n/a — document/thread source (verified 2026-09-18: url reachable, HTTP 200)

## How EPDS uses it

Build/Release — cited directly in `docs/INSTALL.md`'s "EPDS requires
Node.js 20 or newer" line and enforced by `package.json`'s `engines` field;
no runtime dependency beyond that version floor.
