#!/usr/bin/env node
// test/v9-phrases.selftest.mjs — v9.1 wording must exist: Security line + 3 general principles. exit 0 = all present.
import fs from 'node:fs';
import path from 'node:path';
const root = path.join(path.dirname(new URL(import.meta.url).pathname), '..');
const rd = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const checks = [
  ['docs/PROTOCOL.md', 'Security: <runtime security hook result | scanner diff command + exit code | none available>'],
  ['SKILL.md', '`Security:` line'],
  ['docs/PROTOCOL.md', 'full set of valid values'],
  ['templates/LIFECYCLE.md', 'completed, deleted, or skipped'],
  ['templates/LIFECYCLE.md', 'visible at the same time'],
];
const bad = checks.filter(([f, s]) => !rd(f).includes(s));
if (bad.length) { console.error('FAIL missing:\n' + bad.map(([f, s]) => `${f}: ${s}`).join('\n')); process.exit(1); }
if (rd('SKILL.md').split('\n').length > 40) { console.error('FAIL SKILL.md > 40 lines'); process.exit(1); }
console.log('PASS v9-phrases.selftest');
