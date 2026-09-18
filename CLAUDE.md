# SIMDALIN - CLAUDE CODE INSTRUCTIONS (EXISTING APP)

Saat sesi dimulai, baca file berikut secara penuh sebelum melakukan perubahan:
1. `prompt/MASTER_PROMPT.md`
2. `prompt/docs/ARCHITECTURE_MAP.md`
3. `prompt/docs/CONVENTIONS.md`
4. File task aktif yang tertera di status, jika ada

Setelah membaca, ringkas rencana dalam 3-5 poin dan tunggu konfirmasi sebelum
mengedit kode aplikasi.

## Status Saat Ini

```
Task aktif : belum ada
Backlog    : lihat prompt/docs/FINDINGS_LOG.md
Onboarding : [x] selesai
```

## Stack & Perintah

```
Stack : Laravel 9 / PHP ^8.0.2, Inertia Laravel ^0.6.3, React 18, Vite 4, Tailwind CSS 3, MySQL
Build : npm run build
Test  : php artisan test
Run   : php artisan serve dan npm run dev
Lint  : vendor/bin/pint (tersedia, tidak ada script lint npm)
```

Baseline onboarding:
- `php artisan route:list` berhasil dan menampilkan 273 routes.
- `php artisan test` gagal baseline: 23 failed, 1 passed. Penyebab dominan:
  migration test gagal membuat FK `fgd_actuals.risk_register_id` karena tabel
  `risk_registers` belum dibuat pada urutan migration yang aktif.

## Aturan Emas Brownfield

1. Baca sebelum tulis: pahami file terkait dan dokumen prompt dulu.
2. Diff sekecil mungkin. Jangan reformat/rename/refactor di luar task.
3. Tiru konvensi existing di `prompt/docs/CONVENTIONS.md`.
4. Jaga regresi: jalankan test baseline dan verifikasi manual bila test belum hijau.
5. Jangan hapus/timpa kode yang tidak dibuat sendiri tanpa alasan jelas.
6. Satu task = satu tujuan; temuan baru masuk `prompt/docs/FINDINGS_LOG.md`.
7. Perubahan endpoint, props Inertia, atau skema DB wajib memperbarui dokumen terkait.

## Struktur Dokumen

```
simdalin/
├── CLAUDE.md
├── prompt/
│   ├── MASTER_PROMPT.md
│   ├── AUDIT_CHECKLIST.md
│   ├── tasks/
│   └── docs/
└── .claude/skills/simdalin-ui/SKILL.md
```
