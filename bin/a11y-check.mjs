#!/usr/bin/env node
// a11y-check.mjs <file.html|url>: axe-core in headless Chrome at 390x844. exit 0 = no serious/critical, 1 = found, 2 = usage/load/setup error.
// Needs `playwright-core` and `axe-core` resolvable from the current folder or from $EPDS_A11Y_MODULES (a node_modules parent); Chrome via $CHROME or playwright's default.
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';

const arg = process.argv[2];
if (!arg) { console.error('usage: a11y-check.mjs <file.html|url>'); process.exit(2); }
const isUrl = /^(https?|file):/.test(arg);
const file = isUrl ? null : path.resolve(arg);
if (file && !fs.existsSync(file)) { console.error(`a11y-check: no such file ${arg}`); process.exit(2); }
let b;
try {
  const req = createRequire(path.join(process.env.EPDS_A11Y_MODULES || process.cwd(), 'x.js'));
  const pw = req('playwright-core');
  const axeSrc = fs.readFileSync(req.resolve('axe-core/axe.min.js'), 'utf8');
  b = await pw.chromium.launch({ executablePath: process.env.CHROME || undefined, args: ['--no-sandbox'] });
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  await p.goto(isUrl ? arg : `file://${file}`, { waitUntil: 'load', timeout: 20000 });
  await p.waitForTimeout(800);
  await p.evaluate(axeSrc);
  const r = await p.evaluate(() => axe.run(document, { resultTypes: ['violations'] }));
  const n = {};
  for (const v of r.violations) n[v.impact] = (n[v.impact] || 0) + v.nodes.length;
  console.log(`axe-core ${r.testEngine.version}: critical ${n.critical || 0}, serious ${n.serious || 0}, moderate ${n.moderate || 0}, minor ${n.minor || 0}`);
  for (const v of r.violations) console.log(`- [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} nodes) e.g. ${v.nodes.slice(0, 3).map((x) => x.target.join(' ')).join(' | ')}`);
  const bad = (n.serious || 0) + (n.critical || 0);
  console.log(bad ? `FAIL: ${bad} serious/critical issue(s)` : 'PASS: no serious/critical issues');
  await b.close();
  process.exit(bad ? 1 : 0);
} catch (e) { console.error(`a11y-check: ${String(e).slice(0, 200)}`); await b?.close(); process.exit(2); }
