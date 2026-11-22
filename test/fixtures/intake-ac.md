# Intake: sample

Status: intake approved by owner on 2026-01-02

## 1. Intake block

### A. Why chain

| field | value |
|---|---|
| need | Users lose notes today; without this they keep losing them |
| start | 0 saved notes; no app exists |
| purpose | Keep personal notes safe |
| goal | A note added today is still shown after a reload |
| success/kill | SUCCESS: 2026-02-01, 10 notes persist across reloads / KILL: storage unavailable in the target browser |
| preserve | N/A: new project |

| metric | current | target | deadline | how measured | done check (oracle outside the author) |
|---|---|---|---|---|---|
| notes kept after reload | 0 | 10 of 10 | 2026-02-01 | reload and count | `node check.mjs index.html checks.json` exits 0 |

### C. Stages

| stage | goal | done check | resources | end state | condition to go on |
|---|---|---|---|---|---|
| 1 | notes persist | `node check.mjs index.html checks.json` exits 0 | 1 day, 0 | GitHub only | none |
