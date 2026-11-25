#!/usr/bin/env node
// bin/check-all.mjs [--template] — one call for the build step: intake check, LIFECYCLE rows (medium), a11y (skipped when deps are missing), check.mjs (high).
// One line per check, then `EPDS check: N passed, M failed, K skipped`. Exit 0 only when nothing failed. Node stdlib only; runs the sibling bins, no logic copied.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { epdsLevel } from './level.mjs';

const bin = path.dirname(new URL(import.meta.url).pathname);
const run = (script, args) => spawnSync(process.execPath, [path.join(bin, script), ...args], { encoding: 'utf8' });
if (process.argv[2] === '--template') { const r = run("intake-check.mjs", ["--template"]); process.stdout.write(r.stdout); process.exit(r.status ?? 1); }
const sh = (r) => ((r.stdout + r.stderr).trim().split('\n').filter(Boolean).pop() || '').slice(0, 140);
const lv = epdsLevel();
const rows = [];
const add = (name, st, note = '') => { rows.push(st); console.log(`${st.toUpperCase()} ${name}${note ? `: ${note}` : ''}`); };

const ir = run('intake-check.mjs', []);
add('intake', ir.status === 0 ? 'pass' : 'fail', ir.status === 0 ? '' : sh(ir));

if (lv === 'low') add('lifecycle', 'skip', 'level low');
else if (!fs.existsSync('LIFECYCLE.md')) add('lifecycle', 'fail', 'LIFECYCLE.md missing');
else if (lv === 'high') { const r = run('check.mjs', ['LIFECYCLE.md']); add('lifecycle', r.status === 0 ? 'pass' : 'fail', sh(r)); }
else {
  const body = fs.readFileSync('LIFECYCLE.md', 'utf8').split(/^## Example.*$/m)[0];
  const n = body.split('\n').filter((l) => l.trim().startsWith('|') && !/^\|[\s:|-]+\|$/.test(l.trim())).slice(1).filter((l) => l.trim().replace(/^\|/, '').split('|')[0].trim()).length;
  add('lifecycle', n ? 'pass' : 'fail', `${n} rows`);
}

if (lv === 'low') add('a11y', 'skip', 'level low');
else if (!fs.existsSync('index.html')) add('a11y', 'skip', 'no index.html');
else {
  const r = run('a11y-check.mjs', ['index.html']);
  if (r.status === 2) add('a11y', 'skip', 'skipped, dependencies missing or unusable');
  else add('a11y', r.status === 0 ? 'pass' : 'fail', sh(r));
}

if (lv !== 'high') add('check.mjs', 'skip', `level ${lv}`);
else if (!fs.existsSync('index.html') || !fs.existsSync('checks.json')) add('check.mjs', 'skip', 'no index.html + checks.json');
else { const r = run('check.mjs', ['index.html', 'checks.json']); add('check.mjs', r.status === 0 ? 'pass' : 'fail', sh(r)); }

const c = (s) => rows.filter((x) => x === s).length;
console.log(`EPDS check: ${c('pass')} passed, ${c('fail')} failed, ${c('skip')} skipped`);
process.exit(c('fail') ? 1 : 0);
