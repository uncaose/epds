# bin/check.mjs — acceptance checks for web artifacts

`node bin/check.mjs <html> <checks.json>` — opens the file in headless Chromium, one fresh browser context per check.
Prints `PASS|FAIL <name>` per check and `N/M checks passed`. Exit 0 = all pass, 1 = any fail, 2 = playwright or Chromium missing (the message says how to install; `NODE_PATH` = dir holding playwright-core, `EPDS_CHROME` = chrome path).

```json
{"checks": [
  {"name": "add a note, reload, still listed",
   "steps":  [{"type": "#in", "text": "milk"}, {"press": "Enter"}, {"reload": true}],
   "expect": [{"text": "milk"}, {"count": "li", "eq": 1}, {"consoleErrors": 0}]}
]}
```

Steps: `{"click": sel}` `{"dblclick": sel}` `{"type": sel, "text": s}` `{"press": key}` `{"reload": true}` `{"wait": ms}`.
Expects: `{"text": s}` (page text contains s) · `{"count": sel, "eq": n}` · `{"consoleErrors": n}`.
