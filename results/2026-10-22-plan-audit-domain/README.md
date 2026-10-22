# Plan-stage audit on domain tasks (R0408): why `medium` gets a conditional plan-audit step

**Result: PARTIAL (34 of 36 runs; direction only, n 11-12 per cell).** Sonnet 5.5, 3 cells x 6 domain tasks, USD 13.31.

| cell | n | fulfil | cost $ | secs |
|---|---|---|---|---|
| B (build only) | 11 | 0.667 | 0.162 | 67 |
| BCUR (brief, audit, revise, build; the flow now in `templates/plan-audit.md`) | 11 | 0.885 | 0.723 | 311 |
| BG (grounded audit variant) | 12 | 0.722 | 0.487 | 177 |

Fulfil = mean of two browser-driving judge lanes. BCUR costs 4.5x B and takes 4.6x as long, so the step is conditional: only vague requests or domain rules (money, dates or times, bookings, health, law, units).

## Decision lines
| line | measured | verdict |
|---|---|---|
| BG - B fulfil >= +0.10 | +0.056 [-0.043, +0.155] | not shown |
| BG - BCUR >= +0.05 | -0.163 [-0.251, -0.071] | G not better |
| cost(BG)/cost(B) <= 3.0 | 3.01 [2.65, 3.37] | outside by a hair |

## Limits
- Post-hoc comparison, not a preregistered test of this exact change; direction only.
- The BG gap is one task: T3 (meeting room), where the revise step added a backend the file-opened page could not reach. G derailed on T3.
- n 11-12 per cell; per-task n 1-2. 2 of 36 runs were not run (cost guard).
- The audit failed 11 of 11 plans, so the effect is the bundle plan + revise, not the audit verdict itself.

## Modes
- `auto` (default): revise once for blocking findings; `interview`: ask only product-meaning blocking findings (max 3), then revise; `off`: skip plan-audit. Set by `epds/audit-mode` or env `EPDS_AUDIT`.
- Interview effect is not measured (needs a simulated answerer); auto is the measured flow; off equals the pre-a75aa2e behavior.
