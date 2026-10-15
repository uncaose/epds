// adapters/opencode/epds-gate.js — end-of-turn gate for opencode. opencode cannot block a stop, so on `session.idle`
// this re-prompts the same session when LIFECYCLE.md is missing or `node bin/check.mjs LIFECYCLE.md` exits non-zero.
// Same rule and cap as adapters/claude-code/stop-gate.mjs: after 3 re-prompts per session the next idle passes (logged).
// Install: copy to <repo>/.opencode/plugins/epds-gate.js and set EPDS_DIR to the epds skill dir (default: this file's ../..).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const CAP = 3;
const epds = process.env.EPDS_DIR || path.join(path.dirname(new URL(import.meta.url).pathname), '..', '..');
const { epdsLevel } = await import(pathToFileURL(path.join(epds, 'bin', 'level.mjs')).href); // works from a copied plugin via EPDS_DIR
const sent = new Map(); // sessionID -> re-prompts sent

export const EpdsGate = async ({ client, directory }) => {
  const state = process.env.EPDS_GATE_STATE || path.join(os.tmpdir(), 'epds-gate');
  fs.mkdirSync(state, { recursive: true });
  const log = (o) => fs.appendFileSync(path.join(state, 'gate.log'), JSON.stringify({ t: new Date().toISOString(), runtime: 'opencode', cwd: directory, ...o }) + '\n');
  return {
    event: async ({ event }) => {
      if (event.type !== 'session.idle') return;
      const sid = event.properties.sessionID;
      const level = epdsLevel(directory);
      if (level !== 'high') return log({ sid, result: 'pass', level });
      let reason = '';
      if (!fs.existsSync(path.join(directory, 'LIFECYCLE.md'))) {
        reason = 'LIFECYCLE.md is missing in the working folder. Copy the template (templates/LIFECYCLE.md in the epds skill), fill every row, and run `node <epds skill dir>/bin/check.mjs LIFECYCLE.md` until it exits 0 before finishing.';
      } else {
        const r = spawnSync('node', [path.join(epds, 'bin', 'check.mjs'), 'LIFECYCLE.md'], { cwd: directory, encoding: 'utf8' });
        if (r.status !== 0) reason = `LIFECYCLE.md check failed (exit ${r.status}):\n${(r.stdout + r.stderr).trim()}\nFix the rows, then finish.`;
      }
      if (!reason) return log({ sid, result: 'pass' });
      const n = sent.get(sid) || 0;
      if (n >= CAP) return log({ sid, result: 'cap-pass', blocks: n });
      sent.set(sid, n + 1);
      log({ sid, result: 'reprompt', n: n + 1 });
      await client.session.promptAsync({ path: { id: sid }, body: { parts: [{ type: 'text', text: reason }] } });
    },
  };
};
