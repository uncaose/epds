# EPDS References

One file per external perspective or pattern the user has actually surfaced (a repo, article,
thread, or search result). EPDS uses these as evidence before falling back to general model
knowledge — see `SKILL.md` step 4 ("Trusted public sources only when internal evidence lacks a
material fact"). Empty by default: nothing goes here until a real source is captured, usually via
`/epds-reference <URL>`.

See also `epds/trusted-sources.json` (config-managed list of trusted public sources, editable with
`epds sources list|add|remove|show`; `docs/EPDS.md` § Trusted public sources config) — a shorter,
structured companion to this file's per-source Markdown records, checked first by `SKILL.md` step 4
and surfaced by `/epds-status` when a bottleneck names a specific perspective.

## Store: local or external

A project may already have its own place for collected research (e.g. a `research/` archive with
an `INDEX.md`, a `wiki/`, or a `knowledge/` tree). Don't duplicate it — point at it.

Config file: `epds/references.json` at the project root (not inside `.claude/skills/epds/`, which
is the installed skill copy and gets replaced on upgrade).

```json
{
  "store": "local",
  "external": { "raw_dir": null, "canon_dir": null, "index": null }
}
```

- `store: "local"` (default) — references live under `docs/references/` as described below.
- `store: "external"` — references live in the project's own structure. `external.raw_dir` =
  where raw/unprocessed captures go, `external.canon_dir` = where curated/canon knowledge goes,
  `external.index` = the catalog file to update. `docs/references/INDEX.md` then holds pointers
  only (pattern/perspective → external file path), no reference bodies.

`/epds-reference` decides once: if `epds/references.json` doesn't exist yet, look for an existing
structure (`research/INDEX.md`, `wiki/`, `knowledge/`) before defaulting to local. If found, ask
the owner once which to use (an owner-only decision under the EPDS evidence-first protocol), write
the answer to `epds/references.json`, and never ask again.

### Field mapping when `store: "external"` points at a `research/INDEX.md`-style catalog

| EPDS frontmatter field | research INDEX.md column | Note |
|---|---|---|
| `source` | (URL, inside the R#### file itself) | INDEX row's 출처 column is the source *type* (github/perplexity/web), not the URL |
| `kind` | 유형 | approximate — research uses finer-grained types (tool-research, design-report, ...) |
| `patterns` | 태그 | |
| `perspectives` | — no equivalent column | keep as EPDS-only metadata in the pointer entry |
| `applies_to` | — no equivalent column | EPDS-only |
| `evidence_grade` | — no exact equivalent | research's 평가 (1-5 score) and 평가 페르소나 grade *quality*, not *source trust*; set `evidence_grade` by hand |
| `captured` | 날짜 | |
| (file itself) | ID (`R####`, links to the source file) | |

## File

One reference = one file: `docs/references/<slug>.md` (or, when `store: "external"`, an entry in
the external `index` file — this file only holds the pointer).

## Frontmatter

```yaml
---
source: <URL>
kind: repo | article | thread | search
perspectives: [product, delivery, evidence, agent-ops, ux, cost, safety]   # >=1, more allowed
patterns: [<pattern-name>, ...]                                            # >=1
applies_to: [direction, problem, hypothesis, experiment, spec, build, verify, release, observe, retro]
evidence_grade: official | community | self
captured: YYYY-MM-DD
---
```

- `perspectives` is open — add a new tag when an existing one doesn't fit, then add it to
  `INDEX.md`'s perspective list.
- `evidence_grade: self` marks a project's own material used as a worked example, not an external
  source (see `example-evidence-first-delivery.md`).

## Body

1. Three-line lede: what this source is, why it's relevant, where in EPDS it applies.
2. Per pattern: 1-3 lines of "lead" (실마리) — the concrete unblock this pattern gives, not a
   restatement of the pattern's definition.
3. Quote the original, at most 5 lines, for attribution. Do not paste the full source.

## Index

After adding or editing a reference, update `INDEX.md` so `/epds-status` and `/epds-reference`
can point a stuck perspective at the right file.
