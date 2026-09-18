---
source: https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions
kind: article
perspectives: [delivery]
patterns: [adr-record]
applies_to: [spec, retro]
evidence_grade: official
captured: 2026-09-18
---

## Analysis

Michael Nygard's original 2011 post defining the Architecture Decision
Record: short, immutable Status/Context/Decision/Consequences documents,
one per significant decision, kept next to the code. Static, canonical
reference — nothing to version-check.

## Measured

n/a — document/thread source (verified 2026-09-18: url reachable, HTTP 200)

## How EPDS uses it

Spec/Retro — direct source of `templates/adr.md`'s four sections. Any EPDS
stage that records a `decide`-class judgment (spec commitments, retro
keep/expand/iterate/stop calls) writes it as one of these files.
