#!/usr/bin/env node
// bin/status-collect-docs.mjs — product/doc fact collectors for bin/status.mjs (lifecycle, metrics).
// Split from status-collect.mjs to keep each file <=300 lines (A17); technical collectors (git/test/
// judges/sim) stay there.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export function collectLifecycle(target) {
  const rel = 'docs/lifecycle-status.md';
  const file = path.join(target, rel);
  if (!fs.existsSync(file)) {
    return { id: 'doc.lifecycle.missing', value: {}, locator: rel, cmd: 'test -f docs/lifecycle-status.md', exit: 1, track: 'product' };
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
// Doc-vs-reality staleness gate (repro3 "정답": doc still shows open stages while HEAD moved on N
// commits without the doc being touched — a documentation-sync violation, not a missing-file gap).
// Threshold overridable per-repo cadence via EPDS_LIFECYCLE_STALE_COMMITS (ponytail calibration knob;
// no evidence base for one universal number across every repo's commit cadence).
export function collectLifecycleStale(target, lifecycleStatus) {
  if (!lifecycleStatus) return null; // file didn't exist -> doc.lifecycle.missing already covers it
  const rel = 'docs/lifecycle-status.md';
  const threshold = Number(process.env.EPDS_LIFECYCLE_STALE_COMMITS) || 5;
  let commitsSince = 0;
  try {
    const lastTouch = spawnSync('git', ['-C', target, 'log', '-1', '--format=%H', '--', rel], { encoding: 'utf8', timeout: 5000 });
    const lastHash = lastTouch.stdout.trim();
    if (lastHash) {
      const count = spawnSync('git', ['-C', target, 'rev-list', `${lastHash}..HEAD`, '--count'], { encoding: 'utf8', timeout: 5000 });
      commitsSince = parseInt(count.stdout.trim(), 10) || 0;
    }
  } catch { /* leave commitsSince 0 -- not stale by default, never fail-open to a false positive */ }
  const hasOpenRows = (lifecycleStatus.inProgress + lifecycleStatus.notStarted) > 0;
  const stale = commitsSince > threshold && hasOpenRows;
  return { id: 'doc.lifecycle.stale', value: { commitsSince, threshold, hasOpenRows, stale },
    locator: rel, cmd: `git log -1 --format=%H -- ${rel}`, exit: stale ? 1 : 0, track: 'product' };
}
// METRICS.md product track (H124 M8): >=1 metric row + a Measured date + a target comparison
// -> PASS/FAIL. Missing file = UNMEASURED-environment (id ends ".missing"). Present but unparseable
// (no Measured date, no valid row, bad markdown) = UNMEASURED-corrupted, never a silent PASS.
export function collectMetricsStatus(target) {
  const rel = 'METRICS.md';
  const file = path.join(target, rel);
  if (!fs.existsSync(file)) {
    return { id: 'metrics.missing', value: {}, locator: rel, cmd: 'test -f METRICS.md', exit: 1, track: 'product' };
  }
  let measuredAt = null;
  const rows = [];
  try {
    const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
    const measuredLine = lines.map((l) => l.trim().match(/^Measured:\s*(\S.*)$/)).find(Boolean);
    if (measuredLine) measuredAt = measuredLine[1].trim();
    const tableLines = lines.filter((l) => l.trim().startsWith('|') && l.trim().endsWith('|'));
    for (const line of tableLines) {
      const cells = line.split('|').slice(1, -1).map((c) => c.trim());
      if (cells.length < 4 || /^-+$/.test(cells[0]) || cells[0].toLowerCase() === 'metric') continue;
      const current = Number(cells[1]);
      const targetVal = Number(cells[2]);
      const direction = cells[3].toLowerCase();
      if (cells[0] === '' || Number.isNaN(current) || Number.isNaN(targetVal)
        || !['higher-better', 'lower-better'].includes(direction)) continue;
      rows.push({ metric: cells[0], current, target: targetVal, direction });
    }
  } catch {
    return { id: 'metrics.status', value: { corrupted: true, measuredAt: null, rowCount: 0 },
      locator: rel, cmd: 'read METRICS.md', exit: 1, track: 'product' };
  }
  if (!measuredAt || rows.length === 0) {
    return { id: 'metrics.status', value: { corrupted: true, measuredAt, rowCount: rows.length },
      locator: rel, cmd: 'read METRICS.md', exit: 1, track: 'product' };
  }
  const failing = rows.filter((r) => (r.direction === 'higher-better' ? r.current < r.target : r.current > r.target));
  const pass = failing.length === 0;
  return { id: 'metrics.status', value: { corrupted: false, measuredAt, rows, failing: failing.map((r) => r.metric) },
    locator: rel, cmd: 'read METRICS.md', exit: pass ? 0 : 1, track: 'product' };
}
