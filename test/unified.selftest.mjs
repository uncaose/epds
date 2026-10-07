#!/usr/bin/env node
// test/unified.selftest.mjs — unified template: `epds new` / `epds check-doc` / status bypass gap.
// `node test/unified.selftest.mjs` -> exit 0.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { KINDS, checkDoc, buildDoc, hasUnifiedMark } from '../bin/unified.mjs';
import { runStatus } from '../bin/status.mjs';

const root = path.join(path.dirname(new URL(import.meta.url).pathname), '..');
const bin = path.join(root, 'bin', 'epds.mjs');
let fail = 0;
const ok = (label, cond) => { console.log(`  ${cond ? 'ok  ' : 'FAIL'} ${label}`); if (!cond) fail += 1; };
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'epds-unified-'));
const run = (...a) => spawnSync('node', [bin, ...a], { encoding: 'utf8' });

// generated docs for every kind pass; strict fails until {{fill}} is replaced
for (const k of KINDS) {
  const f = path.join(tmp, `${k}.md`);
  const r = run('new', k, `sample-${k}`, '--out', f);
  ok(`new ${k} exits 0`, r.status === 0);
  ok(`check-doc PASS for generated ${k}`, run('check-doc', f).status === 0);
  ok(`check-doc --strict FAILs unfilled ${k}`, run('check-doc', '--strict', f).status === 1);
}
ok('new refuses unknown kind', run('new', 'nope', 'x', '--out', path.join(tmp, 'x.md')).status === 2);
ok('new refuses overwrite without --force', run('new', 'brief', 'sample-brief', '--out', path.join(tmp, 'brief.md')).status === 1);

// violation samples (each must be caught)
const good = buildDoc('report', 'g', { date: '2026-01-01' });
ok('good sample has no errors', checkDoc(good).length === 0);
const bad = (label, text, needle) => { const e = checkDoc(text); ok(`violation: ${label}`, e.length > 0 && (!needle || e.some((x) => x.includes(needle)))); };
bad('no frontmatter (bypass)', good.replace(/^---[\s\S]*?---\n/, ''), 'no frontmatter');
bad('template mark removed', good.replace(/^template:.*\n/m, ''), 'template');
bad('bad template mark', good.replace('unified@1', 'unified@x'), 'template mark invalid');
bad('bad kind', good.replace('kind: report', 'kind: memo'), 'kind invalid');
bad('bad status', good.replace('status: draft', 'status: wip'), 'status invalid');
bad('missing section 3', good.replace(/## 3\.[\s\S]*?(?=## 4\.)/, ''), 'section "## 3." missing');
bad('empty section 4', good.replace(/## 4\.[\s\S]*?(?=## 5\.)/, '## 4. Risks and rollback\n\n'), 'empty');
bad('acceptance without arrow', good.replace(/\[Acceptance\].*\n/, '[Acceptance] A1: something\n'), 'Acceptance');
bad('kind block missing', good.replace(/## \[kind: report\][\s\S]*$/, ''), 'kind block');
bad('foreign kind block', good + '\n## [kind: brief] x\n', 'foreign');
ok('--require catches missing profile key', checkDoc(good, { require: ['data_tier'] }).some((e) => e.includes('data_tier')));

// profile: version suffix + extra frontmatter + extra kind block, still passes
const prof = path.join(tmp, 'prof'); fs.mkdirSync(prof);
fs.writeFileSync(path.join(prof, 'VERSION'), 'acme@2\n');
fs.writeFileSync(path.join(prof, 'frontmatter.txt'), 'data_tier: B\n');
fs.writeFileSync(path.join(prof, 'brief.md'), '\n- ACME-PROFILE-LINE\n');
const pd = buildDoc('brief', 'p', { profileDir: prof });
ok('profile doc carries unified@1+acme@2 mark', /^template: unified@1\+acme@2$/m.test(pd) && /^data_tier: B$/m.test(pd) && pd.includes('ACME-PROFILE-LINE'));
ok('profile doc passes with --require data_tier', checkDoc(pd, { require: ['data_tier'] }).length === 0);

// status: bypass gap counted, never changes verdict track
const tgt = path.join(tmp, 'proj'); fs.mkdirSync(path.join(tgt, 'docs', 'specs'), { recursive: true });
fs.writeFileSync(path.join(tgt, 'docs', 'specs', 'marked.md'), good);
fs.writeFileSync(path.join(tgt, 'docs', 'specs', 'plain.md'), '# plain\n');
const st = runStatus(['--json', '--target', tgt]).output;
const fact = st.facts.find((f) => f.id === 'doc.template.bypass');
ok('status reports template bypass 1 of 2', fact && fact.value.total === 2 && fact.value.bypass === 1 && fact.value.marked === 1 && fact.exit === 0);
ok('hasUnifiedMark true/false', hasUnifiedMark(good) && !hasUnifiedMark('# plain'));
const emptyTgt = path.join(tmp, 'empty'); fs.mkdirSync(emptyTgt);
ok('status: no doc dirs -> no bypass fact', !runStatus(['--json', '--target', emptyTgt]).output.facts.some((f) => f.id === 'doc.template.bypass'));

fs.rmSync(tmp, { recursive: true, force: true });
console.log(fail ? `FAIL (${fail} failures)` : 'PASS (0 failures)');
process.exit(fail ? 1 : 0);
