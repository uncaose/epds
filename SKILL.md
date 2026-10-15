---
name: epds
description: Evidence-First Product Delivery System. Use when the user asks to set up EPDS, assess a project’s current state, decide what to do next, evaluate an idea before implementation, design a minimum experiment, audit agent instructions, improve AGENTS.md or CLAUDE.md, prepare a release decision, or analyze an external repository/tool for reusable patterns. EPDS first inspects project evidence and trusted public sources, asks only owner-only decisions, then routes work through direction, problem, hypothesis, experiment, spec, build, verify, release, observe, and retro. Also use when asked to build, make or create an app, game, tool or feature from a request, even a short or vague one-liner or with no human available to answer, so the work is carried through to a finished product that has been run and checked.
argument-hint: "[setup|status|audit|upgrade|reference <URL>|discover|decide|experiment|spec|build|verify|release|observe|retro]"
---


# EPDS

Evidence-First Product Delivery System: finish the product yourself, with evidence (`docs/EPDS.md` §0-§3).

## Level
Pick `low`, `medium` (default) or `high` from the request wording or one line in `epds/level` (env `EPDS_LEVEL` wins); never from the model's size. Evidence records (executed table, `checks.json`, Stop gate) exist only at `high`.

## Run to completion (the loop)
Every build request, however short, runs this loop. Do not stop short of its last step for your level.

1. **Take stock.** Read what exists (one tool call), then note state and next direction in one line each. An empty folder is a state too.
2. **Questions never block.** Ask only what a reachable human can answer. If no human can answer (non-interactive run, "no human available", or no reply), do not end the turn on a question: write each open question with the default you chose under `Assumptions` in the Final report and continue.
3. **Sharpen before building.** Pick the one thing the request is about; fill gaps in a vague request with the most common reading and record it as an assumption. Each item asks two things: does it work, and would an ordinary person using that state find it obvious, see the result of every action, and find every value and message right and tidy? When a person gives the app a value they already know, show them the value they will want to read when they come back.
   - `low`: write its whole life (first visit and empty state -> each event -> end -> what happens after the end -> a mistake and the way back) as 3 to 7 observable checks, one line each.
   - `medium`: write it as a table instead: `cp <this skill dir>/templates/LIFECYCLE.md LIFECYCLE.md`, fill every row; the last column may stay empty.
   - `high`: as `medium`, and every row's last column is an executed command with its exit code. One transition = one executable check. Run `node <this skill dir>/bin/check.mjs LIFECYCLE.md` until it exits 0 (it re-runs your `check.mjs ... .json` commands); do not add test-only hooks to the product.
4. **Build** the smallest complete version at the requested path.
5. **Execute it** (`high` only). Run the real artifact and perform every row's checks, with its exit code, then use it like a person. For a web deliverable, write the files and run the checker in the SAME Bash command (`cat > index.html <<'EOF' ... EOF` then `cat > checks.json <<'EOF' ... EOF` then `node <this skill dir>/bin/check.mjs index.html checks.json`); check.mjs alone, it prints failing checks plus one summary line (`--verbose` lists passes). `checks.json` = `{"checks":[{"name":"add a note","steps":[{"type":"#in","text":"milk"},{"press":"Enter"},{"reload":true}],"expect":[{"text":"milk"},{"count":"li","eq":1},{"consoleErrors":0}]}]}`; steps `click` `dblclick` `type`(+`text`) `press` `reload` `wait`(ms) `advance`(simulated ms) `viewport`([390,844]); expects `text` `count`(+`eq`) `consoleErrors` `noOverflow`(true). Reading the code, grepping the source, or a screenshot you never looked at are not checks.
6. **Fix and re-run** (`high` only) each failing check, up to 5 rounds. If the same check fails twice for the same reason, change the premise instead of patching again.
7. **Done means** `low`: the deliverable exists at the requested path and the check list is in the report. `medium`: plus the filled table. `high`: every lifecycle row was executed and passed; if any check still fails, say which one and why; never write "complete".

## Fast path (TRIVIAL)

Classify the request: `TRIVIAL` (one file, one feature, or a one-line request for a single small app) / `FEATURE` / `EXPLORATORY` / `STRATEGIC` / `SENSITIVE` / `RELEASE` / `GROWTH`.
If it is TRIVIAL, use only this path: the LIFECYCLE.md rows (one check per transition), at most 2 fix rounds, and the short report `[Acceptance] N of M checks executed and passed (exit codes)` + `[Plain language] one line, no jargon`.
For work that already has acceptance criteria or tests (including delegated subtasks), write LIFECYCLE.md with at most 5 rows, link each row's last cell to that existing check command and its exit code, and do not build a new checker.

## Details (read only when needed)

- Command routing, evidence-first protocol, work router, 14 safety rules, full Final report format (its [Verification] block ends with one `Security:` line: runtime hook result, else an existing scanner/linter diff run with its exit code, else `none available`): [docs/PROTOCOL.md](docs/PROTOCOL.md)
- Commands: [docs/COMMANDS.md](docs/COMMANDS.md)
