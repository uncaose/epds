---
source: owner-provided native build incident, 2026-10-14
kind: thread
perspectives: [self, delivery, evidence, agent-ops]
patterns: [resolved-artifact-provenance, cache-invalidation-boundary]
applies_to: [build, verify, release, retro]
evidence_grade: self
captured: 2026-10-14
---

# Reference case: identical dependency locks, different native artifacts

An owner-provided native build incident, recorded only for EPDS to reference when considering improvements.
This is not an established EPDS defect, an accepted change request, or a new mandatory gate.
It illustrates a boundary between dependency selection evidence and the executable actually tested.

## Observed case

A project checked lockfiles and resolved package metadata before running native tests. An isolated package cache contained an upstream native library where that project required a patched build, under the same package name and version. The metadata stayed identical. Static analysis passed, then a runtime guard rejected a missing patch symbol after the expensive build. Installing qualified patched artifacts resolved the bounded operation.

## Potentially useful patterns

- **Resolved artifact provenance:** distinguish declared version, actual selected path, source/patch/toolchain fingerprints, and final linked output. Lockfile equality alone does not establish all four.
- **Cache invalidation boundary:** invalidate affected generated outputs when relevant inputs change. A blanket purge can remove evidence or other projects' state and can download the same unsuitable upstream payload again.
- **Negative verification:** unchanged lockfile plus a swapped native payload is a useful test case for a build guard. Check that rejection happens before the protected command runs.
- **Honest enforcement claims:** instructions, optional launchers and mandatory runner checks provide different coverage. Record direct-entrypoint gaps rather than claiming universal prevention.

The owner asked that the incident be shared as reference. The initial GitHub issue was the reporting agent's wrong choice of channel; it was closed as not planned. No EPDS code or policy adoption is implied. Private logs, machine paths, project source and user data are intentionally omitted.
