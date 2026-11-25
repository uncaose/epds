#!/usr/bin/env node
// test/check-all.selftest.mjs — check-all: pass case, fail case (missing intake), a11y skipped, one-line summary format.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
const root = path.join(path.dirname(new URL(import.meta.url).pathname), '..');
const run = (cwd, env = {}) => spawnSync('node', [path.join(root, 'bin', 'check-all.mjs')], { cwd, encoding: 'utf8', env: { ...process.env, EPDS_LEVEL: 'medium', EPDS_A11Y_MODULES: '/nonexistent', ...env } });
let fail = 0;
const ok = (l, c) => { console.log(`  ${c ? 'ok  ' : 'FAIL'} ${l}`); if (!c) fail += 1; };
const mk = () => fs.mkdtempSync(path.join(os.tmpdir(), 'epds-ca-'));
const H = '| state | sees | works | detail | how executed |\n|---|---|---|---|---|\n';

const d1 = mk();
fs.writeFileSync(path.join(d1, 'intake.md'), '# Intake: t\nStatus: draft\nPurpose: a tiny app | Done check: node t.js\n');
fs.writeFileSync(path.join(d1, 'LIFECYCLE.md'), `# L\n\n${H}| first visit | empty | add | clear | |\n`);
fs.writeFileSync(path.join(d1, 'index.html'), '<html></html>');
const r1 = run(d1);
const l1 = r1.stdout.trim().split('\n');
ok('pass case exit 0 (a11y skipped)', r1.status === 0 && /^SKIP a11y/m.test(r1.stdout) && /^PASS intake/m.test(r1.stdout) && /^PASS lifecycle: 1 rows/m.test(r1.stdout));
ok('summary is the last line and one line per check', /^EPDS check: 2 passed, 0 failed, 2 skipped$/.test(l1[l1.length - 1]) && l1.length === 5);

const d2 = mk();
const r2 = run(d2);
ok('missing intake -> exit 1, FAIL line', r2.status === 1 && /^FAIL intake/m.test(r2.stdout) && /, [1-9]\d* failed,/.test(r2.stdout));

const d3 = mk();
fs.writeFileSync(path.join(d3, 'intake.md'), '# Intake: t\nStatus: draft\nPurpose: a tiny app | Done check: node t.js\n');
const r3 = run(d3, { EPDS_LEVEL: 'low' });
ok('low level skips lifecycle and a11y', r3.status === 0 && /^SKIP lifecycle/m.test(r3.stdout) && /^SKIP a11y/m.test(r3.stdout));
ok('medium without LIFECYCLE.md fails', run(d3).status === 1);

const t = spawnSync('node', [path.join(root, 'bin', 'check-all.mjs'), '--template'], { encoding: 'utf8' });
ok('--template prints the skeleton', t.status === 0 && /^# Intake:/.test(t.stdout));
if (fail) process.exit(1);
console.log('PASS check-all.selftest');
