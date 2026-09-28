# Evidence before completion claims

Do not claim completion without evidence. Mark unsupported statements as `Unverified`.

**Why**: A claim of "done" without a file:line, test run, or exit code is unverifiable and, per EPDS's own evidence-first protocol, indistinguishable from a guess.

For non-trivial repeated work (bulk edits, migrations, recurring checks), build or reuse the small
script/test that performs or verifies it — a rerunnable artifact a reviewer can execute again — not
a one-time hand-check nobody else can repeat (docs/absorb-pstack.md item 10 P7 rework, pstack's
`build-the-lever` principle, `README.md:212`).

Referenced from: `SKILL.md` § Scope and safety rules — see `docs/policies/README.md` for why these are separate files.
