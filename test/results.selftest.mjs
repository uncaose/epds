#!/usr/bin/env node
// test/results.selftest.mjs — results/ stays publishable: index links real RESULTS.md files, every image linked there exists and is <= 2 MB,
// archives <= 5 MB, no internal machine paths, and the root README links results/README.md. `node test/results.selftest.mjs` -> exit 0.
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import path from 'node:path';

const root = path.join(path.dirname(new URL(import.meta.url).pathname), '..');
const bad = [];
const idx = path.join(root, 'results', 'README.md');
if (!existsSync(idx)) bad.push('missing results/README.md');
else {
  const docs = [...readFileSync(idx, 'utf8').matchAll(/\]\((\d{4}-\d{2}-\d{2}-[\w-]+\/RESULTS\.md)\)/g)].map((m) => m[1]);
  if (!docs.length) bad.push('results/README.md links no RESULTS.md');
  for (const d of docs) {
    const f = path.join(root, 'results', d);
    if (!existsSync(f)) { bad.push(`missing ${d}`); continue; }
    const imgs = [...readFileSync(f, 'utf8').matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)].map((m) => m[1]);
    if (!imgs.length) bad.push(`${d}: no image embedded`);
    for (const i of imgs) {
      const p = path.join(path.dirname(f), i);
      if (!existsSync(p)) bad.push(`${d}: missing image ${i}`);
      else if (statSync(p).size > 2 * 1024 * 1024) bad.push(`${d}: image over 2MB ${i}`);
    }
  }
}
const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
if (existsSync(path.join(root, 'results'))) {
  for (const f of walk(path.join(root, 'results'))) {
    if (f.endsWith('.tar.gz') && statSync(f).size > 5 * 1024 * 1024) bad.push(`archive over 5MB ${path.relative(root, f)}`);
    if (f.endsWith('.md') && readFileSync(f, 'utf8').includes('/Users/')) bad.push(`internal path in ${path.relative(root, f)}`);
  }
}
const rm = readFileSync(path.join(root, 'README.md'), 'utf8');
if (!rm.includes('results/README.md')) bad.push('root README does not link results/README.md');
if (bad.length) { console.error(`FAIL results.selftest:\n${bad.join('\n')}`); process.exit(1); }
console.log('PASS results.selftest: index, RESULTS.md, images, archives, root link ok');
