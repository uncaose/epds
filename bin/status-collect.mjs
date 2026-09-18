#!/usr/bin/env node
// bin/status-collect.mjs — fact collectors for bin/status.mjs (split out to keep each file <=300 lines, A17).
import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

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
export function collectTest(target) {
  const pkgPath = path.join(target, 'package.json');
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    if (!pkg.scripts || typeof pkg.scripts.test !== 'string') return null;
  } catch { return null; }
  let exit = 0, env = false;
  try { execSync('npm test --silent', { cwd: target, timeout: 20000, stdio: 'pipe' }); }
  catch (e) {
    // signal set (killed/timeout) or no numeric status (spawn failure) -> can't tell FAIL from env gap.
    if (e.signal || typeof e.status !== 'number') { exit = -1; env = true; }
    else { exit = e.status; env = exit === 127 || exit === 126; } // command-not-found / not-executable
  }
  return { id: 'test.exit', value: { exit, env }, locator: 'package.json', cmd: 'npm test --silent', exit };
}
export function collectLifecycle(target) {
  const rel = 'docs/lifecycle-status.md';
  const file = path.join(target, rel);
  if (!fs.existsSync(file)) {
    return { id: 'doc.lifecycle.missing', value: {}, locator: rel, cmd: 'test -f docs/lifecycle-status.md', exit: 1 };
  }
  let total = 0, done = 0, inProgress = 0, notStarted = 0, firstOpenStage = null;
  try {
    const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/)
      .filter((l) => l.trim().startsWith('|') && l.trim().endsWith('|'));
    for (const line of lines) {
      const cells = line.split('|').map((c) => c.trim()).filter(Boolean);
      const icon = cells.find((c) => ['✅', '🔄', '❌'].includes(c));
      if (!icon) continue;
      total += 1;
      if (icon === '✅') done += 1;
      else {
        if (icon === '🔄') inProgress += 1; else notStarted += 1;
        if (firstOpenStage === null) firstOpenStage = cells[1] ?? null; // "# | 단계 | 상태 | ..." -> cells[1]=단계
      }
    }
  } catch { /* leave counters at zero */ }
  return { id: 'doc.lifecycle.status', value: { total, done, inProgress, notStarted, firstOpenStage },
    locator: rel, cmd: 'read docs/lifecycle-status.md', exit: 0 };
}
export function collectMeasurement(target) {
  const relDir = 'journal/measurements/';
  const dir = path.join(target, 'journal', 'measurements');
  let files = [];
  try { files = fs.readdirSync(dir).filter((f) => f.endsWith('.latest.json')).map((f) => path.join(dir, f)); }
  catch { files = []; }
  if (files.length === 0) {
    return { id: 'mqc.missing', value: {}, locator: relDir, cmd: 'glob journal/measurements/*.latest.json', exit: 1 };
  }
  const mtime = (f) => fs.statSync(f).mtimeMs;
  const newest = files.reduce((a, b) => (mtime(b) > mtime(a) ? b : a));
  let exitField = null, corrupted = false;
  try {
    const data = JSON.parse(fs.readFileSync(newest, 'utf8'));
    if (Object.prototype.hasOwnProperty.call(data, 'exit')) exitField = data.exit;
    else corrupted = true; // parses fine but the required field is gone
  } catch { corrupted = true; } // JSON parse failure
  // no fail-open: an unreadable/field-less producer output is UNMEASURED-corrupted, never a silent PASS(0).
  const exit = typeof exitField === 'number' ? exitField : 0;
  return { id: 'mqc.latest', value: { file: path.basename(newest), exit: exitField, corrupted },
    locator: `${relDir}${path.basename(newest)}`, cmd: 'read journal/measurements/*.latest.json', exit };
}
export function collectMetrics(target) {
  const product = fs.existsSync(path.join(target, 'PRODUCT.md'));
  const metrics = fs.existsSync(path.join(target, 'METRICS.md'));
  return { id: 'fs.metrics.missing', value: { 'PRODUCT.md': product, 'METRICS.md': metrics },
    locator: '.', cmd: 'test -f PRODUCT.md METRICS.md', exit: product && metrics ? 0 : 1 };
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
    locator: relDir, cmd: 'glob docs/sim-dumps/*.json', exit: 0 };
}
