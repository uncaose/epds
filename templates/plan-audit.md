# Plan audit (medium: vague request or domain rules)

Used before building when the request is one or two sentences or carries domain rules (money, dates or times, bookings, health, law, units). Source: R0408 (BRIEF -> audit -> revise -> build).

## 1. Write BRIEF.md (do NOT build yet, no code, no human to ask)
A one-page build brief with these sections: Goal (the task text verbatim); REQ-1..REQ-n (each one a single testable requirement); for every REQ an Acceptance line (observable and literal) and a RED line (a command or check that fails before the work); Failure modes (plausible ways this build goes wrong, including races, partial failure, stale or missing data, and rollback where they apply).

## 2. Audit once (a different session or model than the author; it sees ONLY BRIEF.md plus its sha256)
Give the auditor this prompt followed by `audited_sha: <sha256 of BRIEF.md>` and the brief text:

> You are an independent design auditor. You see ONLY the build brief below (no author reasoning, no code). Default stance: the brief has defects. Procedure: (1) list plausible failure modes for this task first (races, partial failure, lookup failure treated as a state, stale reads, rollback, edge inputs); (2) check each against the brief's REQ lines: every REQ must have a testable Acceptance line and a RED line; every failure mode you listed must be covered by some REQ or be flagged; (3) tag every finding `blocking` (a builder following the brief would plausibly ship a defect or an untestable requirement) or `optional` (nice to have; optional findings never justify FAIL); (4) a PASS must quote the brief lines that satisfy each REQ; a PASS without quotes counts as UNVERIFIED and is a FAIL.
> Output format, first two lines exactly:
> verdict: PASS   (or FAIL)
> audited_sha: <the sha256 given below>
> then a findings list, one per line: `[blocking|optional] <short title> | quote: "<brief text>" | fix: <one sentence>`. Maximum 3 blocking findings. Do not write files; answer on stdout only.

## 3. Revise once
Revise BRIEF.md in place so each blocking finding is resolved (add or sharpen REQ, Acceptance, RED, failure-mode lines). Ignore optional findings. Do not audit again. Then build from BRIEF.md.

## Modes (`epds/audit-mode` first line; env `EPDS_AUDIT` wins; default `auto`; invalid value = `auto`)
- `auto`: revise once for blocking findings, as in section 3.
- `off`: skip this whole step (write no audit, build from the request); same as before plan-audit existed.
- `interview`: audit as in section 2, with two changes: put `REQUEST: <the request verbatim>` before the brief, and append one line to the audit prompt: "The original request is given first as REQUEST; you may quote it." Ask the human only about `blocking` findings that need a policy or value only the owner knows (purpose, scope, UX meaning, a number or rule); findings that cite the REQUEST text come first. A finding with one sensible default (input validation, ordering, error handling) is not a question: resolve it by the `auto` rule (revise once). At most 3 questions. Each question = finding title + the quoted text + 2 options, each option with a one-line consequence the person would experience (e.g. "you must run a server" / "only visible in each person's own browser") + a default marked (what `auto` would have chosen). Ask all questions in one message and take the answers in one reply. Resolve every other finding by the `auto` rule (revise once). Then record in BRIEF.md one `Decisions:` line per question marked `answered` or `default kept (not answered)`; an unanswered default is never treated as consent.
- No reachable human (non-interactive run, no reply): `interview` behaves as `auto`; list each question and the default chosen under `Assumptions` in the Final report.
