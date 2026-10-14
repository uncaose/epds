<!-- source: README.md sha256:617bfd45dfbf -->
[English](../../README.md) · [한국어](../ko/README.md) · [简体中文](../zh-CN/README.md) · [日本語](../ja/README.md) · [Tiếng Việt](../vi/README.md) · [ไทย](../th/README.md) · [Bahasa Melayu](../ms/README.md) · Bahasa Indonesia

# EPDS

> **Sistem Pengiriman Produk Berbasis Bukti**
>
> Skill umum yang membantu agen coding AI menjalankan proyek ide, layanan berjalan, program, game, dan otomatisasi konten dari arahan hingga refleksi **berdasarkan bukti**.

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](../../LICENSE)
[![Node.js >= 20](https://img.shields.io/badge/node-%3E%3D20-brightgreen.svg)](https://nodejs.org/)

## Instalasi

```bash
npx skills add uncaose/epds -a claude-code
```

Untuk opsi yang lebih terperinci dan prosedur verifikasi, silakan lihat [docs/INSTALL.md](docs/INSTALL.md).

## Masalah apa yang diselesaikannya?

Alat coding AI dapat menghasilkan banyak kode dalam beberapa detik. Namun, kegagalan termahal dalam pengembangan produk biasanya bukan "terlambat menulis kode", melainkan hal-hal berikut.

- Membuat fitur dengan cepat yang sebenarnya tidak diinginkan pengguna nyata.
- Memperluas cakupan implementasi sebelum memeriksa batasan pengguna, bisnis, dan operasional.
- Kode lulus pengujian dan sudah dideploy, tetapi pengguna nyata tidak menyelesaikan aksi inti.
- Seiring bertambahnya jumlah fitur, informasi pribadi, biaya, performa, beban dukungan, dan utang teknis meningkat.
- Perencanaan, implementasi, QA, distribusi, dan refleksi terpisah, sehingga kegagalan sebelumnya tidak tercermin dalam tugas berikutnya.
- Pengguna harus memutuskan apa yang perlu ditanyakan kepada AI, peran/skill apa yang perlu dipanggil, dan kapan memanggilnya.

EPDS bukan tentang "lebih banyak agen" atau "prompt yang lebih panjang". EPDS terlebih dahulu menetapkan posisi proyek saat ini, lalu menetapkan urutan tindakan AI untuk mencari tahu **bukti apa yang diperlukan untuk keputusan berikutnya**.

**[H1] Pemeriksaan Empat Elemen Wajib** — Apakah README ini memuat empat hal yang diminta oleh teks asli manusia ("Menentukan hambatan/masalah apa, dengan penalaran apa, lalu menjelaskan secara sistematis dan terstruktur melalui proses penerapan solusi yang dipilih")?

- [x] **Masalah** — Daftar di atas (6 butir, termasuk fitur yang tidak diinginkan pengguna aktual, dan perilaku pengguna yang belum selesai tetapi sudah lulus pengujian)
- [x] **Rasional** — Paragraf "Lebih banyak agen/prompt yang lebih panjang bukanlah tujuan", mengapa bukti diprioritaskan
- [x] **proses penerapan solusi** — [docs/EPDS.md](../../docs/EPDS.md) §0(definisi) + §1~§5(proses tinjauan alat, pola, dan struktur)
- [x] **Instalasi dan Penggunaan** — Bagian [Instalasi](#instalasi) di atas + [docs/INSTALL.md](docs/INSTALL.md)

Bagaimana saya sampai di sini (alat yang dilihat, pola yang dibuang, rasional) → [docs/EPDS.md](../../docs/EPDS.md)

## Hasil

Verifikasi terbaru (detail, prompt, dan data: [results/README.md](../../results/README.md)):

- EPDS v8 dibandingkan dengan agen polos, 7 model x 6 permintaan aplikasi satu baris, 144 eksekusi yang dinilai: kesenjangan niat antara haiku dan sonnet menyempit (0,167 -> 0,014) dan sonnet tidak turun, tetapi fungsi haiku berkurang 2 dari 46 butir; vonis PARTIAL (hanya arah, n = 2 per tugas).
- Kegunaan aplikasi tersebut (2 penilai buta + pemeriksaan mesin): v8 menaikkan skor rata-rata model keluarga Claude sebesar 1,0 hingga 1,5 dari 20 dan memangkas cacat aksesibilitas serius secara tajam.
- Tanpa gerbang akhir giliran (model lokal), skill tidak mengubah perilaku dan skor niat turun.

![Layar pertama dari semua 144 aplikasi](../../results/2026-10-13-v8-gate/contact-sheet-first.png)

![Ikhtisar penilaian kegunaan: layar pertama dan setelah satu tindakan](../../results/2026-10-14-usability/contact-sheet.png)
