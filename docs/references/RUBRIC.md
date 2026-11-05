# Reference Evaluation Rubric — `/epds-reference` 10 items

source: table 7 provided by the human (the evaluation criteria of "find a highly complete repository like ai-job-search and absorb it"). When `/epds-reference
<URL>` (`adapters/claude-code/commands/epds-reference.md`) analyzes an external repository, tool or framework, it scores with this
rubric and cites each item's good/warning signals as the evidence for the final recommendation (Adopt/Adapt/Observe/Reject).
## 10 items

| # | Evaluation item | Check question | Good signal | Warning signal |
|---|---|---|---|---|
| 1 | Real problem | Which repeated task/risk does it solve? | Clear use case and target user | Only an "AI team", artifacts unclear |
| 2 | Artifact contract | What file, schema or template does the result end up as? | YAML/JSON/MD/code contract | Chat output only |
| 3 | Verification | What judges the AI's result? | lint, test, E2E, compile, eval, CI | "The AI reviewed it" |
| 4 | Tooling | Is the repeated verification done in code? | tools/scripts/CLI/CI | Only "please check" in the prompt |
| 5 | Failure handling | Are stops, retries and fallbacks defined? | Error messages, regression, rollback | Only a happy-path demo |
| 6 | Maintainability | Are the change history and contributions healthy? | Releases, issues, tests, docs kept up to date | Stale docs, broken examples |
| 7 | Security | Handling of secrets, personal data and external input | Least privilege, `.env.example`, scanning, policy | Keys in files, trusting external prompts |
| 8 | Portability | Does the core survive without a specific model/IDE? | Tool-neutral docs, CLI, tests | Tied to a specific chat UI |
| 9 | Cost | Are call, API and operating costs controlled? | Cache, budget, fallback, local run | Assumes unlimited calls |
| 10 | Product linkage | Do user value and business metrics improve? | Success metrics, scenarios | Only developer-productivity claims |

## Wiring

Step 4 ("Report the recommendation") of `adapters/claude-code/commands/epds-reference.md` names which of these 10 items
had a warning signal confirmed, and writes the Adopt/Adapt/Observe/Reject judgment on the basis of those items — a report with only a grade and no
evidence is rejected (same as the §0 principle: no artifacts with only conclusions and no flow).

## Scoring examples (these 8 sources, summary)

| Source | Strong items | Weak/unconfirmed items |
|---|---|---|
| [gstack](gstack.md) | 1(Real problem), 6(Maintainability: 890 open issues = active) | 9(Cost: many commands, heavy initial flow) |
| [superpowers](superpowers.md) | 3(Verification: TDD/debugging skills built in), 8(Portability: 6 runtimes supported) | 10(Product linkage: limited to engineering execution quality) |
| [ouroboros](ouroboros.md) | 4(Tooling: CLI+MCP), 2(Contract: acceptance spec) | 9(Cost: multiple LLM providers, budget unconfirmed), 7(Security: PostHog telemetry opt-out unconfirmed — R0229) |
| [ai-job-search](ai-job-search.md) | 2,3,4,7(all of README table 3) | 6(real-use activity relative to star count unverified) |

The full evidence for each source: see `docs/references/<slug>.md`.
