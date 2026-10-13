#!/usr/bin/env node
// adapters/claude-code/stop-gate.mjs — end-of-turn gate for runtimes with a Stop hook (Claude Code, Codex; same rule, any model).
// Blocks the stop while LIFECYCLE.md is missing or `node bin/check.mjs LIFECYCLE.md` exits non-zero. After 3 blocks in one
// session the next stop passes and is logged. Stdin: hook JSON {session_id, cwd}. Stdout: {"decision":"block","reason":...} or {}.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const CAP = 3;
let input = {};
try { input = JSON.parse(fs.readFileSync(0, 'utf8') || '{}'); } catch {}
const cwd = input.cwd || process.cwd();
const sid = String(input.session_id || 'nosession').replace(/[^\w.-]/g, '_');
const state = process.env.EPDS_GATE_STATE || path.join(os.tmpdir(), 'epds-gate');
fs.mkdirSync(state, { recursive: true });
const counter = path.join(state, `${sid}.count`);
const log = (o) => fs.appendFileSync(path.join(state, 'gate.log'), JSON.stringify({ t: new Date().toISOString(), sid, cwd, ...o }) + '\n');

let reason = '';
if (!fs.existsSync(path.join(cwd, 'LIFECYCLE.md'))) {
  reason = 'LIFECYCLE.md is missing in the working folder. Copy the template (templates/LIFECYCLE.md in the epds skill), fill every row, and run `node <epds skill dir>/bin/check.mjs LIFECYCLE.md` until it exits 0 before finishing.';
} else {
  const r = spawnSync('node', [path.join(path.dirname(new URL(import.meta.url).pathname), '..', '..', 'bin', 'check.mjs'), 'LIFECYCLE.md'], { cwd, encoding: 'utf8' });
  if (r.status !== 0) reason = `LIFECYCLE.md check failed (exit ${r.status}):\n${(r.stdout + r.stderr).trim()}\nFix the rows, then finish.`;
}
if (!reason) { log({ result: 'pass' }); console.log('{}'); process.exit(0); }
let n = 0;
try { n = Number(fs.readFileSync(counter, 'utf8')) || 0; } catch {}
if (n >= CAP) { log({ result: 'cap-pass', blocks: n }); console.log('{}'); process.exit(0); }
fs.writeFileSync(counter, String(n + 1));
log({ result: 'block', n: n + 1 });
console.log(JSON.stringify({ decision: 'block', reason }));
