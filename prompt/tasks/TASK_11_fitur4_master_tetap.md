# TASK 11 - FITUR 4 MASTER TETAP, FITUR 1-3 BERUBAH PER TAHUN

| Field | Isi |
|-------|-----|
| ID | TASK_11 |
| Severity | P0 (pemblokir merge `codex/indikator-tahunan-lokal` -> `main`) |
| Tipe | perubahan arsitektur - model data indikator tahunan |
| Status | IN PROGRESS - disetujui user 2026-09-20 |
| Temuan | `prompt/docs/FINDINGS_LOG.md` #17, #18 |
| Menggantikan | Sebagian besar TASK_10 (lihat "Hubungan dengan TASK_10") |

## Tujuan

Indikator fitur 4 (indikator mutu unit) menjadi **master tetap lintas tahun**:
satu baris, satu ID, dipakai selamanya oleh risk register dan kamus MUTU.
Yang berubah setiap tahun hanya hierarki fitur 1-3 dan **penautan** fitur 4 ke
fitur 3 tahun itu (induk, aktif/tidak, urutan, kode).

Keputusan user (2026-09-19/20):
- Data lama 2023-2026 tetap bisa diedit.
- 325 indikator KATIM 2026 **dinonaktifkan** (bukan dihapus), karena belum
  jelas setara atau berbeda dengan indikator mutu unit.
- Hanya fitur 4 KATIM yang dinonaktifkan; 58 indikator kinerja dan fitur 1-3
  2026 tetap aktif.
- Penyalinan kamus MUTU 2025 -> 2026 tidak diperlukan di model ini.

## Fakta Data (`dev_simdalin`, 2026-09-20)

| Data | Kondisi |
|------|---------|
| Fitur 4 lama (tanpa periode) | 571; `location_id` = unit layanan (72 unit); `jabatan`/`penanggung_jawab_id` kosong; 4 tanpa unit; 284 menyimpan unit sebagai angka tunggal |
| Fitur 4 periode 2024 / 2025 (ditutup, schema v1) | 571 / 571; semua `copied_from_id` -> master lama; nama & unit identik 100% |
| Fitur 4 periode 2026 (aktif, schema v2) | 325 KATIM; tanpa `copied_from_id`; unit = unit tim kerja; 0 risk register, 0 kamus MUTU; tertaut 325 `cascading_concepts`, 2 arsip ekspor |
| Risk register | 1.246, semua tanpa periode, menunjuk fitur 4 lama |
| Kamus MUTU | 373, semua tanpa periode, menunjuk fitur 4 lama |
| Production (`61fb174`) | Belum punya migration tahunan sama sekali |

Kesimpulan: salinan 2024/2025 dapat dikonversi tanpa kehilangan informasi
menjadi penautan ke master lama.

## Rancangan Skema

### Tabel baru `indikator_fitur4_periodes`

| Kolom | Tipe | Catatan |
|-------|------|---------|
| id | bigint PK | |
| periode_kinerja_id | FK `periode_kinerjas`, restrict | |
| indikator_fitur4_id | FK `indikator_fitur4s` (master), restrict | |
| indikator_fitur3_id | FK `indikator_fitur3s`, nullable, restrict | induk tahun itu; harus satu periode |
| is_active | boolean default true | aktif di tahun itu |
| sort_order | uint default 0 | |
| kode_cascading | string(50) nullable | |
| timestamps | | |
| unique | (periode_kinerja_id, indikator_fitur4_id) | satu penautan per tahun |

### Atribut: master vs per tahun

| Atribut | Tempat | Alasan |
|---------|--------|--------|
| name, tujuan, location_id (unit), penanggung_jawab_id | master `indikator_fitur4s` | identitas indikator; akses PIC unit tetap seperti production |
| is_active (master) | master | pensiun permanen |
| induk fitur 3, is_active tahun, sort_order, kode_cascading | `indikator_fitur4_periodes` | berubah mengikuti cascading tahun |
| `sasaran_strategis_id` | diturunkan dari induk fitur 3 saat dibaca | tidak disimpan ganda |

Kolom `indikator_fitur4s.periode_kinerja_id`, `lineage_id`, `copied_from_id`
dipertahankan sementara untuk kompatibilitas/audit; master baru selalu null.

### Transaksi

- `risk_registers.periode_kinerja_id` tetap: diisi dari tahun `tgl_register`
  bila periode tahun itu ada. `indikator_fitur4_id` selalu ID master.
- `risk_registers.indikator_snapshot` tetap diisi saat simpan (nama, unit,
  induk tahun itu) - menjaga riwayat bila redaksi master berubah.
- `mutu_indikators` (kamus) **tidak berperiode**: kamus menunjuk master dan
  berlaku lintas tahun. Tahun hanya ada pada `mutu_units.tanggal_mutu`.

## Aturan Bisnis

1. Risk register **baru** tahun T: indikator master harus aktif dan tertaut
   aktif di periode T. Bila periode T belum ada -> ditolak (seperti sekarang).
2. Risk register **lama** (sudah ada) tanpa mengganti indikator: selalu boleh
   diedit, termasuk tahun tanpa periode (2023) dan periode ditutup, sesuai
   keputusan user. Mengganti indikator mengikuti aturan 1.
3. Pengukuran MUTU tahun T: kamus aktif & disetujui; bila periode T ada,
   fitur 4 kamus harus tertaut aktif di T. Pengukuran lama tetap bisa diedit.
4. Periode ditutup mengunci **penautan dan hierarki** tahun itu, bukan transaksi
   lama (sesuai keputusan "data lama tetap bisa diedit").
5. Mengubah nama/unit master yang sudah dipakai transaksi: diizinkan untuk
   koreksi redaksi; perubahan definisi -> buat master baru dan nonaktifkan
   yang lama (pola yang sama dengan kamus MUTU). Lihat "Pertanyaan" #2.

## Migrasi Data (satu migration, idempotent, ada guard)

1. Buat `indikator_fitur4_periodes`.
2. Untuk tiap baris fitur 4 berperiode dengan `copied_from_id` menunjuk master
   tanpa periode (2024/2025): buat penautan
   (periode, master = `copied_from_id`, induk = `indikator_fitur3_id` baris
   salinan, is_active, sort_order, kode_cascading). Pindahkan referensi yang
   menunjuk ID salinan (`risk_registers`, `mutu_indikators`,
   `indikator_year_mappings`, `cascading_concepts.legacy_id`) ke ID master.
   Baris salinan dinonaktifkan dan diberi penanda, **tidak dihapus**.
3. Untuk fitur 4 berperiode tanpa sumber (325 KATIM 2026): jadikan master
   sendiri (`periode_kinerja_id` -> null), master `is_active = false`,
   penautan ke 2026 dengan `is_active = false`. `cascading_concepts` tetap
   menunjuk ID yang sama.
4. Guard: migration berhenti bila ada salinan dengan nama/unit berbeda dari
   sumbernya atau referensi yang tidak bisa dipindah - tidak menebak.
5. `down()`: melempar exception seperti migration tahunan lain; rollback lewat
   backup terverifikasi.

Di production (belum punya data tahunan) langkah 2-3 tidak menemukan baris;
hanya tabel yang dibuat. Di dev-mutu server (periode ID 4/5/6) langkah 2-3
berlaku sama seperti lokal - dijalankan user sendiri setelah backup.

## Dampak Kode

Pendekatan utama: satu **read model** `App\Services\Fitur4PeriodRows` yang
menghasilkan baris fitur 4 per periode berbentuk sama seperti sekarang
(`id` = master, `periode_kinerja_id`, `indikator_fitur3_id`, `is_active`,
`sort_order`, `kode_cascading`, `sasaran_strategis_id`). Konsumen yang saat
ini membaca `indikator_fitur4s where periode_kinerja_id = X` cukup berganti ke
read model ini, sehingga bentuk props Inertia dan frontend sebagian besar tetap.

| Area | File | Perubahan |
|------|------|-----------|
| Skema | `database/migrations/2026_09_20_*_fitur4_master_per_periode.php` (baru) | tabel + konversi |
| Model | `app/Models/IndikatorFitur4.php`, `app/Models/Concerns/HasAnnualIndicator.php` | fitur 4 tidak lagi memakai global scope/guard periode; trait tetap untuk fitur 1-3 |
| Model | `app/Models/MUTU/MutuIndikator.php` | hapus global scope & aturan periode; validasi master aktif |
| Read model | `app/Services/Fitur4PeriodRows.php` (baru) | baris per periode |
| Hierarki/bagan/ekspor | `CascadingHierarchyService.php` (tanpa ubah), `PeriodeKinerjaController.php` (index, saveNode level 4, validasi aktivasi :93), `CascadingExportService.php`, `CascadingTemplateExportService.php`, `DirectorCascadingService.php` | level 4 dari read model; saveNode level 4 = buat/ubah master + penautan |
| Persiapan tahun | `AnnualIndicatorService::copyHierarchy`, `CascadingYearsPreparation.php`, `CascadingFeatureAlignment.php` (hapus fitur 4 per periode :148-149) | salin **penautan**, bukan baris fitur 4; alignment tidak menghapus master |
| Risk register | `app/Observers/AnnualRiskObserver.php`, `RiskIndicatorAccess.php` (jalur induk memakai penautan), `RiskRegisterKlinisController.php`/`NonKlinis` (props opsi), `RiskRegisterYearCopyService.php`, `AnnualIndicatorService::resolve/snapshot/acceptsPics` | aturan 1-2; copy tahun tidak perlu memetakan ID |
| MUTU | `app/Observers/AnnualMutuObserver.php`, `app/Services/MutuIndicatorInput.php` (buat fitur 4 = master + penautan), `MUTU/MutuIndikatorController.php`, `MutuUnitController.php` | aturan 3; kamus lama tampil kembali |
| Middleware | `EnsureAnnualPeriodWritable.php` | PDSA null-safe; cek periode hanya untuk hierarki, bukan transaksi lama |
| Command usang | `InitializeAnnualIndicators.php` (`indikator:initialize-years`) | dihapus atau ditolak jalan - bertentangan dengan model baru |
| Frontend | `RiskRegister/*/Form*` (`RiskRegisterAnnualFields`), `MUTU/MutuIndikator/Form.jsx`, `MUTU/MutuUnit/Index.jsx`, editor `/kinerja` | filter per `periode_kinerja_id` tetap bekerja lewat read model; kamus tanpa tahun; null-check |
| Dokumen | `docs/CASCADING-PRODUCTION-2024-2026.md`, `docs/Indikator-Tahunan-Lokal.md`, `prompt/docs/ARCHITECTURE_MAP.md` | model baru + urutan deploy |

Tidak disentuh: Export risk register lama (`app/Exports/Format*`) - tetap
membaca relasi master; justru pulih karena global scope fitur 4 dilepas.

## Tahapan (commit terpisah per fase)

1. **A - Skema & konversi** + test konversi di atas fixture (2024/2025 salinan,
   2026 KATIM) dalam `DatabaseTransactions`.
2. **B - Read model & kinerja**: hierarki, bagan, editor, ekspor. Bukti: ekspor
   2024/2025/2026 sebelum vs sesudah identik (skrip `scripts/test-cascading-export.cjs`
   dan test `CascadingTemplateExportTest`).
3. **C - Risk register**: observer, akses, opsi form, copy tahun.
4. **D - MUTU**: kamus tanpa periode, observer, input, PDSA.
5. **E - Command & dokumen**: persiapan tahun, alignment, command usang, runbook.
6. **F - Nonaktifkan 325 KATIM 2026** (sudah tercakup di konversi langkah 3).

## Verifikasi

- Test baru (semua `DatabaseTransactions`, fixture dibuat di test):
  `Fitur4MasterConversionTest`, `Fitur4PeriodRowsTest`,
  `LegacyDataWithoutPeriodTest` (skenario TASK_10), penyesuaian
  `AnnualIndicatorsTest`, `PicIndicatorAccessTest`, `MutuIndicator*Test`,
  `Cascading*Test`.
- PIC unit (mis. IRNA, NICU, PENDAPATAN) bisa memilih indikator unitnya untuk
  register baru 2026 (menutup #18).
- Kamus MUTU lama tampil dan dapat dipakai input 2026; PDSA tidak 500.
- `php artisan test`: tidak menambah kegagalan dari baseline 6 failed.
- `npm run build`; cek manual `/kinerja` (2024/2025/2026), `/riskRegisterKlinis`,
  `/riskRegisterNonKlinis`, `/MutuIndikator`, `/MutuUnit`.
- Audit tabel sebelum/sesudah migration di `dev_simdalin`: hanya tabel dalam
  daftar konversi yang berubah; tidak ada baris terhapus.

## Hubungan dengan TASK_10

TASK_10 tetap berlaku untuk bagian yang tidak bergantung model data:
PDSA null-safe, `updatestatus` dalam `DB::transaction`, null-check
`MutuUnit/Index.jsx`. Bagian observer/global scope TASK_10 diserap TASK_11.
Temuan #18 ditutup oleh TASK_11.

## Pertanyaan Untuk User

1. Unit dan penanggung jawab fitur 4 **tetap di master** (sama semua tahun),
   atau boleh berbeda per tahun?
2. Ubah redaksi/target master yang sudah dipakai transaksi: boleh edit langsung
   (riwayat dijaga snapshot), atau wajib buat master baru?
3. Tahun 2027 dst.: indikator unit ditautkan otomatis dari tahun sebelumnya saat
   "Buat tahun baru" (usul: ya, dapat diubah di draft)?
4. Konversi di server dev-mutu: dijalankan user sendiri setelah backup, dengan
   panduan yang disiapkan di runbook?

Jawaban user 2026-09-20:
1. Unit dan penanggung jawab **tetap di master**, sama untuk semua tahun.
2. Redaksi/target master yang sudah dipakai **boleh diedit langsung**; riwayat
   dijaga `indikator_snapshot` dan standar pada kamus MUTU.
3. "Buat tahun baru" **menautkan otomatis** indikator dari tahun sumber
   (dapat diubah selama draft).
4. Konversi di server dev-mutu **dijalankan langsung** setelah implementasi
   lokal terverifikasi (tetap dengan backup lebih dulu; konfirmasi akses server
   pada saat eksekusi).

## Implementasi (2026-09-20)

Keputusan tambahan user: (a) indikator unit ditautkan ke 2026 **tanpa induk**
dulu, penempatan ke kegiatan menyusul di `/kinerja`; (b) teknis memakai **baris
per periode + `master_id`**, bukan tabel penautan baru dan bukan read model -
editor, bagan, konsep workbook, dan ekspor tetap membaca baris per periode.

Model data yang berlaku:
- Master = `indikator_fitur4s` dengan `periode_kinerja_id` null.
- Penautan = baris dengan periode dan `master_id`; `indikator_fitur3_id` dan
  `sasaran_strategis_id` kini nullable (null = belum ditempatkan).
- Risk register dan kamus MUTU selalu menyimpan ID master (observer menormalkan
  bila yang dikirim ID penautan).

Perubahan:
- Migration `2026_09_20_000000_make_fitur4_permanent_masters` - kolom `master_id`,
  parent nullable, `Fitur4Master::ensureAll()` (2024/2025 -> master lama via
  `copied_from_id`, dengan guard nama/unit; baris tanpa sumber dibuatkan master).
- `app/Services/Fitur4Master.php` (baru) - `masterId`, `placement`, `ensureAll`,
  `syncFromPlacement` (nama/tujuan/unit/penanggung jawab/jabatan sama di semua
  tahun), `linkMasters`.
- Command `indikator:link-masters {tahun} [--deactivate-existing] [--apply]`
  (baru, dry-run default). Command `indikator:initialize-years` dihapus.
- `AnnualRiskObserver` - data lama selalu bisa diedit; register baru/ganti
  indikator/ganti tahun wajib periode aktif + penautan aktif + akses PIC.
- `AnnualMutuObserver`, `MutuIndikator` - kamus permanen tanpa periode, global
  scope dihapus; pengukuran baru wajib kamus aktif & disetujui dan penautan
  aktif bila tahunnya punya periode.
- `EnsureAnnualPeriodWritable` dihapus (periode ditutup mengunci hierarki, bukan
  transaksi; menutup PDSA 500).
- `RiskIndicatorAccess` - opsi form bernilai ID master (`placement_id` terpisah);
  `allowsUser` menerima ID master atau penautan.
- `AnnualIndicatorService` - `copyHierarchy` membawa `master_id`, tidak menimpa
  unit/jabatan fitur 4, penautan tanpa induk tetap tanpa induk, kamus MUTU tidak
  disalin; `resolve` mencari penautan aktif milik master.
- `PeriodeKinerjaController` - edit fitur 4 mempertahankan unit master dan
  menyinkronkan ke semua tahun; penanggung jawab wajib hanya untuk indikator baru;
  aktivasi & daftar isu melewati penautan tanpa induk; prop `unplacedIndicators`.
- `CascadingExportService` - penautan tanpa induk tidak ikut bagan/ekspor.
- `MutuIndicatorInput`, `MutuIndikatorController` - kamus per tahun disaring lewat
  penautan; kegiatan wajib hanya untuk indikator baru atau yang sudah ditempatkan.
- `RiskRegisterYearCopyService` - salinan menyimpan ID master.
- Controller Osd2/Pengendalian/OpsiPengendalian - daftar indikator = master
  (seperti production).
- `RiskRegisterKlinisController::updatestatus` - dalam `DB::transaction` (TASK_10).
- `Kinerja/Index.jsx` - info indikator belum ditempatkan; unit tetap untuk edit.

Data lokal `dev_simdalin` (backup `storage/app/backups/before-task11-20260920-004621.sql`,
SHA-256 `cd8c9b80...1779`): migration + `indikator:link-masters 2026
--deactivate-existing --apply` -> 896 master (571 aktif), 2026: 325 KATIM
nonaktif + 571 indikator unit tanpa induk. Simulasi: 78/78 akun PIC unit punya
indikator 2026 (sebelumnya 0); risk register 2023/2025/2026 lama dan MUTU lama
tersimpan normal.

Verifikasi: test baru `LegacyDataWithoutPeriodTest` (5 lulus). Test yang
menguji aturan lama disesuaikan ke keputusan user (bukan dihapus):
`AnnualIndicatorsTest`, `PicIndicatorAccessTest`, `MutuIndicatorAdminAccessTest`,
`MutuIndicatorPenyebutTest`, `MutuYearFilterTest`, `RiskRegisterInputTest`.
`npm run build` berhasil. Suite penuh: 2 failed / 146 passed (baseline 6 / 137). Sisa: `ExampleTest` (temuan #2) dan `PreloadResponseHeadersTest` (ada `public/hot` dari Vite dev server lokal).

Verifikasi ulang 2026-09-20 (review sebelum commit): suite penuh tanpa
`public/hot` 2 failed / 146 passed - `ExampleTest` (#2) dan
`CascadingFeaturesTest::test_add_and_delete_performance_indicators...` yang
juga gagal 3/3 di HEAD `2d78ae0b` tanpa perubahan lokal (flaky, dicatat di #13).
`LegacyDataWithoutPeriodTest` 5 lulus termasuk guard baru. `npm run build`
berhasil. Dry-run lokal `indikator:link-masters 2026` = 0 perubahan;
dengan `--deactivate-existing` ditolak sesuai guard.

Urutan deploy (dev-mutu/production, setelah backup):
1. `php artisan migrate` (termasuk migration ini).
2. Production saja: `cascading:prepare-2024-2026` sesuai runbook (kini membuat
   master otomatis setelah pemeriksaan sumber).
3. `php artisan indikator:link-masters 2026 --deactivate-existing` (dry-run),
   periksa angka, lalu ulangi dengan `--apply`.

Catatan terbuka:
- Ekspor cascading 2026 (template v6) mengosongkan sekitar 650 sel KATIM karena
  KATIM nonaktif - **diterima user 2026-09-20 (opsi a: biarkan kosong)**.
- Review 2026-09-20: `indikator:link-masters --deactivate-existing` yang dijalankan
  ulang akan menonaktifkan 571 penautan unit beserta master lamanya. Ditambah
  guard (ditolak bila tahun sudah punya penautan master) + assertion di
  `LegacyDataWithoutPeriodTest`.
- `PicController` hanya menyinkronkan `jabatan` periode terbuka; jabatan fitur 4
  di tahun lain bisa berbeda sampai indikator disimpan ulang (kosmetik).
- Form risk register untuk tahun tanpa periode (2023) tidak menampilkan nama
  indikator di combobox, tetapi nilainya tetap tersimpan.

## Aman di-merge?

Belum ke `main`/production. Keputusan ekspor 2026 sudah diambil (opsi a) dan
kode sudah di-commit (`67b5b034`..`ae4d0bd6`).

Dev-mutu 2026-09-20: database dev diganti salinan production (tabel
`risk_gradings` dan `risk_grading_settings` tetap milik dev). Kemudian dijalankan
seluruh migration tahunan, `cascading:prepare-2024-2026 --apply`, dan
`indikator:link-masters 2026 --deactivate-existing --apply`. Hasil: 2024/2025
ditutup, 2026 aktif; 325 KATIM nonaktif dan 571 indikator unit tertaut tanpa
induk. Audit data asli 69 tabel lulus di setiap langkah; semua akun PIC
non-admin punya indikator 2026; smoke halaman utama 200. Rincian dan path
backup disimpan di luar repo (lihat `storage/app/`, di-gitignore).

Sisa sebelum merge ke `main`: review user dan uji manual di dev-mutu
(penempatan indikator unit ke kegiatan di `/kinerja`, input risk register dan
MUTU 2026 oleh PIC unit).
