#!/usr/bin/env node
// test/status.selftest-h125.mjs — H125 cases 19-23 (split out of status.selftest.mjs, A17 <=300
// lines/file). `node test/status.selftest-h125.mjs` -> exit 0. package.json "test" runs both files.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { runStatus } from '../bin/status.mjs';

let fail = 0;
function ok(label, cond) {
  console.log(`  ${cond ? 'ok  ' : 'FAIL'} ${label}`);
  if (!cond) fail += 1;
}

function freshTmp() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'epds-status-selftest-h125-'));
}

function withMqcJudge(dir) {
  fs.mkdirSync(path.join(dir, 'epds'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'epds', 'judges.json'), JSON.stringify([
    { id: 'mqc', cmd: 'node scripts/merge-quality-check.mjs', outputGlob: 'journal/measurements/*.latest.json', exitField: 'exit', applies: 'auto' }
  ]));
}

{ // case19 (H125 item1): results[] -> per-row judge.<id> facts + 3-way classify, no collapsing
  const dir = freshTmp();
  withMqcJudge(dir);
  fs.mkdirSync(path.join(dir, 'journal', 'measurements'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'journal', 'measurements', 'x.latest.json'), JSON.stringify({ exit: 1,
    results: [{ id: 'A1', verdict: 'deficient', judge: 'machine', detail: '해시불일치=1' },
      { id: 'D1', verdict: 'unmeasured', judge: 'machine', detail: '전표본 endReason=maxDropsReached 절단' }],
    counts: { deficient: 1, unmeasured: 1 } }));
  const { output } = runStatus(['--target', dir, '--snapshot-dir', freshTmp(), '--json']);
  const a1 = output.facts.find((f) => f.id === 'judge.A1');
  const d1 = output.facts.find((f) => f.id === 'judge.D1');
  ok('case19 (H125 item1) judge.A1 FAIL(deficient) + judge.D1 censored-classified("절단") + mqc.counts fact',
    !!(a1 && a1.value.verdict === 'deficient' && a1.exit === 1 && d1 && d1.value.class === 'censored' && d1.value.censored === true
      && output.facts.some((f) => f.id === 'mqc.counts')));
}
{ // case20 (H125 item2): runner never echoes a caller --model/--effort flag no LLM actually ran
  const { output } = runStatus(['--target', freshTmp(), '--snapshot-dir', freshTmp(), '--model', 'claude-sonnet-5', '--effort', 'high', '--json']);
  ok('case20 (H125 item2) runner honesty: model="none"/effort=null regardless of caller flags',
    output.runner.model === 'none' && output.runner.effort === null);
}
{ // case21 (H125 item3): corrupted judge output's fact-level exit is null, never a fail-open 0
  const dir = freshTmp();
  withMqcJudge(dir);
  fs.mkdirSync(path.join(dir, 'journal', 'measurements'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'journal', 'measurements', 'x.latest.json'), JSON.stringify({ noExitField: true }));
  const { output } = runStatus(['--target', dir, '--snapshot-dir', freshTmp(), '--json']);
  const mqc = output.facts.find((f) => f.id === 'mqc.latest');
  ok('case21 (H125 item3) corrupted judge fact.exit is null, never a fail-open 0', mqc && mqc.exit === null);
}
{ // case22 (H125 item4): absolute outputGlob outside the target is discovered (no target-drop needed)
  const outsideDir = freshTmp();
  fs.writeFileSync(path.join(outsideDir, 'x.latest.json'), JSON.stringify({ exit: 0 }));
  const dir = freshTmp();
  fs.mkdirSync(path.join(dir, 'epds'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'epds', 'judges.json'), JSON.stringify(
    [{ id: 'ext', cmd: 'x', outputGlob: path.join(outsideDir, '*.latest.json'), exitField: 'exit', applies: 'auto' }]));
  const { output } = runStatus(['--target', dir, '--snapshot-dir', freshTmp(), '--json']);
  const ext = output.facts.find((f) => f.id === 'ext.latest');
  ok('case22 (H125 item4) absolute outputGlob outside target discovered, locator points outside',
    !!(ext && ext.value.exit === 0 && ext.locator.startsWith(outsideDir)));
}
{ // case23 (H125 item5): judges.unconfigured fact + package.json now runs both selftest files
  const { output } = runStatus(['--target', freshTmp(), '--snapshot-dir', freshTmp(), '--json']);
  const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  ok('case23 (H125 item5) judges.unconfigured fact present + package.json declares npm test',
    output.facts.some((f) => f.id === 'judges.unconfigured' && f.value.env === true)
      && pkg.scripts.test.includes('status.selftest.mjs') && pkg.scripts.test.includes('status.selftest-h125.mjs'));
}

if (fail > 0) { console.log(`\nstatus.selftest-h125 FAIL (${fail} failing check(s))`); process.exit(1); }
console.log('\nstatus.selftest-h125 PASS');
