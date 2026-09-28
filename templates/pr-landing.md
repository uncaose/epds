# PR landing: [Change title]

Standard exit shape for every `/build` that reaches a commit or PR — one convergence point
regardless of which delivery command or work-router classification produced the change
(docs/absorb-pstack.md item 4, pstack's opening-a-pr convergence pattern; EPDS's version is the
exit for all 14 commands, not one playbook subset).

## Commit sequence

Small, ordered commits — each one a state a reviewer could check out and verify on its own, not
one squashed diff. One topic per commit.

| # | Commit message (subject line) | What it changes |
|---|---|---|
| 1 | | |

## PR title

Conventional Commits format: `<type>(<scope>): <subject>` — `feat`/`fix`/`docs`/`refactor`/`test`/
`chore`, imperative mood, no trailing period.

## PR body (briefing-style, not narrative)

```text
[What changed] one or two lines, no preamble
[Why] the gate/bottleneck this closes (link the spec/decision if one exists)
[Verification] commands run + exit codes + result summary (never omit an exit code)
[Risks / follow-ups] what's still open, if anything
```

## Before landing

- [ ] Tests run, exit code recorded (`Do not claim completion without evidence` —
      `docs/policies/evidence-before-completion-claims.md`)
- [ ] No unrelated scope bundled in (`docs/policies/scope-discipline.md`)
- [ ] Secrets/PII check clean (`docs/policies/secrets-and-pii.md`)
