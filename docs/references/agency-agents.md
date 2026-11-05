---
source: https://github.com/msitarzewski/agency-agents
kind: repo
perspectives: [product, agent-ops]
patterns: [persona-catalog]
applies_to: [direction, spec, build]
evidence_grade: community
captured: 2026-09-16
---

## Analysis

msitarzewski/agency-agents — Product Manager·UX Researcher·Privacy Engineer·Test Automation
Engineer: a per-role persona catalog (states when to call, artifacts, priority). The primary source of the
"Stage → key question → recommended role → artifact → priority" structure of `docs/ROLES.md` (table 2 + table 6 merged).

**persona-catalog**: each role pins down "when it is called" and "the artifact it must leave behind", so that calling a role is itself an
artifact contract. Lead: EPDS's skill routing must likewise state not only "when this command triggers" but also "what file must be
left for it to count as done" — reflected as is in `docs/ROLES.md`.

## Measured

n/a — document/thread source (verified 2026-09-18: url reachable, HTTP 200). The catalog itself is a collection of markdown
persona files, so it has no "install/run" concept (cloning the catalog or installing it with `agency-agents-app`
is a separate item, see `agency-agents-app-v0-3-0.md` below).

## How EPDS uses it

Direction/Spec/Build — the primary source of the table structure of `docs/ROLES.md`. EPDS's design of pinning the artifact together
when it calls a role (call = contract) follows this catalog's persona file format as is.

> "A complete AI agency at your fingertips ... Each agent is a specialized expert with personality,
> processes, and proven deliverables." — repo description(gh api measured 2026-09-16, stars 152679;
> remeasured 2026-09-18: stars 153256, open_issues 149).
