#!/usr/bin/env node
// test/status.selftest.mjs — 6 cases for bin/status.mjs. `node test/status.selftest.mjs` -> exit 0.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { runStatus, validateFacts, validateQuestions, writeSnapshot } from '../bin/status.mjs';

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
  const testFact = output.facts.find((f) => f.id === 'test.exit');
  // B3 is a live external go-work worktree; its node_modules/test state can drift outside this repo's
  // control (critic 20260918 §1: an `npm install` mid-measurement flipped this exact fact 127->0) — when
  // its test currently passes on this machine, skip the FAIL-specific asserts instead of hardcoding a
  // stale expectation; the fixture-independent censored asserts below still run either way.
  if (testFact && testFact.value.exit === 0) {
    console.log('  note  case2 B3: test currently passes on this machine (node_modules present) - skipping FAIL-specific asserts');
  } else {
    ok('case2 B3: exit 1', exit === 1);
    ok('case2 B3: technical verdict is FAIL', output.state.technical.verdict === 'FAIL');
  }
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

// ---- case 10 (critic req #1): environment gap (exit 127, tool not installed) is UNMEASURED, never FAIL ----
{
  const dir = freshTmp();
  execFileSync('git', ['init', '-q'], { cwd: dir });
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ scripts: { test: 'no-such-binary-xyz' } }));
  execFileSync('git', ['add', '.'], { cwd: dir });
  execFileSync('git', ['-c', 'user.email=a@b.c', '-c', 'user.name=t', 'commit', '-q', '-m', 'i'], { cwd: dir });
  const { output } = runStatus(['--target', dir, '--snapshot-dir', freshTmp(), '--json']);
  const testFact = output.facts.find((f) => f.id === 'test.exit');
  ok('case10 exit127: classified as env, not a raw failure', testFact && testFact.value.env === true);
  ok('case10 exit127: technical verdict is UNMEASURED (not FAIL)', output.state.technical.verdict === 'UNMEASURED-environment');
  ok('case10 exit127: unmeasured.environment >= 1', output.unmeasured.environment >= 1);
}

// ---- case 11 (critic req #2): same measuredAt written twice -> 2 distinct files, no self-referencing prev ----
{
  const dir = freshTmp();
  const frozen = { schemaVersion: 1, measuredAt: '2026-09-18T10:50:24.000Z', state: {}, position: {}, outcome: {}, direction: {} };
  const s1 = writeSnapshot(dir, frozen);
  const s2 = writeSnapshot(dir, { ...frozen, position: { changed: true } });
  ok('case11 same-ms collision: 2 distinct snapshot files written', s1.path !== s2.path && fs.readdirSync(dir).length === 2);
  ok('case11 same-ms collision: second file has a seq suffix', s2.path.endsWith('-2.status.json'));
  ok('case11 same-ms collision: second run\'s prev points at the FIRST file, not itself', s2.prev === s1.path);
}

// judges.json fixture enabling the mqc judge — H124 made judges opt-in via <target>/epds/judges.json,
// so case12/13's corrupted-output path now needs an explicit config to exercise collectJudges() at all.
function withMqcJudge(dir) {
  fs.mkdirSync(path.join(dir, 'epds'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'epds', 'judges.json'), JSON.stringify([
    { id: 'mqc', cmd: 'node scripts/merge-quality-check.mjs', outputGlob: 'journal/measurements/*.latest.json', exitField: 'exit', applies: 'auto' }
  ]));
}

// ---- case 12 (critic req #3): corrupted producer output (bad JSON) counted in unmeasured.corrupted, not 0 ----
{
  const dir = freshTmp();
  withMqcJudge(dir);
  fs.mkdirSync(path.join(dir, 'journal', 'measurements'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'journal', 'measurements', 'x.latest.json'), '{not valid json');
  const { output } = runStatus(['--target', dir, '--snapshot-dir', freshTmp(), '--json']);
  const mqc = output.facts.find((f) => f.id === 'mqc.latest');
  ok('case12 corrupted mqc output: fact flags corrupted', mqc && mqc.value.corrupted === true);
  ok('case12 corrupted mqc output: unmeasured.corrupted >= 1 (not hardcoded 0)', output.unmeasured.corrupted >= 1);
  ok('case12 corrupted mqc output: technical verdict is UNMEASURED-corrupted', output.state.technical.verdict === 'UNMEASURED-corrupted');
}

// ---- case 13 (critic req #4): judge output with no `exit` field -> UNMEASURED-corrupted, never a silent PASS(0) ----
{
  const dir = freshTmp();
  withMqcJudge(dir);
  fs.mkdirSync(path.join(dir, 'journal', 'measurements'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'journal', 'measurements', 'x.latest.json'), JSON.stringify({ noExitField: true }));
  const { output } = runStatus(['--target', dir, '--snapshot-dir', freshTmp(), '--json']);
  const mqc = output.facts.find((f) => f.id === 'mqc.latest');
  ok('case13 missing exit field: flagged corrupted, exitField stays null (no fail-open to 0)', mqc && mqc.value.corrupted === true && mqc.value.exit === null);
  ok('case13 missing exit field: technical verdict is UNMEASURED-corrupted, not PASS', output.state.technical.verdict === 'UNMEASURED-corrupted');
}

// ---- case 14 (H124 #1): self-apply nextAction never points at a harness-specific command ----
{
  const EPDS_SELF = path.join(os.homedir(), 'Projects', 'epds');
  const { output } = runStatus(['--target', EPDS_SELF, '--snapshot-dir', freshTmp(), '--json']);
  const harnessCmdPattern = /merge-quality-check|scripts\/[\w.-]+\.(mjs|ts|js)/i;
  ok('case14 self-apply: no mqc-style fact present (epds/judges.json = [])', !output.facts.some((f) => f.id.startsWith('mqc.')));
  ok('case14 self-apply: nextAction has zero harness-command references', !harnessCmdPattern.test(output.direction.nextAction));
}

// ---- case 15 (H124 #1): no judges.json at all -> bundled default is inert -> 0 judge facts, no phantom env count ----
{
  const dir = freshTmp();
  execFileSync('git', ['init', '-q'], { cwd: dir });
  fs.mkdirSync(path.join(dir, 'journal', 'measurements'), { recursive: true }); // looks like an mqc target, but unconfigured
  const { output } = runStatus(['--target', dir, '--snapshot-dir', freshTmp(), '--json']);
  ok('case15 no judges.json: no mqc fact generated for an unconfigured target', !output.facts.some((f) => f.id === 'mqc.missing' || f.id === 'mqc.latest'));
  ok('case15 no judges.json: 0 judge facts total (bundled default ships inert)', !output.facts.some((f) => f.locator.includes('journal/measurements')));
}

// ---- case 16 (H124 #2): repro3 doc.lifecycle.stale detects the doc-vs-HEAD drift ----
if (fs.existsSync(REPRO3)) {
  const { output } = runStatus(['--target', REPRO3, '--snapshot-dir', freshTmp(), '--json']);
  const stale = output.facts.find((f) => f.id === 'doc.lifecycle.stale');
  ok('case16 repro3: doc.lifecycle.stale fact present', !!stale);
  ok('case16 repro3: stale detected (commits since last doc touch > threshold, open rows remain)', stale && stale.value.stale === true);
} else {
  console.log('  skip case16 repro3 (worktree not present on this machine)');
}

// ---- case 17 (H124 #3): METRICS.md with a target-missed row -> product track can FAIL ----
{
  const dir = freshTmp();
  fs.writeFileSync(path.join(dir, 'METRICS.md'),
    '# Metrics\n\nMeasured: 2026-09-19\n\n| Metric | Current | Target | Direction |\n|---|---|---|---|\n| activation_rate | 0.10 | 0.20 | higher-better |\n');
  const { output } = runStatus(['--target', dir, '--snapshot-dir', freshTmp(), '--json']);
  const metrics = output.facts.find((f) => f.id === 'metrics.status');
  ok('case17 METRICS.md FAIL fixture: metrics.status exit 1, not corrupted', metrics && metrics.exit === 1 && metrics.value.corrupted === false);
  ok('case17 METRICS.md FAIL fixture: product track verdict is FAIL', output.state.product.verdict === 'FAIL');
}

// ---- case 18 (H124 #3): METRICS.md with no parseable Measured/row -> UNMEASURED-corrupted, not PASS ----
{
  const dir = freshTmp();
  fs.writeFileSync(path.join(dir, 'METRICS.md'), '# Metrics\n\nno structured data here\n');
  const { output } = runStatus(['--target', dir, '--snapshot-dir', freshTmp(), '--json']);
  const metrics = output.facts.find((f) => f.id === 'metrics.status');
  ok('case18 METRICS.md corrupted fixture: flagged corrupted', metrics && metrics.value.corrupted === true);
  ok('case18 METRICS.md corrupted fixture: product track verdict is UNMEASURED-corrupted', output.state.product.verdict === 'UNMEASURED-corrupted');
}

if (fail > 0) { console.log(`\nstatus.selftest FAIL (${fail} failing check(s))`); process.exit(1); }
console.log('\nstatus.selftest PASS');
