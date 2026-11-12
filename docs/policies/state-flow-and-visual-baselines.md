# Model multi-step flows; baseline the UI before changing it

For a product with a multi-step flow, model its states and show that every rule-breaking state is unreachable or give the shortest path to it; for a UI change, where the project can capture and compare screens, take baseline screenshots before changing anything and compare by image diff (where it cannot, mark visual parity Unverified rather than claiming it), and never edit the baseline to make a diff pass.

Apply each requirement below where it fits the check and the project's facilities. For a manual check (for example a human GO decision or a hand-run step), record the steps taken and what was observed failing and then passing instead of commands and exit codes. A requirement that does not apply is named in the report with the reason, never skipped silently.

## Multi-step flows

- Write each rule the owner agrees to (a screen shown, a result, a stored value, a message sent) as a checked invariant. If the model has no variable for a rule, add one. Never weaken a rule to make it hold.
- Explore the states with any tool that covers every reachable state within a stated bound (a model checker, or an exhaustive enumeration of a small model). Keep the bound small and say what it is.
- For every broken rule, report the shortest path to it as steps the user would recognise ("you press pay", "the network drops"), not as code or action names. Label states with what the reader sees or cares about.
- A correct end state with no step out is not a deadlock; mark it as an end state in the model instead of hiding the deadlock check.
- When the model describes real code, replay each reported path against that code as a test or live reproduction. If the bug does not occur, suspect the model until you show otherwise.

The trust rules for such a model (maps to real code, seen to fail, stated bounds, recorded commit) are in `docs/policies/formal-verification-for-untestable-promises.md`; they are not repeated here.

## UI changes

- Where the project can capture screenshots and diff images, capture the baseline first: screenshots of the current UI across its states (and of the target when matching two implementations). No baseline, no parity claim; the baseline is a prerequisite, not a follow-up.
- Where it can, compare by image diff on the same surface and size. A nonzero diff is a failure to investigate, not a judgment call made by eye.
- Do not edit the baseline, the diff harness or the component structure to make a diff pass. If the baseline itself looks wrong, stop work on that component and ask the owner; when no owner can answer, record visual parity for it as Unverified and continue with other work instead of editing the baseline.
- Change one component at a time, shared building blocks first, so each diff points at one change.
- Where the project has no way to capture and diff screenshots, report visual parity as `Unverified` rather than claiming it by eye.

**Why**: Multi-step flows break in orders nobody wrote a test for, and the shortest path to a broken state is the clearest bug report a non-engineer can judge. UI regressions are invisible to a reviewer comparing by eye, and a baseline taken after the change, or edited to match, silently turns the spec into whatever the code now does. (docs/absorb-pstack.md — pstack's `statechart` skill and `visual-parity` playbook, `skills/statechart/SKILL.md` and `skills/poteto-mode/playbooks/visual-parity.md` at `cursor/plugins` commit `a5539b1`, 2026-11-12; restated in EPDS's own words, not copied.)

Referenced from: `docs/PROTOCOL.md` — see `docs/policies/README.md` for why these are separate files.
