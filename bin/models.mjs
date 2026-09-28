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

// Cursor's own current headless docs (cursor.com/docs/cli/headless, re-checked P10) show the
// binary as `agent`, not `cursor-agent` — but which name is actually on PATH can differ by install
// version, so both are detected (docs/absorb-pstack.md CLI table note).
export const KNOWN_CLIS = ['claude', 'codex', 'cursor-agent', 'agent', 'opencode', 'gemini', 'aider', 'ollama', 'lms'];
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

// N5: these CLIs run a *local* model the caller must name — "cli:ollama" or "cli:lms" alone is
// ambiguous about which model actually answers (docs/COMMANDS.md's CLI invocation table: `ollama
// run <model> "<prompt>"`, `lms chat <model> -p "<prompt>"` both require a model argument). A role
// pointed at one of these must say which model, as `cli:<name>:<model>`, or setRole rejects it.
const MODEL_REQUIRED_CLIS = new Set(['ollama', 'lms']);

// N1: a role value for a MODEL_REQUIRED_CLIS entry is stored as `cli:<name>:<model>` (setRole
// above), but `detectSignals` only ever detects the bare CLI itself (`cli:<name>` — it has no way
// to enumerate which local models a CLI can serve). Comparing the full `cli:ollama:llama3:8b`
// string against `detectedIds` (which only ever holds `cli:ollama`) would always read as "missing"
// and reconcileRoles would narrow/null the role even though the CLI is still right there — this
// maps a model-qualified role value back to the base id `detectedIds` actually carries.
function detectionKeyFor(id) {
  const parts = id.split(':');
  if (parts[0] === 'cli' && MODEL_REQUIRED_CLIS.has(parts[1]) && parts.length >= 3) {
    return `cli:${parts[1]}`;
  }
  return id;
}

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

// env is injectable for tests; never reads env[*] VALUES, only checks which keys are present
// (`k in env` is a property-existence check — it never evaluates the value at all, so an L4
// rework made this literal: the old `env[k].length > 0` form technically read the value into
// memory to measure it, even though it was then discarded; `k in env` avoids that read entirely).
export async function detectSignals(env = process.env) {
  const pathDirs = (env.PATH ?? '').split(path.delimiter).filter(Boolean);
  const clis = [];
  for (const bin of KNOWN_CLIS) {
    const found = await which(bin, pathDirs);
    if (found) clis.push({ id: `cli:${bin}`, kind: 'cli', signal: found });
  }
  const envSignals = KNOWN_ENV_KEYS
    .filter((k) => k in env)
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
// N1 rework: this file is inside `epds/`, a directory the target project may already have its own
// reasons to put other entries in (e.g. a local scratch file). APPEND the "models.json" line if
// it's missing, never overwrite whatever is already there — still idempotent (checked first).
async function ensureModelsGitignore(target) {
  const gitignorePath = join(dirname(modelsPath(target)), '.gitignore');
  const entry = 'models.json';
  const contents = (await exists(gitignorePath)) ? await readFile(gitignorePath, 'utf8') : '';
  if (contents.split('\n').map((l) => l.trim()).includes(entry)) return gitignorePath;
  await mkdir(dirname(gitignorePath), { recursive: true });
  const sep = contents.length === 0 || contents.endsWith('\n') ? '' : '\n';
  await writeFile(gitignorePath, `${contents}${sep}${entry}\n`, 'utf8');
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
// would let a reviewer panel or default model quietly point at nothing. Instead: any id inside a
// role's value that is no longer in the freshly detected set is warned about on stderr and dropped.
// N2: a role already null is left alone — untouched, no warning — so re-running `detect --write`
// twice in a row with nothing changed produces zero warnings, not a repeated "cleared to null"
// noise line for a role that was already null.
// N3: an array role only drops the ids that are actually missing, keeping the ones still detected
// (a 2-reviewer panel losing one reviewer shouldn't also silently drop the other); it only becomes
// null if EVERY id in it is missing. A role that ends this session as null (whether it started
// null-bound or was fully cleared here) has its `effort[role]` self-report deleted too — an effort
// level self-reported for an identity that no longer exists is stale, not corroborating. A role
// that was ALREADY null still gets any leftover `effort[role]` deleted (silently, no warning — N2
// only suppresses the noise line, not the stale-data cleanup); it can only be leftover from manual
// `models.json` edits or an older version of this function, since `setRole`/this same reconcile
// path always deletes `effort[role]` in the same step that clears `roles[role]` to `null`.
function reconcileRoles(roles, detected, effort = {}) {
  const detectedIds = new Set(detected.map((d) => d.id));
  const nextRoles = { ...roles };
  const nextEffort = { ...effort };
  const warnings = [];
  for (const [role, value] of Object.entries(roles)) {
    if (value === null) {
      delete nextEffort[role];
      continue;
    }
    const ids = Array.isArray(value) ? value : [value];
    const kept = ids.filter((id) => detectedIds.has(detectionKeyFor(id)));
    const missing = ids.filter((id) => !detectedIds.has(detectionKeyFor(id)));
    if (missing.length === 0) continue;
    if (kept.length === 0) {
      warnings.push(`role "${role}" pointed at ${missing.join(', ')}, no longer detected this session — cleared to null`);
      nextRoles[role] = null;
      delete nextEffort[role];
    } else {
      warnings.push(`role "${role}" lost ${missing.join(', ')}, no longer detected this session — narrowed to ${kept.join(', ')}`);
      nextRoles[role] = kept.length === 1 ? kept[0] : kept;
    }
  }
  return { roles: nextRoles, effort: nextEffort, warnings };
}

export async function runDetect(target, { write = false, env = process.env } = {}) {
  const detected = await detectSignals(env);
  if (!write) return { detected, written: null, warnings: [] };
  const data = await loadModels(target);
  const { roles, effort, warnings } = reconcileRoles(data.roles, detected, data.effort ?? {});
  for (const w of warnings) console.warn(`epds models detect --write: ${w}`);
  const next = { ...data, detectedAt: new Date().toISOString(), detected, roles, effort };
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
// 4. No id may repeat in the same list (L1) — a duplicate never adds a second reviewer, it's
//    always a typo or a copy-paste slip, so it's rejected rather than silently deduplicated.
// 5. `cli:ollama`/`cli:lms` (N5, MODEL_REQUIRED_CLIS) must carry a model: `cli:ollama:<model>`,
//    not bare `cli:ollama` — checked against `detected` by its base `cli:<name>` entry, since
//    detection only knows the CLI itself is on PATH, not which local models it can serve.
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
  const seen = new Set();
  for (const id of ids) {
    if (seen.has(id)) {
      throw new Error(`"${id}" is listed more than once in "${modelId}" — duplicate ids are not allowed`);
    }
    seen.add(id);
    if (id.startsWith('env:')) {
      throw new Error(`"${id}" is an env-var signal, not an invokable identity — env:* ids cannot be assigned to a role`);
    }
    const parts = id.split(':');
    if (parts[0] === 'cli' && MODEL_REQUIRED_CLIS.has(parts[1])) {
      // The model portion itself may contain a colon (e.g. an Ollama tag like "llama3:8b"), so
      // only the first two colons are structural — everything after them is the model id verbatim.
      const model = parts.slice(2).join(':');
      if (parts.length < 3 || model.length === 0) {
        throw new Error(`"${id}" requires a model id — use "cli:${parts[1]}:<model>" (e.g. "cli:${parts[1]}:llama3")`);
      }
      const base = `cli:${parts[1]}`;
      if (!data.detected.some((d) => d.id === base)) {
        throw new Error(`"${base}" is not in detected signals — run "epds models detect --write" first, or check "epds models list"`);
      }
    } else if (!data.detected.some((d) => d.id === id)) {
      throw new Error(`"${id}" is not in detected signals — run "epds models detect --write" first, or check "epds models list"`);
    }
  }
  data.roles[role] = ids.length === 1 ? ids[0] : ids;
  // N3: reassigning a role invalidates any effort self-report made for its previous identity.
  if (data.effort && role in data.effort) delete data.effort[role];
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
