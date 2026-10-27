# Verify the artifact that actually runs

Evidence about declared inputs (lockfiles, manifests, version strings) is not evidence about the artifact that runs; verify and record the resolved path or fingerprint of what was actually built and executed.

**Why**: A lockfile or version string says what was requested, not what the build resolved, linked, and tested — a cache, a path override, or a swapped payload can make two identical declarations produce different executables, so a green check on the declaration proves nothing about the binary. Record the resolved path or a fingerprint of the real output as part of the evidence. (docs/references/native-artifact-integrity-case.md — a reference case, cited here only for the general principle.)

**Applies to tools too**: a test tool that auto-updates (browser, driver, SDK, CLI, packager) can drift away from its paired tool between runs, and a bare "is it installed" check misses that. Pin the matched pair once per version and bind its path, version, and archive SHA-256 to the candidate's evidence; a mismatch is a test-toolchain incident, not a product failure. This is guidance to follow and record; EPDS does not enforce it automatically.

Referenced from: `SKILL.md` § Scope and safety rules — see `docs/policies/README.md` for why these are separate files.
