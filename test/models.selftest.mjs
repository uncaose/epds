#!/usr/bin/env node
// test/models.selftest.mjs — bin/models.mjs + `epds models` CLI (H154 pstack-absorb item 3:
// session model detection). `node test/models.selftest.mjs` -> exit 0.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { detectSignals, loadModels, saveModels, runDetect, setRole, modelsPath, KNOWN_CLIS, KNOWN_ENV_KEYS } from '../bin/models.mjs';

const here = path.dirname(new URL(import.meta.url).pathname);
const epdsBin = path.join(here, '..', 'bin', 'epds.mjs');

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

// ---- case 2: detectSignals finds a CLI binary present on a fake PATH, honors X_OK, and honors path.delimiter ----
{
  const dir = freshTmp();
  fs.writeFileSync(path.join(dir, 'claude'), '#!/bin/sh\n', { mode: 0o755 });
  const signals = await detectSignals({ PATH: dir });
  ok('case2 finds claude on PATH', signals.some((s) => s.id === 'cli:claude' && s.signal === path.join(dir, 'claude')));
  ok('case2 does not report unrelated known CLIs as found', !signals.some((s) => s.id === 'cli:codex'));

  const emptyDir = freshTmp();
  const multiPath = [emptyDir, dir].join(path.delimiter);
  const multiSignals = await detectSignals({ PATH: multiPath });
  ok('case2 honors path.delimiter across multiple PATH dirs', multiSignals.some((s) => s.id === 'cli:claude'));

  if (process.platform !== 'win32') {
    const noExecDir = freshTmp();
    fs.writeFileSync(path.join(noExecDir, 'codex'), '#!/bin/sh\n', { mode: 0o644 });
    const noExecSignals = await detectSignals({ PATH: noExecDir });
    ok('case2 a non-executable file on PATH is not reported (X_OK enforced)', !noExecSignals.some((s) => s.id === 'cli:codex'));
  }
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

// ---- case 6: runDetect write=true REPLACES "detected" wholesale (no merge), preserves "roles" ----
{
  const dir = freshTmp();
  fs.writeFileSync(path.join(dir, 'claude'), '#!/bin/sh\n', { mode: 0o755 });
  await saveModels(dir, {
    version: 1,
    detectedAt: null,
    detected: [
      { id: 'cli:claude', kind: 'cli', signal: 'stale-path' },
      { id: 'cli:codex', kind: 'cli', signal: 'stale-path-uninstalled-since' }
    ],
    roles: { default: 'cli:claude' }
  });
  const { written } = await runDetect(dir, { write: true, env: { PATH: dir } });
  ok('case6 writes to epds/models.json', written === modelsPath(dir));
  const after = JSON.parse(fs.readFileSync(modelsPath(dir), 'utf8'));
  ok('case6 no duplicate cli:claude entries', after.detected.filter((d) => d.id === 'cli:claude').length === 1);
  ok('case6 a stale entry no longer detected this session (cli:codex) is DROPPED, not merged-in', !after.detected.some((d) => d.id === 'cli:codex'));
  ok('case6 stale signal path for cli:claude is refreshed to the current one', after.detected.find((d) => d.id === 'cli:claude').signal === path.join(dir, 'claude'));
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

// ---- case 8: setRole() success + validation-failure + reserved-key guard (library level) ----
{
  const data = { version: 1, detectedAt: new Date().toISOString(), detected: [{ id: 'cli:claude', kind: 'cli', signal: '/usr/local/bin/claude' }], roles: {} };
  setRole(data, 'critic', 'cli:claude');
  ok('case8 setRole assigns a role pointing at a detected id', data.roles.critic === 'cli:claude');

  let threwUnknown = false;
  try { setRole(data, 'reviewer', 'cli:not-detected'); } catch { threwUnknown = true; }
  ok('case8 setRole rejects a modelId not in detected[] (no silent write)', threwUnknown);
  ok('case8 rejected assignment left roles.reviewer unset', !('reviewer' in data.roles));

  for (const reserved of ['__proto__', 'constructor', 'prototype']) {
    let threwReserved = false;
    try { setRole(data, reserved, 'cli:claude'); } catch { threwReserved = true; }
    ok(`case8 setRole rejects reserved key "${reserved}"`, threwReserved);
  }
  ok('case8 no prototype pollution occurred', typeof {}.polluted === 'undefined');
}

// ---- case 9: `epds models` CLI end-to-end (detect --write, list, set success, set failures) ----
{
  const dir = freshTmp();
  fs.writeFileSync(path.join(dir, 'claude'), '#!/bin/sh\n', { mode: 0o755 });
  // execFileSync's own argv[0] resolution needs node itself findable, so PATH keeps `dir` first
  // (for the CLI's own `which('claude', ...)` scan) and process.execPath's dir appended after,
  // rather than replacing PATH wholesale.
  const env = { ...process.env, PATH: `${dir}${path.delimiter}${path.dirname(process.execPath)}` };
  const node = process.execPath;

  const detectOut = execFileSync(node, [epdsBin, 'models', 'detect', '--write'], { cwd: dir, env, encoding: 'utf8' });
  ok('case9 `models detect --write` reports the detected cli', JSON.parse(detectOut).detected.some((d) => d.id === 'cli:claude'));
  ok('case9 `models detect --write` created epds/models.json', fs.existsSync(modelsPath(dir)));

  const listOut = execFileSync(node, [epdsBin, 'models', 'list'], { cwd: dir, env, encoding: 'utf8' });
  ok('case9 `models list` echoes the written file', JSON.parse(listOut).detected.some((d) => d.id === 'cli:claude'));

  const setOut = execFileSync(node, [epdsBin, 'models', 'set', 'critic', 'cli:claude'], { cwd: dir, env, encoding: 'utf8' });
  ok('case9 `models set critic cli:claude` succeeds (exit 0 implied by execFileSync not throwing)', setOut.includes('Set roles.critic'));

  let unknownFailed = false;
  try {
    execFileSync(node, [epdsBin, 'models', 'set', 'reviewer', 'cli:ghost-not-detected'], { cwd: dir, env, encoding: 'utf8', stdio: 'pipe' });
  } catch (error) {
    unknownFailed = error.status !== 0;
  }
  ok('case9 `models set` with an undetected id exits non-zero', unknownFailed);

  let reservedFailed = false;
  try {
    execFileSync(node, [epdsBin, 'models', 'set', '__proto__', 'cli:claude'], { cwd: dir, env, encoding: 'utf8', stdio: 'pipe' });
  } catch (error) {
    reservedFailed = error.status !== 0;
  }
  ok('case9 `models set __proto__ ...` exits non-zero', reservedFailed);
}

console.log(fail === 0 ? `\nPASS (0 failures)` : `\nFAIL (${fail} failures)`);
process.exit(fail === 0 ? 0 : 1);
