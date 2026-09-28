# Why these are separate files

Each file in `docs/policies/` is one rule, one file — following pstack's principle-independent-files
pattern (`docs/absorb-pstack.md` item 2: a small, independently linkable unit is easier to edit and
cross-reference than one rule buried in a longer list). `SKILL.md` § Scope and safety rules carries
each rule's own sentence (verbatim, not a paraphrase) plus a link here; read the linked file for the
full rule text, its rationale, and any cross-references. See `docs/LAYOUT.md` for how this directory
maps to the layout this repo's own `agent/policies/*.md` convention is modeled on.

Every file in this directory ends with a one-line `Referenced from:` pointer back to this file
instead of repeating this explanation in full (P12, `docs/absorb-pstack.md` item 2) — this file is
the one place to update if the reason for the split ever changes.
