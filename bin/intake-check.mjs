#!/usr/bin/env node
// bin/intake-check.mjs <intake.md> — blocks building on an unfilled or blocked intake (templates/intake.md sections A-C, Status).
// Scope: catches honest mistakes and omissions, not deliberate forgery.
// Exit 0 = every check passes; exit 1 = failures listed one per line; exit 2 = usage/read error. Node stdlib only.
import fs from 'node:fs';

const file = process.argv[2];
if (!file) { console.error('usage: intake-check.mjs <intake.md>'); process.exit(2); }
let text;
try { text = fs.readFileSync(file, 'utf8'); } catch (e) { console.error(`cannot read ${file}: ${e.message}`); process.exit(2); }

const bad = [];
const empty = (v) => !v || /^<.*>$/.test(v.trim()) || /^(-|tbd|todo)$/i.test(v.trim()) || /^n\/a:?$/i.test(v.trim());
// A cell may be N/A only with a reason after the colon (`N/A: reason`); empty() already rejects a bare N/A.
const naNoReason = (v) => { const t = v.trim(); if (!/^n\/a\b/i.test(t)) return false; const m = /^n\/a:\s*(\S.*)$/i.exec(t); return !m || empty(m[1]); };

// Tables under a "### <letter>." heading: array of tables, each = array of rows (cells[]), header and separator rows dropped.
function tables(letter) {
  const m = text.match(new RegExp(`^###\\s+${letter}\\.[^\\n]*\\n([\\s\\S]*?)(?=^#{1,3}\\s|(?![\\s\\S]))`, 'm'));
  if (!m) { bad.push(`section ${letter} missing`); return []; }
  const out = []; let cur = null;
  for (const line of m[1].split('\n')) {
    if (!line.trim().startsWith('|')) { cur = null; continue; }
    if (!cur) { cur = []; out.push(cur); }
    const cells = line.trim().replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map((c) => c.trim().replace(/\\\|/g, '|')); // `\|` stays inside a cell
    if (cells.every((c) => /^:?-{3,}:?$/.test(c))) continue;
    cur.push(cells);
  }
  return out.map((t) => t.slice(1)); // drop header
}

// TRIVIAL one-line intake (templates/intake.md section 0): no section A, so only purpose and done check are checked.
// TRIVIAL only when the whole input, minus blank, title and Status lines, is that one line.
const st = (text.match(/^Status:[ \t]*(.*)$/m) || [])[1] || '';
const approved = /approved/i.test(st);
const noApprover = approved && !/\bby\s+[^<>]*\S[^<>]*\s+on\s+\d{4}-\d{2}-\d{2}\b/i.test(st);
const rest = text.split('\n').filter((l) => l.trim() && !/^#\s/.test(l) && !/^Status:/.test(l));
const triv = rest.length === 1 && rest[0].match(/^Purpose:[ \t]*(.*?)[ \t]*\|[ \t]*Done check:[ \t]*(.*)$/);
if (triv) {
  if (empty(triv[1])) bad.push('trivial: purpose is empty');
  if (empty(triv[2])) bad.push('trivial: done check is empty');
  if (noApprover) bad.push('status: approved without approver and date (by <owner> on <YYYY-MM-DD>)');
  if (bad.length) { console.error(`intake-check: ${bad.length} failure(s)\n- ${bad.join('\n- ')}`); process.exit(1); }
  console.log('intake-check: ok (TRIVIAL one-line intake)'); process.exit(0);
}

// A: chain
const [chain = [], measures = []] = tables('A');
const blockedCells = []; // `blocked` written in an A or C cell counts as a blocked row
const FIELDS = ['need', 'start', 'purpose', 'goal', 'success/kill', 'preserve'];
for (const f of FIELDS) {
  const r = chain.find((c) => c[0].toLowerCase() === f);
  if (!r) bad.push(`chain: row "${f}" missing`);
  else if (empty(r[1])) bad.push(`chain: "${f}" is empty`);
  else if (naNoReason(r[1])) bad.push(`chain: "${f}" is N/A without a reason`);
}
chain.forEach((r) => { if (/^blocked$/i.test(r[1])) blockedCells.push(r[0]); });
measures.forEach((r, i) => { if (r.some((c) => /^blocked$/i.test(c))) blockedCells.push(`measure ${i + 1}`); });
if (!measures.length) bad.push('chain: no measure rows');
measures.forEach((r, i) => {
  ['metric', 'current', 'target', 'deadline', 'how measured'].forEach((n, k) => { if (empty(r[k])) bad.push(`measure ${i + 1}: "${n}" is empty`); });
  if (empty(r[5])) bad.push(`measure ${i + 1}: no done check`);
});

// B: axes
const [axes = []] = tables('B');
const AXES = ['target', 'organization', 'end-state', 'form', 'infrastructure', 'ai-model', 'promotion', 'feedback', 'operation', 'resources', 'start'];
const seen = new Set();
const states = [];
const endState = ((axes.find((r) => r[1].toLowerCase() === 'end-state') || [])[2] || '').toLowerCase();
// Spec-required axes ignore the typed class column; conditional ones follow the end state (also inside folded rows).
const ALWAYS = ['target', 'end-state', 'form', 'operation', 'resources', 'start'];
const needs = { infrastructure: /\bservice\b/.test(endState), feedback: !/\bprivate\b/.test(endState) && /\bservice\b|open source|release|public/.test(endState) };
for (const a of ALWAYS) needs[a] = true;
for (const r of axes) {
  const [, axis, value, cls, source, state] = r;
  axis.toLowerCase().split('+').forEach((a) => seen.add(a.trim()));
  const c = (cls || '').toLowerCase();
  const req = axis.toLowerCase().split('+').some((a) => needs[a.trim()]);
  if (req && (c === 'n/a' || empty(value) || /^n\/a\b/i.test(value))) bad.push(`axis ${axis}: required axis needs a real value, not N/A or empty`);
  if (c !== 'n/a' && naNoReason(value || '')) bad.push(`axis ${axis}: N/A without a reason`);
  if (!['required', 'optional', 'n/a'].includes(c)) bad.push(`axis ${axis}: class must be required | optional | N/A`);
  if (c === 'n/a' ? !/^n\/a/i.test(value || '') || naNoReason(value || '') : (c === 'required' && empty(value))) bad.push(`axis ${axis}: ${c === 'n/a' ? 'N/A without a reason' : 'required value is empty'}`);
  if (empty(source)) bad.push(`axis ${axis}: source is empty`);
  const s = (state || '').toLowerCase();
  if (!['decided', 'open', 'blocked'].includes(s)) bad.push(`axis ${axis}: state must be decided | open | blocked`);
  else states.push([axis, s, req ? 'required' : c]);
}
const own = new Set(axes.map((r) => r[1].toLowerCase()).filter((a) => !a.includes('+')));
for (const a of AXES) {
  if (!seen.has(a)) bad.push(`axis ${a} missing`);
  else if (needs[a] && !own.has(a)) bad.push(`axis ${a}: required axis needs its own row, not folded (a+b)`);
}

// C: stages
const [stages = []] = tables('C');
if (!stages.length) bad.push('stages: no rows');
const STAGE = ['stage', 'goal', 'done check', 'resources', 'end state', 'condition to go on'];
stages.forEach((r, i) => { STAGE.forEach((n, k) => { if (k !== 2 && empty(r[k])) bad.push(`stage ${i + 1}: "${n}" is empty`); }); if (empty(r[2])) bad.push(`stage ${i + 1}: no done check`); if (r.some((c) => /^blocked$/i.test(c))) blockedCells.push(`stage ${i + 1}`); });

// Status: approval needs approver and date; approved + a blocked row is refused.
if (!st.trim() || /^<.*>$/.test(st.trim())) bad.push('status missing');
if (noApprover) bad.push('status: approved without approver and date (by <owner> on <YYYY-MM-DD>)');
const blocked = [...states.filter(([, s]) => s === 'blocked'), ...blockedCells.map((a) => [a])];
if (approved) for (const [a, s, c] of states) if (c === 'required' && s !== 'decided') bad.push(`axis ${a}: required axis is ${s} under an approved status`);
if (approved && blocked.length) bad.push(`blocked rows remain under an approved status: ${blocked.map(([a]) => a).join(', ')}`);

if (bad.length) { console.error(`intake-check: ${bad.length} failure(s)\n- ${bad.join('\n- ')}`); process.exit(1); }
if (blocked.length) console.log(`intake-check: ok; do not build units behind blocked rows: ${blocked.map(([a]) => a).join(', ')}`);
else console.log('intake-check: ok');
