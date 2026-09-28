#!/usr/bin/env node
// bin/models.mjs — generic session model detection + role-mapping framework (H154: absorbs
// pstack's setup-pstack strength — EPDS had no counterpart, see docs/absorb-pstack.md item 3).
//
// Deliberately generic: only public CLI tool names and standard provider env-var *names* are
// checked — never values, since reading a live credential into memory only to discard it risks
// that value leaking into logs or output; not checking it at all avoids the risk entirely. No
// project-specific alias (e.g. a local model's nickname) is hardcoded here; EPDS is a portable
// public skill (SKILL.md:24), not tied to any one user's local alias table.
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
  if (!(await exists(p))) return { version: 1, detectedAt: null, detected: [], roles: {}, effort: {} };
  const data = JSON.parse(await readFile(p, 'utf8'));
  if (!Array.isArray(data.detected)) throw new Error(`${p}: missing "detected" array`);
  if (typeof data.roles !== 'object' || data.roles === null || Array.isArray(data.roles)) {
    throw new Error(`${p}: missing "roles" object`);
  }
  if (data.effort === undefined) {
    data.effort = {};
  } else if (typeof data.effort !== 'object' || data.effort === null || Array.isArray(data.effort)) {
    throw new Error(`${p}: "effort" must be an object when present`);
  }
  return data;
}

// K2 (docs/absorb-pstack.md item 3 rework): the per-machine/session state file (epds/models.json)
// must never be committed. Rather than `epds setup` reaching into the TARGET PROJECT's own root
// .gitignore (a file the project owns and may format however it likes), saveModels() writes a
// small, idempotent epds/.gitignore next to models.json itself — one line, scoped to its own
// directory, safe to commit alongside epds/trusted-sources.json.
async function ensureModelsGitignore(target) {
  const gitignorePath = join(dirname(modelsPath(target)), '.gitignore');
  const entry = 'models.json';
  if (await exists(gitignorePath)) {
    const contents = await readFile(gitignorePath, 'utf8');
    if (contents.split('\n').map((l) => l.trim()).includes(entry)) return gitignorePath;
  }
  await mkdir(dirname(gitignorePath), { recursive: true });
  await writeFile(gitignorePath, `${entry}\n`, 'utf8');
  return gitignorePath;
}

export async function saveModels(target, data) {
  const p = modelsPath(target);
  await mkdir(dirname(p), { recursive: true });
  await writeFile(p, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  await ensureModelsGitignore(target);
  return p;
}

// write=false (default): report only, nothing touched on disk.
// write=true: REPLACES epds/models.json "detected" wholesale with this session's freshly
// detected signals — a session's live tool set is the truth, so a stale entry from a previous
// machine/session (e.g. a CLI that was uninstalled) must not survive a merge (H154 rework: the
// prior merge-and-dedup behavior let stale entries persist forever). "roles" is untouched (role
// assignment stays an explicit, separate `epds models set <role> <id>` step — detection never
// guesses which detected id should fill which role).
// K5: `detected` is replaced wholesale (see saveModels/loadModels comment above), so a role
// assignment made in an earlier session can point at an id this session no longer detects (the
// CLI got uninstalled, the env var got unset). Silently leaving that dangling reference in place
// would let a reviewer panel or default model quietly point at nothing. Instead: any role whose
// value (single id, or any id inside an array value — see setRole) is no longer in the freshly
// detected set is warned about on stderr and cleared to null, never left stale.
function reconcileRoles(roles, detected) {
  const detectedIds = new Set(detected.map((d) => d.id));
  const next = { ...roles };
  const warnings = [];
  for (const [role, value] of Object.entries(roles)) {
    const ids = Array.isArray(value) ? value : [value];
    const missing = ids.filter((id) => !detectedIds.has(id));
    if (missing.length > 0) {
      warnings.push(`role "${role}" pointed at ${missing.join(', ')}, no longer detected this session — cleared to null`);
      next[role] = null;
    }
  }
  return { roles: next, warnings };
}

export async function runDetect(target, { write = false, env = process.env } = {}) {
  const detected = await detectSignals(env);
  if (!write) return { detected, written: null, warnings: [] };
  const data = await loadModels(target);
  const { roles, warnings } = reconcileRoles(data.roles, detected);
  for (const w of warnings) console.warn(`epds models detect --write: ${w}`);
  const next = { ...data, detectedAt: new Date().toISOString(), detected, roles };
  const written = await saveModels(target, next);
  return { detected, written, warnings };
}

// Assigns `roles[role]`, in place on `data`, after guards:
// 1. `role` must not be a prototype-pollution key (__proto__/constructor/prototype).
// 2. `modelId` is one id, or a comma-separated list of ids (K4 — `roles.reviewers` panel support,
//    docs/COMMANDS.md `/verify` ↳ panel). Each id must be one of the ids currently in
//    `data.detected` (re-run `epds models detect --write` first if the id you want isn't there
//    yet) — a role must point at something this session actually has, not a typo or a stale
//    manual guess. A single id is stored as a string (unchanged shape); two or more are stored as
//    an array — `docs/COMMANDS.md` already documents `roles.reviewers` as "a single id or an
//    array of ids".
// 3. No `env:*` id may ever be assigned to a role (K6): an env var's presence only proves a key is
//    set, not that it names an invokable reviewer/model identity the panel could actually run —
//    unlike a `cli:<name>` id, there is nothing to execute. Rejected outright, not routed through
//    "the API", so a role always names something runnable.
// All ids are validated before anything is written — a rejection never leaves a partial list.
// Throws (never silently no-ops) so the CLI can exit non-zero on rejection.
export function setRole(data, role, modelId) {
  if (typeof role !== 'string' || role.length === 0) {
    throw new Error('role must be a non-empty string');
  }
  if (RESERVED_ROLE_KEYS.has(role)) {
    throw new Error(`"${role}" is a reserved key and cannot be used as a role name`);
  }
  if (typeof modelId !== 'string' || modelId.length === 0) {
    throw new Error('modelId must be a non-empty string (or comma-separated list of ids)');
  }
  const ids = modelId.split(',').map((s) => s.trim()).filter(Boolean);
  if (ids.length === 0) {
    throw new Error('modelId must contain at least one non-empty id');
  }
  for (const id of ids) {
    if (id.startsWith('env:')) {
      throw new Error(`"${id}" is an env-var signal, not an invokable identity — env:* ids cannot be assigned to a role`);
    }
    if (!data.detected.some((d) => d.id === id)) {
      throw new Error(`"${id}" is not in detected signals — run "epds models detect --write" first, or check "epds models list"`);
    }
  }
  data.roles[role] = ids.length === 1 ? ids[0] : ids;
  return data;
}

// K7: an optional, freely-typed reasoning-effort self-report sitting alongside `roles`, keyed by
// the same role name (`data.effort[role]`). No value is validated beyond "non-empty string" — EPDS
// is agent-neutral (docs/LAYOUT.md) and does not hardcode any provider's effort-token vocabulary
// (e.g. low/medium/high/max); it only records whatever the caller typed. See SKILL.md §Final
// report for how this connects to the mandatory effort self-report.
export function setEffort(data, role, effort) {
  if (typeof role !== 'string' || role.length === 0) {
    throw new Error('role must be a non-empty string');
  }
  if (!(role in data.roles)) {
    throw new Error(`role "${role}" has no assigned id yet — run "epds models set ${role} <id>" first`);
  }
  if (typeof effort !== 'string' || effort.length === 0) {
    throw new Error('effort must be a non-empty string');
  }
  data.effort = data.effort ?? {};
  data.effort[role] = effort;
  return data;
}
