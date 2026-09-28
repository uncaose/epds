#!/usr/bin/env node
// test/layout.selftest.mjs — new template/policy files exist and every link SKILL.md/COMMANDS.md
// makes to them resolves, and `epds setup` actually installs them (H154 rework item 2, item 4,
// item 5, item 6). `node test/layout.selftest.mjs` -> exit 0.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const here = path.dirname(new URL(import.meta.url).pathname);
const root = path.join(here, '..');
const epdsBin = path.join(root, 'bin', 'epds.mjs');

let fail = 0;
function ok(label, cond) {
  console.log(`  ${cond ? 'ok  ' : 'FAIL'} ${label}`);
  if (!cond) fail += 1;
}

const REQUIRED_POLICIES = [
  'approval-before-implementation.md',
  'scope-discipline.md',
  'smallest-reversible-change.md',
  'untrusted-external-input.md',
  'secrets-and-pii.md',
  'irreversible-actions-confirmation.md',
  'evidence-before-completion-claims.md',
  'tests-not-weakened.md'
];

// ---- case 1: every docs/policies/<slug>.md link SKILL.md makes actually exists on disk ----
{
  const skillMd = fs.readFileSync(path.join(root, 'SKILL.md'), 'utf8');
  const linked = [...skillMd.matchAll(/\]\((docs\/policies\/[a-z0-9-]+\.md)\)/g)].map((m) => m[1]);
  ok('case1 SKILL.md links at least 8 policy files', linked.length >= 8);
  for (const rel of linked) {
    ok(`case1 linked file exists: ${rel}`, fs.existsSync(path.join(root, rel)));
  }
  for (const name of REQUIRED_POLICIES) {
    ok(`case1 SKILL.md links docs/policies/${name}`, linked.includes(`docs/policies/${name}`));
  }
}

// ---- case 2: no rule prose duplicated back into SKILL.md itself (index+links only) ----
{
  const skillMd = fs.readFileSync(path.join(root, 'SKILL.md'), 'utf8');
  ok('case2 old inline rule text is gone from SKILL.md', !skillMd.includes('Never expose or commit secrets'));
}

// ---- case 3: new templates referenced from docs/COMMANDS.md exist on disk ----
{
  const commandsMd = fs.readFileSync(path.join(root, 'docs', 'COMMANDS.md'), 'utf8');
  for (const name of ['arena.md', 'pr-landing.md']) {
    ok(`case3 docs/COMMANDS.md mentions templates/${name}`, commandsMd.includes(`templates/${name}`));
    ok(`case3 templates/${name} exists`, fs.existsSync(path.join(root, 'templates', name)));
  }
}

// ---- case 4: `epds setup` installs docs/policies/ into the target skill dir (was missing pre-rework) ----
{
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'epds-layout-selftest-'));
  execFileSync(process.execPath, [epdsBin, 'setup', '--project', '--yes'], { cwd: dir, encoding: 'utf8' });
  const installedPolicies = path.join(dir, '.claude', 'skills', 'epds', 'docs', 'policies');
  ok('case4 setup creates docs/policies/ under the installed skill', fs.existsSync(installedPolicies));
  for (const name of REQUIRED_POLICIES) {
    ok(`case4 setup installs docs/policies/${name}`, fs.existsSync(path.join(installedPolicies, name)));
  }
  const installedArena = path.join(dir, '.claude', 'skills', 'epds', 'templates', 'README.md');
  ok('case4 setup still installs the templates/README.md pointer (unrelated existing behavior kept)', fs.existsSync(installedArena));
}

// ---- case 5: templates/retro.md carries the file-diff/locator fields (item 7) ----
{
  const retroMd = fs.readFileSync(path.join(root, 'templates', 'retro.md'), 'utf8');
  ok('case5 retro.md has a File diff / locator field', retroMd.includes('File diff / locator'));
}

// ---- case 6: SKILL.md Final report carries the plain-language line (item 8) ----
{
  const skillMd = fs.readFileSync(path.join(root, 'SKILL.md'), 'utf8');
  ok('case6 Final report has a [Plain language] line', skillMd.includes('[Plain language]'));
}

console.log(fail === 0 ? `\nPASS (0 failures)` : `\nFAIL (${fail} failures)`);
process.exit(fail === 0 ? 0 : 1);
