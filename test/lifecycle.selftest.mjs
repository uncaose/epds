#!/usr/bin/env node
// test/lifecycle.selftest.mjs — LIFECYCLE.md gate: `node bin/check.mjs LIFECYCLE.md` exits 1 when a row has an empty cell
// (esp. the detail-check column), an unfilled <placeholder>, or a "how executed" cell without an exit code. No browser needed.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
const root = path.join(path.dirname(new URL(import.meta.url).pathname), '..');
const run = (f) => spawnSync('node', [path.join(root, 'bin', 'check.mjs'), f], { encoding: 'utf8' });
let fail = 0;
const ok = (l, c) => { console.log(`  ${c ? 'ok  ' : 'FAIL'} ${l}`); if (!c) fail += 1; };
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'epds-lc-'));
const H = '| state | what the user sees and can do | works check | common-sense usability & detail check | how executed (command + exit code) |\n|---|---|---|---|---|\n';
const R = (a, b, c, d, e) => `| ${a} | ${b} | ${c} | ${d} | ${e} |\n`;
const good = R('first visit', 'empty list, an add box', 'add one item, it is listed', 'empty state says what to do; Enter adds', 'check.mjs c1 -> exit 0')
  + R('add item', 'item appears at once', 'count is 1', 'box clears and keeps focus', 'check.mjs c2 -> exit 0')
  + R('end', 'all done message', 'all ticked shows done', 'message is plain, count right', 'check.mjs c3 -> exit 0')
  + R('after end', 'reload keeps state', 'reload, still done', 'a way to start over', 'check.mjs c4 -> exit 0')
  + R('mistake', 'delete or undo', 'delete removes', 'accidental delete can be undone', 'check.mjs c5 -> exit 0');
const w = (n, body) => { const p = path.join(dir, n); fs.writeFileSync(p, `# Lifecycle\n\n${H}${body}\n## Example (delete this section)\n\n${H}${R('<x>', '<x>', '<x>', '<x>', '<x>')}`); return p; };
ok('filled table -> exit 0', run(w('good.md', good)).status === 0);
const emptyDetail = good.replace('empty state says what to do; Enter adds', ' ');
const r1 = run(w('empty.md', emptyDetail));
ok('empty detail-check cell -> exit 1 naming the row', r1.status === 1 && /FAIL/.test(r1.stdout) && /first visit/.test(r1.stdout));
const noExit = run(w('noexit.md', good.replace('check.mjs c3 -> exit 0', 'looked at it')));
ok('"how executed" without an exit code -> exit 1', noExit.status === 1 && /exit code/.test(noExit.stdout));
ok('unfilled <placeholder> -> exit 1', run(w('ph.md', good.replace('count is 1', '<fill>'))).status === 1);
ok('fewer than 4 rows -> exit 1', run(w('few.md', good.split('\n').slice(0, 2).join('\n') + '\n')).status === 1);
const tpl = run(path.join(root, 'templates', 'LIFECYCLE.md'));
ok('the unfilled template itself fails (copy and fill it)', tpl.status === 1);
const tx = fs.readFileSync(path.join(root, 'templates', 'LIFECYCLE.md'), 'utf8');
const ex = (tx.split(/^## Example.*$/m)[1] || '');
fs.writeFileSync(path.join(dir, 'ex.md'), ex);
ok('the filled example in the template passes', run(path.join(dir, 'ex.md')).status === 0);
console.log(fail ? `FAIL (${fail} failures)` : 'PASS (0 failures)');
process.exit(fail ? 1 : 0);
