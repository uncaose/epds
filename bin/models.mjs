#!/usr/bin/env node
// bin/models.mjs — generic session model detection + role-mapping framework (H154: absorbs
// pstack's setup-pstack strength — EPDS had no counterpart, see docs/absorb-pstack.md item 3).
//
// Deliberately generic: only public CLI tool names and standard provider env-var *names* are
// checked (never values — A19/secret-peek). No project-specific alias (e.g. a local model's
// nickname) is hardcoded here; EPDS is a portable public skill (SKILL.md:24), not tied to any
// one user's local-inventory.md or role-alias table.
import { access, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { dirname, join } from 'node:path';
import path from 'node:path';

export const KNOWN_CLIS = ['claude', 'codex', 'cursor-agent', 'opencode', 'gemini', 'aider', 'ollama', 'lms'];
export const KNOWN_ENV_KEYS = [
  'ANTHROPIC_API_KEY', 'OPENAI_API_KEY', 'GOOGLE_API_KEY', 'GEMINI_API_KEY',
  'OPENROUTER_API_KEY', 'MISTRAL_API_KEY', 'GROQ_API_KEY', 'XAI_API_KEY',
  'COHERE_API_KEY', 'DEEPSEEK_API_KEY'
];

// Reserved keys that must never be accepted as a role name (prototype-pollution guard — `roles`
// is later spread/assigned onto a plain object and re-serialized to JSON).
const RESERVED_ROLE_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

// Windows has no execute bit; a CLI installed there resolves through one of these extensions.
const WIN_EXTS = ['.exe', '.cmd', '.bat'];

async function isExecutableFile(p) {
  try {
    const info = await stat(p);
    if (!info.isFile()) return false;
    const mode = process.platform === 'win32' ? constants.F_OK : constants.X_OK;
    await access(p, mode);
    return true;
  } catch {
    return false;
  }
}

async function which(bin, pathDirs) {
  for (const dir of pathDirs) {
    const candidates = process.platform === 'win32'
      ? [join(dir, bin), ...WIN_EXTS.map((ext) => join(dir, bin + ext))]
      : [join(dir, bin)];
    for (const candidate of candidates) {
      if (await isExecutableFile(candidate)) return candidate;
    }
  }
  return null;
}

// env is injectable for tests; never logs or returns env[*] values, only which keys are set.
export async function detectSignals(env = process.env) {
  const pathDirs = (env.PATH ?? '').split(path.delimiter).filter(Boolean);
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

export async function exists(p) {
  try { await access(p, constants.F_OK); return true; } catch { return false; }
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
// write=true: REPLACES epds/models.json "detected" wholesale with this session's freshly
// detected signals — a session's live tool set is the truth, so a stale entry from a previous
// machine/session (e.g. a CLI that was uninstalled) must not survive a merge (H154 rework: the
// prior merge-and-dedup behavior let stale entries persist forever). "roles" is untouched (role
// assignment stays an explicit, separate `epds models set <role> <id>` step — detection never
// guesses which detected id should fill which role).
export async function runDetect(target, { write = false, env = process.env } = {}) {
  const detected = await detectSignals(env);
  if (!write) return { detected, written: null };
  const data = await loadModels(target);
  const next = { ...data, detectedAt: new Date().toISOString(), detected };
  const written = await saveModels(target, next);
  return { detected, written };
}

// Assigns `roles[role] = modelId`, in place on `data`, after two guards:
// 1. `role` must not be a prototype-pollution key (__proto__/constructor/prototype).
// 2. `modelId` must be one of the ids currently in `data.detected` (re-run `epds models detect
//    --write` first if the id you want isn't there yet) — a role must point at something this
//    session actually has, not a typo or a stale manual guess.
// Throws (never silently no-ops) so the CLI can exit non-zero on rejection.
export function setRole(data, role, modelId) {
  if (typeof role !== 'string' || role.length === 0) {
    throw new Error('role must be a non-empty string');
  }
  if (RESERVED_ROLE_KEYS.has(role)) {
    throw new Error(`"${role}" is a reserved key and cannot be used as a role name`);
  }
  if (!data.detected.some((d) => d.id === modelId)) {
    throw new Error(`"${modelId}" is not in detected signals — run "epds models detect --write" first, or check "epds models list"`);
  }
  data.roles[role] = modelId;
  return data;
}
