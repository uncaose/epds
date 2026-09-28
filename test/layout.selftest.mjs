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
  'tests-not-weakened.md',
  'test-first.md',
  'root-cause-not-symptom.md',
  'premise-review-after-repeated-failure.md',
  'test-behavior-not-implementation.md'
];

// ---- case 1: every docs/policies/<slug>.md link SKILL.md makes actually exists on disk ----
{
  const skillMd = fs.readFileSync(path.join(root, 'SKILL.md'), 'utf8');
  const linked = [...skillMd.matchAll(/\]\((docs\/policies\/[a-z0-9-]+\.md)\)/g)].map((m) => m[1]);
  ok('case1 SKILL.md links at least 12 policy files', linked.length >= 12);
  for (const rel of linked) {
    ok(`case1 linked file exists: ${rel}`, fs.existsSync(path.join(root, rel)));
  }
  for (const name of REQUIRED_POLICIES) {
    ok(`case1 SKILL.md links docs/policies/${name}`, linked.includes(`docs/policies/${name}`));
  }
}

// ---- case 2: each rule's own sentence in SKILL.md is IDENTICAL (punctuation included) to its
// docs/policies/<file>.md line 3 (heading blank RULE — the rule sentence is always line 3) — not a
// truncated paraphrase (L3, docs/absorb-pstack.md item 3 rework). K1 — the index line IS the rule
// sentence, full detail stays only in docs/policies/<file>.md. P15 strengthening: the sentence must
// be on the SAME bullet line as that policy's own link, not merely present somewhere else in the
// file (e.g. reused verbatim in a different section, which would pass a whole-document substring
// check without actually indexing that rule) ----
{
  const skillMd = fs.readFileSync(path.join(root, 'SKILL.md'), 'utf8');
  const lines = skillMd.split('\n');
  for (const name of REQUIRED_POLICIES) {
    const policyText = fs.readFileSync(path.join(root, 'docs', 'policies', name), 'utf8');
    const line3 = policyText.split('\n')[2];
    ok(`case2 SKILL.md carries docs/policies/${name}:3 verbatim (punctuation included): "${line3.slice(0, 50)}..."`, skillMd.includes(line3));
    const bulletLine = lines.find((l) => l.includes(`](docs/policies/${name})`));
    ok(`case2 (P15) the bullet linking docs/policies/${name} contains that same rule sentence`, !!bulletLine && bulletLine.includes(line3));
  }
  ok('case2 SKILL.md directs readers to docs/policies/ for full detail', skillMd.includes('Read `docs/policies/`'));
}

// ---- case 3: every templates/<file> docs/COMMANDS.md mentions exists in the source repo (K3) ----
{
  const commandsMd = fs.readFileSync(path.join(root, 'docs', 'COMMANDS.md'), 'utf8');
  const mentioned = [...new Set([...commandsMd.matchAll(/templates\/([a-z0-9-]+\.(?:md|json))/g)].map((m) => m[1]))];
  ok('case3 docs/COMMANDS.md mentions at least 3 templates', mentioned.length >= 3);
  for (const name of ['arena.md', 'pr-landing.md', 'retro.md']) {
    ok(`case3 docs/COMMANDS.md mentions templates/${name}`, mentioned.includes(name));
  }
  for (const name of mentioned) {
    ok(`case3 templates/${name} exists in source`, fs.existsSync(path.join(root, 'templates', name)));
  }
}

// ---- case 4: `epds setup` installs docs/policies/ AND templates/{arena,pr-landing,retro}.md into
// the target skill dir (was missing pre-rework; K3) ----
{
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'epds-layout-selftest-'));
  execFileSync(process.execPath, [epdsBin, 'setup', '--project', '--yes'], { cwd: dir, encoding: 'utf8' });
  const installedSkill = path.join(dir, '.claude', 'skills', 'epds');
  const installedPolicies = path.join(installedSkill, 'docs', 'policies');
  ok('case4 setup creates docs/policies/ under the installed skill', fs.existsSync(installedPolicies));
  for (const name of REQUIRED_POLICIES) {
    ok(`case4 setup installs docs/policies/${name}`, fs.existsSync(path.join(installedPolicies, name)));
  }
  for (const name of ['arena.md', 'pr-landing.md', 'retro.md']) {
    ok(`case4 setup installs templates/${name}`, fs.existsSync(path.join(installedSkill, 'templates', name)));
  }
  const installedReadme = path.join(installedSkill, 'templates', 'README.md');
  ok('case4 setup still installs the templates/README.md pointer (unrelated existing behavior kept)', fs.existsSync(installedReadme));
}

// ---- case 7: every relative docs/*.md and templates/*.{md,json} link in SKILL.md and
// docs/COMMANDS.md resolves inside an `epds setup` install (K3) ----
{
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'epds-layout-selftest-links-'));
  execFileSync(process.execPath, [epdsBin, 'setup', '--project', '--yes'], { cwd: dir, encoding: 'utf8' });
  const installedRoot = path.join(dir, '.claude', 'skills', 'epds');
  const sources = [
    path.join(installedRoot, 'SKILL.md'),
    path.join(installedRoot, 'docs', 'COMMANDS.md')
  ];
  let linkCount = 0;
  for (const src of sources) {
    const text = fs.readFileSync(src, 'utf8');
    const links = [...text.matchAll(/]\((docs\/[a-z0-9-/]+\.md|templates\/[a-z0-9-.]+\.(?:md|json))\)/g)].map((m) => m[1]);
    for (const rel of links) {
      linkCount += 1;
      ok(`case7 ${path.basename(src)} link resolves in install: ${rel}`, fs.existsSync(path.join(installedRoot, rel)));
    }
  }
  ok('case7 found at least one link to check', linkCount > 0);
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

// ---- case 8: docs/absorb-pstack.md's full pstack disposition accounts for all 24 skills + 23
// principles = 47 rows, no omission (K8) — R0310 raw material lives outside this repo, so this is
// a document-internal row-count assertion rather than a cross-check against the raw source ----
{
  const absorbMd = fs.readFileSync(path.join(root, 'docs', 'absorb-pstack.md'), 'utf8');
  const skillsSection = absorbMd.split('### Skills (24')[1]?.split('### Principles (23')[0] ?? '';
  const principlesSection = absorbMd.split('### Principles (23')[1]?.split('## Conflicts checked')[0] ?? '';
  const skillRows = [...skillsSection.matchAll(/^\| \d+ \|/gm)].length;
  const principleRows = [...principlesSection.matchAll(/^\| \d+ \|/gm)].length;
  ok('case8 docs/absorb-pstack.md "Skills" table has exactly 24 rows', skillRows === 24);
  ok('case8 docs/absorb-pstack.md "Principles" table has exactly 23 rows', principleRows === 23);
  ok('case8 combined pstack disposition totals exactly 47 rows (24 skills + 23 principles)', skillRows + principleRows === 47);

  // L6: the Verdict column (5th `|`-delimited cell) of every row, tallied per bucket, must equal
  // the numbers the doc's own "Disposition tally" prose line claims — so a verdict edited in a row
  // without updating the tally sentence (or vice versa) fails loudly instead of silently drifting.
  function tallyVerdicts(sectionText) {
    const rows = sectionText.split('\n').filter((l) => /^\| \d+ \|/.test(l));
    const counts = { built: 0, builtPartial: 0, reinforced: 0, rejected: 0 };
    for (const row of rows) {
      const verdict = row.split('|').map((c) => c.trim())[4] ?? '';
      if (/Built \(partial\)/.test(verdict)) counts.builtPartial += 1;
      else if (/^Built\b/.test(verdict)) counts.built += 1;
      else if (/Reinforced/.test(verdict)) counts.reinforced += 1;
      else if (/Rejected/.test(verdict)) counts.rejected += 1;
    }
    return counts;
  }
  const skillsTally = tallyVerdicts(skillsSection);
  const principlesTally = tallyVerdicts(principlesSection);
  const combinedTally = {
    built: skillsTally.built + principlesTally.built,
    builtPartial: skillsTally.builtPartial + principlesTally.builtPartial,
    reinforced: skillsTally.reinforced + principlesTally.reinforced,
    rejected: skillsTally.rejected + principlesTally.rejected
  };

  const tallyLine = absorbMd.match(
    /Skills — Built (\d+), Built \(partial\) (\d+), Reinforced (\d+), Rejected (\d+)\s*\(= 24\)\. Principles — Built (\d+), Built \(partial\) (\d+), Reinforced (\d+), Rejected (\d+)\s*\(= 23\)\. Combined across\s*all 47 rows: \*\*Built (\d+), Built \(partial\) (\d+), Reinforced (\d+), Rejected (\d+)\*\*/
  );
  ok('case8 (L6) "Disposition tally" prose line is present and parseable', !!tallyLine);
  if (tallyLine) {
    const nums = tallyLine.slice(1).map((n) => Number(n));
    const [skB, skBP, skR, skJ, prB, prBP, prR, prJ, coB, coBP, coR, coJ] = nums;
    ok('case8 (L6) Skills table verdict counts match the tally sentence', skillsTally.built === skB && skillsTally.builtPartial === skBP && skillsTally.reinforced === skR && skillsTally.rejected === skJ);
    ok('case8 (L6) Principles table verdict counts match the tally sentence', principlesTally.built === prB && principlesTally.builtPartial === prBP && principlesTally.reinforced === prR && principlesTally.rejected === prJ);
    ok('case8 (L6) Combined verdict counts match the tally sentence', combinedTally.built === coB && combinedTally.builtPartial === coBP && combinedTally.reinforced === coR && combinedTally.rejected === coJ);
  }
}

console.log(fail === 0 ? `\nPASS (0 failures)` : `\nFAIL (${fail} failures)`);
process.exit(fail === 0 ? 0 : 1);
