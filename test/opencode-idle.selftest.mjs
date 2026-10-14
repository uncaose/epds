#!/usr/bin/env node
// test/opencode-idle.selftest.mjs — adapters/opencode/epds-gate.js: session.idle re-prompt (opencode has no blocking stop hook).
// Fake client + events: missing LIFECYCLE.md -> 1 re-prompt; failing check -> reason carried; cap 3; passing check -> none.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const root = path.join(path.dirname(new URL(import.meta.url).pathname), '..');
const { EpdsGate } = await import(path.join(root, 'adapters', 'opencode', 'epds-gate.js'));
let fail = 0;
const ok = (l, c) => { console.log(`  ${c ? 'ok  ' : 'FAIL'} ${l}`); if (!c) fail += 1; };
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'epds-oc-'));
process.env.EPDS_GATE_STATE = path.join(tmp, 'state');
const mk = async (dir) => {
  const calls = [];
  const client = { session: { promptAsync: async (o) => { calls.push(o); } } };
  const h = await EpdsGate({ client, directory: dir });
  return { calls, idle: (id) => h.event({ event: { type: 'session.idle', properties: { sessionID: id } } }) };
};
const work = path.join(tmp, 'work'); fs.mkdirSync(work);
const txt = (c) => c.body.parts[0].text;

let a = await mk(work);
await a.idle('s1');
ok('no LIFECYCLE.md -> one re-prompt on the same session naming LIFECYCLE.md', a.calls.length === 1 && a.calls[0].path.id === 's1' && /LIFECYCLE\.md/.test(txt(a.calls[0])));

const tpl = fs.readFileSync(path.join(root, 'templates', 'LIFECYCLE.md'), 'utf8');
fs.writeFileSync(path.join(work, 'LIFECYCLE.md'), tpl);
await a.idle('s1');
ok('failing check -> re-prompt carries the check output', a.calls.length === 2 && /FAIL/.test(txt(a.calls[1])));
await a.idle('s1');
ok('third re-prompt sent', a.calls.length === 3);
await a.idle('s1');
ok('4th idle in the same session -> no re-prompt (cap), logged', a.calls.length === 3 && /cap/.test(fs.readFileSync(path.join(tmp, 'state', 'gate.log'), 'utf8')));

fs.writeFileSync(path.join(work, 'LIFECYCLE.md'), (tpl.split(/^## Example.*$/m)[1] || '').replace(/\.json/g, ''));
const b = await mk(work);
await b.idle('s2');
ok('passing check -> no re-prompt', b.calls.length === 0);
await b.event?.({ event: { type: 'message.updated', properties: {} } });
console.log(fail ? `FAIL (${fail} failures)` : 'PASS (0 failures)');
process.exit(fail ? 1 : 0);
