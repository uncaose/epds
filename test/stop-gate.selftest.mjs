#!/usr/bin/env node
// test/stop-gate.selftest.mjs — adapters/claude-code/stop-gate.mjs: end-of-turn gate shared by Claude Code and Codex Stop hooks.
// Blocks (JSON {"decision":"block","reason"}) while LIFECYCLE.md is missing or `check.mjs LIFECYCLE.md` exits non-zero;
// passes silently-with-{} when it exits 0; after 3 blocks in one session the 4th stop passes and is logged.
process.env.EPDS_LEVEL = 'high'; // v10: this test covers the high-level gate
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
const root = path.join(path.dirname(new URL(import.meta.url).pathname), '..');
const gate = path.join(root, 'adapters', 'claude-code', 'stop-gate.mjs');
let fail = 0;
const ok = (l, c) => { console.log(`  ${c ? 'ok  ' : 'FAIL'} ${l}`); if (!c) fail += 1; };
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'epds-gate-'));
const state = path.join(tmp, 'state');
const stop = (cwd, session) => spawnSync('node', [gate], { input: JSON.stringify({ session_id: session, cwd, hook_event_name: 'Stop' }), encoding: 'utf8', env: { ...process.env, EPDS_GATE_STATE: state } });
const work = path.join(tmp, 'work'); fs.mkdirSync(work);

const r1 = stop(work, 's1');
ok('no LIFECYCLE.md -> exit 0 with block JSON naming LIFECYCLE.md', r1.status === 0 && JSON.parse(r1.stdout).decision === 'block' && /LIFECYCLE\.md/.test(JSON.parse(r1.stdout).reason));

const tpl = fs.readFileSync(path.join(root, 'templates', 'LIFECYCLE.md'), 'utf8');
fs.writeFileSync(path.join(work, 'LIFECYCLE.md'), tpl);
const r2 = stop(work, 's1');
ok('unfilled LIFECYCLE.md -> block, reason carries the check output', JSON.parse(r2.stdout).decision === 'block' && /FAIL/.test(JSON.parse(r2.stdout).reason));

const r3 = stop(work, 's1');
ok('third block still blocks', JSON.parse(r3.stdout).decision === 'block');
const r4 = stop(work, 's1');
ok('4th stop in the same session passes ({}), and is logged', r4.status === 0 && r4.stdout.trim() === '{}' && /cap/.test(fs.readFileSync(path.join(state, 'gate.log'), 'utf8')));

const ex = (tpl.split(/^## Example.*$/m)[1] || '').replace(/\.json/g, ''); // other-tool rows: the json re-run is covered by lifecycle.selftest
fs.writeFileSync(path.join(work, 'LIFECYCLE.md'), ex);
const r5 = stop(work, 's2');
ok('filled LIFECYCLE.md (check exit 0) -> pass {}', r5.status === 0 && r5.stdout.trim() === '{}');

const r6 = stop(work, 's2');
ok('pass does not consume the block budget of another session', JSON.parse(stop(path.join(tmp, 'work2'), 's3').stdout).decision === 'block' && r6.stdout.trim() === '{}');
console.log(fail ? `FAIL (${fail} failures)` : 'PASS (0 failures)');
process.exit(fail ? 1 : 0);
