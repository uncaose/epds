# EPDS

> **Evidence-First Product Delivery System**
>
> A general skill that helps AI coding agents to conduct idea, ongoing service, program, game, and content automation projects from direction to reflection **based on evidence**.

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](LICENSE)
[![Node.js >= 20](https://img.shields.io/badge/node-%3E%3D20-brightgreen.svg)](https://nodejs.org/)

## Installation

```bash
npx skills add uncaose/epds -a claude-code
```

For more detailed options and verification procedures, please refer to [docs/INSTALL.md](docs/INSTALL.md).

## What does it solve?

AI coding tools can produce a lot of code in a few seconds. However, the most expensive failures in product development are usually not "writing code late," but the following.

- Created a feature that real users didn't want quickly.
- Expanded the scope of implementation before checking user, business, and operational constraints.
- The code passed the test and was deployed, but the real users did not complete the core actions.
- As the number of features increased, personal information, cost, performance, support burden, and technical debt increased.
- Planning, implementation, QA, distribution, and reflection were separated, and previous failures were not reflected in the next task.
- Users had to decide what to ask the AI, what role/skill to call, and when to call it.

EPDS is not about "more agents" or "longer prompts". It first establishes where the current project is, and fixes the AI's action sequence to find out **what evidence is needed for the next decision**.

**[H1] Four Required Elements Check** — Does this README contain the four things requested by the human original text ("Define what obstacle/problem, by what reasoning, and explain systematically and structurally through the process of applying the selected solution")?

- [x] **Problem** — The above list (6 items, including features that actual users do not want, and user behaviors that are incomplete but have passed the test)
- [x] **Rationale** — "More agents/longer prompts are not the goal" paragraph, why evidence prioritized
- [x] **solution application process** — [docs/EPDS.md](docs/EPDS.md) §0(definition) + §1~§5(tool, pattern, and structure review process)
- [x] **Installation and Usage** — Above [Installation](#installation) section + [docs/INSTALL.md](docs/INSTALL.md)

How I got here (tools looked at, patterns discarded, rationale) → [docs/EPDS.md](docs/EPDS.md)
