---
name: epds
description: Evidence-First Product Delivery System. Use when the user asks to set up EPDS, assess a project’s current state, decide what to do next, evaluate an idea before implementation, design a minimum experiment, audit agent instructions, improve AGENTS.md or CLAUDE.md, prepare a release decision, or analyze an external repository/tool for reusable patterns. EPDS first inspects project evidence and trusted public sources, asks only owner-only decisions, then routes work through direction, problem, hypothesis, experiment, spec, build, verify, release, observe, and retro. Also use when asked to build, make or create an app, game, tool or feature from a request, even a short or vague one-liner or with no human available to answer, to carry it through to a finished product that was run and checked.
argument-hint: "[setup|status|audit|upgrade|reference <URL>|discover|decide|experiment|spec|build|verify|release|observe|retro]"
---

# EPDS

Evidence-First Product Delivery System: finish the product yourself, with evidence (`docs/EPDS.md` §0-§3).

## Level
Pick `low`, `medium` (default) or `high` from the request wording or one line in `epds/level` (env `EPDS_LEVEL` wins); never from the model's size. Evidence records (executed table, `checks.json`, Stop gate): `high`.

## Run to completion (the loop)
Every build request runs this loop; do not stop before its last step for your level.

1. **Take stock.** Read what exists; note state and next direction, one line each. Mid-project start: fill the intake first.
2. **Questions never block.** Ask when a channel exists (chat, or a question file the prompt names), even when non-interactive. With no channel ("no human available") or no reply, never end the turn on a question: list open questions with chosen defaults under `Assumptions` in the Final report and continue; record the intake `UNCONFIRMED`, build only what the router allows without approval, and show it first when a human is back.
3. **Sharpen before building.** Pick the one thing the request is about; fill gaps with the commonest reading, noted as assumption. Each item asks: does it work, and would an ordinary person find it obvious, see each action's result, and find every value and message right? When a person gives the app a value they know, show the value they will want to read on return. Write the intake: TRIVIAL one line; else the skeleton printed by `node <this skill dir>/bin/intake-check.mjs --template` (read no template file). With a reachable human make ONE question call: one Bash command that writes `QUESTIONS.md` (the intake block under `## 1. Intake block` plus the questions) and then runs `node <this skill dir>/bin/intake-check.mjs`, no separate `intake.md`; no human: write `intake.md`. Get explicit approval of intake, then decomposition; it must exit 0 before build; re-confirm on every correction or direction change ([policy](docs/policies/intake-confirmation.md)).
   - `low`: write its whole life (first visit and empty state -> each event -> end -> what happens after the end -> a mistake and the way back) as 3 to 7 observable checks, one line each.
   - `medium`: write it as a table with the columns state | what the user sees and can do | works check | usability & detail check | how executed (command + exit code); one row per state; last column may stay empty.
     If the request is vague (one or two sentences) or carries domain rules (money, dates or times, bookings, health, law, units): before building, write BRIEF.md with `<this skill dir>/templates/plan-audit.md`, get one audit from a different session or model (subagent, `codex exec`, or any second model; never the author session), handle findings per `epds/audit-mode` (`auto` default; `interview`; `off` skips this step; env `EPDS_AUDIT` wins; see plan-audit.md), then build from BRIEF.md. Every button, link and input is at least 44 px high and wide; body text contrast is at least 4.5:1. If `a11y-check.mjs` exits 2 with its one-line missing-dependency message, do not search for modules; note it and go on.
   - `high`: as `medium`, and every row's last column is an executed command with its exit code. One transition = one executable check. Run `node <this skill dir>/bin/check.mjs LIFECYCLE.md` until it exits 0 (it re-runs your `check.mjs ... .json` commands); do not add test-only hooks to the product.
4. **Build** the smallest complete version at the requested path, from a WBS written first at every layer, run in dependency order ([policy](docs/policies/wbs-first-planning.md); TRIVIAL: one line). After approval use ONE Bash call at `low`/`medium`: `cat > index.html <<'EOF' ... EOF` `&& node <this skill dir>/bin/intake-check.mjs`; at `medium` also write LIFECYCLE.md in it and chain `; node <this skill dir>/bin/a11y-check.mjs index.html`. Screenshots, by-eye checks: `high`.
5. **Execute it** (`high` only). Run the real artifact, perform every row's checks with exit codes, then use it like a person; grepping or an unviewed screenshot is no check. For a web deliverable write the files and run `node <this skill dir>/bin/check.mjs index.html checks.json` in the SAME Bash command; it prints failing checks and one summary line. Format of `checks.json`, steps and expects: [docs/COMMANDS.md](docs/COMMANDS.md).
6. **Fix and re-run** (`high` only) each failing check, up to 5 rounds. If the same check fails twice for the same reason, change the premise instead of patching again.
7. **Done means** `low`: the deliverable exists at the requested path and the check list is in the report. `medium`: plus the filled table. `high`: every lifecycle row was executed and passed; if any check still fails, say which one and why; never write "complete".

## Fast path (TRIVIAL)

Classify the request: `TRIVIAL` (one file, one feature, or a one-line request for a single small app) / `FEATURE` / `EXPLORATORY` / `STRATEGIC` / `SENSITIVE` / `RELEASE` / `GROWTH`.
If it is TRIVIAL and checkable without judging by eye, use only this path (a visual change checkable only by eye takes the normal path: `docs/policies/visual-quality-layers.md`): a one-line intake (purpose + done check), the LIFECYCLE.md rows (one check per transition), at most 2 fix rounds, and the short report `[Acceptance] N of M checks executed and passed (exit codes; steps and observation for a manual check)` + `[Plain language] one line, no jargon`.
For work that already has acceptance criteria or tests (including delegated subtasks), write LIFECYCLE.md with at most 5 rows, link each row's last cell to that existing check command and its exit code, and do not build a new checker.

## Details (read only when needed)

- Command routing, evidence-first protocol, work router, safety rules, full Final report format (its [Verification] block ends with one `Security:` line: runtime hook result, else an existing scanner/linter diff run with its exit code, else `none available`): [docs/PROTOCOL.md](docs/PROTOCOL.md)
- Commands: [docs/COMMANDS.md](docs/COMMANDS.md)
