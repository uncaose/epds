#!/usr/bin/env node
// bin/status-collect.mjs — technical fact collectors for bin/status.mjs (git/test/judges/sim).
// Doc/product collectors (lifecycle, metrics) live in status-collect-docs.mjs (A17 <=300 lines/file).
import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function collectGit(target) {
  const fact = { id: 'git.head', value: { head: 'unknown', shortHead: 'unknown', dirty: 0 },
    locator: '.git/HEAD', cmd: 'git rev-parse HEAD', exit: 0 };
  try {
    const head = spawnSync('git', ['-C', target, 'rev-parse', 'HEAD'], { encoding: 'utf8', timeout: 5000 });
    const short = spawnSync('git', ['-C', target, 'rev-parse', '--short', 'HEAD'], { encoding: 'utf8', timeout: 5000 });
    const st = spawnSync('git', ['-C', target, 'status', '--porcelain'], { encoding: 'utf8', timeout: 5000 });
    if (head.status !== 0 || short.status !== 0 || st.status !== 0) fact.exit = 1;
    else fact.value = { head: head.stdout.trim(), shortHead: short.stdout.trim(),
      dirty: st.stdout.split(/\r?\n/).filter(Boolean).length };
  } catch { fact.exit = 1; }
  return fact;
}
// summary-line fail-count parsers for common JS test runners — anchored/specific enough to avoid
// matching a test NAME that happens to contain the word "fail" (H124 test.counter.sanity).
const FAIL_COUNT_PATTERNS = [
  /^[\sℹ#]*fail\s+(\d+)\s*$/im, // node:test default reporter ("ℹ fail 0")
  /(\d+)\s+failing\b/i,          // mocha ("2 failing")
  /(\d+)\s+failed\b/i            // jest/vitest ("Tests: 2 failed, 8 passed")
];
function parseTestFailCount(output) {
  if (typeof output !== 'string' || output.length === 0) return null;
  for (const re of FAIL_COUNT_PATTERNS) { const m = output.match(re); if (m) return parseInt(m[1], 10); }
  return null; // no parseable summary line -> not applicable, no fact (never a forced env/fail guess)
}
// exit code can lie (a runner that swallows a failing case and still exits 0) — cross-check the
// parsed fail count against the exit code when a summary line is actually parseable.
function buildTestCounterSanity(testFact, output) {
  const failCount = parseTestFailCount(output);
  if (failCount === null) return null;
  const mismatch = (failCount > 0) !== (testFact.value.exit !== 0);
  return { id: 'test.counter.sanity', value: { failCount, testExit: testFact.value.exit, mismatch },
    locator: testFact.locator, cmd: testFact.cmd, exit: mismatch ? 1 : 0, track: 'technical' };
}
export function collectTest(target) {
  const pkgPath = path.join(target, 'package.json');
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    if (!pkg.scripts || typeof pkg.scripts.test !== 'string') return null;
  } catch { return null; }
  let exit = 0, env = false, output = '';
  try { output = execSync('npm test --silent', { cwd: target, timeout: 20000, stdio: 'pipe', encoding: 'utf8' }); }
  catch (e) {
    // signal set (killed/timeout) or no numeric status (spawn failure) -> can't tell FAIL from env gap.
    if (e.signal || typeof e.status !== 'number') { exit = -1; env = true; }
    else { exit = e.status; env = exit === 127 || exit === 126; } // command-not-found / not-executable
    output = `${e.stdout || ''}${e.stderr || ''}`;
  }
  const testFact = { id: 'test.exit', value: { exit, env }, locator: 'package.json', cmd: 'npm test --silent', exit, track: 'technical' };
  const sanityFact = buildTestCounterSanity(testFact, output);
  return sanityFact ? [testFact, sanityFact] : [testFact];
}
// minimal "*"-only glob -> RegExp (no dependency; enough for "*.latest.json"-shaped outputGlob patterns).
function globToRegExp(pattern) {
  const escaped = pattern.split('*').map((seg) => seg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  return new RegExp(`^${escaped.join('.*')}$`);
}
// Judge plugin config: <target>/epds/judges.json overrides the bundled templates/epds-judges.json
// default (which ships inert/"never" — no judge is hardcoded into this tool, portability H124).
function loadJudgesConfig(target) {
  const overridePath = path.join(target, 'epds', 'judges.json');
  const defaultPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'templates', 'epds-judges.json');
  const src = fs.existsSync(overridePath) ? overridePath : defaultPath;
  try {
    const data = JSON.parse(fs.readFileSync(src, 'utf8'));
    return Array.isArray(data) ? data : [];
  } catch { return []; } // malformed config -> 0 judges, never a crash or a silent fail-open
}
// A judge with no applicable config (applies:"never", or absent entirely) generates NO fact —
// "해당 없음", not UNMEASURED-environment. This is what makes self-apply on a non-mqc repo clean.
export function collectJudges(target) {
  const facts = [];
  for (const judge of loadJudgesConfig(target)) {
    if (!judge || judge.applies === 'never' || !judge.id || !judge.outputGlob) continue;
    const dir = path.dirname(path.join(target, judge.outputGlob));
    const pattern = path.basename(judge.outputGlob);
    const re = globToRegExp(pattern);
    let files = [];
    try { files = fs.readdirSync(dir).filter((f) => re.test(f)).map((f) => path.join(dir, f)); }
    catch { files = []; }
    const relDir = `${path.relative(target, dir)}${path.sep}`;
    if (files.length === 0) {
      const directionHint = `${judge.cmd || `${judge.id} 실행`} 등으로 ${judge.outputGlob} 생성`;
      facts.push({ id: `${judge.id}.missing`, value: { directionHint }, locator: relDir,
        cmd: `glob ${judge.outputGlob}`, exit: 1, track: 'technical' });
      continue;
    }
    const mtime = (f) => fs.statSync(f).mtimeMs;
    const newest = files.reduce((a, b) => (mtime(b) > mtime(a) ? b : a));
    const exitField = judge.exitField || 'exit';
    let exitVal = null, corrupted = false;
    try {
      const data = JSON.parse(fs.readFileSync(newest, 'utf8'));
      if (Object.prototype.hasOwnProperty.call(data, exitField)) exitVal = data[exitField];
      else corrupted = true;
    } catch { corrupted = true; }
    // no fail-open: an unreadable/field-less judge output is UNMEASURED-corrupted, never a silent PASS(0).
    const finalExit = typeof exitVal === 'number' ? exitVal : 0;
    const directionHint = corrupted
      ? `${judge.id} 산출물 손상 - ${relDir}${path.basename(newest)} (${exitField} 필드 없음/JSON 파손, 재실행 필요)`
      : `${judge.cmd || `${judge.id} 재실행`} - exit=${exitVal} 원인 조사`;
    facts.push({ id: `${judge.id}.latest`, value: { file: path.basename(newest), exit: exitVal, corrupted, directionHint },
      locator: `${relDir}${path.basename(newest)}`, cmd: judge.cmd || `read ${judge.outputGlob}`, exit: finalExit, track: 'technical' });
  }
  return facts;
}
export function collectSimDumps(target) {
  const relDir = 'docs/sim-dumps/';
  const dir = path.join(target, 'docs', 'sim-dumps');
  let files = [];
  try { files = fs.readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => path.join(dir, f)); }
  catch { files = []; }
  if (files.length === 0) return null;
  const reasons = [];
  let corruptedCount = 0;
  for (const f of files) {
    try {
      const data = JSON.parse(fs.readFileSync(f, 'utf8'));
      if (typeof data.endReason === 'string') reasons.push(data.endReason);
      else corruptedCount += 1; // parses fine but the required field is gone
    } catch { corruptedCount += 1; } // JSON parse failure
  }
  if (reasons.length === 0 && corruptedCount === 0) return null;
  const values = [...new Set(reasons)].sort();
  return { id: 'sim.endReason.distribution',
    value: { distinctCount: values.length, values, censored: reasons.length > 0 && values.length === 1, corruptedCount },
    locator: relDir, cmd: 'glob docs/sim-dumps/*.json', exit: 0, track: 'technical' };
}
