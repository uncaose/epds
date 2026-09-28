#!/usr/bin/env node
// bin/models.mjs — generic session model detection + role-mapping framework (H154: absorbs
// pstack's setup-pstack strength — EPDS had no counterpart, see docs/absorb-pstack.md item 3).
//
// Deliberately generic: only public CLI tool names and standard provider env-var *names* are
// checked (never values — A19/secret-peek). No project-specific alias (e.g. a local model's
// nickname) is hardcoded here; EPDS is a portable public skill (SKILL.md:24), not tied to any
// one user's local-inventory.md or role-alias table.
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { dirname, join } from 'node:path';

export const KNOWN_CLIS = ['claude', 'codex', 'cursor-agent', 'opencode', 'gemini', 'aider', 'ollama', 'lms'];
export const KNOWN_ENV_KEYS = [
  'ANTHROPIC_API_KEY', 'OPENAI_API_KEY', 'GOOGLE_API_KEY', 'GEMINI_API_KEY',
  'OPENROUTER_API_KEY', 'MISTRAL_API_KEY', 'GROQ_API_KEY', 'XAI_API_KEY',
  'COHERE_API_KEY', 'DEEPSEEK_API_KEY'
];

async function exists(p) {
  try { await access(p, constants.F_OK); return true; } catch { return false; }
}

async function which(bin, pathDirs) {
  for (const dir of pathDirs) {
    const candidate = join(dir, bin);
    if (await exists(candidate)) return candidate;
  }
  return null;
}

// env is injectable for tests; never logs or returns env[*] values, only which keys are set.
export async function detectSignals(env = process.env) {
  const pathDirs = (env.PATH ?? '').split(':').filter(Boolean);
  const clis = [];
  for (const bin of KNOWN_CLIS) {
    const found = await which(bin, pathDirs);
    if (found) clis.push({ id: `cli:${bin}`, kind: 'cli', signal: found });
  }
  const envSignals = KNOWN_ENV_KEYS
    .filter((k) => typeof env[k] === 'string' && env[k].length > 0)
    .map((k) => ({ id: `env:${k}`, kind: 'env', signal: k }));
  return [...clis, ...envSignals];
}

export function modelsPath(target) {
  return join(target, 'epds', 'models.json');
}

export async function loadModels(target) {
  const p = modelsPath(target);
  if (!(await exists(p))) return { version: 1, detectedAt: null, detected: [], roles: {} };
  const data = JSON.parse(await readFile(p, 'utf8'));
  if (!Array.isArray(data.detected)) throw new Error(`${p}: missing "detected" array`);
  if (typeof data.roles !== 'object' || data.roles === null || Array.isArray(data.roles)) {
    throw new Error(`${p}: missing "roles" object`);
  }
  return data;
}

export async function saveModels(target, data) {
  const p = modelsPath(target);
  await mkdir(dirname(p), { recursive: true });
  await writeFile(p, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  return p;
}

// write=false (default): report only, nothing touched on disk.
// write=true: merge newly detected signals into epds/models.json, existing "roles" untouched
// (role assignment stays an explicit, separate `epds models set <role> <id>` step — detection
// never guesses which detected id should fill which role).
export async function runDetect(target, { write = false, env = process.env } = {}) {
  const detected = await detectSignals(env);
  if (!write) return { detected, written: null };
  const data = await loadModels(target);
  const merged = [...data.detected];
  for (const d of detected) {
    if (!merged.some((m) => m.id === d.id)) merged.push(d);
  }
  const next = { ...data, detectedAt: new Date().toISOString(), detected: merged };
  const written = await saveModels(target, next);
  return { detected, written };
}
