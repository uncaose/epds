---
name: epds
description: Evidence-First Product Delivery System. Use when the user asks to set up EPDS, assess a project’s current state, decide what to do next, evaluate an idea before implementation, design a minimum experiment, audit agent instructions, improve AGENTS.md or CLAUDE.md, prepare a release decision, or analyze an external repository/tool for reusable patterns. EPDS first inspects project evidence and trusted public sources, asks only owner-only decisions, then routes work through direction, problem, hypothesis, experiment, spec, build, verify, release, observe, and retro. Also use when asked to build, make or create an app, game, tool or feature from a request, even a short or vague one-liner or with no human available to answer, so the work is carried through to a finished product that has been run and checked.
argument-hint: "[setup|status|audit|upgrade|reference <URL>|discover|decide|experiment|spec|build|verify|release|observe|retro]"
---


# EPDS

Evidence-First Product Delivery System: finish the product yourself, with evidence (`docs/EPDS.md` §0-§3).

## Run to completion (the loop)

Every build request, however short, runs this loop. Do not stop short of step 7.

1. **Take stock.** Read what exists (one tool call), then note state and next direction in one line each. An empty folder is a state too.
2. **Questions never block.** Ask only what a reachable human can answer. If no human can answer (non-interactive run, "no human available", or no reply), do not end the turn on a question: write each open question with the default you chose under `Assumptions` in the Final report and continue.
3. **Sharpen before building.** Pick the one thing the request is about and write its whole life as a table: `cp <this skill dir>/templates/LIFECYCLE.md LIFECYCLE.md` and fill every row (first visit and empty state -> each event -> end -> what happens after the end -> a mistake and the way back). Fill gaps in a vague request with the most common reading and record it as an assumption. Each row asks two things: does it work, and would an ordinary person using that state find it obvious, see the result of every action, and find every value and message right and tidy? When a person gives the app a value they already know, show them the value they will want to read when they come back. One transition = one executable check. Run `node <this skill dir>/bin/check.mjs LIFECYCLE.md` until it exits 0; do not add test-only hooks to the product.
4. **Build** the smallest complete version at the requested path.
5. **Execute it.** Run the real artifact and perform every row's checks by running it, with its exit code, then use it like a person: do each row's detail check. For a web deliverable, write the files and run the checker in the SAME Bash command (`cat > index.html <<'EOF' ... EOF` then `cat > checks.json <<'EOF' ... EOF` then `node <this skill dir>/bin/check.mjs index.html checks.json`). Use check.mjs alone: do not also run your own verification script. It prints only failing checks plus one summary line (`--verbose` lists passes). `checks.json` = `{"checks":[{"name":"add a note","steps":[{"type":"#in","text":"milk"},{"press":"Enter"},{"reload":true}],"expect":[{"text":"milk"},{"count":"li","eq":1},{"consoleErrors":0}]}]}`; steps `click` `dblclick` `type`(+`text`) `press` `reload` `wait`(ms) `advance`(simulated ms: a timer or a day rollover) `viewport`([390,844]); expects `text` `count`(+`eq`) `consoleErrors` `noOverflow`(true). Reading the code, grepping the source, or a screenshot you never looked at are not checks. A page that crashes on load fails every check.
6. **Fix and re-run** each failing check, up to 5 rounds. If the same check fails twice for the same reason, change the premise instead of patching again.
7. **Done means** every lifecycle row was executed and passed, with the deliverable at the requested path. If any check still fails, say which one and why; never write "complete".

## Fast path (TRIVIAL)

Classify the request: `TRIVIAL` (one file, one feature, or a one-line request for a single small app) / `FEATURE` / `EXPLORATORY` / `STRATEGIC` / `SENSITIVE` / `RELEASE` / `GROWTH`.
If it is TRIVIAL, use only this path: the LIFECYCLE.md rows (one check per transition), at most 2 fix rounds, and the short report `[Acceptance] N of M checks executed and passed (exit codes)` + `[Plain language] one line, no jargon`.

## Details (read only when needed)

- Command routing, evidence-first protocol, work router, 13 safety rules, full Final report format: [docs/PROTOCOL.md](docs/PROTOCOL.md)
- Commands: [docs/COMMANDS.md](docs/COMMANDS.md)
