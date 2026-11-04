# Evidence before completion claims

Do not claim completion without evidence. Mark unsupported statements as `Unverified`.

**Why**: A claim of "done" without a file:line, test run, or exit code is unverifiable and, per EPDS's own evidence-first protocol, indistinguishable from a guess.

**A check must be able to fail.** A green result from a check that never exercises the risky path is not evidence: fast, mostly-right agent work removes the natural prompts to look again, so verification has to be designed in. For each acceptance check, show one negative control — a wrong input, broken fixture or reverted fix that the check rejects. Also list the defaults, thresholds and requirement readings the agent chose on its own (not only answers to unasked questions), because those are what a reviewer most needs to challenge. (Reference: Addy Osmani, "critical thinking when agents do the work", 2026-11 — cognitive delegation vs. cognitive surrender.)

For non-trivial repeated work (bulk edits, migrations, recurring checks), build or reuse the small
script/test that performs or verifies it — a rerunnable artifact a reviewer can execute again — not
a one-time hand-check nobody else can repeat (docs/absorb-pstack.md item 10 P7 rework, pstack's
`build-the-lever` principle, `README.md:212`).

Referenced from: `SKILL.md` § Scope and safety rules — see `docs/policies/README.md` for why these are separate files.
