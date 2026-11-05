#!/usr/bin/env node
// test/english.selftest.mjs — the repo must stay English-only: no Hangul and no romanized Korean (token list below) in any tracked text file; binaries such as result images are skipped (translations under i18n/ are exempt).
// Allowlist (path:reason) below; empty by design. `node test/english.selftest.mjs` -> exit 0.
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const root = path.join(path.dirname(new URL(import.meta.url).pathname), '..');
const ALLOW = new Set([]); // tracked paths allowed to contain Hangul (needs a reason comment)
let out = '';
try {
  out = execFileSync('git', ['grep', '-n', '-I', '-P', '[\\x{AC00}-\\x{D7A3}]', '--', '.', ':(exclude)i18n'], { cwd: root, encoding: 'utf8' });
} catch (e) { if (e.status !== 1) throw e; } // status 1 = no match
const bad = out.split('\n').filter((l) => l && !ALLOW.has(l.split(':')[0]) && !l.startsWith('README.md:1:')); // README.md line 1 = language-switcher links (native names)
if (bad.length) { console.error(`FAIL: ${bad.length} tracked lines contain Hangul\n${bad.slice(0, 20).join('\n')}`); process.exit(1); }
// Romanized Korean is not English either (commit 17973f1 shipped it): fail on these whole-word tokens, print file:line.
const ROMAN = ['jilmun', 'haeksim', 'useonsunwi', 'gyuchik', 'wonchik', 'sanchulmul', 'yeokhal', 'jeojangso', 'daeeung', 'hyeonjae', 'geudaero', 'gijun', 'wonbon', 'jeongbo', 'peurojekteu', 'Stagebyeol', 'answerhal', 'eodaepteo', 'jeoldae', 'boksa'];
let rom = '';
try {
  rom = execFileSync('git', ['grep', '-n', '-I', '-i', '-w', ...ROMAN.flatMap((t) => ['-e', t]), '--', '.', ':(exclude)i18n', ':(exclude)test/english.selftest.mjs'], { cwd: root, encoding: 'utf8' }); // the token list itself lives in this file
} catch (e) { if (e.status !== 1) throw e; }
const romBad = rom.split('\n').filter(Boolean).map((l) => l.split(':').slice(0, 2).join(':'));
if (romBad.length) { console.error(`FAIL: ${romBad.length} tracked lines contain romanized Korean\n${romBad.slice(0, 20).join('\n')}`); process.exit(1); }
console.log('PASS english.selftest: no Hangul or romanized Korean in tracked files');
