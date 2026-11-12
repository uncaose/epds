# Proposal: which pstack absorb gaps to adopt (H789 audit, 2026-11)

Status: proposal only. Nothing below is adopted yet; each "adopt now" row needs owner approval and
then its own change. Source: the 2026-11-13 independent audit recorded in `docs/absorb-pstack.md`
("Audit 2026-11-13"), which moved 31 rows from `Reinforced` to `Built (partial) (H789 audit)`.
This file is kept next to `docs/absorb-pstack.md` because the repo has no separate proposals folder
(`docs/LAYOUT.md`: `docs/` holds evidence flow and references).

Rule used: not every gap needs adding. Where a gap affects correctness, safety, or a promise EPDS
makes to the owner (evidence before done claims, owner-only decisions surfaced, gates not silently
skipped), recommend adopting it. Style, architecture taste and runtime-specific features stay out or
wait for a demonstrated repeated bottleneck (`/epds-upgrade` gate).

## Summary

| Recommendation | Count | Items |
|---|---|---|
| Adopt now | 14 | `poteto-mode`, `ketchup`, `boundary-discipline`, `migrate-callers-then-delete-legacy-apis`, `prove-it-works`, `sequence-verifiable-units`, `explain-the-number`, `autonomous-run`, `babysit`, `opening-a-pr`, `orchestrate` (one writer only), `pause-safely`, `perf-issue`, `prototype` |
| Later | 12 | `why`, `architect`, `reflect`, `show-me-your-work`, `laziness-protocol`, `foundational-thinking`, `subtract-before-you-add`, `experience-first`, `model-the-domain`, `encode-lessons-in-structure`, `authoring-a-skill`, `feature` |
| No | 5 | `recall`, `automate-me`, `figure-it-out`, `poteto-help`, `sharpen` |

Counts: 14 adopt now + 12 later + 5 no = 31 rows.

## Gap table

Risk = what can go wrong if the gap stays. Cost = effort to add it at doc/template level.

| # | Item (table, row) | Gap | Risk if missing | Cost to add | Recommendation | Reason |
|---|---|---|---|---|---|---|
| 1 | `poteto-mode` (Skills 1) | Chosen route's steps not copied into a checklist; skipped steps not accounted for | med | low | adopt now | A silently skipped step is a silently skipped gate; reuse the named-left-out rule in `choose-checks-by-risk-and-oracle.md`. |
| 2 | `why` (Skills 3) | No required code/history anchor; no evidence-category coverage map with null results | med | low | later | Improves rationale answers, but a wrong "why" does not ship broken code; add if retros show missed evidence. |
| 3 | `recall` (Skills 4) | No scoped reconstruction of prior conversations or shared-record sweep | low | high | no | Chat-history mining is runtime-specific; re-checking inherited claims on live state is already Playbooks row 20. |
| 4 | `architect` (Skills 6) | No mandatory two distinct design candidates, synthesis, or signature sketch | med | med | later | Valuable for large designs, costly for small ones; `templates/arena.md` already offers it as a choice. |
| 5 | `automate-me` (Skills 10) | No owner-preference discovery or personal-mode authoring | low | med | no | Personal modes are runtime features; the `/epds-upgrade` gate stays the only growth path. |
| 6 | `reflect` (Skills 13) | No active-conversation review sorting findings into accepted/rejected/backlog | low | low | later | `templates/retro.md` already captures learning; add only if retros miss findings. |
| 7 | `figure-it-out` (Skills 18) | No bespoke phased workflow with baseline and per-unit hypothesis loop | low | med | no | A per-task custom workflow can route around EPDS gates; the router fallback is the safer default. |
| 8 | `show-me-your-work` (Skills 19) | No append-only run trail of checkpoints, pivots and results, independently reviewed | med | med | later | Helps audits of long runs; LIFECYCLE rows and ADRs cover the decisions that gate release today. |
| 9 | `ketchup` (Skills 31) | Catch-up need not list changes since the owner's last message or every pending owner decision | high | low | adopt now | Surfacing every owner-only decision is an EPDS promise; one missed decision is a missed owner gate. |
| 10 | `poteto-help` (Skills 33) | Help does not answer the specific question with a source after checking setup state | low | low | no | Convenience only; the command table and install guide answer the same questions. |
| 11 | `sharpen` (Skills 34) | No professional-gap question or prompt rewrite | low | low | no | Prompt polishing is style, not a delivery gate. |
| 12 | `laziness-protocol` (Principles 1) | No rule to consolidate a repeated decision into one source of truth | med | low | later | Drift between copies causes bugs, but no repeated failure is recorded yet; revisit on first drift incident. |
| 13 | `foundational-thinking` (Principles 2) | No access-pattern-driven structure or scaffold-before-features rule | low | low | later | Architecture advice the project owns; `/spec` data contract already forces the question. |
| 14 | `subtract-before-you-add` (Principles 5) | No explicit remove-before-add order | low | low | later | Scope and smallest-change rules already limit growth; ordering is a refinement. |
| 15 | `experience-first` (Principles 8) | No rule settling convenience-versus-experience tradeoffs for users incl. library consumers | low | low | later | Product track already weighs user outcomes; add if a retro shows a tradeoff went the wrong way. |
| 16 | `model-the-domain` (Principles 11) | No rule to encode invariants so invalid states cannot be represented | med | med | later | Strong practice but stack-dependent; EPDS stays stack-neutral until a repeated defect justifies it. |
| 17 | `boundary-discipline` (Principles 12) | No rule placing guards at the system boundary, trusting internal types, pure core | high | low | adopt now (boundary guard only) | Validating untrusted input at the boundary is a safety rule next to `untrusted-external-input.md`; the pure-core part stays later. |
| 18 | `migrate-callers-then-delete-legacy-apis` (Principles 15) | No obligation to migrate internal callers in the same wave and update contract tests | med | low | adopt now | A deleted or changed path with an unmigrated caller is a correctness break; one line in `smallest-reversible-change.md`. |
| 19 | `prove-it-works` (Principles 17) | No direct inspection of real output for every task; no scripted check whenever possible | high | low | adopt now | Evidence before a done claim is EPDS's core promise; make inspection of the real output unconditional. |
| 20 | `sequence-verifiable-units` (Principles 19) | Units need only be verifiable, not checked before the next starts | med | low | adopt now | Unchecked units stack failures and hide which change broke; one line in `templates/pr-landing.md`. |
| 21 | `encode-lessons-in-structure` (Principles 23) | Retro does not prefer enforceable structure over prose | low | low | later | `docs/policies/make-repeated-mistakes-impossible.md` already holds the prevention ladder; a link from the retro can come with the next retro change. |
| 22 | `explain-the-number` (Principles 24) | No predeclared decision-changing result and noise floor; limiter evidence and eval-trial scrutiny weaker | med | low | adopt now | A number without a predeclared threshold can justify any decision; extends `vet-measurements.md`. |
| 23 | `authoring-a-skill` (Playbooks 4) | No validation of a new skill's frontmatter and links or structural test cases | low | low | later | EPDS's own `test/layout.selftest.mjs` already checks its links; add when EPDS ships skill authoring. |
| 24 | `autonomous-run` (Playbooks 5) | No per-iteration predicate check, discard of failed attempts, or per-iteration checkpoint | med | low | adopt now | Unattended runs that keep failed attempts produce wrong results nobody saw; the owner-gate conflict stays rejected. |
| 25 | `babysit` (Playbooks 8) | No classification of a CI failure before retry; no one-retry limit | med | low | adopt now | Blind retries turn real failures into "flaky"; fits `honest-evaluation.md` § Flaky-check quarantine. |
| 26 | `feature` (Playbooks 10) | No four-part throughput checkpoint; arena optional when several shapes are valid | low | med | later | Throughput checkpoint is process taste; a mandatory arena costs several attempts per feature. |
| 27 | `opening-a-pr` (Playbooks 13) | PR body lacks explicit scope and omissions and a blast-radius line | med | low | adopt now | A reviewer must know what was not done and what else can break; two lines in `templates/pr-landing.md`. |
| 28 | `orchestrate` (Playbooks 14) | No one-writer-per-unit rule, no different-model-family verifier, no pilot before fan-out | med | low | adopt now (one writer only) | Two writers on one unit cause lost or conflicting changes; cross-family review and pilots stay later because EPDS is agent-neutral. |
| 29 | `pause-safely` (Playbooks 15) | No finish-or-back-out of the atomic step, no durable edits, no cold-start resume note | high | low | adopt now | Pausing mid-step can leave half-applied state or lose work; a safety rule for `lean-handoff.md`. |
| 30 | `perf-issue` (Playbooks 16) | No required baseline trace, trace-planned fix, or post-fix trace comparison | med | low | adopt now | A performance fix claim without before/after evidence breaks the evidence promise; adopt together with row 22. |
| 31 | `prototype` (Playbooks 17) | No isolated throwaway artifacts; no observation on the matching surface | med | low | adopt now | Prototype code leaking into the product, or a result observed on the wrong surface, misleads the decision. |
