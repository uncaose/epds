# Attack the premise after repeated failure

If two or more fixes built on the same premise fail the same gate, stop patching and re-examine the underlying premise before the next attempt.

**Why**: Two fixes that share a premise both failing the same gate is evidence the diagnosis, not just the patches, may be wrong; another blind patch on an unexamined premise usually compounds the same mistake instead of correcting it. Re-examining the premise is itself the smaller move at that point — cheaper than another guess. (docs/absorb-pstack.md — pstack's `attack-the-premise` principle, `README.md:206`: "Apply when two or more fixes that share one premise have failed the same gate... question the premise instead of writing another fix that assumes it.")

Referenced from: `SKILL.md` § Scope and safety rules — see `docs/policies/README.md` for why these are separate files.
