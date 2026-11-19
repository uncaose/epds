# Contain what the agent executes

Block reads of secret files (env files, keys, credentials) with deny rules so they never enter context, enable the tool's OS-level sandbox where one exists scoped to what the work needs (writable paths, allowed hosts, local ports) and record any incompatibility instead of silently disabling it, run long unattended work in an isolated environment that holds no local secrets, and make a gate hook that must stop and report a failure use the blocking exit code its host defines.

**Why**: Deny rules only see the commands the agent issues; code it runs indirectly (test runners, third-party packages) can still read secrets or reach the network, so the sandbox covers what rules cannot, and a recorded incompatibility keeps the next run from guessing. A non-blocking exit code lets a failing gate pass silently, which is a gate that is not one (`docs/policies/every-check-seen-to-fail.md`). Secret handling itself is `docs/policies/secrets-and-pii.md`; this policy is its enforcement side, chosen as a separate file because that one is a one-sentence rule indexed verbatim and this one adds mechanisms.

Referenced from: `docs/PROTOCOL.md` § Scope and safety rules — see `docs/policies/README.md` for why these are separate files.
