#!/usr/bin/env node
// bin/status.mjs — deterministic evidence layer for `epds status --json` (no LLM calls; interpretation stays null).
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectGit, collectTest, collectJudges, collectSimDumps } from './status-collect.mjs';
import { collectLifecycle, collectLifecycleStale, collectMetricsStatus } from './status-collect-docs.mjs';
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
// 미달 순서(심각→PASS): FAIL 만 실제 결함. UNMEASURED 3분화는 결함이 아니라 계측 공백(bands §3) —
// corrupted(산출물 손상, 뭘 놓쳤는지도 모름) > censored(관측은 됐으나 사건 미발생) > environment(도구 미배선/UNWIRED, criteria:31).
const RANK = { FAIL: 0, 'UNMEASURED-corrupted': 1, 'UNMEASURED-censored': 2, 'UNMEASURED-environment': 3, PASS: 4 };
// Judge-plugin facts (mqc.*, or whatever a target's epds/judges.json configures) carry their own
// value.directionHint built from that config's cmd/outputGlob — no per-judge text is hardcoded here
// (H124 portability). This table only covers the built-in, non-configurable facts.
const DIRECTION_TABLE = {
  'test.exit': (f) => f.value.env
    ? `테스트 실행 환경 확인 - ${f.locator} (exit ${f.value.exit}, 명령/의존성 미설치 가능 - 실패 아님)`
    : `테스트 실패 원인 조사 - ${f.locator} (exit ${f.value.exit})`,
  'test.counter.sanity': (f) => `테스트 러너 출력 확인 - ${f.locator} (파싱된 fail=${f.value.failCount}, exit=${f.value.testExit} 불일치)`,
  'sim.endReason.distribution': () => 'sim-dump seed 다양화 - endReason 분포 확보(censored 해소)',
  'doc.lifecycle.missing': () => 'docs/lifecycle-status.md 작성 - 단계 상태 정본 없음',
  'doc.lifecycle.stale': (f) => `${f.locator} 갱신 - HEAD 대비 ${f.value.commitsSince}커밋 미갱신 상태로 미완료 단계 존재`,
  'metrics.missing': () => 'METRICS.md 작성 - 지표·측정일·목표 정의 없음',
  'metrics.status': (f) => (f.value.corrupted
    ? `METRICS.md 형식 확인 - ${f.locator} (측정일/표 파싱 실패)`
    : `목표 미달 지표 개선 - ${f.value.failing.join(', ')}`)
};
// Shared FAIL>corrupted>censored>environment>PASS classification for one track's facts. A track with
// zero facts (nothing configured/applicable) is UNMEASURED-environment, never a silent PASS — absence
// of evidence is not evidence of PASS (criteria:31 UNWIRED philosophy, generalized to both tracks).
function classifyTrack(trackFacts) {
  if (trackFacts.length === 0) return { verdict: 'UNMEASURED-environment', evidence: [] };
  // env/corrupted/censored are computed first and "claimed" out of the FAIL pool — a fact whose id
  // ends ".missing" (or is flagged env/corrupted) is never a raw FAIL, no matter its exit code.
  const corruptedFacts = trackFacts.filter((f) => f.value && f.value.corrupted === true);
  const censoredFacts = trackFacts.filter((f) => f.value && f.value.censored === true);
  const envFacts = trackFacts.filter((f) => f.id.endsWith('.missing') || (f.value && f.value.env === true));
  const claimed = new Set([...corruptedFacts, ...censoredFacts, ...envFacts]);
  const failFacts = trackFacts.filter((f) => f.exit !== 0 && !claimed.has(f));
  if (failFacts.length > 0) return { verdict: 'FAIL', evidence: failFacts };
  if (corruptedFacts.length > 0) return { verdict: 'UNMEASURED-corrupted', evidence: corruptedFacts };
  if (censoredFacts.length > 0) return { verdict: 'UNMEASURED-censored', evidence: censoredFacts };
  if (envFacts.length > 0) return { verdict: 'UNMEASURED-environment', evidence: envFacts };
  return { verdict: 'PASS', evidence: [] };
}
function buildState(facts) {
  const technical = classifyTrack(facts.filter((f) => f.track === 'technical'));
  const product = classifyTrack(facts.filter((f) => f.track === 'product'));
  return {
    state: { product: { verdict: product.verdict, evidence: product.evidence.map((f) => f.id) },
      technical: { verdict: technical.verdict, evidence: technical.evidence.map((f) => f.id) } },
    technicalFailFact: technical.evidence[0] ?? null,
    productFailFact: product.evidence[0] ?? null
  };
}
function buildPosition(facts, state) {
  const lifecycle = facts.find((f) => f.id === 'doc.lifecycle.status');
  const stage = lifecycle && lifecycle.value.firstOpenStage ? lifecycle.value.firstOpenStage : 'unknown';
  const techRank = RANK[state.state.technical.verdict];
  const prodRank = RANK[state.state.product.verdict];
  let weakerIsProduct = prodRank < techRank;
  // tie-break: when ranks tie, prefer whichever track actually has an evidence fact — a real
  // nextAction beats "판정 불가" when e.g. technical has nothing configured at all (self-apply).
  if (prodRank === techRank && !state.technicalFailFact && state.productFailFact) weakerIsProduct = true;
  const track = weakerIsProduct ? 'product' : 'technical';
  const item = weakerIsProduct ? state.productFailFact : state.technicalFailFact;
  return {
    stage,
    weakest: { track, item: item ? item.id : null, rule: 'FAIL > UNMEASURED-corrupted > UNMEASURED-censored > UNMEASURED-environment > PASS' }
  };
}
function buildOutcome(target) {
  const rel = 'PRODUCT.md';
  const productMd = path.join(target, rel);
  if (!fs.existsSync(productMd)) return { goal: null, locator: null, gap: 'PRODUCT.md 없음 - 최종 결과물 미정의' };
  try {
    const lines = fs.readFileSync(productMd, 'utf8').split(/\r?\n/);
    const goalLine = lines.map((l) => l.trim().match(/^Goal:\s*(.+)$/)).find(Boolean);
    if (goalLine) return { goal: goalLine[1].trim(), locator: rel, gap: null };
    const headingAt = lines.findIndex((l) => l.trim() === '## Goal');
    const next = headingAt !== -1 ? lines.slice(headingAt + 1).find((l) => l.trim().length > 0) : null;
    if (next) return { goal: next.trim(), locator: rel, gap: null };
  } catch { /* fall through */ }
  return { goal: null, locator: rel, gap: 'PRODUCT.md 에 "Goal: ..." 줄/"## Goal" 헤딩 없음 - 목표 미정의' };
}
function buildDirection(weakestFact) {
  if (!weakestFact) return { nextAction: '판정 불가 - 트랙 사실 없음', evidence: [], smallest: false };
  // a judge-plugin fact carries its own directionHint (built from that target's epds/judges.json
  // cmd/outputGlob) — that always wins over the built-in table, since the table has no entry for it.
  const hint = weakestFact.value && weakestFact.value.directionHint;
  const build = DIRECTION_TABLE[weakestFact.id];
  const nextAction = hint || (build ? build(weakestFact) : `${weakestFact.id} 결함 해소`);
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
// keep milliseconds (WAL "status = 스냅샷+이력" needs per-run granularity, not per-second).
function isoCompact(iso) { return iso.replace(/[-:]/g, '').replace(/\.(\d+)Z$/, '$1Z'); }
// repoId/snapshotDir — snapshots live OUTSIDE target under EPDS_HOME (default ~/.epds), keyed by
// the target's resolved-path hash (same shape as the harness's lib-lock-home.sh lock_repo_id), so
// `status --json` never dirties the target's own git status (M6 self-pollution fix).
function repoId(target) {
  let resolved = target;
  try { resolved = fs.realpathSync(target); } catch { /* leave as-is */ }
  return crypto.createHash('sha256').update(resolved).digest('hex').slice(0, 8);
}
function snapshotDir(target, opts) {
  if (opts.snapshotDir) return opts.snapshotDir;
  const home = process.env.EPDS_HOME || path.join(os.homedir(), '.epds');
  return path.join(home, 'status', repoId(target));
}
export function writeSnapshot(dir, output) {
  const base = isoCompact(output.measuredAt);
  let file = `${base}.status.json`, prevPath = null, changed = [];
  try {
    fs.mkdirSync(dir, { recursive: true });
    const existing = fs.readdirSync(dir).filter((f) => f.endsWith('.status.json')).sort();
    if (existing.length > 0) {
      prevPath = path.join(dir, existing[existing.length - 1]);
      const prev = JSON.parse(fs.readFileSync(prevPath, 'utf8'));
      changed = ['state', 'position', 'outcome', 'direction'].filter((k) => JSON.stringify(prev[k]) !== JSON.stringify(output[k]));
    }
    // same-ms collision (two runs within 1ms, or a frozen clock in a test) -> suffix instead of overwrite,
    // or the second run silently clobbers the first and its own "prev" points at itself (critic #2).
    for (let seq = 2; existing.includes(file); seq += 1) file = `${base}-${seq}.status.json`;
    fs.writeFileSync(path.join(dir, file), `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  } catch { /* snapshot dir unwritable — leave prev/changed at defaults, not fatal */ }
  return { path: path.join(dir, file), prev: prevPath, changed };
}
// H125 item2: this binary is a deterministic collector — no LLM ever runs it, so `runner` says so
// truthfully instead of echoing back a caller-supplied --model/--effort flag no LLM actually used
// (critic 20260919 C6: that passthrough recorded models that never executed this code). Whatever
// interpretation layer a SKILL bolts on afterward attaches its OWN `interpretation.runner` (default
// 'unknown' there too) — this collector never fabricates that field.
function parseArgs(argv) {
  const out = { target: null, snapshotDir: null, runner: { model: 'none', effort: null, dataTier: 'B' } };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--target') out.target = argv[++i] ?? null;
    else if (argv[i] === '--snapshot-dir') out.snapshotDir = argv[++i] ?? null;
    else if (argv[i] === '--data-tier') out.runner.dataTier = argv[++i] ?? 'B';
  }
  return out;
}
export function runStatus(argv) {
  const opts = parseArgs(argv);
  if (!opts.target) return { output: { error: 'missing --target', exit: 2 }, exit: 2 };
  const target = path.resolve(opts.target);
  const facts = [collectGit(target)];
  const testFacts = collectTest(target); if (testFacts) facts.push(...testFacts);
  const lifecycleFact = collectLifecycle(target);
  facts.push(lifecycleFact);
  if (lifecycleFact.id === 'doc.lifecycle.status') {
    const staleFact = collectLifecycleStale(target, lifecycleFact.value);
    if (staleFact) facts.push(staleFact);
  }
  facts.push(collectMetricsStatus(target));
  facts.push(...collectJudges(target));
  const simFact = collectSimDumps(target); if (simFact) facts.push(simFact);
  const factCheck = validateFacts(facts);
  if (!factCheck.ok) return { output: { error: factCheck.reason, exit: 2 }, exit: 2 };
  const { state, technicalFailFact, productFailFact } = buildState(facts);
  const position = buildPosition(facts, { state, technicalFailFact, productFailFact });
  const outcome = buildOutcome(target);
  const weakestFact = position.weakest.track === 'product' ? productFailFact : technicalFailFact;
  const direction = buildDirection(weakestFact);
  const questions = buildQuestions(outcome, position);
  const questionCheck = validateQuestions(questions);
  if (!questionCheck.ok) return { output: { error: questionCheck.reason, exit: 2 }, exit: 2 };
  // outcome.gap+locator = PRODUCT.md exists but had no parseable goal, distinct from fs.metrics.missing.
  const unmeasured = {
    // fs.metrics.missing's id is a fixed name; only count it when exit!=0 (an actual miss).
    environment: facts.filter((f) => (f.id.endsWith('.missing') && f.exit !== 0) || (f.value && f.value.env === true)).length
      + (outcome.gap && outcome.locator ? 1 : 0),
    censored: facts.filter((f) => f.value && f.value.censored === true).length,
    // real count, not a hardcoded 0: a corrupted judge/metrics output + per-file corrupted sim-dumps.
    corrupted: facts.filter((f) => f.value && f.value.corrupted === true).length
      + facts.reduce((sum, f) => sum + (f.value && typeof f.value.corruptedCount === 'number' ? f.value.corruptedCount : 0), 0)
  };
  const gitFact = facts.find((f) => f.id === 'git.head');
  const output = {
    schemaVersion: 1, measuredAt: new Date().toISOString(), runner: opts.runner,
    target: { path: target, head: gitFact ? gitFact.value.shortHead : 'unknown', dirty: gitFact ? gitFact.value.dirty : 0 },
    facts, state, position, outcome, direction, questions, unmeasured,
    snapshot: null, interpretation: null, exit: 0
  };
  const bothPass = state.product.verdict === 'PASS' && state.technical.verdict === 'PASS';
  const anyFail = state.product.verdict === 'FAIL' || state.technical.verdict === 'FAIL';
  output.exit = bothPass ? 0 : anyFail ? 1 : 3;
  output.snapshot = writeSnapshot(snapshotDir(target, opts), output);
  return { output, exit: output.exit };
}
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isMain) {
  const { output, exit } = runStatus(process.argv.slice(2));
  console.log(JSON.stringify(output, null, 2));
  process.exit(exit);
}
