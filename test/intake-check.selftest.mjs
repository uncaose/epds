#!/usr/bin/env node
// test/intake-check.selftest.mjs — bin/intake-check.mjs passes one full sample and fails every negative control (every-check-seen-to-fail).
// `node test/intake-check.selftest.mjs` -> exit 0.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = path.join(path.dirname(new URL(import.meta.url).pathname), '..');
const bin = path.join(root, 'bin', 'intake-check.mjs');
const sample = fs.readFileSync(path.join(root, 'test', 'fixtures', 'intake-ok.md'), 'utf8');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'intake-'));
let fail = 0;
const run = (txt) => { const f = path.join(tmp, 'intake.md'); fs.writeFileSync(f, txt); return spawnSync('node', [bin, f], { encoding: 'utf8' }); };
const ok = (label, cond) => { console.log(`  ${cond ? 'ok  ' : 'FAIL'} ${label}`); if (!cond) fail += 1; };
const mut = (from, to) => { if (!sample.includes(from)) throw new Error(`sample lacks: ${from}`); return sample.replace(from, to); };

ok('full sample exits 0', run(sample).status === 0);
ok('blocked row with non-approved status exits 0 and is reported', (() => { const r = run(mut('intake approved by owner on 2026-01-02', 'draft').replace('| required | owner | decided |\n| form', '| required | owner | blocked |\n| form')); return r.status === 0 && /blocked/.test(r.stdout); })());

const negatives = [
  ['chain: empty need', mut('| need | Users lose notes today; without this they keep losing them |', '| need | <why> |'), 'chain: "need" is empty'],
  ['chain: preserve N/A without reason', mut('N/A: new project', 'N/A'), 'preserve'],
  ['measure: empty deadline', mut('| 10 of 10 | 2026-02-01 |', '| 10 of 10 |  |'), '"deadline" is empty'],
  ['measure: no done check', mut('| `node check.mjs index.html checks.json` exits 0 |\n\n### B', '|  |\n\n### B'), 'no done check'],
  ['no measure rows', sample.replace(/\| notes kept after reload[^\n]*\n/, ''), 'no measure rows'],
  ['axis: class missing', mut('| required | owner | decided |\n| organization', '|  | owner | decided |\n| organization'), 'class must be'],
  ['axis: N/A without reason', mut('N/A: personal project', 'N/A'), 'N/A without a reason'],
  ['axis: required value empty', mut('| one day, no money |', '|  |'), 'required value is empty'],
  ['axis: row missing', sample.replace(/\| start \| start[^\n]*\n/, ''), 'axis start missing'],
  ['stages: no rows', sample.replace(/\| 1 \| notes persist[^\n]*\n/, ''), 'stages: no rows'],
  ['stage: no done check', mut('| notes persist | `node check.mjs index.html checks.json` exits 0 |', '| notes persist |  |'), 'stage 1: no done check'],
  ['blocked row under approved status', mut('| required | owner | decided |\n| form', '| required | owner | blocked |\n| form'), 'blocked rows remain'],
  ['approved without approver and date', mut('intake approved by owner on 2026-01-02', 'approved'), 'approved without approver'],
  ['empty template', fs.readFileSync(path.join(root, 'templates', 'intake.md'), 'utf8'), 'failure(s)']
];
for (const [label, txt, needle] of negatives) {
  const r = run(txt);
  ok(`negative: ${label} -> non-zero and names it`, r.status === 1 && r.stderr.includes(needle));
}
ok('unreadable file exits 2', spawnSync('node', [bin, path.join(tmp, 'none.md')]).status === 2);
fs.rmSync(tmp, { recursive: true, force: true });
if (fail) { console.error(`FAIL: ${fail} case(s)`); process.exit(1); }
console.log('PASS intake-check.selftest');
