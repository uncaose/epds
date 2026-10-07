#!/usr/bin/env node
// bin/unified.mjs — unified document template: generator (`epds new`) + checker (`epds check-doc`).
// Pure functions + a tiny CLI wrapper. Core = templates/unified/core.md + kinds/<kind>.md (public).
// A profile (e.g. a private project's extra fields) is a directory: frontmatter.txt, <kind>.md, VERSION.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const CORE_VERSION = '1';
export const KINDS = ['brief', 'report', 'spec', 'critic', 'decision', 'research'];
export const STATUSES = ['draft', 'active', 'done', 'deprecated'];
const REQUIRED_KEYS = ['template', 'kind', 'id', 'status', 'updated', 'owner', 'source'];
const TEMPLATE_RE = /^unified@\d+(\.\d+)*(\+[a-z][\w-]*@\d+(\.\d+)*)*$/;
const here = path.dirname(fileURLToPath(import.meta.url));
const tplDir = path.join(here, '..', 'templates', 'unified');

export function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return null;
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*?)\s*(?:#.*)?$/);
    if (kv) fm[kv[1]] = kv[2];
  }
  return { fm, body: text.slice(m[0].length) };
}

// Bypass test used by `epds status`: a doc counts as templated only if it carries the unified mark.
export function hasUnifiedMark(text) {
  const p = parseFrontmatter(text);
  return !!(p && TEMPLATE_RE.test(p.fm.template || ''));
}

export function checkDoc(text, opts = {}) {
  const errs = [];
  const p = parseFrontmatter(text);
  if (!p) return ['no frontmatter (template bypass): file must start with --- / template: unified@N / ... / ---'];
  const { fm, body } = p;
  for (const k of [...REQUIRED_KEYS, ...(opts.require || [])]) if (!fm[k]) errs.push(`frontmatter key missing or empty: ${k}`);
  if (fm.template && !TEMPLATE_RE.test(fm.template)) errs.push(`template mark invalid: "${fm.template}" (want unified@N[+profile@M])`);
  if (fm.kind && !KINDS.includes(fm.kind)) errs.push(`kind invalid: "${fm.kind}" (one of ${KINDS.join('|')})`);
  if (fm.status && !STATUSES.includes(fm.status)) errs.push(`status invalid: "${fm.status}" (one of ${STATUSES.join('|')})`);
  if (fm.updated && !/^\d{4}-\d{2}-\d{2}$/.test(fm.updated)) errs.push(`updated must be YYYY-MM-DD: "${fm.updated}"`);
  // sections "## 0." .. "## 6." in order, each with a non-trivial body
  const lines = body.split(/\r?\n/);
  const heads = [];
  lines.forEach((l, i) => { const h = l.match(/^## ([0-6])\./); if (h) heads.push({ n: Number(h[1]), i }); });
  for (let n = 0; n <= 6; n++) {
    const idx = heads.findIndex((h) => h.n === n);
    if (idx < 0) { errs.push(`section "## ${n}." missing`); continue; }
    const start = heads[idx].i + 1;
    const end = lines.findIndex((l, j) => j >= start && /^## /.test(l));
    const sec = lines.slice(start, end < 0 ? lines.length : end).join('\n').trim();
    if (sec.length < 8) errs.push(`section "## ${n}." is empty`);
    if (n === 2 && !/\[Acceptance\][^\n]*->/.test(sec)) errs.push('section "## 2." needs an "[Acceptance] <action> -> <expected result>" line');
  }
  if (heads.map((h) => h.n).join('') !== [...new Set(heads.map((h) => h.n))].sort().join('')) errs.push('sections "## 0."-"## 6." out of order or duplicated');
  const kb = [...body.matchAll(/^## \[kind: ([\w-]+)\]/gm)].map((m) => m[1]);
  if (fm.kind && KINDS.includes(fm.kind)) {
    if (!kb.includes(fm.kind)) errs.push(`kind block "## [kind: ${fm.kind}]" missing`);
    if (kb.some((k) => k !== fm.kind)) errs.push(`foreign kind block present: ${kb.filter((k) => k !== fm.kind).join(',')}`);
  }
  if (opts.strict && /\{\{fill\}\}/.test(text)) errs.push('unfilled {{fill}} markers remain (strict)');
  return errs;
}

function slug(s) { return String(s).trim().replace(/[^\w.-]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase(); }

export function buildDoc(kind, name, opts = {}) {
  if (!KINDS.includes(kind)) throw new Error(`unknown kind "${kind}" (one of ${KINDS.join('|')})`);
  const id = slug(name);
  if (!id) throw new Error('name is empty after slug');
  const read = (f) => fs.readFileSync(f, 'utf8');
  let core = read(path.join(tplDir, 'core.md'));
  const prof = opts.profileDir;
  let version = CORE_VERSION;
  let extraFm = '';
  let extraBlock = '';
  if (prof) {
    const pv = fs.existsSync(path.join(prof, 'VERSION')) ? read(path.join(prof, 'VERSION')).trim() : '';
    if (pv) version = `${CORE_VERSION}+${pv}`;
    const fmf = path.join(prof, 'frontmatter.txt');
    if (fs.existsSync(fmf)) extraFm = read(fmf).replace(/\s+$/, '') + '\n';
    const kf = path.join(prof, `${kind}.md`);
    if (fs.existsSync(kf)) extraBlock = '\n' + read(kf).replace(/^\n+/, '');
  }
  const vars = { version, kind, id, updated: opts.date || new Date().toISOString().slice(0, 10),
    owner: opts.owner || 'unknown', source: opts.source || 'none: fill in' };
  core = core.replace(/\{\{(version|kind|id|updated|owner|source)\}\}/g, (_, k) => vars[k]);
  core = core.replace(/\n---\n\n# /, `\n${extraFm}---\n\n# `);
  return core.replace(/\s+$/, '\n') + read(path.join(tplDir, 'kinds', `${kind}.md`)).replace(/\s+$/, '\n') + (extraBlock ? extraBlock.replace(/\s+$/, '\n') : '');
}

function opt(argv, name) { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : undefined; }

export function runNew(argv) {
  const pos = argv.filter((a, i) => !a.startsWith('--') && !(i > 0 && argv[i - 1].startsWith('--') && argv[i - 1] !== '--stdout' && argv[i - 1] !== '--force'));
  const [kind, name] = pos;
  if (!kind || !name) return { code: 2, out: 'usage: epds new <kind> <name> [--out <file>] [--stdout] [--profile <dir>] [--owner O] [--source S] [--force]' };
  let doc;
  try { doc = buildDoc(kind, name, { profileDir: opt(argv, '--profile'), owner: opt(argv, '--owner'), source: opt(argv, '--source') }); }
  catch (e) { return { code: 2, out: `epds new: ${e.message}` }; }
  if (argv.includes('--stdout')) return { code: 0, out: doc.replace(/\n$/, '') };
  const out = opt(argv, '--out') || `${slug(name)}.md`;
  if (fs.existsSync(out) && !argv.includes('--force')) return { code: 1, out: `epds new: ${out} exists (use --force)` };
  fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
  fs.writeFileSync(out, doc);
  return { code: 0, out: `created ${out}` };
}

export function runCheckDoc(argv) {
  const files = argv.filter((a, i) => !a.startsWith('--') && !(i > 0 && argv[i - 1] === '--require'));
  if (!files.length) return { code: 2, out: 'usage: epds check-doc <file>... [--strict] [--require key,key]' };
  const req = (opt(argv, '--require') || '').split(',').filter(Boolean);
  const lines = []; let bad = 0;
  for (const f of files) {
    let text;
    try { text = fs.readFileSync(f, 'utf8'); } catch { lines.push(`FAIL ${f}: unreadable`); bad++; continue; }
    const errs = checkDoc(text, { strict: argv.includes('--strict'), require: req });
    if (errs.length) { bad++; lines.push(`FAIL ${f}`); errs.forEach((e) => lines.push(`  - ${e}`)); } else lines.push(`PASS ${f}`);
  }
  return { code: bad ? 1 : 0, out: lines.join('\n') };
}
