# Arena: [Question being settled by comparison]

Use when the riskiest unknown is *which of several approaches is best*, not *whether one works*.
N independent attempts, judged, owner picks. See `docs/COMMANDS.md` `/experiment` ↳ N-parallel.

## Question

What decision does this comparison settle?

## Attempts (N ≥ 2)

| # | Approach | Owner/agent | Constraints held equal |
|---|---|---|---|
| 1 | | | |
| 2 | | | |

Each attempt runs against the same input, budget, and time limit. Attempts must be independent —
no attempt sees another attempt's output before judging. Also covers the "different independent
slices, one aggregated report" shape (pstack's `swarm`): list each slice as its own row instead of
each attempt — still one owner decision at the end, not a separate parallel-execution command.

## Judging

- Judge(s): human, or a cross-model judge distinct from every attempt's own model/session
  (production ≠ verification — same discipline as `/verify`; if `epds/models.json` `roles.critic`
  is set, use it here too).
- Criteria (fixed before attempts are judged, not after):
  -
- Judging is blind where practical (attempts unlabeled by source).

## Result

| # | Score/verdict | Why |
|---|---|---|

## Decision

Human selects. The panel/judge ranks candidates and surfaces tradeoffs — ranking is not deciding;
the owner makes the final call.

## Permanent learning

What in this comparison should be encoded (a template, a policy, a default) so the next
occurrence of this question doesn't re-run the full arena from scratch?
