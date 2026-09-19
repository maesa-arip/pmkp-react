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
Terakhir   : TASK_09 selesai - modul akses dijaga otorisasi server-side
Backlog    : 14 temuan terbuka - lihat prompt/docs/FINDINGS_LOG.md
Mendesak   : ada item deploy - lihat bagian server di FINDINGS_LOG
Onboarding : [x] selesai
Audit ulang: 2026-09-19 pada branch codex/indikator-tahunan-lokal
```

PERINGATAN: temuan #1-#6 yang sebelumnya tertulis FIXED ternyata tidak ada di
branch aktif. Jangan percaya status DONE pada file task tanpa verifikasi ulang
di kode.

## Stack & Perintah

```
Stack : Laravel 9 / PHP ^8.0.2, Inertia Laravel ^0.6.3, React 18, Vite 4, Tailwind CSS 3, MySQL
Build : npm run build
Test  : php artisan test
Run   : php artisan serve dan npm run dev
Lint  : vendor/bin/pint (tersedia, tidak ada script lint npm)
```

Test berjalan di atas database `dev_simdalin` dari `.env` dan me-rollback
perubahannya lewat `DatabaseTransactions`. Semua test WAJIB memakai trait itu;
`tests/TestCase.php` menolak `RefreshDatabase` dan `DatabaseMigrations` karena
keduanya akan men-drop seluruh tabel kerja. Lihat temuan #7 dan TASK_08.

Baseline per 2026-09-19:
- `php artisan route:list` berhasil dan menampilkan 273 routes.
- `php artisan test`: 6 failed, 137 passed (~200 detik). Kegagalan tersisa
  berasal dari temuan #2 dan #13 yang masih terbuka, bukan regresi baru.

## Aturan Emas Brownfield

1. Baca sebelum tulis: pahami file terkait dan dokumen prompt dulu.
2. Diff sekecil mungkin. Jangan reformat/rename/refactor di luar task.
3. Tiru konvensi existing di `prompt/docs/CONVENTIONS.md`.
4. Jaga regresi: jalankan `php artisan test` dan bandingkan dengan baseline
   6 failed / 133 passed. Test baru wajib memakai `DatabaseTransactions`.
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
└── .codex/skills/simdalin-ui/SKILL.md
```
