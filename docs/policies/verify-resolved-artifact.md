# Verify the artifact that actually runs

Evidence about declared inputs (lockfiles, manifests, version strings) is not evidence about the artifact that runs; verify and record the resolved path or fingerprint of what was actually built and executed, and treat a verdict as valid only for the exact patch and check inputs it checked.

**Why**: A lockfile or version string says what was requested, not what the build resolved, linked, and tested — a cache, a path override, or a swapped payload can make two identical declarations produce different executables, so a green check on the declaration proves nothing about the binary. Record the resolved path or a fingerprint of the real output as part of the evidence. (docs/references/native-artifact-integrity-case.md — a reference case, cited here only for the general principle.)

**A verdict covers exactly the code it checked**: a pass, a review verdict or a GO holds only for the change it checked. When that code changes (a rebase, a conflict resolution, a fix on top), re-check before trusting it. Compare the patch (for example `git patch-id`), not the commit id: a rebase gives every commit a new id without changing its patch. A verdict binds to the patch and to the check's own inputs: its configuration, thresholds, fixtures, data and tool versions (the qualified-input contract below). Reuse an earlier pass (from an earlier session, another agent or a handoff) only when the patch and all of those inputs are unchanged; a change to the tests, the lint or check configuration, or any input of the check needs a fresh run. A prior trail says where to resume; its claims are re-checked against the goal on the real artifact, not taken from its self-report. (docs/absorb-pstack.md — pstack's `shipping` and `session-pickup` playbooks; restated in EPDS's own words.)

**Applies to tools too**: a test tool that auto-updates (browser, driver, SDK, CLI, packager) can drift away from its paired tool between runs, and a bare "is it installed" check misses that. Pin the matched pair once per version and bind its path, version, and archive SHA-256 to the candidate's evidence; a mismatch is a test-toolchain incident, not a product failure. This is guidance to follow and record; EPDS does not enforce it automatically.

**Freeze the whole qualified-input contract**: the verification meaning is set by more than one file. A single external config (for example `toolchain.json`) vanished mid-run and produced environment failures that looked like product failures. Treat every input that defines what a check means as one candidate-lifecycle-immutable contract: dependency/lock/config graph, real tool and runtime identity, target/profile/build defines, OS/device/browser matrix, commands and options, fixtures and certificates, thresholds/timeouts/retries, deploy snapshot, and helpers and external receipts.
- Ordinary files: copy atomically into a candidate-only durable area at start and record source, mode, and full SHA-256; every lane reads only the copy.
- Large installs that are impractical to copy: lifecycle protection plus the identity check below. If no automatic reclaimer honors the protection, mark it `manual protection only`.
- A partial or focused check is valid only when its scope differs and the contract hash is identical to the full run. A missing, altered, or unverifiable input makes the result `INVALID` or an environment/verifier failure; never use it as a product verdict or toward GO.
- Retention runs from the first focused check until independent GO, publication, and fresh-download verification end.
- Keep only the final (or in-progress) candidate copy. A failed or superseded attempt removes what it created when it exits, the number of candidate copies kept at once has a cap, each run records free disk at start and end, and a device test shuts down the simulators or emulators it started.
- Secrets stay in the private copy; public evidence carries only safe identifiers and hashes.

**One authority per input**: a recursive folder hash next to these identities is a second authority that reports false drift and forces needless copies. Use exactly one:
- Tracked source: the Git commit/tree only.
- Tools, SDKs and browsers: the recorded path, version/build and key, plus the identity of the executable actually selected.
- Dependencies: a semantic match of the tracked lock, package key and approved package root. Shared dependency caches are not candidate state.
- Generated or installed trees (symlink farms, generated build settings, vendored package folders, build workspaces): structural validation only, meaning required path and type, containment, exact symlink target, and agreement between lock files.
- Files outside Git (downloads, models, content, release artifacts, evidence): a full SHA-256 for each.

Attach this to the existing lifecycle table (at most 5 rows): freeze at the first row, verify the contract hash before each gate row, compare the same hash at GO and at publication/re-download, and record a missing or altered input as an environment/verifier failure in the failure row. Do not add a new checker, Stop hook, or repeated review; whether it caught anything, and at what cost, is judged at the next maintenance or retro. Source: a downstream project's release-verification incident.

Referenced from: `SKILL.md` § Scope and safety rules — see `docs/policies/README.md` for why these are separate files.
