<!-- source: docs/INSTALL.md sha256:43821af1b54a -->
<!-- diselesaikan 2026-09-16 oleh orchestrator harness dari thread Perplexity 6f74f459 (stub dalam artifact asli) -->

# Panduan Instalasi

## Instalasi terverifikasi (2026-09-16)

Kedua perintah di bawah dijalankan dan diperiksa dari awal hingga akhir (checkout repo, daftar file, diff `CLAUDE.md`/`AGENTS.md`/`settings.json` sebelum/sesudah — tidak berubah pada kedua kasus).

| Metode | Perintah | Lokasi instalasi | Mencakup | Slash command | Dampak konfigurasi global | Verifikasi |
|---|---|---|---|---|---|---|
| `skills add` | `npx skills add uncaose/epds -a claude-code` | `./.claude/skills/epds/` | repo penuh (SKILL.md, adapter, bin, docs, template) | 5 (`/epds-setup /epds-status /epds-audit /epds-upgrade /epds-reference`) | tidak ada | lihat di bawah |
| npx setup | `npx github:uncaose/epds setup --project` | `./.claude/skills/epds/` | SKILL.md, LICENSE, NOTICE, `templates/` secara penuh (semua arena.md/pr-landing.md/retro.md/experiment-brief.md/feature-spec.md/adr.md/gate-report.md/WORK-ROUTER.md/epds-\*.json ditambah `templates/README.md` yang dihasilkan, bukan hanya pointer README), `docs/*.md` (EPDS/ROLES/TESTS/LAYOUT/…), `docs/references/`, `docs/policies/` secara penuh, `.installed-from.json` | 0 | tidak ada | lihat di bawah |

Rekomendasi: gunakan `skills add` jika Anda menginginkan slash command; npx setup biasa hanya memberikan file skill minimal.

Verifikasi setelah salah satu instalasi:

```bash
node bin/epds.mjs check --project
ls .claude/skills/epds
# in Claude Code:
/epds-status
```

## Opsi A: Sumber GitHub dengan npx

EPDS pada awalnya dimaksudkan untuk berjalan langsung dari GitHub, tanpa publikasi registry npm.

```bash
npx github:uncaose/epds setup
```

Installer menanyakan di mana skill Claude Code harus ditempatkan.

- Global: `~/.claude/skills/epds/`
- Project: `./.claude/skills/epds/`

Gunakan flag untuk instalasi non-interaktif atau berbasis skrip:

```bash
npx github:uncaose/epds setup --global
npx github:uncaose/epds setup --project
npx github:uncaose/epds setup --global --yes
```

Installer hanya menyalin paket Skill EPDS. Installer tidak mengonfigurasi project target. Untuk mengonfigurasi project, buka project tersebut di Claude Code setelah instalasi dan katakan:

```text
EPDS seoljeonghaejwo.
```

## Opsi B: clone dan symlink

```bash
git clone https://github.com/uncaose/epds.git ~/Developer/epds
mkdir -p ~/.claude/skills
ln -s ~/Developer/epds ~/.claude/skills/epds
```

Perbarui dengan:

```bash
cd ~/Developer/epds
git pull
```

## Opsi C: instalasi manual

```bash
mkdir -p ~/.claude/skills/epds
cp SKILL.md ~/.claude/skills/epds/SKILL.md
cp LICENSE ~/.claude/skills/epds/LICENSE
cp NOTICE ~/.claude/skills/epds/NOTICE
```

## Verifikasi instalasi

```bash
npx github:uncaose/epds check
npx github:uncaose/epds check --global
npx github:uncaose/epds check --project
```

## Uninstall

```bash
npx github:uncaose/epds uninstall --global
npx github:uncaose/epds uninstall --project
```

Perintah uninstall hanya menghapus direktori skill EPDS yang dipilih. Perintah ini tidak menghapus file EPDS yang sebelumnya dipasang ke project target oleh agen.

## Konfigurasi sumber publik tepercaya

`epds/trusted-sources.json` di root project mencantumkan sumber publik yang diizinkan EPDS untuk dicari
dan dikutip terlebih dahulu (lihat `docs/EPDS.md` § Trusted public sources config). Kelola dengan:

```bash
node bin/epds.mjs sources list
node bin/epds.mjs sources add <url> --kind doc --name "Some Docs" --note "why it matters"
node bin/epds.mjs sources show <id>
node bin/epds.mjs sources remove <id|url>
```

`epds check` melaporkan apakah file tersebut ada dan merupakan JSON yang valid.

## Pemecahan masalah

### `npx` tidak dapat menjalankan package

Periksa versi Node:

```bash
node --version
```

EPDS membutuhkan Node.js 20 atau lebih baru.

### Claude Code tidak menampilkan EPDS

- Pastikan file ada di `~/.claude/skills/epds/SKILL.md` atau `./.claude/skills/epds/SKILL.md`.
- Mulai sesi Claude Code baru di project target.
- Minta secara alami: `EPDS seoljeonghaejwo.`
- Jika slash command tidak tercantum di runtime Anda, pemicu bahasa alami tetap berfungsi saat skill dimuat.

### Skill EPDS yang sudah ada diganti

Installer akan bertanya sebelum mengganti `epds` pada scope yang dipilih. Gunakan Git clone + symlink jika Anda menginginkan riwayat lengkap dan pembaruan yang mudah.
