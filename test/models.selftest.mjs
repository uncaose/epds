#!/usr/bin/env node
// test/models.selftest.mjs — bin/models.mjs (H154 pstack-absorb item 3: session model detection).
// `node test/models.selftest.mjs` -> exit 0.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { detectSignals, loadModels, saveModels, runDetect, modelsPath, KNOWN_CLIS, KNOWN_ENV_KEYS } from '../bin/models.mjs';

let fail = 0;
function ok(label, cond) {
  console.log(`  ${cond ? 'ok  ' : 'FAIL'} ${label}`);
  if (!cond) fail += 1;
}

function freshTmp() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'epds-models-selftest-'));
}

// ---- case 1: detectSignals never leaks env var VALUES, only names ----
{
  const fakeEnv = { PATH: '', ANTHROPIC_API_KEY: 'sk-super-secret-value-should-not-appear' };
  const signals = await detectSignals(fakeEnv);
  ok('case1 detects the env key by name', signals.some((s) => s.id === 'env:ANTHROPIC_API_KEY'));
  ok('case1 never includes the secret value anywhere in the signal', !JSON.stringify(signals).includes('sk-super-secret-value-should-not-appear'));
  ok('case1 empty PATH -> no cli signals', !signals.some((s) => s.kind === 'cli'));
}

// ---- case 2: detectSignals finds a CLI binary present on a fake PATH ----
{
  const dir = freshTmp();
  fs.writeFileSync(path.join(dir, 'claude'), '#!/bin/sh\n', { mode: 0o755 });
  const signals = await detectSignals({ PATH: dir });
  ok('case2 finds claude on PATH', signals.some((s) => s.id === 'cli:claude' && s.signal === path.join(dir, 'claude')));
  ok('case2 does not report unrelated known CLIs as found', !signals.some((s) => s.id === 'cli:codex'));
}

// ---- case 3: no project-specific alias hardcoded (only public tool names / standard env keys) ----
{
  ok('case3 KNOWN_CLIS are public tool names, no local alias like gamedev-coder/go-coder', !KNOWN_CLIS.some((n) => /gamedev|go-coder|go-worker|go-vision|go-reason/.test(n)));
  ok('case3 KNOWN_ENV_KEYS are standard provider key names', KNOWN_ENV_KEYS.includes('ANTHROPIC_API_KEY') && KNOWN_ENV_KEYS.includes('OPENAI_API_KEY'));
}

// ---- case 4: loadModels default shape when epds/models.json absent ----
{
  const dir = freshTmp();
  const data = await loadModels(dir);
  ok('case4 default version 1', data.version === 1);
  ok('case4 default detected []', Array.isArray(data.detected) && data.detected.length === 0);
  ok('case4 default roles {}', typeof data.roles === 'object' && Object.keys(data.roles).length === 0);
}

// ---- case 5: runDetect write=false never touches disk ----
{
  const dir = freshTmp();
  const { written } = await runDetect(dir, { write: false, env: { PATH: '' } });
  ok('case5 write=false returns written=null', written === null);
  ok('case5 write=false creates no file', !fs.existsSync(modelsPath(dir)));
}

// ---- case 6: runDetect write=true merges into epds/models.json, dedups, preserves existing roles ----
{
  const dir = freshTmp();
  fs.writeFileSync(path.join(dir, 'claude'), '#!/bin/sh\n', { mode: 0o755 });
  await saveModels(dir, { version: 1, detectedAt: null, detected: [{ id: 'cli:claude', kind: 'cli', signal: 'stale-path' }], roles: { default: 'cli:claude' } });
  const { written } = await runDetect(dir, { write: true, env: { PATH: dir } });
  ok('case6 writes to epds/models.json', written === modelsPath(dir));
  const after = JSON.parse(fs.readFileSync(modelsPath(dir), 'utf8'));
  ok('case6 dedups by id (no duplicate cli:claude entries)', after.detected.filter((d) => d.id === 'cli:claude').length === 1);
  ok('case6 preserves existing role assignment', after.roles.default === 'cli:claude');
  ok('case6 sets detectedAt', typeof after.detectedAt === 'string' && after.detectedAt.length > 0);
}

// ---- case 7: loadModels rejects a corrupted config instead of silently defaulting ----
{
  const dir = freshTmp();
  fs.mkdirSync(path.join(dir, 'epds'), { recursive: true });
  fs.writeFileSync(modelsPath(dir), JSON.stringify({ version: 1 }), 'utf8');
  let threw = false;
  try { await loadModels(dir); } catch { threw = true; }
  ok('case7 missing "detected"/"roles" throws instead of silently defaulting', threw);
}

console.log(fail === 0 ? `\nPASS (0 failures)` : `\nFAIL (${fail} failures)`);
process.exit(fail === 0 ? 0 : 1);
