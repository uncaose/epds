#!/usr/bin/env node
// test/completion.selftest.mjs — H269 repairs (R0357 root causes: skill not triggered by build requests,
// no run-to-completion loop, questions blocking with no human, "verification" that never executes the
// artifact). One assertion group per repair. `node test/completion.selftest.mjs` -> exit 0.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = path.join(path.dirname(new URL(import.meta.url).pathname), '..');
const skill = fs.readFileSync(path.join(root, 'SKILL.md'), 'utf8');
const epds = fs.readFileSync(path.join(root, 'docs', 'EPDS.md'), 'utf8');
let fail = 0;
const ok = (label, cond) => { console.log(`  ${cond ? 'ok  ' : 'FAIL'} ${label}`); if (!cond) fail += 1; };

const fm = skill.match(/^---\n([\s\S]*?)\n---/);
const desc = (fm && fm[1].match(/^description:\s*(.+)$/m) || [])[1] || '';
const loop = (skill.match(/## Run to completion[\s\S]*?(?=\n## )/) || [''])[0];

// R1 trigger: a build request (even a vague one-liner) must match the description
ok('R1 frontmatter has name+description', !!fm && /^name: epds$/m.test(fm[1]) && desc.length > 50);
ok('R1 description triggers on build/make/create requests', /build, make or create an app, game, tool or feature/.test(desc));
ok('R1 description covers vague one-liners and no-human runs', /vague one-liner/.test(desc) && /no human available/.test(desc));

// R2 completion loop exists with 7 numbered steps, before the routing table
ok('R2 "Run to completion" section exists before "Trigger and routing"', loop.length > 0 && skill.indexOf('## Run to completion') < skill.indexOf('## Trigger and routing'));
ok('R2 loop has 7 numbered steps', (loop.match(/^\d\. \*\*/gm) || []).length === 7);
ok('R2 acceptance checks are written before building', /Sharpen before building[\s\S]*3 to 7 acceptance checks/.test(loop) && loop.indexOf('Sharpen') < loop.indexOf('**Build**'));
ok('R2 loop has bounded retry (5 rounds)', /up to 5 rounds/.test(loop));
ok('R2 Done requires every check executed and passed', /Done means[\s\S]*every acceptance check was executed and passed/.test(loop));

// R3 no-human path: questions never block
ok('R3 questions never block when no human can answer', /Questions never block/.test(loop) && /Assumptions/.test(loop) && /do not end the turn on a question/.test(loop));

// R4 verification must execute the artifact
ok('R4 grep/unviewed screenshot are not checks', /grepping the source/.test(loop) && /screenshot you never looked at/.test(loop));
ok('R4 Final report carries an [Acceptance] line with exit codes', /\[Acceptance\] N of M acceptance checks executed and passed/.test(skill));

// guard: §0 human definition block unchanged (verbatim, no interpretation)
const sec0 = (epds.match(/## §0\.[\s\S]*?(?=`\[H\]` 로케이터)/) || [''])[0];
const sha = crypto.createHash('sha256').update(sec0).digest('hex');
ok(`guard §0 verbatim block unchanged (sha256 ${sha.slice(0, 12)})`, sha.startsWith('1f364d07c92d'));

console.log(fail ? `FAIL (${fail} failures)` : 'PASS (0 failures)');
process.exit(fail ? 1 : 0);
