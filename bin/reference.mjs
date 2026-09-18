#!/usr/bin/env node
// bin/reference.mjs — `epds reference <url>` collection+comparison layer.
// Deterministic only: scores the rubric items that repo metadata (stars/license/pushed_at/
// archived) can decide; everything else is left `unmeasured` rather than guessed. Never
// fabricates an install/run command and never sets addCandidate — that requires an actual
// executed install/run (accept.sh protocol step 3), which this script does not perform.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function slugify(text) {
  return text.toLowerCase().replace(/^https?:\/\//, '').replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '').slice(0, 60) || 'source';
}

function parseGithubUrl(url) {
  const m = url.match(/^https?:\/\/github\.com\/([^/]+)\/([^/#?]+)/);
  if (!m) return null;
  return { owner: m[1], repo: m[2].replace(/\.git$/, '') };
}

function fetchGithubMeta(owner, repo) {
  const cmd = `gh api repos/${owner}/${repo}`;
  const res = spawnSync('gh', ['api', `repos/${owner}/${repo}`], { encoding: 'utf8', timeout: 10000 });
  if (res.status !== 0) return { ok: false, cmd, exit: res.status ?? 1, error: (res.stderr || res.error?.message || 'gh api failed').trim() };
  try {
    const data = JSON.parse(res.stdout);
    return {
      ok: true, cmd, exit: 0,
      license: data.license?.spdx_id ?? null,
      stars: data.stargazers_count ?? null,
      pushed: data.pushed_at ?? null,
      archived: !!data.archived,
      description: data.description ?? null
    };
  } catch (e) {
    return { ok: false, cmd, exit: 2, error: `unparseable gh api response: ${e.message}` };
  }
}

// Only rubric item #6 (유지보수) is decidable from repo metadata alone — the other 9 require
// reading README/source, which this deterministic script does not do (left unmeasured).
function scoreRubric(meta) {
  const rows = [];
  for (let n = 1; n <= 10; n += 1) {
    if (n !== 6) { rows.push({ n, item: RUBRIC_ITEMS[n], signal: 'unmeasured', evidence: null }); continue; }
    if (!meta.ok) { rows.push({ n, item: RUBRIC_ITEMS[n], signal: 'unmeasured', evidence: 'gh api metadata unavailable' }); continue; }
    if (meta.archived) {
      rows.push({ n, item: RUBRIC_ITEMS[n], signal: 'warn', evidence: 'repo archived (gh api archived=true)' });
      continue;
    }
    const days = meta.pushed ? (Date.now() - new Date(meta.pushed).getTime()) / 86400000 : null;
    if (days === null) rows.push({ n, item: RUBRIC_ITEMS[n], signal: 'unmeasured', evidence: 'no pushed_at' });
    else if (days <= 180) rows.push({ n, item: RUBRIC_ITEMS[n], signal: 'good', evidence: `pushed_at ${meta.pushed} (${Math.round(days)}d ago)` });
    else rows.push({ n, item: RUBRIC_ITEMS[n], signal: 'warn', evidence: `pushed_at ${meta.pushed} (${Math.round(days)}d ago, stale)` });
  }
  return rows;
}

const RUBRIC_ITEMS = {
  1: '실제 문제', 2: '산출물 계약', 3: '검증', 4: '도구화', 5: '실패 처리',
  6: '유지보수', 7: '보안', 8: '이식성', 9: '비용', 10: '제품 연결'
};

function writeMetacard(packageRoot, slug, url, meta) {
  const dir = path.join(packageRoot, 'docs', 'references');
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${slug}.md`);
  const captured = new Date().toISOString().slice(0, 10);
  const body = `---
source: ${url}
kind: repo
perspectives: []
patterns: []
applies_to: []
evidence_grade: community
captured: ${captured}
---

## Analysis

TODO — fill after reading README/source. Deterministic collection only found:
${meta.ok ? `license=${meta.license ?? 'unknown'}, stars=${meta.stars ?? 'unknown'}, pushed=${meta.pushed ?? 'unknown'}` : `metadata fetch failed: ${meta.error}`}

## Measured

not executed

## How EPDS uses it

TODO
`;
  fs.writeFileSync(file, body, 'utf8');
  return path.relative(packageRoot, file);
}

function parseArgs(argv) {
  const out = { url: null, write: false };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--write') out.write = true;
    else if (!argv[i].startsWith('--') && !out.url) out.url = argv[i];
  }
  return out;
}

export function runReference(argv, packageRoot) {
  const { url, write } = parseArgs(argv);
  if (!url) return { output: { error: 'usage: epds reference <url> [--write]', exit: 2 }, exit: 2 };

  const slug = slugify(url);
  const gh = parseGithubUrl(url);
  const meta = gh ? fetchGithubMeta(gh.owner, gh.repo) : { ok: false, cmd: null, exit: 2, error: 'not a github.com URL — no metadata source wired' };

  const rubric = scoreRubric(meta);
  const measured = { install: null, installExit: null, run: null, runExit: null, at: null };
  // addCandidate stays false — this script never executes an install/run, so per protocol
  // (docs/references — "measured.runExit 실측 전 sources add 금지") it can never be true.
  const addCandidate = false;

  const output = {
    schemaVersion: 1,
    url,
    slug,
    license: meta.ok ? meta.license : null,
    activity: { stars: meta.ok ? meta.stars : null, pushed: meta.ok ? meta.pushed : null, cmd: meta.cmd, exit: meta.exit },
    rubric,
    measured,
    recommendation: 'Observe',
    addCandidate,
    exit: meta.ok ? 0 : 1,
    metacard: null
  };

  if (write) {
    output.metacard = writeMetacard(packageRoot, slug, url, meta);
  } else {
    output.metacard = { dryRun: true, wouldWrite: `docs/references/${slug}.md` };
  }

  return { output, exit: output.exit };
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isMain) {
  const packageRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
  const { output, exit } = runReference(process.argv.slice(2), packageRoot);
  console.log(JSON.stringify(output, null, 2));
  process.exit(exit);
}
