#!/usr/bin/env node
// test/sources.selftest.mjs — `epds sources add` value-flag regression (P11,
// docs/absorb-pstack.md item 3): every value-taking flag (--kind/--name/--note) must exit
// non-zero when given with no value (`--flag` at the end, or `--flag=`), instead of silently
// falling through to a default. `node test/sources.selftest.mjs` -> exit 0.
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

function freshTmp() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'epds-sources-selftest-'));
}

function runsNonZero(argv, cwd) {
  try {
    execFileSync(process.execPath, [epdsBin, ...argv], { cwd, encoding: 'utf8', stdio: 'pipe' });
    return false;
  } catch (error) {
    return error.status !== 0;
  }
}

// ---- case 1: `--kind` with no value exits non-zero (was already true, via KINDS.includes) ----
{
  const dir = freshTmp();
  ok('case1 `sources add <url> --kind` (no value) exits non-zero', runsNonZero(['sources', 'add', 'https://example.com/a', '--kind'], dir));
}

// ---- case 2: `--name` with no value exits non-zero (P11 regression — was silently accepted,
// falling through to a generated id via `'' ?? fallback` === '') ----
{
  const dir = freshTmp();
  ok('case2 `sources add <url> --name` (no value) exits non-zero', runsNonZero(['sources', 'add', 'https://example.com/b', '--name'], dir));
  ok('case2 `sources add <url> --name=` (equals, empty) exits non-zero', runsNonZero(['sources', 'add', 'https://example.com/b2', '--name='], dir));
}

// ---- case 3: `--note` with no value exits non-zero (same regression as --name) ----
{
  const dir = freshTmp();
  ok('case3 `sources add <url> --note` (no value) exits non-zero', runsNonZero(['sources', 'add', 'https://example.com/c', '--note'], dir));
}

// ---- case 4: a value actually given still works (the fix must not reject real values) ----
{
  const dir = freshTmp();
  const out = execFileSync(process.execPath, [epdsBin, 'sources', 'add', 'https://example.com/d', '--kind', 'tool', '--name', 'Example', '--note', 'a real note'], { cwd: dir, encoding: 'utf8' });
  ok('case4 a fully-valued `sources add` still succeeds', out.includes('Added'));
  const listed = execFileSync(process.execPath, [epdsBin, 'sources', 'list'], { cwd: dir, encoding: 'utf8' });
  ok('case4 the added source is listed with its given name', listed.includes('Example'));
}

console.log(fail === 0 ? `\nPASS (0 failures)` : `\nFAIL (${fail} failures)`);
process.exit(fail === 0 ? 0 : 1);
