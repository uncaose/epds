#!/usr/bin/env node
// bin/check.mjs <html> <checks.json> — run acceptance checks against a web artifact in headless Chromium.
// Format: docs/CHECK.md. exit 0 = all PASS, 1 = some FAIL, 2 = playwright/browser missing or bad usage.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

const argv = process.argv.slice(2);
const verbose = argv.includes('--verbose');
const [htmlArg, checksArg] = argv.filter((a) => a !== '--verbose');

// LIFECYCLE.md mode: every table row needs all 5 cells filled, no <placeholder>, and an exit code in the last cell.
// v9: the exit code must be 0, and a `check.mjs [<html>] <checks>.json` command is re-run here (rows are re-run, not just read); other commands are counted as "not re-run".
if (htmlArg && htmlArg.endsWith('.md') && !checksArg) {
  const text = fs.readFileSync(htmlArg, 'utf8').split(/^## Example.*$/m)[0];
  const rows = text.split('\n').filter((l) => l.trim().startsWith('|') && !/^\|[\s:|-]+\|$/.test(l.trim())).slice(1) // slice(1) = header
    .map((l) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim()));
  const bad = []; let notRerun = 0;
  const dir = path.dirname(path.resolve(htmlArg));
  rows.forEach((c, i) => {
    const who = c[0] || `row ${i + 1}`;
    if (c.length !== 5 || c.some((x) => !x)) bad.push(`FAIL ${who} -- empty cell (all 5 columns must be filled)`);
    else if (c.some((x) => /<[^>]*>/.test(x))) bad.push(`FAIL ${who} -- unfilled <placeholder>`);
    else if (!/exit(\s*code)?\s*[=:]?\s*\d+/i.test(c[4])) bad.push(`FAIL ${who} -- "how executed" has no exit code`);
    else if (Number(/exit(?:\s*code)?\s*[=:]?\s*(\d+)/i.exec(c[4])[1]) !== 0) bad.push(`FAIL ${who} -- recorded exit code is not 0`);
    else {
      const m = /check\.mjs\s+(?:([^\s`]+\.html?)\s+)?([^\s`]+\.json)/.exec(c[4]);
      if (!m) { notRerun += 1; return; }
      const jf = path.resolve(dir, m[2]);
      if (!fs.existsSync(jf)) { bad.push(`FAIL ${who} -- ${m[2]} does not exist`); return; }
      let html = m[1] && path.resolve(dir, m[1]);
      if (!html) { const h = JSON.parse(fs.readFileSync(jf, 'utf8')).html; html = path.resolve(dir, h || 'index.html'); } // bare form: "html" in the json, else index.html
      if (!fs.existsSync(html)) { notRerun += 1; return; }
      const r = spawnSync(process.execPath, [fileURLToPath(import.meta.url), html, jf], { encoding: 'utf8' });
      if (r.status !== 0) bad.push(`FAIL ${who} -- re-run exit ${r.status}: ${(r.stdout + r.stderr).trim().split('\n')[0].slice(0, 120)}`);
    }
  });
  if (rows.length < 4) bad.push(`FAIL table -- ${rows.length} rows, need at least 4 (first visit, event, end, after end)`);
  console.log([...bad, `${rows.length - bad.filter((b) => !b.startsWith('FAIL table')).length}/${rows.length} lifecycle rows complete, ${notRerun} rows not re-run`].join('\n'));
  process.exit(bad.length ? 1 : 0);
}
if (!htmlArg || !checksArg) { console.error('usage: node bin/check.mjs <html> <checks.json> [--verbose]'); process.exit(2); }

const require = createRequire(import.meta.url); // honors NODE_PATH
let pw;
for (const n of ['playwright', 'playwright-core']) { try { pw = require(n); break; } catch {} }
if (!pw) {
  console.error('playwright not found. Install: npm i playwright-core && npx playwright install chromium (or set NODE_PATH to a node_modules dir that has playwright-core).');
  process.exit(2);
}

function chromePath() {
  if (process.env.EPDS_CHROME) return process.env.EPDS_CHROME;
  if (fs.existsSync('/usr/bin/chromium')) return '/usr/bin/chromium';
  const cache = path.join(os.homedir(), 'Library', 'Caches', 'ms-playwright');
  try {
    for (const d of fs.readdirSync(cache).filter((x) => /^chromium-\d+$/.test(x)).sort().reverse()) {
      const p = path.join(cache, d, 'chrome-mac-arm64', 'Google Chrome for Testing.app', 'Contents', 'MacOS', 'Google Chrome for Testing');
      if (fs.existsSync(p)) return p;
    }
  } catch {}
  return undefined; // playwright default
}

const { checks } = JSON.parse(fs.readFileSync(checksArg, 'utf8'));
const url = pathToFileURL(path.resolve(htmlArg)).href;
let browser;
try { browser = await pw.chromium.launch({ executablePath: chromePath(), args: ['--no-sandbox'] }); }
catch (e) { console.error(`cannot launch chromium (${String(e.message).split('\n')[0]}). Set EPDS_CHROME=<chrome path> or run: npx playwright install chromium`); process.exit(2); }

async function step(page, s) {
  if ('click' in s) await page.click(s.click, { timeout: 3000 });
  else if ('dblclick' in s) await page.dblclick(s.dblclick, { timeout: 3000 });
  else if ('type' in s) await page.fill(s.type, s.text ?? '', { timeout: 3000 });
  else if ('press' in s) await page.keyboard.press(s.press);
  else if ('reload' in s) await page.reload();
  else if ('wait' in s) await page.waitForTimeout(s.wait);
  else if ('advance' in s) await page.clock.runFor(s.advance); // simulated time: timers fire, Date moves (25-min timer, day rollover)
  else if ('viewport' in s) await page.setViewportSize({ width: s.viewport[0], height: s.viewport[1] });
  else throw new Error(`unknown step ${JSON.stringify(s)}`);
}
async function expectOne(page, errs, e) {
  if ('text' in e) { const t = await page.evaluate(() => document.body.innerText); return [t.includes(e.text), `text "${e.text}"`]; }
  if ('count' in e) { const n = await page.locator(e.count).count(); return [n === e.eq, `count(${e.count}) = ${n}, want ${e.eq}`]; }
  if ('noOverflow' in e) { const o = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth); return [o <= 0, `noOverflow: page is ${o}px wider than the window`]; }
  if ('consoleErrors' in e) return [errs.length === e.consoleErrors, `consoleErrors = ${errs.length}, want ${e.consoleErrors}${errs[0] ? ` (${errs[0].slice(0, 80)})` : ''}`];
  throw new Error(`unknown expect ${JSON.stringify(e)}`);
}

let failed = 0;
for (const c of checks) {
  const ctx = await browser.newContext(); const page = await ctx.newPage(); const errs = [];
  await page.clock.install(); // time flows normally until a step says {"advance":ms}
  page.on('pageerror', (e) => errs.push(String(e.message)));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  let msg = '';
  try {
    await page.goto(url);
    for (const s of c.steps || []) await step(page, s);
    for (const e of c.expect || []) { const [good, d] = await expectOne(page, errs, e); if (!good) { msg = d; break; } }
  } catch (e) { msg = String(e.message).split('\n')[0]; }
  if (msg || verbose) console.log(`${msg ? 'FAIL' : 'PASS'} ${c.name}${msg ? ` -- ${msg}` : ''}`);
  if (msg) failed += 1;
  await ctx.close();
}
await browser.close();
if (failed) console.log('Note: each check starts in a fresh page with empty storage; put dependent steps in one check.');
console.log(`${checks.length - failed}/${checks.length} checks passed`);
process.exit(failed ? 1 : 0);
