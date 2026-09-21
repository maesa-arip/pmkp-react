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
Task aktif : TASK_11 ter-deploy di dev-mutu 2026-09-20; menunggu uji manual sebelum merge main
Berikutnya : TASK_12 (penautan massal fitur 4) - 54 master 2026 belum tertaut; kolom hierarki 129 register 2026 KOSONG sampai selesai
Terakhir   : TASK_13 disesuaikan - indikator 2026 yang belum tertaut dikosongkan di export (daftar periksa)
Backlog    : 26 temuan terbuka (#20/#23/#27/#28/#29/#33/#35/#37 fixed, #22 sisi export fixed; #30-#37 baru; #36 P2 peringkat residual campur penamaan klinis) - lihat prompt/docs/FINDINGS_LOG.md
Mendesak   : ada item deploy - lihat bagian server di FINDINGS_LOG
Onboarding : [x] selesai
Audit ulang: 2026-09-19 pada branch codex/indikator-tahunan-lokal
Periode    : 2023/2024/2025 ditutup (hierarki lama sama), 2026 aktif (fitur 1-3 baru)
```

Periode 2023 diterapkan di lokal 2026-09-20. Production yang belum punya periode
memakai `cascading:prepare-2023-2026` SEKALI SAJA (sudah mencakup 2023-2026);
dev-mutu yang periodenya sudah ada memakai `cascading:prepare-2023`. Jangan
menjalankan keduanya - lihat `docs/CASCADING-PRODUCTION-2024-2026.md`.

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

Baseline per 2026-09-20 (setelah penanggung jawab PIC di /kinerja, tanpa `public/hot`):
- `php artisan route:list` berhasil dan menampilkan 296 routes (293 + 3 export
  baru: MR Terbaru klinis/non klinis dan Keterjadian Risiko).
- `php artisan test`: 168 passed (158 + 5 VerificationAuthorizationTest + 4 RegisterHierarchyResolverTest + 1 filter unit copy #37);
  `ExampleTest` selalu merah (temuan #2) dan
  `CascadingFeaturesTest` merah/hijau berganti antar-run, bahkan saat dijalankan
  sendiri (temuan #13). Jadi 1-2 failed adalah baseline, bukan regresi baru;
  ulangi run-nya sebelum menuduh ada regresi.
  Hapus/pindah `public/hot` dulu; bila ada, `PreloadResponseHeadersTest` ikut gagal.

## Aturan Emas Brownfield

1. Baca sebelum tulis: pahami file terkait dan dokumen prompt dulu.
2. Diff sekecil mungkin. Jangan reformat/rename/refactor di luar task.
3. Tiru konvensi existing di `prompt/docs/CONVENTIONS.md`.
4. Jaga regresi: jalankan `php artisan test` dan bandingkan dengan baseline
   2 failed / 146 passed. Test baru wajib memakai `DatabaseTransactions`.
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
