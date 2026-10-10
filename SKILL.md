---
name: epds
description: Evidence-First Product Delivery System. Use when the user asks to set up EPDS, assess a project’s current state, decide what to do next, evaluate an idea before implementation, design a minimum experiment, audit agent instructions, improve AGENTS.md or CLAUDE.md, prepare a release decision, or analyze an external repository/tool for reusable patterns. EPDS first inspects project evidence and trusted public sources, asks only owner-only decisions, then routes work through direction, problem, hypothesis, experiment, spec, build, verify, release, observe, and retro. Also use when asked to build, make or create an app, game, tool or feature from a request, even a short or vague one-liner or with no human available to answer, so the work is carried through to a finished product that has been run and checked.
argument-hint: "[setup|status|audit|upgrade|reference <URL>|discover|decide|experiment|spec|build|verify|release|observe|retro]"
---


# EPDS

Evidence-First Product Delivery System: finish the product yourself, with evidence (`docs/EPDS.md` §0-§3).

## Run to completion (the loop)

Every build request, however short, runs this loop. Do not stop short of step 7.

1. **Take stock.** Read what exists, then write three lines: state, position, next direction. An empty folder is a state too.
2. **Questions never block.** Ask only what a reachable human can answer. If no human can answer (non-interactive run, "no human available", or no reply), do not end the turn on a question: write each open question with the default you chose under `Assumptions` in the Final report and continue.
3. **Sharpen before building.** Write 3 to 7 acceptance checks, each one an observable action plus its expected result (e.g. "type a note, reload, the note is still listed"). Fill gaps in a vague request with the most common reading and record it as an assumption.
4. **Build** the smallest complete version at the requested path.
5. **Execute it.** Run the real artifact and perform every acceptance check by running it, with its exit code. For a web deliverable write `checks.json` and run `node <this skill dir>/bin/check.mjs <html> checks.json` (format: [docs/CHECK.md](docs/CHECK.md)). Reading the code, grepping the source for strings, or a screenshot you never looked at are not checks. A page that crashes on load, or an overlay that hides the content, fails every check.
6. **Fix and re-run** each failing check, up to 5 rounds. If the same check fails twice for the same reason, change the premise instead of patching again.
7. **Done means** every acceptance check was executed and passed, with the deliverable at the requested path. If any check still fails, say which one and why; never write "complete".

## Fast path (TRIVIAL)

Classify the request: `TRIVIAL` (one file, one feature) / `FEATURE` / `EXPLORATORY` / `STRATEGIC` / `SENSITIVE` / `RELEASE` / `GROWTH`.
If you are a small or low-cost model, or the request is TRIVIAL, use only this path: 2 to 3 acceptance checks, at most 2 fix rounds, and the short report `[Acceptance] N of M checks executed and passed (exit codes)` + `[Plain language] one line, no jargon`.

## Details (read only when needed)

- Command routing, evidence-first protocol, work router, 12 safety rules, full Final report format: [docs/PROTOCOL.md](docs/PROTOCOL.md)
- Commands: [docs/COMMANDS.md](docs/COMMANDS.md) · Check script format: [docs/CHECK.md](docs/CHECK.md)
