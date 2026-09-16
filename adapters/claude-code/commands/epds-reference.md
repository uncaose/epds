---
description: Analyze an external repository, tool, or framework before adopting its patterns.
argument-hint: "<URL>"
---

Use the installed `epds` skill and execute the `reference <URL>` procedure.

Do not install, copy, or add dependencies from the reference before analysis and approval.

After analysis, if the source has a real, reusable lead (not merely "reviewed, rejected"), save it:

0. Read `epds/references.json` at the project root. If it does not exist yet: check for an
   existing knowledge structure (`research/INDEX.md`, `wiki/`, `knowledge/`). If none exists,
   write `epds/references.json` with `store: "local"` and proceed with step 1 — do not ask.
   If one exists, ask the owner once (owner-only decision) whether to use it or store locally
   under `docs/references/`; write the answer to `epds/references.json` and never ask again on
   later runs. Template: `templates/epds-references.json`.
1. `store: "local"` — write `docs/references/<slug>.md` (slug = short kebab-case name for the
   source). Frontmatter: `source`, `kind` (repo|article|thread|search), `perspectives` (>=1 tag),
   `patterns` (>=1 name), `applies_to` (EPDS stages), `evidence_grade` (official|community|self),
   `captured` (today's date). Format and body rules: `docs/references/README.md`.
   `store: "external"` — write the capture into `external.raw_dir` (and, once curated,
   `external.canon_dir`) following that store's own conventions, and add an entry to
   `external.index`. Field mapping to a `research/INDEX.md`-style catalog: `docs/references/README.md`.
2. Update `docs/references/INDEX.md`: add the file (or, for `external`, the pointer path) under
   each of its patterns and perspectives.
3. Report the recommendation (Adopt/Adapt/Observe/Reject) and where it was saved.
