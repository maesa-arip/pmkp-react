# TASK 10 - DATA LAMA TANPA PERIODE TETAP BISA DIPAKAI

| Field | Isi |
|-------|-----|
| ID | TASK_10 |
| Severity | P0 (pemblokir merge ke `main`/production) |
| Tipe | regresi fungsional - kompatibilitas data lama |
| Status | OPEN - sebagian diserap TASK_11 (lihat TASK_11 "Hubungan dengan TASK_10") |
| Temuan | `prompt/docs/FINDINGS_LOG.md` #17 |

## Masalah

Branch `codex/indikator-tahunan-lokal` mewajibkan setiap risk register dan
pengukuran MUTU terikat ke `periode_kinerjas`. Migration hanya menambah kolom
`periode_kinerja_id` nullable, dan runbook
`docs/CASCADING-PRODUCTION-2024-2026.md` sengaja tidak menyentuh transaksi.
Hasilnya, setelah deploy seluruh data lama berstatus "tanpa periode" dan
sebagian besar alur yang saat ini berjalan di production (`61fb174`) putus.

Kondisi `dev_simdalin` (identik dengan production setelah cascading):
periode 2024 ditutup, 2025 ditutup, 2026 aktif; 1.246/1.246 risk register,
373/373 kamus MUTU, dan 571 fitur 4 lama tanpa periode.

Reproduksi (dijalankan dalam transaksi yang di-rollback, login super admin):

| Aksi | Hasil |
|------|-------|
| `MutuIndikator::count()` | 0 - seluruh kamus tersembunyi global scope |
| Simpan `MutuUnit` 2026 yang ada | `Indikator MUTU belum memiliki periode.` |
| Simpan risk register 2026 lama | `Indikator harus berasal dari tahun register.` |
| Simpan risk register 2025 lama | `Periode 2025 belum aktif atau sudah ditutup.` |
| Simpan risk register 2023 lama | `Siapkan periode indikator untuk tahun register terlebih dahulu.` |
| `MutuUnit->mutu_indikator` untuk data lama | `null` |

## Root Cause & Lokasi

1. `app/Models/MUTU/MutuIndikator.php` `booted()` - global scope
   `whereNotNull('periode_kinerja_id')` menyembunyikan kamus lama dari daftar,
   form input, dan relasi `MutuUnit::mutu_indikator`. Akibat turunan:
   `MutuUnitController.php:30` `whereRelation('mutu_indikator', ...)` membuang
   seluruh riwayat pengukuran; `MutuUnit/Index.jsx:151` mengakses
   `item.mutu_indikator.operator` tanpa null-check.
2. `app/Observers/AnnualMutuObserver.php` `assertMaster()` - menolak simpan/hapus
   bila kamus tidak berperiode.
3. `app/Observers/AnnualRiskObserver.php` `saving()` - selalu mencari periode
   dari tahun `tgl_register` dan mewajibkan `indikator_fitur4_id` dari periode
   itu, termasuk untuk update record lama yang indikatornya tidak diubah.
4. `app/Http/Middleware/EnsureAnnualPeriodWritable.php:27` - route
   `MutuUnit.formulirpdsa` membaca `$unit->mutu_indikator->periode_kinerja_id`;
   relasi null -> error 500.
5. `app/Http/Controllers/RiskRegisterKlinisController.php` `updatestatus()`
   (dan padanannya di `RiskRegisterNonKlinisController`) - `RequestUpdate::updateOrCreate`
   ditulis sebelum `$riskRegister->update()`; bila observer menolak, data
   tersimpan setengah. Tidak ada `DB::transaction`.
6. `app/Models/Concerns/HasAnnualIndicator.php` - global scope yang sama pada
   `IndikatorFitur1-4/04`; relasi `RiskRegister::indikator_fitur4()` untuk
   register lama menjadi null sehingga nama indikator hilang di daftar/ekspor
   (verifikasi pemakaiannya di Resource, Export, dan PDF sebelum mengubah).

## Keputusan (tanya user sebelum mengerjakan)

1. Data lama tahun **berjalan (2026)**: tetap bisa diedit dengan indikator
   lama (mode legacy), atau wajib dipetakan ke struktur 2026 baru?
   Catatan: struktur 2026 berbeda (325 fitur 4 vs 571 lama), pemetaan 1:1
   tidak mungkin tanpa tabel mapping dari user.
2. Data lama tahun **selesai (2023-2025)**: tetap bisa diedit seperti sekarang,
   atau baca-saja mengikuti status periode 2024/2025 `ditutup`?
   2023 tidak punya periode sama sekali.
3. Kamus MUTU untuk pengukuran 2026 berikutnya: tetap memakai kamus lama,
   dibuat ulang admin, atau disalin otomatis ke periode 2026?

Jawaban user 2026-09-19:
1. Data lama 2026: **tetap bisa diedit** (mode legacy).
2. Data lama 2023-2025: **tetap bisa diedit**.
3. Kamus MUTU: rencana user **menyalin kamus 2025 ke 2026** (2026-09-20).
   Analisis kelayakan (dev_simdalin):
   - 245 dari 373 kamus dipakai pengukuran 2025; 171 dipakai 2026 (irisan 143).
   - Semua kamus lama tanpa periode dan menunjuk fitur 4 lama. Periode 2025
     tidak punya kamus, jadi `AnnualIndicatorService::copyHierarchy` (salin
     kamus antarperiode) tidak bisa dipakai; tidak ada lineage/mapping dari
     fitur 4 lama ke fitur 4 2026 (struktur baru hasil workbook).
   - Nama fitur 4 2026 berformat `nama + target + (unit)`. Pencocokan otomatis
     nama+unit: 42 cocok tunggal, 41 nama cocok tetapi unit beda/ambigu,
     162 tanpa padanan nama (heuristik kasar; butuh review manusia).
   - Akses input MUTU memakai `mutu_indikators.location_id` (unit), bukan akses
     fitur 4, sehingga kamus salinan tetap bisa dipakai PIC unit.
   Implikasi: penyalinan butuh tabel mapping kamus lama -> fitur 4 2026 yang
   disetujui user; dikerjakan sebagai task terpisah setelah TASK_10. TASK_10
   tetap menjaga kamus lama bisa dipakai sampai salinan siap.

Rekomendasi default bila user tidak memberi arahan lain: **data tanpa periode
berperilaku persis seperti di production `61fb174`** (dapat dilihat dan diedit),
sedangkan data baru dan data yang sudah berperiode mengikuti aturan tahunan.
Ini perubahan terkecil yang menghilangkan pemblokir merge; migrasi data lama ke
periode dikerjakan sebagai task terpisah setelah keputusan bisnis.

## Rencana Perubahan (mengikuti rekomendasi default)

Prinsip: "legacy" = `periode_kinerja_id` asli null. Jangan mengubah perilaku
record yang sudah berperiode.

1. `AnnualRiskObserver::saving` - bila record sudah ada, periode asli null,
   dan `indikator_fitur4_id` tidak diubah ke indikator berperiode, lewati
   validasi tahunan (tetap wajib `tgl_register`). Bila user memilih indikator
   tahunan, jalankan aturan penuh sehingga record ikut masuk periode.
   Record baru tetap wajib periode.
2. `AnnualMutuObserver` - lewati `assertMaster` bila kamus tidak berperiode;
   aturan tahun `tanggal_mutu` hanya berlaku untuk kamus berperiode.
3. Global scope `MutuIndikator` - jangan sembunyikan kamus lama dari relasi
   `MutuUnit::mutu_indikator` dan daftar unit. Opsi terkecil:
   `withoutGlobalScope('annual')` pada relasi, dan evaluasi apakah scope
   masih dibutuhkan pada daftar kamus/form input (ikuti keputusan #3).
   `MutuIndikator::saving` hanya berlaku untuk kamus baru/berperiode.
4. `RiskRegister::indikator_fitur4()` - `withoutGlobalScope('annual')` agar
   indikator lama tetap tampil. Periksa efek ke opsi dropdown
   (`RiskIndicatorAccess::optionsForUser`) - dropdown tetap hanya periode aktif.
5. `EnsureAnnualPeriodWritable` - null-safe untuk PDSA; cek periode hanya bila
   kamus berperiode.
6. `updatestatus` klinis dan non-klinis - bungkus dengan `DB::transaction`
   agar `RequestUpdate` tidak tersimpan bila update risiko ditolak.
7. `MutuUnit/Index.jsx` - null-safe pada `item.mutu_indikator` (defensif).

Terkait tetapi di luar scope: temuan #18 - PIC unit layanan tidak punya
indikator 2026 untuk register BARU. Mode legacy hanya menjaga data lama; #18
tetap pemblokir merge terpisah dan butuh keputusan pemetaan tim kerja -> unit.

Di luar scope (catat ke findings bila ditemukan): pemetaan data lama ke periode,
command `indikator:initialize-years` yang bertentangan dengan
`cascading:prepare-2024-2026`, refactor observer.

## Verifikasi

- Test baru `tests/Feature/LegacyDataWithoutPeriodTest.php` dengan
  `DatabaseTransactions`. Fixture dibuat di dalam test (jangan bergantung
  baris `dev_simdalin`, lihat temuan #13), minimal:
  - update risk register tanpa periode (2023, 2025, 2026) berhasil;
  - `updatestatus` register lama berhasil; bila ditolak, `RequestUpdate` tidak berubah;
  - simpan `MutuUnit` pada kamus lama berhasil; PDSA pada unit lama tidak 500;
  - daftar MutuUnit menampilkan pengukuran lama;
  - register baru tanpa periode tetap ditolak; register berperiode ditutup tetap ditolak;
  - memilih indikator 2026 pada register lama memindahkannya ke periode 2026.
- `php artisan test` - baseline 6 failed / 137 passed, tidak boleh bertambah gagal.
- `npm run build` bila JSX tersentuh.
- Manual: `/riskRegisterKlinis`, `/riskRegisterNonKlinis`, `/MutuUnit`,
  `/MutuIndikator` dengan data lama dan data 2026 berperiode.

## Aman di-merge?

Belum. Task ini wajib selesai sebelum `codex/indikator-tahunan-lokal`
di-merge ke `main` atau dideploy ke production.
