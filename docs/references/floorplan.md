---
source: https://github.com/haydenschmitty/floorplan
kind: repo
perspectives: [agent-ops, delivery]
patterns: [code-structure-map, local-offline-map]
applies_to: [build, verify, release, observe]
evidence_grade: community
captured: 2026-11-19
---

## Analysis

Floorplan is an MIT-licensed local tool that scans a code repository and writes one self-contained HTML map of its structure
(modules, files, import links, health hints). It is a code layer for developer, operations and recovery documents. It does not
replace the document position line (`Position:` in `docs/PROTOCOL.md`), and it is not meant for public documents.

1. Local code-structure map: scan and build run offline with no model call and no outbound network call; the repository tree is
   the only input, and the output is a single HTML file (about 2 MB for a 400-file repository), not SVG, PNG or mermaid.
2. Optional extras are separable: "Ask" and "open in an agent CLI" only run when its local server is up; one waitlist URL is sent
   only if a user types an email into the map. An unattended mode starts no server and no browser.
3. Limits: no dedicated "you are here" marker (deep links highlight one card); shell scripts yield few import links; Dart is
   recognised only lightly and is not in the supported language list; the map goes stale without a refresh.

## Measured

2026-11-19: scan plus build on 414 code files took under 1 second, zero dependencies, no API key; grep of its sources found
network calls only to its own local server and the waitlist form. A Dart repository was not tried.

## How EPDS uses it

Build/Verify/Release/Observe: an optional attachment to usage, operations and recovery guides that need a code structure map.
Not adopted into EPDS commands; this entry only records the lead and its scope.
