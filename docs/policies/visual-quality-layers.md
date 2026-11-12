# Check visual quality in layers, not by eye alone

For a change whose correctness is visual (layout, spacing, color, type, icons, copy placement), verify it in this order: prevent off-system values structurally, measure what can be measured on the rendered screen, have an independent reviewer score the rest blind against a stated rubric, and leave only the remaining matter of taste to the owner, reported as `Unverified – awaiting owner` until the owner confirms it.

Apply each layer where the project's facilities allow it, and name any layer that could not run, with the reason (see `docs/policies/vet-measurements.md` for how to trust a number and `docs/policies/state-flow-and-visual-baselines.md` for baselines).

1. **Structure (prevent).** Keep visual values in design tokens: a spacing grid, a type scale with a fixed ratio, a small fixed palette with a dominant/secondary/accent split, and at most two type families. Where the project has a linter or build check, reject values outside the tokens. A value the structure cannot produce cannot ship by accident.
2. **Measurement (on the rendered screen).** Where screens can be captured, measure each changed screen and compare it with stated thresholds:
   - the visual center of mass relative to the frame center;
   - text contrast;
   - touch-target size;
   - alignment to the grid;
   - the number of competing focal elements;
   - the number of distinct colors and type sizes in view.

   Write the thresholds down before measuring. Show that each measurement separates a known-good screen from a known-bad one before relying on it.
3. **Independent rubric review (judgment).** Score the before and after screens against a written rubric of visual dimensions, such as hierarchy, balance, alignment, rhythm and spacing, color restraint, legibility and consistency with the design system. The reviewer is not the author. It scores the screens under neutral labels, never knowing who made them or which one is the change, and it never sees the author's explanation. It scores all screens in one pass on one scale, as `docs/policies/honest-evaluation.md` requires for any judge. Prefer a choice or a score on a fixed scale to free-form praise. Record the scores with the screens.
4. **Owner taste (last).** Show the owner the before/after screens, the measurements and the rubric scores together. This does not change the definition of done (SKILL.md "Done means"): the executable checks from layers 1 and 2 decide whether the work is done, and LIFECYCLE.md rows stay executable-only. The owner's taste is a separate item in the report's acceptance list, `Unverified – awaiting owner` until the owner confirms. Never report it as passed. When no owner can answer, keep that status and continue other work.

A visual change that can only be checked by eye does not take the TRIVIAL fast path. It takes the normal path, with these layers and the `Unverified – awaiting owner` status.

**Why**: A visual check done by eye alone is either skipped, or replaced by a check that cannot fail. Both end in a false pass. Much of what makes a screen read as balanced and calm is measurable: symmetry and proportion, a predictable rhythm, few competing elements and a restrained palette all lower the effort of reading it. Only the residue needs a person's taste. Measuring and scoring first leaves the owner a short, evidenced decision instead of a full review. (Sources: perceptual-fluency and layout-ratio findings and a ten-dimension design rubric compiled in this operator's design research; restated in EPDS's own words.)

Referenced from: `docs/PROTOCOL.md` — see `docs/policies/README.md` for why these are separate files.
