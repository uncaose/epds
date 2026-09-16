#!/usr/bin/env node

import { access, cp, copyFile, mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { homedir } from 'node:os';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(here, '..');
const sourceSkill = join(packageRoot, 'SKILL.md');
const sourceLicense = join(packageRoot, 'LICENSE');
const sourceNotice = join(packageRoot, 'NOTICE');
const sourceTemplates = join(packageRoot, 'templates');
const sourceDocs = join(packageRoot, 'docs');
const sourceReferences = join(packageRoot, 'docs', 'references');

const command = process.argv[2] ?? 'help';
const args = new Set(process.argv.slice(3));
const yes = args.has('--yes') || args.has('-y');
const projectOnly = args.has('--project');
const globalOnly = args.has('--global');

function printUsage() {
  console.log(`
EPDS — Evidence-First Product Delivery System

Usage:
  epds setup                 Install the EPDS Claude Code skill interactively
  epds setup --global        Install to ~/.claude/skills/epds
  epds setup --project       Install to ./.claude/skills/epds
  epds setup --yes           Replace an existing EPDS skill without asking
  epds check [--global|--project]
                             Check whether an EPDS skill is installed
  epds uninstall [--global|--project]
                             Remove only the installed EPDS skill directory
  epds sources list         List trusted public sources (epds/trusted-sources.json)
  epds sources add <url> [--kind K] [--name N] [--note T]
                             Add a trusted source (kind: skill|tool|repo|doc|article|thread)
  epds sources remove <id|url>
                             Remove a trusted source by id or url
  epds sources show <id>    Print one source's full record

Examples:
  npx github:uncaose/epds setup
  npx github:uncaose/epds setup --project
  npx github:uncaose/epds check --global
  npx github:uncaose/epds sources add https://example.com/docs --kind doc --name "Example Docs"

The installer installs only the EPDS skill package. It does not modify
AGENTS.md, CLAUDE.md, product code, CI, deployments, secrets, or any
other target-project files. After installation, open a project in Claude
Code and say: "EPDS 설정해줘."
`);
}

async function exists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function isDirectory(path) {
  try {
    return (await stat(path)).isDirectory();
  } catch {
    return false;
  }
}

function globalTarget() {
  return join(homedir(), '.claude', 'skills', 'epds');
}

function projectTarget() {
  return join(process.cwd(), '.claude', 'skills', 'epds');
}

async function chooseTarget() {
  if (projectOnly && globalOnly) {
    throw new Error('Use only one of --global or --project.');
  }
  if (projectOnly) return { scope: 'project', target: projectTarget() };
  if (globalOnly) return { scope: 'global', target: globalTarget() };

  if (!process.stdin.isTTY) {
    throw new Error('Non-interactive use requires --global or --project.');
  }

  const rl = createInterface({ input, output });
  try {
    console.log('\nChoose where to install EPDS:');
    console.log(`  1) Global  — ${globalTarget()} (all Claude Code projects)`);
    console.log(`  2) Project — ${projectTarget()} (current project only)`);
    const answer = (await rl.question('Select 1 or 2 [1]: ')).trim() || '1';
    if (answer === '1') return { scope: 'global', target: globalTarget() };
    if (answer === '2') return { scope: 'project', target: projectTarget() };
    throw new Error('Invalid selection. Choose 1 or 2.');
  } finally {
    rl.close();
  }
}

async function confirm(question) {
  if (yes) return true;
  if (!process.stdin.isTTY) return false;
  const rl = createInterface({ input, output });
  try {
    const answer = (await rl.question(`${question} [y/N]: `)).trim().toLowerCase();
    return answer === 'y' || answer === 'yes';
  } finally {
    rl.close();
  }
}

async function copyOptionalTemplateReadme(target) {
  if (!(await isDirectory(sourceTemplates))) return;
  const targetTemplates = join(target, 'templates');
  await mkdir(targetTemplates, { recursive: true });
  const readme = `# EPDS templates\n\nThese templates are shipped with the EPDS skill for reference.\nDo not copy them into a product repository blindly. Ask EPDS to inspect the\nrepository and propose a minimal installation plan first.\n`;
  await writeFile(join(targetTemplates, 'README.md'), readme, 'utf8');
}

async function setup() {
  for (const path of [sourceSkill, sourceLicense, sourceNotice]) {
    if (!(await exists(path))) {
      throw new Error(`EPDS package is incomplete: missing ${basename(path)}.`);
    }
  }

  const { scope, target } = await chooseTarget();
  const existing = await exists(target);

  if (existing) {
    const replace = await confirm(`\nEPDS already exists at ${target}. Replace only this EPDS skill directory?`);
    if (!replace) {
      console.log('Installation cancelled. No files were changed.');
      return;
    }
    await rm(target, { recursive: true, force: true });
  }

  await mkdir(target, { recursive: true });
  await copyFile(sourceSkill, join(target, 'SKILL.md'));
  await copyFile(sourceLicense, join(target, 'LICENSE'));
  await copyFile(sourceNotice, join(target, 'NOTICE'));
  await copyOptionalTemplateReadme(target);
  if (await isDirectory(sourceDocs)) {
    await mkdir(join(target, 'docs'), { recursive: true });
    for (const entry of await readdir(sourceDocs, { withFileTypes: true })) {
      if (entry.isFile() && entry.name.endsWith('.md')) {
        await copyFile(join(sourceDocs, entry.name), join(target, 'docs', entry.name));
      }
    }
  }
  if (await isDirectory(sourceReferences)) {
    await cp(sourceReferences, join(target, 'docs', 'references'), { recursive: true });
  }

  const marker = {
    name: 'EPDS',
    fullName: 'Evidence-First Product Delivery System',
    version: '0.1.0',
    source: 'https://github.com/uncaose/epds',
    scope,
    installedAt: new Date().toISOString(),
    attribution: 'Retain LICENSE and NOTICE when redistributing or modifying EPDS materials.'
  };
  await writeFile(join(target, '.installed-from.json'), `${JSON.stringify(marker, null, 2)}\n`, 'utf8');

  console.log(`\nEPDS installed successfully (${scope}).`);
  console.log(`Location: ${target}`);
  console.log('\nNext steps:');
  console.log('  1. Open the target project with Claude Code.');
  console.log('  2. Say: EPDS 설정해줘.');
  console.log('  3. EPDS will diagnose first, propose a plan, and wait for approval before modifying the project.');
}

async function check() {
  const targets = projectOnly ? [{ scope: 'project', target: projectTarget() }]
    : globalOnly ? [{ scope: 'global', target: globalTarget() }]
      : [{ scope: 'project', target: projectTarget() }, { scope: 'global', target: globalTarget() }];

  let found = false;
  for (const item of targets) {
    const skill = join(item.target, 'SKILL.md');
    if (await exists(skill)) {
      found = true;
      console.log(`FOUND   ${item.scope.padEnd(7)} ${item.target}`);
      const marker = join(item.target, '.installed-from.json');
      if (await exists(marker)) {
        try {
          const text = await readFile(marker, 'utf8');
          const data = JSON.parse(text);
          console.log(`        version: ${data.version ?? 'unknown'}, installed: ${data.installedAt ?? 'unknown'}`);
        } catch {
          console.log('        marker: unreadable');
        }
      }
    } else {
      console.log(`MISSING  ${item.scope.padEnd(7)} ${item.target}`);
    }
  }

  const sourcesPath = trustedSourcesPath();
  if (await exists(sourcesPath)) {
    try {
      JSON.parse(await readFile(sourcesPath, 'utf8'));
      console.log(`OK       sources  ${sourcesPath}`);
    } catch (error) {
      console.log(`INVALID  sources  ${sourcesPath} (${error.message})`);
      process.exitCode = 1;
    }
  }

  if (!found) process.exitCode = 1;
}

async function uninstall() {
  if (projectOnly && globalOnly) {
    throw new Error('Use only one of --global or --project.');
  }

  const candidates = projectOnly ? [{ scope: 'project', target: projectTarget() }]
    : globalOnly ? [{ scope: 'global', target: globalTarget() }]
      : await chooseTarget().then((item) => [item]);

  for (const { scope, target } of candidates) {
    if (!(await exists(target))) {
      console.log(`No EPDS directory found at ${target}. Nothing changed.`);
      continue;
    }
    const remove = await confirm(`Remove the EPDS ${scope} skill directory at ${target}?`);
    if (!remove) {
      console.log('Uninstall cancelled. No files were changed.');
      continue;
    }
    await rm(target, { recursive: true, force: true });
    console.log(`Removed EPDS from ${target}.`);
  }
}

const KINDS = ['skill', 'tool', 'repo', 'doc', 'article', 'thread'];

function trustedSourcesPath() {
  return join(process.cwd(), 'epds', 'trusted-sources.json');
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'source';
}

function normalizeUrl(raw) {
  try {
    const u = new URL(raw);
    u.hash = '';
    return u.toString().replace(/\/$/, '');
  } catch {
    throw new Error(`Not a valid URL: ${raw}`);
  }
}

async function loadSources() {
  const path = trustedSourcesPath();
  if (!(await exists(path))) return { version: 1, sources: [] };
  const text = await readFile(path, 'utf8');
  try {
    const data = JSON.parse(text);
    if (!Array.isArray(data.sources)) throw new Error('missing "sources" array');
    return data;
  } catch (error) {
    throw new Error(`${path} is not valid JSON: ${error.message}`);
  }
}

async function saveSources(data) {
  const path = trustedSourcesPath();
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  return path;
}

function parseFlags(rest) {
  const flags = {};
  for (let i = 0; i < rest.length; i += 1) {
    if (rest[i].startsWith('--')) {
      flags[rest[i].slice(2)] = rest[i + 1];
      i += 1;
    }
  }
  return flags;
}

async function sourcesList() {
  const data = await loadSources();
  if (data.sources.length === 0) {
    console.log(`No trusted sources yet. ${trustedSourcesPath()}`);
    return;
  }
  for (const s of data.sources) {
    console.log(`${s.id.padEnd(24)} ${(s.kind ?? '').padEnd(8)} ${s.name ?? ''}  ${s.url}`);
  }
}

async function sourcesShow(id) {
  const data = await loadSources();
  const found = data.sources.find((s) => s.id === id);
  if (!found) throw new Error(`No trusted source with id "${id}".`);
  console.log(JSON.stringify(found, null, 2));
}

async function sourcesAdd(url, flags) {
  if (!url) throw new Error('Usage: epds sources add <url> [--kind K] [--name N] [--note T]');
  const normalized = normalizeUrl(url);
  const kind = flags.kind ?? 'doc';
  if (!KINDS.includes(kind)) throw new Error(`--kind must be one of: ${KINDS.join(', ')}`);

  const data = await loadSources();
  if (data.sources.some((s) => s.url === normalized)) {
    throw new Error(`Already tracked: ${normalized}`);
  }

  let id = slugify(flags.name ?? new URL(normalized).hostname + new URL(normalized).pathname);
  let unique = id;
  let n = 2;
  while (data.sources.some((s) => s.id === unique)) {
    unique = `${id}-${n}`;
    n += 1;
  }

  data.sources.push({
    id: unique,
    url: normalized,
    kind,
    name: flags.name ?? unique,
    purpose: '',
    perspectives: [],
    patterns: [],
    applies_to: [],
    evidence_grade: 'community',
    meta: { install: null, invoke: null, license: null, last_release: null, activity: null },
    added: new Date().toISOString().slice(0, 10),
    note: flags.note ?? ''
  });

  const path = await saveSources(data);
  console.log(`Added ${unique} -> ${path}`);
}

async function sourcesRemove(idOrUrl) {
  if (!idOrUrl) throw new Error('Usage: epds sources remove <id|url>');
  const data = await loadSources();
  const before = data.sources.length;
  data.sources = data.sources.filter((s) => s.id !== idOrUrl && s.url !== idOrUrl);
  if (data.sources.length === before) {
    throw new Error(`No trusted source matching "${idOrUrl}".`);
  }
  const path = await saveSources(data);
  console.log(`Removed ${idOrUrl} -> ${path}`);
}

async function sources() {
  const [sub, arg, ...rest] = process.argv.slice(3);
  const flags = parseFlags(rest);
  if (sub === 'list') return sourcesList();
  if (sub === 'add') return sourcesAdd(arg, flags);
  if (sub === 'remove') return sourcesRemove(arg);
  if (sub === 'show') return sourcesShow(arg);
  throw new Error('Usage: epds sources list|add <url>|remove <id|url>|show <id>');
}

try {
  if (command === 'setup') await setup();
  else if (command === 'check') await check();
  else if (command === 'uninstall') await uninstall();
  else if (command === 'sources') await sources();
  else if (command === 'help' || command === '--help' || command === '-h') printUsage();
  else {
    console.error(`Unknown command: ${command}`);
    printUsage();
    process.exitCode = 1;
  }
} catch (error) {
  console.error(`\nEPDS error: ${error.message}`);
  process.exitCode = 1;
}
