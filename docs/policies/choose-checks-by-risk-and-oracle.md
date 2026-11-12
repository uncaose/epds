# Choose the check by the oracle you have

Choose which checks a change needs from the methods catalog (`docs/verification-methods.md`) by the risk of being wrong and by their cost, naming each method left out with a one-line reason and never dropping one whose mandatory condition applies at the work's rigor level; a needed check keeps its principles without shortcuts, its technique follows the oracle available (an exact expected value, an invariant, no oracle, ordering, performance, or visual), and every done criterion maps to at least one check id or is reported `Unverified`.

**Proportionate checks (the single home for "apply where it fits")**: not every check applies to every change; leaving out what a change does not need is how verification stays worth its cost. Where a check is needed, it is not optional and not cut short.

- **Pick from the catalog by risk and cost.** `docs/verification-methods.md` lists each method with the risk it catches, the oracle it needs, its typical cost, its prerequisites and when it is mandatory. Weigh how bad it is to be wrong (data loss, a broken promise to users, a release) against the method's cost. A one-line copy fix does not need a property-based test; a payment retry path does.
- **Never drop a mandatory method.** When a method's "mandatory when" applies (a release gate, a promise the code makes, the `high` rigor level, a repeated mistake), it is not left out. Risk and cost choose only among the rest.
- **The rigor level sets the form.** "Mandatory when" applies within the rigor level the work runs at (SKILL.md § Level). At `low`, `medium` and TRIVIAL, a mandatory method is reported either as done, with its evidence, or as `Unverified` with the reason; it does not raise the level by itself. This selection rule never removes an execution requirement SKILL.md already sets at any level (for example a command at `medium` or a TRIVIAL acceptance command for an existing criterion), adds none of its own below `high` or a release gate, and never loosens `high`.
- **Name what is left out.** Each method or policy requirement a change does not get is named in the report with a one-line reason (`not needed: <reason>` or `cannot run here: <reason>`). Skipping silently is not allowed.
- **Needed means whole.** A check is needed when the risk calls for it or when its "mandatory when" applies. A needed check keeps its own policy's rules in full: seen to fail before it is trusted (`docs/policies/every-check-seen-to-fail.md`), not weakened to pass (`docs/policies/tests-not-weakened.md`), run against the artifact that actually runs (`docs/policies/verify-resolved-artifact.md`).
- **Manual checks.** For a check done by hand (for example a human GO decision or a hand-run step), record the steps taken and what was observed failing and then passing instead of commands and exit codes. This does not relax `high`: there every LIFECYCLE.md row stays an executed command with its exit code, so a manual check is never a LIFECYCLE row.
- **Levels still decide done.** "Done means" in SKILL.md decides completion at each rigor level; this rule decides which checks fill that level, never whether the level's own checks run.

Other policies that say "apply each requirement where it fits" defer to this section.

**Technique by oracle**: an oracle is what tells a check the right answer. Pick the technique from the oracle you have, one per need, not all at once:

| What you know about the right answer | Technique | Where the rules live |
|---|---|---|
| The exact expected value for a given input | Example tests (input -> expected output) | `docs/policies/test-behavior-not-implementation.md`, `docs/policies/test-first.md` |
| An invariant that must hold for every input (round-trips, ordering of a sort, no lost items) | Property-based tests or fuzzing over generated inputs, with a stated input range | this file |
| No oracle: no single right output (AI scoring, ranking, translation, search) | Metamorphic relations: change the input in a way whose effect on the output is known and check that effect (the same answer with whitespace changed scores the same; adding an irrelevant document does not reorder the top result) | this file, and `docs/policies/honest-evaluation.md` for judges |
| Ordering, retries or concurrency | A tool that covers every case in a stated scope | `docs/policies/formal-verification-for-untestable-promises.md` |
| Performance (speed, throughput, latency, resource use) | A vetted measurement | `docs/policies/vet-measurements.md` |
| Visual correctness | Structure, measurement, blind rubric review, then owner taste | `docs/policies/visual-quality-layers.md` |

A property or metamorphic check is a check like any other: show it failing on a deliberately broken copy before trusting it.

**Traceability**: give every check an id (for example `C1`). Every done or acceptance criterion maps to at least one check id.

- In the intake decomposition table (`templates/intake.md`), the verify-condition cell starts with the check id and names the catalog method it uses (for example `C1 M1 example test: npm test -> exit 0`).
- Where the id appears next depends on the completion path (no new table is required for `low` or TRIVIAL):

  | Path | Where the check id appears |
  |---|---|
  | `low` | At the start of its item in the check list |
  | `medium` | At the start of its LIFECYCLE row's "how executed" cell; the execution may stay empty and is then reported `Unverified` |
  | `high` | At the start of its executed LIFECYCLE row's "how executed" cell, with the command and exit code |
  | TRIVIAL | In the one-line intake's done check (and in its LIFECYCLE row where the fast path writes one) |
  | Manual check, any level | In the final report's acceptance list, with the steps taken and what was observed |
- In the final report, a criterion with no mapped check, or whose check did not run, is listed as `Unverified`, never as passed.
- Matching ids is a reviewer check, not a machine check: `bin/check.mjs` checks each LIFECYCLE row's exit code but does not read the intake, so it does not confirm that every id appears.

**Why**: Running every known technique on every change wastes effort and buries the checks that matter; running too few lets the risky change through. Choosing by risk and cost, and saying what was left out, keeps the cost proportionate and the gap visible. The technique has to fit the oracle: an example test cannot check an output nobody can predict, and a property test is wasted where one exact value says it all. A criterion that maps to no check is a claim, not a result. (Sources: the project owner's rule that not every check is needed but a needed check keeps its principles; property-based and metamorphic testing as general testing practice; restated in EPDS's own words.)

Referenced from: `docs/PROTOCOL.md` — see `docs/policies/README.md` for why these are separate files.
