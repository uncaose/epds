#!/usr/bin/env node
// bin/status-collect.mjs — technical fact collectors for bin/status.mjs (git/test/judges/sim).
// Doc/product collectors (lifecycle, metrics) live in status-collect-docs.mjs (A17 <=300 lines/file).
import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
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
  // guard: a target whose own test script re-invokes `epds status` on itself (epds's own package.json
  // does, H125 item5) would spawn npm test -> this selftest -> collectTest(target) -> npm test forever
  // without this — the env flag set on the spawned child below stops that SAME target from nesting twice.
  if (process.env.EPDS_STATUS_TEST_GUARD === target) return null;
  let exit = 0, env = false, output = '';
  try { output = execSync('npm test --silent', { cwd: target, timeout: 20000, stdio: 'pipe', encoding: 'utf8',
    env: { ...process.env, EPDS_STATUS_TEST_GUARD: target } }); }
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
// H125 item4: outputGlob may point outside the target (absolute path, ~, or $EPDS_HOME) so a judge's
// measurement output never has to be dropped inside the target worktree just to be discoverable.
// A plain relative pattern keeps the original target-relative resolution unchanged.
function expandOutputGlob(pattern) {
  if (pattern.startsWith('~')) return path.join(os.homedir(), pattern.slice(1));
  if (pattern.includes('$EPDS_HOME')) {
    return pattern.replace('$EPDS_HOME', process.env.EPDS_HOME || path.join(os.homedir(), '.epds'));
  }
  return pattern;
}
// v4 finding (metrics-v4.md §0-b/§0-c): outputGlob pointing at a directory shared across targets
// (wildcard + shared dir) can match another target's judge output by mtime alone. judge.targetField
// (default "game") names the field the judge's own JSON carries; when present as a string it must
// resolve to this target (basename or realpath) to be adopted. Field absent -> no info -> unguarded
// (keeps every pre-existing judge fixture, none of which carry this field, working unchanged).
// targetField:null is an explicit opt-out (guard skipped entirely).
function judgeTargetValue(data, targetField) {
  const val = data && data[targetField];
  return typeof val === 'string' && val.length > 0 ? val : null;
}
function judgeTargetMatches(val, target) {
  if (path.basename(val) === path.basename(target)) return true;
  try { return fs.realpathSync(path.resolve(val)) === fs.realpathSync(target); }
  catch { return path.resolve(val) === path.resolve(target); }
}
// H125 item1: UNMEASURED-verdict judge rows get a 3-way class from their `detail` text, same split as
// bands doc §3 (environment=tool not wired, censored=observed but event never happened, corrupted=
// everything else/output damage). A target's epds/judges.json can override this per judge via a
// `classify` array of {class, matches:[substr,...]} tried in order — no keyword is hardcoded per-judge.
const DEFAULT_CLASSIFY = [
  { class: 'environment', matches: ['--skip-trace', '계약 없음', '미설치', 'env'] },
  { class: 'censored', matches: ['절단', 'censored'] },
  { class: 'corrupted', matches: ['파싱'] }
];
function classifyUnmeasured(detail, table) {
  const rules = Array.isArray(table) && table.length > 0 ? table : DEFAULT_CLASSIFY;
  const text = typeof detail === 'string' ? detail : '';
  for (const rule of rules) {
    if (Array.isArray(rule.matches) && rule.matches.some((m) => text.includes(m))) return rule.class;
  }
  return 'corrupted'; // no keyword hit -> "그 외 = corrupted" (bands §3), never a silent PASS
}
// A judge with no applicable config (applies:"never", or absent entirely) generates NO per-row fact —
// "해당 없음", not UNMEASURED-environment. If NONE of the configured judges are applicable at all, a
// single judges.unconfigured fact makes the resulting "technical track had 0 evidence" explicit
// (H125 item5) instead of a silent empty array.
export function collectJudges(target) {
  const facts = [];
  let anyApplicable = false;
  for (const judge of loadJudgesConfig(target)) {
    if (!judge || judge.applies === 'never' || !judge.id || !judge.outputGlob) continue;
    anyApplicable = true;
    const expanded = expandOutputGlob(judge.outputGlob);
    const absolute = path.isAbsolute(expanded);
    const dir = path.dirname(absolute ? expanded : path.join(target, expanded));
    const pattern = path.basename(expanded);
    const re = globToRegExp(pattern);
    let files = [];
    try { files = fs.readdirSync(dir).filter((f) => re.test(f)).map((f) => path.join(dir, f)); }
    catch { files = []; }
    const relDir = absolute ? `${dir}${path.sep}` : `${path.relative(target, dir)}${path.sep}`;
    if (files.length === 0) {
      const directionHint = `${judge.cmd || `${judge.id} 실행`} 등으로 ${judge.outputGlob} 생성`;
      facts.push({ id: `${judge.id}.missing`, value: { directionHint }, locator: relDir,
        cmd: `glob ${judge.outputGlob}`, exit: 1, track: 'technical' });
      continue;
    }
    const mtime = (f) => fs.statSync(f).mtimeMs;
    let newest = files.reduce((a, b) => (mtime(b) > mtime(a) ? b : a));
    let matchNote = '';
    const targetField = Object.prototype.hasOwnProperty.call(judge, 'targetField') ? judge.targetField : 'game';
    if (targetField !== null) {
      let newestParsed;
      try { newestParsed = JSON.parse(fs.readFileSync(newest, 'utf8')); } catch { newestParsed = undefined; } // corrupted -> unguarded, existing corrupted-fact path below handles it
      const newestVal = newestParsed === undefined ? null : judgeTargetValue(newestParsed, targetField);
      if (newestVal !== null && !judgeTargetMatches(newestVal, target)) {
        // newest is valid JSON for a DIFFERENT target (shared outputGlob dir) — look for a
        // same-target candidate among the rest, newest-first; adopt only a confirmed match.
        const rest = files.filter((f) => f !== newest).sort((a, b) => mtime(b) - mtime(a));
        let matched = null, matchedVal = null;
        for (const f of rest) {
          let d;
          try { d = JSON.parse(fs.readFileSync(f, 'utf8')); } catch { continue; }
          const v = judgeTargetValue(d, targetField);
          if (v !== null && judgeTargetMatches(v, target)) { matched = f; matchedVal = v; break; }
        }
        if (!matched) {
          facts.push({ id: `${judge.id}.unmatched`,
            value: { class: 'environment', env: true, directionHint: `output for other target: ${newestVal}` },
            locator: `${relDir}${path.basename(newest)}`, cmd: judge.cmd || `read ${judge.outputGlob}`,
            exit: 1, track: 'technical' });
          continue;
        }
        newest = matched;
        matchNote = ` (${targetField}=${matchedVal})`;
      } else if (newestVal !== null) {
        matchNote = ` (${targetField}=${newestVal})`;
      }
    }
    const newestName = `${path.basename(newest)}${matchNote}`;
    let data = null, corrupted = false;
    try { data = JSON.parse(fs.readFileSync(newest, 'utf8')); } catch { corrupted = true; }
    if (!corrupted && data && Array.isArray(data.results)) {
      // H125 item1: one fact per judged row — no more collapsing a 27-row verdict table into 2 fields.
      data.results.forEach((row, i) => {
        if (!row || !row.id) return;
        const cls = row.verdict === 'unmeasured' ? classifyUnmeasured(row.detail, judge.classify) : null;
        const value = { verdict: row.verdict, judge: row.judge || null, detail: row.detail || null, class: cls };
        if (cls === 'environment') value.env = true;
        if (cls === 'censored') value.censored = true;
        if (cls === 'corrupted') value.corrupted = true;
        // item3: a row corrupted-classified is UNMEASURED-corrupted, never a fake numeric PASS(0).
        const rowExit = row.verdict === 'deficient' ? 1 : (cls === 'corrupted' ? null : 0);
        facts.push({ id: `judge.${row.id}`, value, locator: `${relDir}${newestName}:${i + 1}`,
          cmd: judge.cmd || `read ${judge.outputGlob}`, exit: rowExit, track: 'technical' });
      });
      if (data.counts) {
        facts.push({ id: `${judge.id}.counts`, value: data.counts, locator: `${relDir}${newestName}`,
          cmd: judge.cmd || `read ${judge.outputGlob}`, exit: 0, track: 'technical' });
      }
      continue;
    }
    // generic {exit:N}-shaped judge output (no results[] table) — same summary fact as before,
    // except a corrupted output now reports exit:null instead of a fail-open 0 (item3).
    const exitField = judge.exitField || 'exit';
    let exitVal = null;
    if (!corrupted && data) {
      if (Object.prototype.hasOwnProperty.call(data, exitField)) exitVal = data[exitField];
      else corrupted = true;
    }
    const finalExit = corrupted ? null : (typeof exitVal === 'number' ? exitVal : 0);
    const directionHint = corrupted
      ? `${judge.id} 산출물 손상 - ${relDir}${newestName} (${exitField} 필드 없음/JSON 파손, 재실행 필요)`
      : `${judge.cmd || `${judge.id} 재실행`} - exit=${exitVal} 원인 조사`;
    facts.push({ id: `${judge.id}.latest`, value: { file: newestName, exit: exitVal, corrupted, directionHint },
      locator: `${relDir}${newestName}`, cmd: judge.cmd || `read ${judge.outputGlob}`, exit: finalExit, track: 'technical' });
  }
  if (!anyApplicable) {
    facts.push({ id: 'judges.unconfigured',
      value: { env: true, directionHint: 'epds/judges.json 작성 - technical 트랙 judge 증거 0(judges 미구성)' },
      locator: 'epds/judges.json', cmd: 'read epds/judges.json', exit: 1, track: 'technical' });
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
