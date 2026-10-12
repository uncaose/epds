#!/usr/bin/env node
// test/check.selftest.mjs — bin/check.mjs: pass fixture -> exit 0, fail fixture -> exit 1, missing args -> exit 2.
// If playwright/Chromium is absent the check script exits 2; this selftest then SKIPs (exit 0) with a note.
import path from 'node:path';
import { spawnSync } from 'node:child_process';
const root = path.join(path.dirname(new URL(import.meta.url).pathname), '..');
const run = (...a) => spawnSync('node', [path.join(root, 'bin', 'check.mjs'), ...a], { encoding: 'utf8' });
let fail = 0;
const ok = (l, c) => { console.log(`  ${c ? 'ok  ' : 'FAIL'} ${l}`); if (!c) fail += 1; };
const fx = (n) => path.join(root, 'test', 'fixtures', n);
ok('no args -> exit 2', run().status === 2);
const good = run(fx('ok.html'), fx('checks.json'));
if (good.status === 2) { console.log(`SKIP (playwright/chromium missing): ${good.stderr.trim()}`); process.exit(0); }
ok('good fixture -> exit 0, only summary line', good.status === 0 && good.stdout.trim() === '2/2 checks passed');
const vb = run(fx('ok.html'), fx('checks.json'), '--verbose');
ok('--verbose lists PASS lines', vb.status === 0 && /PASS add a note/.test(vb.stdout));
const bad = run(fx('bad.html'), fx('checks.json'));
ok('bad fixture -> exit 1, FAIL lines', bad.status === 1 && /FAIL add a note/.test(bad.stdout) && /FAIL no console errors/.test(bad.stdout));
// v6 additions: {"advance":ms} simulated clock, {"viewport":[w,h]} step, {"noOverflow":true} expect (adopted from replica-test/replica-build edge states).
const tm = run(fx('time.html'), fx('checks-new.json'));
ok('advance flips a 10-minute timer, no early flip, small page fits a phone', tm.status === 0 && tm.stdout.trim() === '3/3 checks passed');
const wd = run(fx('wide.html'), fx('checks-new.json'));
ok('wide page -> noOverflow check FAILs, others reported', wd.status === 1 && /FAIL fits a phone screen -- noOverflow/.test(wd.stdout));
console.log(fail ? `FAIL (${fail} failures)` : 'PASS (0 failures)');
process.exit(fail ? 1 : 0);
