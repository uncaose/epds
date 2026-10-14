# Verify the artifact that actually runs

Evidence about declared inputs (lockfiles, manifests, version strings) is not evidence about the artifact that runs; verify and record the resolved path or fingerprint of what was actually built and executed.

**Why**: A lockfile or version string says what was requested, not what the build resolved, linked, and tested — a cache, a path override, or a swapped payload can make two identical declarations produce different executables, so a green check on the declaration proves nothing about the binary. Record the resolved path or a fingerprint of the real output as part of the evidence. (docs/references/native-artifact-integrity-case.md — a reference case, cited here only for the general principle.)

Referenced from: `SKILL.md` § Scope and safety rules — see `docs/policies/README.md` for why these are separate files.
