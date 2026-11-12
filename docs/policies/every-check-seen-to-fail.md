# Every check is seen to fail once

Before trusting a new or changed test or gate, break the behavior it guards (a negative control, or a mutation where tooling exists), see the check fail, restore the behavior, and report that failing run as evidence.

- **Break the behavior, not the check.** Remove the guard, flip a comparison, revert the fix, or feed the wrong fixture. Editing the check itself to fail proves nothing about what it guards.
- **Restore, then rerun.** Put the behavior back and confirm the check passes again. Never commit the break.
- **Record both runs.** The command, the failing exit code and the passing exit code are the evidence; "it would have caught it" is not.
- **A check that cannot be made to fail is not a check.** Fix or replace it; do not count its pass.
- **Mutation where tooling exists.** If the project already has a mutation-testing tool, a surviving mutant on the guarded lines is the same finding as a check that never failed.

This applies to every kind of check the project has (tests, lints, automated pipeline steps, document checks, release gates). Acceptance checks for a completion claim already need a negative control (`docs/policies/evidence-before-completion-claims.md`); formal models and properties follow `docs/policies/formal-verification-for-untestable-promises.md`. This rule extends the same idea to the check itself whenever it is added or changed, and does not repeat those files.

**Why**: A green check is only evidence if it could have been red. Checks that match the wrong string, read the wrong file or never reach the risky path pass forever and look exactly like checks that work; one deliberate failure is the cheapest way to tell them apart. (docs/absorb-pstack.md — generalised from pstack's formal-verification rows 25-26 and the `correct` skill's "prove each check fails on a real past mistake", `cursor/plugins` commit `a5539b1`; restated in EPDS's own words, not copied.)

Referenced from: `docs/PROTOCOL.md` — see `docs/policies/README.md` for why these are separate files.
