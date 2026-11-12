# Make repeated mistakes impossible

When the same mistake recurs or the owner corrects one, prevent it at the highest level that works — structure first, then types, then a lint whose message names the fix, then a test, and docs last — and prove the new check fails on the real past mistake.

A mistake becomes a class to fix once it has happened twice, or once the owner has corrected it. Find the cause first (`docs/policies/root-cause-not-symptom.md`); if fixes on the same premise keep failing, re-examine the premise (`docs/policies/premise-review-after-repeated-failure.md`). This rule covers what comes after: making the class impossible to repeat.

1. **Structure.** Give each piece of state one owner and each task one supported way; replace hand-synced lists with one source of truth; delete old paths an agent would copy.
2. **Types.** Make the bad state impossible to write.
3. **Lint or CI check.** If bad code still builds, fail it with a message that names the file, type or function to use instead. If the pattern is already common, fail only on changes that add more.
4. **Test.** Assert the behavior (`docs/policies/test-behavior-not-implementation.md`).
5. **Docs or agent instructions, last.** Only for judgment calls; nothing fails when a reader skips them.

Prove each new check fails on the actual past mistake, not an invented one (`docs/policies/every-check-seen-to-fail.md`), and run the same command locally and in CI. An exception goes on the offending line with a reason, an expiry date and the approving person. Keep a short table in the project's agent instructions pairing each rule with what enforces it; a rule that exists but is unenforced and is broken again counts as a repeat and moves up a level in the same change. Drop a rule once its mistake can no longer happen.

**Why**: Contributors, human or agent, see only the files they opened and copy the nearest example; a rule written only in prose is skipped exactly when it matters. Moving the rule into structure, types or a failing check means the next contributor cannot make the mistake at all, instead of being asked not to. (docs/absorb-pstack.md — pstack's `correct` skill, `skills/correct/SKILL.md` at `cursor/plugins` commit `a5539b1`, 2026-11-12; restated in EPDS's own words, not copied.)

Referenced from: `docs/PROTOCOL.md` — see `docs/policies/README.md` for why these are separate files.
