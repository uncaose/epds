#!/usr/bin/env node
// test/status.selftest.mjs — 6 cases for bin/status.mjs. `node test/status.selftest.mjs` -> exit 0.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { runStatus, validateFacts, validateQuestions } from '../bin/status.mjs';

const B3 = path.join(os.homedir(), 'Projects', 'go-work', 'epds-verify-b3');
const REPRO3 = path.join(os.homedir(), 'Projects', 'go-work', 'epds-verify-repro3');

let fail = 0;
function ok(label, cond) {
  console.log(`  ${cond ? 'ok  ' : 'FAIL'} ${label}`);
  if (!cond) fail += 1;
}

function freshTmp() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'epds-status-selftest-'));
  return dir;
}

// content that matters for M9/reproducibility comparisons — strips wall-clock/disk-state noise.
function contentOnly(output) {
  const { measuredAt, snapshot, target, ...rest } = output;
  return JSON.stringify({ ...rest, targetPath: '<stripped>' });
}

// ---- case 1: empty directory -> everything UNMEASURED-environment, exit 3 ----
{
  const dir = freshTmp();
  const { output, exit } = runStatus(['--target', dir, '--json']);
  ok('case1 empty dir: exit 3', exit === 3);
  ok('case1 empty dir: technical UNMEASURED-environment', output.state.technical.verdict === 'UNMEASURED-environment');
  ok('case1 empty dir: product UNMEASURED-environment', output.state.product.verdict === 'UNMEASURED-environment');
  ok('case1 empty dir: unmeasured.environment > 0, censored/corrupted 0', output.unmeasured.environment > 0 && output.unmeasured.censored === 0 && output.unmeasured.corrupted === 0);
}

// ---- case 2: B3 worktree -> exit 1, censored detected ----
if (fs.existsSync(B3)) {
  const { output, exit } = runStatus(['--target', B3, '--json']);
  ok('case2 B3: exit 1', exit === 1);
  ok('case2 B3: technical verdict is FAIL', output.state.technical.verdict === 'FAIL');
  ok('case2 B3: sim.endReason censored fact present', output.facts.some((f) => f.id === 'sim.endReason.distribution' && f.value.censored === true));
  ok('case2 B3: unmeasured.censored >= 1', output.unmeasured.censored >= 1);
} else {
  console.log('  skip case2 B3 (worktree not present on this machine)');
}

// ---- case 3: repro3 worktree -> lifecycle doc/reality gap detected ----
// repro3's docs/lifecycle-status.md still marks stage 3(개선) as the first open row while git log
// shows commits well past it (e.g. "add headless SIM producer (C1-D5)" = stage 5 work) — the
// lifecycle-status fact must surface that gap (firstOpenStage stuck early + later rows non-done).
if (fs.existsSync(REPRO3)) {
  const { output } = runStatus(['--target', REPRO3, '--json']);
  const lifecycle = output.facts.find((f) => f.id === 'doc.lifecycle.status');
  ok('case3 repro3: lifecycle fact present', !!lifecycle);
  ok('case3 repro3: firstOpenStage stuck at an early stage (개선)', lifecycle && lifecycle.value.firstOpenStage === '개선');
  ok('case3 repro3: later rows still open (notStarted+inProgress > done)', lifecycle && (lifecycle.value.notStarted + lifecycle.value.inProgress) > lifecycle.value.done);
} else {
  console.log('  skip case3 repro3 (worktree not present on this machine)');
}

// ---- case 4: same input, 2 runs -> content byte-identical (measuredAt/snapshot excluded, the
// way the M6 procedure's `jq del(.measuredAt)` excludes the clock; snapshot embeds the clock too
// and its prev/changed depend on prior on-disk snapshots, so two truly-fresh targets are used). ----
{
  const dirA = freshTmp();
  const dirB = freshTmp();
  fs.writeFileSync(path.join(dirA, 'PRODUCT.md'), 'Goal: ship the thing\n');
  fs.writeFileSync(path.join(dirB, 'PRODUCT.md'), 'Goal: ship the thing\n');
  const a = runStatus(['--target', dirA, '--json']).output;
  const b = runStatus(['--target', dirB, '--json']).output;
  ok('case4 reproducibility: content identical across 2 fresh runs of the same input', contentOnly(a) === contentOnly(b));
}

// ---- case 5: fact missing locator -> validator rejects (exit-2 path) ----
{
  const bad = validateFacts([{ id: 'x', value: {}, locator: '', cmd: 'x', exit: 0 }]);
  ok('case5 locator missing: validateFacts rejects', bad.ok === false);
  const good = validateFacts([{ id: 'x', value: {}, locator: 'a/b', cmd: 'x', exit: 0 }]);
  ok('case5 locator present: validateFacts accepts', good.ok === true);
}

// ---- case 6: owner question sharpens missing/empty -> validator rejects (exit-2 path) ----
{
  const badEmpty = validateQuestions([{ id: 'Q1', ask: 'x', ownerOnly: true, source: 's', sharpens: {} }]);
  ok('case6 sharpens empty object: validateQuestions rejects', badEmpty.ok === false);
  const badAllNull = validateQuestions([{ id: 'Q1', ask: 'x', ownerOnly: true, source: 's',
    sharpens: { state: null, position: null, outcome: null, direction: null } }]);
  ok('case6 sharpens all-null: validateQuestions rejects', badAllNull.ok === false);
  const good = validateQuestions([{ id: 'Q1', ask: 'x', ownerOnly: true, source: 's',
    sharpens: { state: 's', position: null, outcome: null, direction: null } }]);
  ok('case6 sharpens 1-of-4 filled: validateQuestions accepts', good.ok === true);
}

// ---- case 7: status write must not dirty the target git repo (M6 self-pollution fix) ----
{
  const dir = freshTmp();
  execFileSync('git', ['init', '-q'], { cwd: dir });
  execFileSync('git', ['config', 'user.email', 'a@b.c'], { cwd: dir });
  execFileSync('git', ['config', 'user.name', 'selftest'], { cwd: dir });
  fs.writeFileSync(path.join(dir, 'PRODUCT.md'), 'Goal: x\n');
  execFileSync('git', ['add', '.'], { cwd: dir });
  execFileSync('git', ['commit', '-q', '-m', 'init'], { cwd: dir });
  const snapDir = freshTmp();
  runStatus(['--target', dir, '--snapshot-dir', snapDir, '--json']);
  const porcelain = execFileSync('git', ['status', '--porcelain'], { cwd: dir, encoding: 'utf8' });
  ok('case7 status write: target git status --porcelain unchanged', porcelain === '');
  ok('case7 status write: snapshot written outside target', fs.readdirSync(snapDir).some((f) => f.endsWith('.status.json')));
}

// ---- case 8: 2 runs on the same target -> content identical (measuredAt/snapshot excluded) ----
{
  const dir = freshTmp();
  fs.writeFileSync(path.join(dir, 'PRODUCT.md'), 'Goal: ship the thing\n');
  const snapDir = freshTmp();
  const r1 = runStatus(['--target', dir, '--snapshot-dir', snapDir, '--json']).output;
  const r2 = runStatus(['--target', dir, '--snapshot-dir', snapDir, '--json']).output;
  ok('case8 same-target reproducibility: content identical across 2 runs', contentOnly(r1) === contentOnly(r2));
}

// ---- case 9: outcome.goal parser — "Goal:" line parsed, heading-only file -> null ----
{
  const dirGoal = freshTmp();
  fs.writeFileSync(path.join(dirGoal, 'PRODUCT.md'), '# Product\n\nGoal: ship the thing\n\nmore text\n');
  const withGoal = runStatus(['--target', dirGoal, '--snapshot-dir', freshTmp(), '--json']).output;
  ok('case9 "Goal:" line parsed correctly', withGoal.outcome.goal === 'ship the thing');

  const dirHeadingOnly = freshTmp();
  fs.writeFileSync(path.join(dirHeadingOnly, 'PRODUCT.md'), '# Product\n\nno Goal line or ## Goal heading here\n');
  const headingOnly = runStatus(['--target', dirHeadingOnly, '--snapshot-dir', freshTmp(), '--json']).output;
  ok('case9 heading-only file -> goal null (first-heading mis-extraction fixed)', headingOnly.outcome.goal === null);
  ok('case9 heading-only file -> gap set + counted in unmeasured.environment', headingOnly.outcome.gap !== null && headingOnly.unmeasured.environment >= 1);
}

if (fail > 0) { console.log(`\nstatus.selftest FAIL (${fail} failing check(s))`); process.exit(1); }
console.log('\nstatus.selftest PASS');
