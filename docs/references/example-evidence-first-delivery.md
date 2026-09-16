---
source: https://github.com/uncaose/epds/blob/main/README.md
kind: repo
perspectives: [evidence, delivery]
patterns: [evidence-before-assumption, gated-state-model]
applies_to: [direction, spec, verify]
evidence_grade: self
captured: 2026-09-16
---

This is a format demo, not a captured reference — EPDS's own README problem statement, used so a
new project sees a filled example instead of an empty template. Delete or replace once a real
source lands.

**evidence-before-assumption**: before asking the owner a question, EPDS reads the project's own
files first (README, PROJECT-STATE, tests, CI) and only reaches for public sources when a fact is
missing there. The lead: don't ask what a file already answers.

**gated-state-model**: product and delivery are tracked as two separate small state machines
(DIRECTION→RETRO, SPEC→RELEASE); the next action is whichever gate is weakest, not whichever file
is newest. The lead: when stuck, name the gate before naming the task.

> EPDS decides what evidence to collect, what information is missing, which questions are worth
> asking, and which delivery gate must be passed next.
