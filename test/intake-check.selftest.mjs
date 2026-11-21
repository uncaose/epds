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
  ['empty Status line', sample.replace(/^Status:.*$/m, 'Status:'), 'status missing'],
  ['service end state with infrastructure folded as N/A', sample.replace(/GitHub only/g, 'service'), 'infrastructure'],
  ['public release with feedback folded as N/A', sample.replace(/GitHub only/g, 'open source release'), 'feedback'],
  ['TRIVIAL one-line with empty done check', 'Purpose: Keep notes | Done check: ', 'trivial: done check is empty'],
  ['TRIVIAL one-line with empty purpose', 'Purpose:  | Done check: reload shows the note', 'trivial: purpose is empty'],
  ['escaped pipe keeps the cell; empty done check still caught', mut('reload and count | `node check.mjs index.html checks.json` exits 0 |', 'reload \\| count |  |'), 'no done check'],
  ['blocked written in an A cell', mut('| reload and count |', '| blocked |'), 'blocked rows remain'],
  ['blocked written in a C cell', mut('| 1 day, 0 |', '| blocked |'), 'blocked rows remain'],
  ['required axis open under approved status', mut('| one person, desktop browser, under 100 notes | required | owner | decided |', '| one person, desktop browser, under 100 notes | required | owner | open |'), 'required axis is open'],
  ['optional axis with bare N/A', mut('N/A: personal project | N/A |', 'N/A | optional |'), 'N/A without a reason'],
  ['full template with A heading replaced by a TRIVIAL line', fs.readFileSync(path.join(root, 'templates', 'intake.md'), 'utf8').replace(/^### A\..*/m, 'Purpose: Keep notes | Done check: Reload shows the saved note'), 'section A missing'],
  ['resources optional and open', sample.replace('one day, no money | required | owner | decided', ' | optional | owner | open'), 'resources'],
  ['folded N/A row with service end state and class required', sample.replace(/GitHub only/g, 'service').replace('| N/A | assumption: end-state |', '| required | assumption: end-state |'), 'infrastructure'],
  ['approver placeholder <owner>', mut('by owner on', 'by <owner> on'), 'approver'],
  ['feedback folded N/A with public open source end state', sample.replace(/GitHub only/g, 'open source'), 'feedback'],
  ['empty template', fs.readFileSync(path.join(root, 'templates', 'intake.md'), 'utf8'), 'failure(s)']
];
for (const [label, txt, needle] of negatives) {
  const r = run(txt);
  ok(`negative: ${label} -> non-zero and names it`, r.status === 1 && r.stderr.includes(needle));
}
ok('TRIVIAL one-line intake exits 0', (() => { const r = run('Purpose: Keep notes | Done check: Reload shows the saved note\n'); return r.status === 0; })());
ok('escaped pipe inside a cell exits 0', run(mut('reload and count', 'reload \\| count')).status === 0);
ok('real name with spaces approves', run(mut('by owner on', 'by Alex Kim on')).status === 0);
ok('private service needs infrastructure but not feedback', (() => { const r = run(sample.replace(/GitHub only/g, 'private service').replace(/^\| infra \|[^\n]*\n/m, '| infra | infrastructure | cloud X, 10 USD cap | required | owner | decided |\n| AI | ai-model+promotion+feedback | N/A: private, no AI | N/A | assumption: private | decided |\n')); return r.status === 0; })());
ok('unreadable file exits 2', spawnSync('node', [bin, path.join(tmp, 'none.md')]).status === 2);
fs.rmSync(tmp, { recursive: true, force: true });
if (fail) { console.error(`FAIL: ${fail} case(s)`); process.exit(1); }
console.log('PASS intake-check.selftest');
