# Lean handoff and report

Hand off and report with the lifecycle table (at most 5 rows, each linked to a check that was run) plus one evidence line per check (command, exit code, commit or file hash; for a manual check, the steps taken and what was observed); collect review findings into one pass, and do not restate history in prose.

**Why**: A reader who receives work needs to know what was checked and what the result was, not how the work unfolded. Reusing the acceptance criteria and checks that already exist keeps the handoff short and verifiable, one consolidated review pass is cheaper and clearer than repeated partial ones, and prose that retells history adds length without adding evidence.

**Delivery is not acceptance**: before handing off to another session or agent, confirm the receiver's role, host, working path and actual address. Keep four states apart: registered, delivered, read, applied. A message id or an "accepted" receipt shows only registration; report "sent, read unconfirmed" until the receiver's read or reply is observed. Two sessions in the same folder or on the same model are not the same session. After a temporary session finishes, keep its results and drafts, then close it.

Referenced from: `docs/PROTOCOL.md` § Scope and safety rules — see `docs/policies/README.md` for why these are separate files.
