#!/usr/bin/env node
// bin/status.mjs — deterministic evidence layer for `epds status --json` (no LLM calls;
// interpretation stays null). Collectors drafted by go-coder, fixed by hand; synthesis is hand-written.
import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
function collectGit(target) {
  const fact = { id: 'git.head', value: { head: 'unknown', shortHead: 'unknown', dirty: 0 },
    locator: '.git/HEAD', cmd: 'git rev-parse HEAD', exit: 0 };
  try {
    const head = spawnSync('git', ['-C', target, 'rev-parse', 'HEAD'], { encoding: 'utf8', timeout: 5000 });
    const short = spawnSync('git', ['-C', target, 'rev-parse', '--short', 'HEAD'], { encoding: 'utf8', timeout: 5000 });
    const st = spawnSync('git', ['-C', target, 'status', '--porcelain'], { encoding: 'utf8', timeout: 5000 });
    if (head.status !== 0 || short.status !== 0 || st.status !== 0) { fact.exit = 1; }
    else {
      fact.value = { head: head.stdout.trim(), shortHead: short.stdout.trim(),
        dirty: st.stdout.split(/\r?\n/).filter(Boolean).length };
    }
  } catch { fact.exit = 1; }
  return fact;
}
function collectTest(target) {
  const pkgPath = path.join(target, 'package.json');
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    if (!pkg.scripts || typeof pkg.scripts.test !== 'string') return null;
  } catch { return null; }
  let exit = 0;
  try { execSync('npm test --silent', { cwd: target, timeout: 20000, stdio: 'pipe' }); }
  catch (e) { exit = typeof e.status === 'number' ? e.status : 1; }
  return { id: 'test.exit', value: { exit }, locator: 'package.json', cmd: 'npm test --silent', exit };
}
function collectLifecycle(target) {
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
function collectMeasurement(target) {
  const relDir = 'journal/measurements/';
  const dir = path.join(target, 'journal', 'measurements');
  let files = [];
  try { files = fs.readdirSync(dir).filter((f) => f.endsWith('.latest.json')).map((f) => path.join(dir, f)); }
  catch { files = []; }
  if (files.length === 0) {
    return { id: 'mqc.missing', value: {}, locator: relDir, cmd: 'glob journal/measurements/*.latest.json', exit: 1 };
  }
  let newest = files[0], newestMtime = fs.statSync(newest).mtimeMs;
  for (const f of files.slice(1)) {
    const mtime = fs.statSync(f).mtimeMs;
    if (mtime > newestMtime) { newest = f; newestMtime = mtime; }
  }
  let exitField = null;
  try {
    const data = JSON.parse(fs.readFileSync(newest, 'utf8'));
    if (Object.prototype.hasOwnProperty.call(data, 'exit')) exitField = data.exit;
  } catch { /* leave null */ }
  const exit = typeof exitField === 'number' ? exitField : 0; // reflects the tool's own exit, not a fixed 0
  return { id: 'mqc.latest', value: { file: path.basename(newest), exit: exitField },
    locator: `${relDir}${path.basename(newest)}`, cmd: 'read journal/measurements/*.latest.json', exit };
}
function collectMetrics(target) {
  const product = fs.existsSync(path.join(target, 'PRODUCT.md'));
  const metrics = fs.existsSync(path.join(target, 'METRICS.md'));
  return { id: 'fs.metrics.missing', value: { 'PRODUCT.md': product, 'METRICS.md': metrics },
    locator: '.', cmd: 'test -f PRODUCT.md METRICS.md', exit: product && metrics ? 0 : 1 };
}
function collectSimDumps(target) {
  const relDir = 'docs/sim-dumps/';
  const dir = path.join(target, 'docs', 'sim-dumps');
  let files = [];
  try { files = fs.readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => path.join(dir, f)); }
  catch { files = []; }
  if (files.length === 0) return null;
  const reasons = [];
  for (const f of files) {
    try {
      const data = JSON.parse(fs.readFileSync(f, 'utf8'));
      if (typeof data.endReason === 'string') reasons.push(data.endReason);
    } catch { /* skip broken/missing-field files */ }
  }
  if (reasons.length === 0) return null;
  const values = [...new Set(reasons)].sort();
  return { id: 'sim.endReason.distribution',
    value: { distinctCount: values.length, values, censored: values.length === 1 },
    locator: relDir, cmd: 'glob docs/sim-dumps/*.json', exit: 0 };
}
export function validateFacts(facts) {
  for (const f of facts) {
    if (typeof f.locator !== 'string' || f.locator.length === 0) {
      return { ok: false, reason: `fact "${f.id ?? '?'}" missing locator` };
    }
  }
  return { ok: true };
}
const SHARPENS_KEYS = ['state', 'position', 'outcome', 'direction'];
export function validateQuestions(questions) {
  for (const q of questions) {
    const s = q.sharpens;
    if (!s || typeof s !== 'object' || Array.isArray(s)) {
      return { ok: false, reason: `question "${q.id ?? '?'}" sharpens missing/not-object` };
    }
    const keys = SHARPENS_KEYS.filter((k) => k in s);
    if (keys.length !== 4) {
      return { ok: false, reason: `question "${q.id ?? '?'}" sharpens missing key(s)` };
    }
    if (SHARPENS_KEYS.every((k) => s[k] === null || s[k] === undefined)) {
      return { ok: false, reason: `question "${q.id ?? '?'}" sharpens all null` };
    }
  }
  return { ok: true };
}
const RANK = { FAIL: 0, 'UNMEASURED-censored': 1, 'UNMEASURED-environment': 2, PASS: 3 };
const DIRECTION_TABLE = {
  'test.exit': (f) => `테스트 실패 원인 조사 - ${f.locator} (exit ${f.value.exit})`,
  'mqc.missing': () => '품질판정기 실행 - node scripts/merge-quality-check.mjs 등으로 journal/measurements/*.latest.json 생성',
  'mqc.latest': (f) => `품질판정기 재실행 - ${f.locator} exit=${f.value.exit} 원인 조사`,
  'sim.endReason.distribution': () => 'sim-dump seed 다양화 - endReason 분포 확보(censored 해소)',
  'doc.lifecycle.missing': () => 'docs/lifecycle-status.md 작성 - 단계 상태 정본 없음',
  'fs.metrics.missing': () => 'PRODUCT.md/METRICS.md 작성 - 최종 결과물·측정 정의'
};
function buildState(facts) {
  const technicalFacts = facts.filter((f) => ['test.exit', 'mqc.missing', 'mqc.latest', 'sim.endReason.distribution'].includes(f.id));
  // Only a fact that actually ran and failed is FAIL; a missing producer (mqc.missing) is UNMEASURED.
  const failFacts = technicalFacts.filter((f) => (f.id === 'test.exit' || f.id === 'mqc.latest') && f.exit !== 0);
  const censoredFacts = technicalFacts.filter((f) => f.value && f.value.censored === true);
  const envFacts = technicalFacts.filter((f) => f.id === 'mqc.missing');
  let technicalVerdict = 'PASS', technicalEvidence = [];
  if (failFacts.length > 0) { technicalVerdict = 'FAIL'; technicalEvidence = failFacts.map((f) => f.id); }
  else if (censoredFacts.length > 0) { technicalVerdict = 'UNMEASURED-censored'; technicalEvidence = censoredFacts.map((f) => f.id); }
  else if (envFacts.length > 0) { technicalVerdict = 'UNMEASURED-environment'; technicalEvidence = envFacts.map((f) => f.id); }
  const metricsFact = facts.find((f) => f.id === 'fs.metrics.missing');
  const lifecycleMissing = facts.find((f) => f.id === 'doc.lifecycle.missing');
  let productVerdict = 'PASS', productEvidence = [];
  if (metricsFact && metricsFact.exit !== 0) { productVerdict = 'UNMEASURED-environment'; productEvidence.push(metricsFact.id); }
  if (lifecycleMissing) { productVerdict = 'UNMEASURED-environment'; productEvidence.push(lifecycleMissing.id); }
  return {
    state: { product: { verdict: productVerdict, evidence: productEvidence }, technical: { verdict: technicalVerdict, evidence: technicalEvidence } },
    technicalFailFact: failFacts[0] ?? censoredFacts[0] ?? envFacts[0] ?? null,
    productFailFact: metricsFact && metricsFact.exit !== 0 ? metricsFact : (lifecycleMissing ?? null)
  };
}
function buildPosition(facts, state) {
  const lifecycle = facts.find((f) => f.id === 'doc.lifecycle.status');
  const stage = lifecycle && lifecycle.value.firstOpenStage ? lifecycle.value.firstOpenStage : 'unknown';
  const techRank = RANK[state.state.technical.verdict];
  const prodRank = RANK[state.state.product.verdict];
  const weakerIsProduct = prodRank < techRank;
  const track = weakerIsProduct ? 'product' : 'technical';
  const item = weakerIsProduct ? state.productFailFact : state.technicalFailFact;
  return {
    stage,
    weakest: { track, item: item ? item.id : null, rule: 'FAIL > UNMEASURED-censored > UNMEASURED-environment > PASS' }
  };
}
function buildOutcome(target) {
  const productMd = path.join(target, 'PRODUCT.md');
  if (fs.existsSync(productMd)) {
    try {
      const firstLine = fs.readFileSync(productMd, 'utf8').split(/\r?\n/).find((l) => l.trim().length > 0);
      if (firstLine) return { goal: firstLine.trim(), locator: 'PRODUCT.md', gap: null };
    } catch { /* fall through */ }
  }
  return { goal: null, locator: null, gap: 'PRODUCT.md 없음 - 최종 결과물 미정의' };
}
function buildDirection(state, weakestFact) {
  if (!weakestFact) return { nextAction: '판정 불가 - 트랙 사실 없음', evidence: [], smallest: false };
  const build = DIRECTION_TABLE[weakestFact.id];
  const nextAction = build ? build(weakestFact) : `${weakestFact.id} 결함 해소`;
  return { nextAction, evidence: [weakestFact.id], smallest: true };
}
function buildQuestions(outcome, position) {
  const candidates = [];
  if (outcome.goal === null) {
    candidates.push({
      id: 'Q1', ask: "이 제품의 '다 됐다'는 무엇으로 판정하나?", ownerOnly: true, source: 'grilling:frontier',
      sharpens: { state: 'product 트랙 증거원 지정', position: null, outcome: 'goal 채움(null 해소)', direction: null }
    });
  }
  candidates.push({
    id: `Q${candidates.length + 1}`,
    ask: `${position.weakest.item ?? position.stage} 이(가) ${position.weakest.track} 트랙 최약점이다 — 이 이유를 무엇으로 해소할 것인가?`,
    ownerOnly: true, source: 'weakest-gate',
    sharpens: { state: `${position.weakest.track} 트랙 재검증`, position: 'Verify 단계 재확인', outcome: null, direction: 'nextAction 대상 확정' }
  });
  candidates.push({
    id: `Q${candidates.length + 1}`,
    ask: '지금의 다음 액션이 가장 작은 유효 개선인가, 다른 더 급한 결함이 있는가?',
    ownerOnly: true, source: 'grilling:frontier',
    sharpens: { state: null, position: 'stage 재확인', outcome: null, direction: 'nextAction 교체 가능' }
  });
  return candidates.slice(0, 5);
}
function isoCompact(iso) { return iso.replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z'); }
function writeSnapshot(target, output) {
  const dir = path.join(target, 'journal', 'epds');
  const rel = `journal/epds/${isoCompact(output.measuredAt)}.status.json`;
  let prevRel = null, changed = [];
  try {
    fs.mkdirSync(dir, { recursive: true });
    const existing = fs.readdirSync(dir).filter((f) => f.endsWith('.status.json')).sort();
    if (existing.length > 0) {
      const prevPath = path.join(dir, existing[existing.length - 1]);
      prevRel = `journal/epds/${existing[existing.length - 1]}`;
      const prev = JSON.parse(fs.readFileSync(prevPath, 'utf8'));
      for (const key of ['state', 'position', 'outcome', 'direction']) {
        if (JSON.stringify(prev[key]) !== JSON.stringify(output[key])) changed.push(key);
      }
    }
    fs.writeFileSync(path.join(dir, path.basename(rel)), `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  } catch { /* snapshot dir unwritable — leave prev/changed at defaults, not fatal */ }
  return { path: rel, prev: prevRel, changed };
}
function parseArgs(argv) {
  const out = { target: null, runner: { model: 'unknown', effort: 'unknown', dataTier: 'B' } };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--target') out.target = argv[++i] ?? null;
    else if (argv[i] === '--model') out.runner.model = argv[++i] ?? 'unknown';
    else if (argv[i] === '--effort') out.runner.effort = argv[++i] ?? 'unknown';
    else if (argv[i] === '--data-tier') out.runner.dataTier = argv[++i] ?? 'B';
  }
  return out;
}
export function runStatus(argv) {
  const opts = parseArgs(argv);
  if (!opts.target) {
    return { output: { error: 'missing --target', exit: 2 }, exit: 2 };
  }
  const target = path.resolve(opts.target);
  const facts = [collectGit(target)];
  const testFact = collectTest(target); if (testFact) facts.push(testFact);
  facts.push(collectLifecycle(target));
  facts.push(collectMeasurement(target));
  facts.push(collectMetrics(target));
  const simFact = collectSimDumps(target); if (simFact) facts.push(simFact);
  const factCheck = validateFacts(facts);
  if (!factCheck.ok) return { output: { error: factCheck.reason, exit: 2 }, exit: 2 };
  const { state, technicalFailFact, productFailFact } = buildState(facts);
  const position = buildPosition(facts, { state, technicalFailFact, productFailFact });
  const outcome = buildOutcome(target);
  const weakestFact = position.weakest.track === 'product' ? productFailFact : technicalFailFact;
  const direction = buildDirection(state, weakestFact);
  const questions = buildQuestions(outcome, position);
  const questionCheck = validateQuestions(questions);
  if (!questionCheck.ok) return { output: { error: questionCheck.reason, exit: 2 }, exit: 2 };
  const unmeasured = {
    // fs.metrics.missing's id is a fixed name; only count it when exit!=0 (an actual miss).
    environment: facts.filter((f) => f.id.endsWith('.missing') && f.exit !== 0).length,
    censored: facts.filter((f) => f.value && f.value.censored === true).length,
    corrupted: 0
  };
  const gitFact = facts.find((f) => f.id === 'git.head');
  const output = {
    schemaVersion: 1,
    measuredAt: new Date().toISOString(),
    runner: opts.runner,
    target: { path: target, head: gitFact ? gitFact.value.shortHead : 'unknown', dirty: gitFact ? gitFact.value.dirty : 0 },
    facts,
    state,
    position,
    outcome,
    direction,
    questions,
    unmeasured,
    snapshot: null,
    interpretation: null,
    exit: 0
  };
  const bothPass = state.product.verdict === 'PASS' && state.technical.verdict === 'PASS';
  const anyFail = state.product.verdict === 'FAIL' || state.technical.verdict === 'FAIL';
  output.exit = bothPass ? 0 : anyFail ? 1 : 3;
  output.snapshot = writeSnapshot(target, output);
  return { output, exit: output.exit };
}
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isMain) {
  const { output, exit } = runStatus(process.argv.slice(2));
  console.log(JSON.stringify(output, null, 2));
  process.exit(exit);
}
