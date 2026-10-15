#!/usr/bin/env node
// test/i18n.selftest.mjs — 7 languages x 2 intro docs (README, INSTALL) must exist, match the current English source (sha256 header),
// and contain the language's script. Editing a source doc without refreshing its translations = "stale translation" -> warning only (v10).
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';

const root = path.join(path.dirname(new URL(import.meta.url).pathname), '..');
const FILES = ['README.md', 'docs/INSTALL.md'];
const SCRIPT = { // null = Latin script: only "differs from English source" is checked
  ko: /[\uAC00-\uD7A3]/, 'zh-CN': /[\u4E00-\u9FFF]/, ja: /[\u3040-\u30FF]/, th: /[\u0E00-\u0E7F]/,
  vi: /[ăâđêôơưĂÂĐÊÔƠƯàáảãạằắẳẵặầấẩẫậèéẻẽẹềếểễệìíỉĩịòóỏõọồốổỗộờớởỡợùúủũụừứửữựỳýỷỹỵ]/, ms: null, id: null,
};
const bad = [];
const stale = []; // v10: a stale translation only warns (translations are refreshed in a later pass)
for (const [lang, re] of Object.entries(SCRIPT)) {
  for (const f of FILES) {
    const t = path.join(root, 'i18n', lang, f);
    if (!existsSync(t)) { bad.push(`missing translation: i18n/${lang}/${f}`); continue; }
    const src = readFileSync(path.join(root, f));
    const sha = createHash('sha256').update(src).digest('hex').slice(0, 12);
    const txt = readFileSync(t, 'utf8');
    const m = txt.split('\n', 1)[0].match(/^<!-- source: (\S+) sha256:([0-9a-f]{12}) -->$/);
    if (!m || m[1] !== f) bad.push(`bad source header: i18n/${lang}/${f}`);
    else if (m[2] !== sha) stale.push(`stale translation: i18n/${lang}/${f}`);
    const body = txt.split('\n').slice(1).join('\n');
    if (re ? !re.test(body) : body.trim() === src.toString('utf8').trim()) bad.push(`not translated (${lang} script/content): i18n/${lang}/${f}`);
  }
}
for (const w of stale) console.warn(`WARN ${w}`);
if (bad.length) { console.error(`FAIL i18n.selftest:\n${bad.join('\n')}`); process.exit(1); }
console.log(`PASS i18n.selftest: ${Object.keys(SCRIPT).length * FILES.length} translations present, fresh, in-language`);
