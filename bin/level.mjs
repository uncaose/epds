// bin/level.mjs — EPDS level: low | medium (default) | high. EPDS_LEVEL env, else first line of <cwd>/epds/level, else medium.
import fs from 'node:fs';
import path from 'node:path';
export const LEVELS = ['low', 'medium', 'high'];
export function epdsLevel(cwd = process.cwd(), env = process.env) {
  let v = String(env.EPDS_LEVEL || '').trim().toLowerCase();
  if (!v) { try { v = fs.readFileSync(path.join(cwd, 'epds', 'level'), 'utf8').split('\n')[0].trim().toLowerCase(); } catch {} }
  return LEVELS.includes(v) ? v : 'medium';
}
export const AUDIT_MODES = ['auto', 'interview', 'off'];
export function auditMode(cwd = process.cwd(), env = process.env) {
  let v = String(env.EPDS_AUDIT || '').trim().toLowerCase();
  if (!v) { try { v = fs.readFileSync(path.join(cwd, 'epds', 'audit-mode'), 'utf8').split('\n')[0].trim().toLowerCase(); } catch {} }
  return AUDIT_MODES.includes(v) ? v : 'auto';
}
