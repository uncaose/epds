<!-- source: docs/INSTALL.md sha256:43821af1b54a -->
<!-- completed 2026-09-16 by harness orchestrator from Perplexity thread 6f74f459 (stub in original artifact) -->

# Panduan Pemasangan

## Pemasangan yang disahkan (2026-09-16)

Kedua-dua arahan di bawah telah dijalankan dan diperiksa dari hujung ke hujung (repo checkout, penyenaraian fail, `CLAUDE.md`/`AGENTS.md`/`settings.json` dibandingkan sebelum/selepas — tidak berubah dalam kedua-dua kes).

| Kaedah | Arahan | Lokasi pemasangan | Termasuk | Arahan slash | Kesan konfigurasi global | Sahkan |
|---|---|---|---|---|---|---|
| `skills add` | `npx skills add uncaose/epds -a claude-code` | `./.claude/skills/epds/` | repo penuh (SKILL.md, adapters, bin, docs, templates) | 5 (`/epds-setup /epds-status /epds-audit /epds-upgrade /epds-reference`) | tiada | lihat di bawah |
| npx setup | `npx github:uncaose/epds setup --project` | `./.claude/skills/epds/` | SKILL.md, LICENSE, NOTICE, `templates/` sepenuhnya (semua arena.md/pr-landing.md/retro.md/experiment-brief.md/feature-spec.md/adr.md/gate-report.md/WORK-ROUTER.md/epds-\*.json serta `templates/README.md` yang dijana, bukan hanya penunjuk README), `docs/*.md` (EPDS/ROLES/TESTS/LAYOUT/…), `docs/references/`, `docs/policies/` sepenuhnya, `.installed-from.json` | 0 | tiada | lihat di bawah |

Syor: gunakan `skills add` jika anda mahu arahan slash; npx setup biasa hanya memberikan fail kemahiran minimum.

Sahkan selepas mana-mana pemasangan:

```bash
node bin/epds.mjs check --project
ls .claude/skills/epds
# in Claude Code:
/epds-status
```

## Pilihan A: sumber GitHub dengan npx

EPDS pada awalnya bertujuan untuk dijalankan terus daripada GitHub, tanpa penerbitan npm registry.

```bash
npx github:uncaose/epds setup
```

Pemasang bertanya di mana kemahiran Claude Code patut ditempatkan.

- Global: `~/.claude/skills/epds/`
- Projek: `./.claude/skills/epds/`

Gunakan flag untuk pemasangan bukan interaktif atau berskrip:

```bash
npx github:uncaose/epds setup --global
npx github:uncaose/epds setup --project
npx github:uncaose/epds setup --global --yes
```

Pemasang hanya menyalin pakej Kemahiran EPDS. Ia tidak mengkonfigurasi projek sasaran. Untuk mengkonfigurasi projek, bukanya dalam Claude Code selepas pemasangan dan katakan:

```text
EPDS seoljeonghaejwo.
```

## Pilihan B: clone dan symlink

```bash
git clone https://github.com/uncaose/epds.git ~/Developer/epds
mkdir -p ~/.claude/skills
ln -s ~/Developer/epds ~/.claude/skills/epds
```

Kemas kini dengan:

```bash
cd ~/Developer/epds
git pull
```

## Pilihan C: pemasangan manual

```bash
mkdir -p ~/.claude/skills/epds
cp SKILL.md ~/.claude/skills/epds/SKILL.md
cp LICENSE ~/.claude/skills/epds/LICENSE
cp NOTICE ~/.claude/skills/epds/NOTICE
```

## Sahkan pemasangan

```bash
npx github:uncaose/epds check
npx github:uncaose/epds check --global
npx github:uncaose/epds check --project
```

## Nyahpasang

```bash
npx github:uncaose/epds uninstall --global
npx github:uncaose/epds uninstall --project
```

Arahan nyahpasang hanya membuang direktori kemahiran EPDS yang dipilih. Ia tidak memadam fail EPDS yang sebelum ini dipasang ke dalam projek sasaran oleh ejen.

## Konfigurasi sumber awam yang dipercayai

`epds/trusted-sources.json` di akar projek menyenaraikan sumber awam yang EPDS dibenarkan untuk cari
dan petik dahulu (lihat `docs/EPDS.md` § Trusted public sources config). Uruskannya dengan:

```bash
node bin/epds.mjs sources list
node bin/epds.mjs sources add <url> --kind doc --name "Some Docs" --note "why it matters"
node bin/epds.mjs sources show <id>
node bin/epds.mjs sources remove <id|url>
```

`epds check` melaporkan sama ada fail tersebut wujud dan merupakan JSON yang sah.

## Penyelesaian masalah

### `npx` tidak dapat menjalankan pakej

Semak versi Node:

```bash
node --version
```

EPDS memerlukan Node.js 20 atau lebih baharu.

### Claude Code tidak menunjukkan EPDS

- Sahkan fail wujud di `~/.claude/skills/epds/SKILL.md` atau `./.claude/skills/epds/SKILL.md`.
- Mulakan sesi Claude Code baharu dalam projek sasaran.
- Tanya secara semula jadi: `EPDS seoljeonghaejwo.`
- Jika arahan slash tidak disenaraikan dalam runtime anda, pencetus bahasa semula jadi masih berfungsi apabila kemahiran dimuatkan.

### Kemahiran EPDS sedia ada telah diganti

Pemasang bertanya sebelum menggantikan `epds` pada skop yang dipilih. Gunakan Git clone + symlink jika anda mahu sejarah penuh dan kemas kini yang mudah.
