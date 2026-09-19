# FINDINGS LOG - SIMDALIN

Backlog temuan audit + status perbaikannya. Mencatat bukan memperbaiki;
perbaikan dibuat sebagai task terpisah di `prompt/tasks/`.

Severity: P0 keamanan/kehilangan data, P1 bug fungsional, P2 inkonsistensi atau
technical debt, P3 kosmetik/minor.

Status: OPEN belum dikerjakan · REGRESSED pernah ditandai selesai tapi tidak ada
di branch aktif · FIXED terverifikasi ada di kode.

> Audit ulang 2026-09-19 pada branch `codex/indikator-tahunan-lokal`.
> Temuan #1-#6 sebelumnya tertulis FIXED, tetapi verifikasi per-item menunjukkan
> tidak satu pun ada di kode. Middleware/berkas yang diklaim TASK_02-TASK_07
> tidak ditemukan di branch mana pun (`main`, `dev`, `codex/*`). Dugaan: hilang
> saat commit `582ce9b8 "Limit release to risk register changes and restore other
> modules"`. Status dikembalikan ke REGRESSED.

| # | Sev | Judul | Lokasi | Dampak | Status | Task |
|---|-----|-------|--------|--------|--------|------|
| 14-16 | P0-P2 | Temuan konfigurasi server deploy | tidak dicatat di sini | Rincian sengaja disimpan di luar repo - lihat catatan di bawah | OPEN | - |
| 17 | P0 | Data lama tanpa periode tidak bisa dilihat/diedit setelah fitur indikator tahunan | `app/Observers/AnnualRiskObserver.php`, `AnnualMutuObserver.php`, `app/Models/MUTU/MutuIndikator.php`, `EnsureAnnualPeriodWritable.php:27` | Setelah merge ke production: input MUTU, edit/ubah status risk register lama gagal; PDSA 500 | FIXED di lokal (belum commit/deploy) | `prompt/tasks/TASK_10_legacy_data_without_period.md`, `prompt/tasks/TASK_11_fitur4_master_tetap.md` |
| 18 | P0 | PIC unit layanan tidak punya satu pun indikator 2026 untuk input risk register baru | `app/Services/RiskIndicatorAccess.php` `forPic()`, data `indikator_fitur4s.location_id` periode 2026 | 78/78 akun PIC unit tidak bisa membuat register 2026; 24 akun di antaranya aktif input 2026 (97 register) | FIXED di lokal (belum commit/deploy) | `prompt/tasks/TASK_11_fitur4_master_tetap.md` |
| 20 | P1 | Form risk register: dropdown tertimpa, field hilang saat simpan, kartu terakhir terpotong saat edit | `resources/js/Pages/RiskRegister/{Klinis,NonKlinis}/Form.jsx`, `app/Models/RiskRegister.php` `FORM_FIELDS`, `NonKlinis/Edit.jsx` | Pilihan Lokasi/Tingkat Keefektifan tertutup field lain; `belum_tertangani`, `usulan_perbaikan`, dan unit tidak tersimpan | FIXED di lokal + dev-mutu (2026-09-20) | - |
| 19 | P2 | Master indikator fitur 4 duplikat: nama dan unit sama | data `indikator_fitur4s` (master tanpa periode) | 23 pasang duplikat (46 baris); 17 kelebihannya sudah dipakai register/kamus MUTU, 6 belum dipakai. Pilihan di form tampak dobel | OPEN | - |
| 7 | P0 | `php artisan test` menghapus database kerja `dev_simdalin` | `phpunit.xml`, `tests/Feature/Auth/*` | Menjalankan baseline test yang diperintahkan dokumen akan drop seluruh tabel dev | FIXED | `prompt/tasks/TASK_08_stop_tests_dropping_working_database.md` |
| 8 | P0 | User/Role/Permission CRUD tanpa authorization server-side | `app/Http/Controllers/RoleController.php:64`, `PermissionController.php:66`, `UserController.php:58` | Privilege escalation: user login biasa bisa memberi dirinya permission apa pun | FIXED | `prompt/tasks/TASK_09_authorize_access_module.md` |
| 3 | P0 | Endpoint list memakai sort field langsung dari request | `RiskCategoryController.php:26` + 40 controller lain | SQL error / identifier injection dari parameter sort | REGRESSED | `prompt/tasks/TASK_04_sanitize_sort_parameters.md` |
| 9 | P1 | Ukuran halaman `load` tidak dibatasi di 34 endpoint list | `ControlValueController.php:27`, `IdentificationSourceController.php:29`, dst | `?load=999999` menarik seluruh tabel; memory exhaustion / DoS | OPEN | - |
| 1 | P1 | Migration `risk_registers` tidak ada di folder aktif | `database/migrations/2023_08_13_043031_create_fgd_actuals_table.php` | Migrate dari database kosong gagal pada FK `fgd_actuals.risk_register_id` | REGRESSED | `prompt/tasks/TASK_02_fix_migration_baseline.md` |
| 2 | P1 | Route dashboard/home memiliki trailing space | `routes/web.php:91-94` | URL `/`, `/dashboard`, `/notifications`, `/requeststatus` tidak terdaftar sebagaimana mestinya | REGRESSED | `prompt/tasks/TASK_03_fix_trailing_space_routes.md` |
| 4 | P1 | Delete risk register menghapus data FGD/RCA terkait | `RiskRegisterKlinisController.php:434` | Jejak audit penilaian risiko hilang saat register dihapus | REGRESSED | `prompt/tasks/TASK_05_preserve_risk_register_history_on_delete.md` |
| 10 | P2 | Timezone aplikasi UTC, tanpa penyesuaian WIB | `config/app.php:72` | `now()` dan default tanggal meleset 7 jam dari waktu operasional RS | OPEN | - |
| 11 | P2 | Modul Kinerja/Cascading tidak terpetakan di dokumen | `app/Http/Controllers/PeriodeKinerjaController.php`, `app/Services/Cascading*.php` | 21 service + 3 controller terbesar tidak ada di ARCHITECTURE_MAP/CONVENTIONS | OPEN | - |
| 5 | P2 | Model domain banyak memakai `$guarded=[]` | `app/Models/RiskRegister.php:14` | 18 dari 65 model bergantung penuh pada validasi controller | REGRESSED | `prompt/tasks/TASK_06_whitelist_risk_register_mass_assignment.md` |
| 6 | P2 | File copy/debug lama tersisa | `resources/js/Layouts/Sidebar copy.jsx` dll | Pencarian dan maintenance rawan salah acuan | REGRESSED | `prompt/tasks/TASK_07_remove_stale_copy_files.md` |
| 13 | P2 | 5 test bergantung pada baris data tertentu di `dev_simdalin` | `tests/Feature/MutuYearFilterTest.php:22`, `IkpRiskLinkTest.php`, `CascadingFeaturesTest.php` | Test gagal di database yang datanya berbeda; tidak bisa jadi gerbang CI | OPEN | - |
| 12 | P3 | Path skill di `CLAUDE.md` salah + sisa `console.log` | `CLAUDE.md`, `resources/js/**` | Dokumen menunjuk `.claude/skills/`, file nyata di `.codex/skills/`; 15 `console.log` tersisa | OPEN | - |

## Temuan Server Deploy - Disimpan Di Luar Repo

Repo ini PUBLIK di GitHub. Temuan #14-#16 menyangkut konfigurasi server deploy
dan sebagian kerentanannya belum ditambal, sehingga rinciannya tidak dicatat di
file yang tracked.

Rincian ada di `storage/app/SECURITY-PRODUCTION-FINDINGS.md` pada mesin
pengembang - lokasi itu di-gitignore. Isinya: peta checkout, status tiap temuan
lokal di server, dan urutan perbaikan yang disarankan.

Aturan untuk sesi berikutnya: jangan menyalin alamat server, domain, nama
database, atau status kerentanan yang belum ditambal ke file mana pun di bawah
`prompt/`, `docs/`, atau `app/`. Keputusan visibilitas repo masih ditunda.

## Detail Temuan Baru

### #18 - PIC unit layanan tidak punya indikator 2026

- Severity: P0 (pemblokir merge; terkait #17 tetapi bukan soal data lama)
- Ditemukan: 2026-09-19, simulasi `RiskIndicatorAccess::forPic()` per akun di
  `dev_simdalin` (periode 2026 aktif hasil `cascading:prepare-2024-2026`).
- Akar: indikator fitur 4 lama (571, tanpa periode) dimiliki **unit layanan**
  lewat `location_id` (72 unit: IRNA, IGD, LAB, ...), `jabatan` dan
  `penanggung_jawab_id` kosong semua. Struktur 2026 (325) dimiliki **tim kerja**:
  `location_id` hanya berisi unit tim kerja, `penanggung_jawab_id` menunjuk
  Kabag/Kabid, dan `kinerja_penanggung_jawab_units` kosong. Tidak ada jalur dari
  unit layanan ke indikator 2026.
- Hasil simulasi akun dengan `edit data risk register sesuai lokasi`:
  - 11 akun pejabat (Direktur, Wadir, Kabag/Kabid): punya indikator 2026.
  - 13 akun tim kerja: 11 punya; Kepegawaian dan Pendidikan/Pelatihan/Penelitian
    0 (18 indikator gabungan belum diputuskan, `location_id` = `[]`).
  - 78 akun unit layanan: **semua 0**. 24 di antaranya sudah membuat 97 register
    2026 (mis. PENDAPATAN, NICU, ICU, JEPUN, AKUNTANSI, LAB PK/MK).
- Dampak: form risk register baru di unit kosong; memilih indikator lama ditolak
  `AnnualRiskObserver` (`Indikator harus berasal dari tahun register.`).
- Opsi (keputusan user): (a) isi `kinerja_penanggung_jawab_units` agar tim kerja
  membawahi unit layanan dan akses mengalir ke unit; (b) tambahkan unit layanan
  ke `location_id` indikator 2026 per indikator; (c) input risiko 2026 hanya oleh
  tim kerja, unit tidak lagi input. Mode legacy TASK_10 tidak menyelesaikan ini.
- Catatan tambahan: 4 indikator lama tanpa unit; 284 indikator lama menyimpan
  `location_id` sebagai angka tunggal, bukan array.

### #20 - Tiga cacat form input risk register

- Severity: P1
- Dilaporkan user 2026-09-20 saat mencoba input di dev-mutu.
- Gejala 1: daftar pilihan "Lokasi" dan "Tingkat Keefektifan" tertutup field
  di bawahnya. Sebab: `C/UC` dan `Celah Pengendalian` memakai `z-[80]`
  sementara field di atasnya bernilai lebih kecil, sehingga urutan z-index di
  dalam kartu tidak menurun sesuai urutan DOM. Diperbaiki dengan menurunkan
  ketiga outlier itu (`C/UC` 40/39/38, `Celah Pengendalian` 22).
- Gejala 2: "Yang Belum Tertangani" dan "Usulan Perbaikan" tidak tersimpan.
  Sebab: keduanya tidak ada di `RiskRegister::FORM_FIELDS` yang dipakai
  `$request->only(...)` pada store/update, padahal form non-klinis mengirimnya.
  Ditambahkan, dengan assertion baru di `RiskRegisterInputTest`.
- Gejala 3: "Lokasi" juga kosong. Sebab: `risk_registers` belum punya kolom
  `location_id` sama sekali - field ini tidak pernah tersimpan sejak sebelum
  TASK_11 (validasinya dikomentari di controller lama). Atas keputusan user,
  kolom `location_id` nullable ditambahkan (migration
  `2026_09_20_010000_add_location_to_risk_registers_table`).
- Gejala 4: saat edit, kartu terakhir tertutup footer tombol. Sebab: form
  memakai `h-full max-h-[85vh]` sementara isinya tidak punya `min-h-0`/`flex-1`,
  sehingga area scroll tidak pernah aktif.

### #19 - Master indikator fitur 4 duplikat

- Severity: P2
- Lokasi: data master `indikator_fitur4s` (`periode_kinerja_id` null), berasal
  dari database production; bukan dibuat oleh TASK_11.
- Gejala: di form risk register 2026 akun admin melihat satu nama indikator
  berulang, contoh "Angka Kejadian Terekstubasi" enam kali.
- Rincian pada salinan production 2026-09-20: 23 grup dengan nama dan unit sama
  (46 baris). Dari 23 baris kelebihan, 17 sudah dipakai risk register atau kamus
  MUTU, 6 belum dipakai. Selain itu 25 nama dipakai beberapa unit berbeda - ini
  wajar, bukan duplikat.
- Sebab tampilnya sekarang: sebelum TASK_11 daftar 2026 hanya berisi 325
  indikator KATIM, sehingga master unit lama tidak muncul. Akun admin melihat
  semua unit; PIC unit hanya melihat miliknya.
- Sudah dikerjakan: opsi indikator membawa `unit_names` dan kedua form
  menampilkan "Nama - UNIT", sehingga nama yang dipakai lintas unit dapat
  dibedakan (`app/Services/RiskIndicatorAccess.php` `present()`).
- Sisa: 21 label masih identik karena nama dan unitnya memang sama, 4 master
  tanpa unit, dan satu nama berawalan karakter sampah (`J.` + tab).
- Rekomendasi: nonaktifkan 6 duplikat yang belum dipakai; penggabungan 17 sisanya
  memindahkan transaksi sehingga perlu task dan keputusan user sendiri.

### #17 - Data lama tanpa periode putus setelah fitur indikator tahunan

- Severity: P0 (pemblokir merge `codex/indikator-tahunan-lokal` -> `main`)
- Ditemukan: 2026-09-19, review kesiapan merge fitur indikator tahunan.
- Gejala: seluruh transaksi lama (1.246 risk register, 373 kamus MUTU) tidak
  punya `periode_kinerja_id`. Global scope `MutuIndikator` menyembunyikan
  semua kamus lama; observer risiko/MUTU menolak simpan data lama; middleware
  PDSA mengakses relasi null; `updatestatus` menulis `RequestUpdate` sebelum
  update risiko yang kemudian ditolak (data setengah tersimpan).
- Bukti: simulasi rollback di `dev_simdalin` - lihat tabel reproduksi di TASK_10.
- Test suite tetap 6 failed / 137 passed karena belum ada test untuk data lama.
- Rencana: `prompt/tasks/TASK_10_legacy_data_without_period.md`, menunggu
  keputusan user soal perlakuan data lama 2023-2026 dan kamus MUTU 2026.

### #7 - `php artisan test` menghapus database kerja

- Severity: P0
- Lokasi: `phpunit.xml` (baris `<!-- <env name="DB_CONNECTION" value="sqlite"/> -->`),
  `tests/Feature/Auth/AuthenticationTest.php` dan 5 test Breeze lain.
- Gejala: `DB_CONNECTION` dan `DB_DATABASE` untuk testing dikomentari, sehingga
  test memakai koneksi `.env` yaitu `dev_simdalin`. Enam test scaffold Breeze
  memakai trait `RefreshDatabase` yang menjalankan `migrate:fresh` - seluruh
  tabel di `dev_simdalin` di-drop.
- Bukti: test yang ditulis tim sendiri (`CascadingConceptTest`, `MutuYearFilterTest`,
  `AnnualIndicatorsTest`, dan 12 lainnya) sengaja memakai `DatabaseTransactions`
  yang aman; hanya sisa scaffold Breeze yang memakai `RefreshDatabase`.
- Dampak: `CLAUDE.md`, `MASTER_PROMPT.md`, dan `AUDIT_CHECKLIST.md` semuanya
  memerintahkan menjalankan `php artisan test` sebagai baseline tiap sesi.
  Mengikuti instruksi itu menghancurkan database kerja.
- Catatan: ini kemungkinan besar penjelasan mengapa "baseline 23 failed" dan
  klaim "27 passed" di TASK_02/TASK_04 tidak konsisten dengan kondisi repo.
- Status: FIXED via `prompt/tasks/TASK_08_stop_tests_dropping_working_database.md`
  (2026-09-19). Guard di `tests/TestCase.php` menolak trait perusak, dan 7 test
  scaffold dipindah ke `DatabaseTransactions`. Suite penuh terbukti tidak
  mengubah database: 81 tabel / 107 user / 1246 risk register sebelum dan sesudah.
- Catatan: `phpunit.xml` sengaja tidak diubah. Database test terpisah tetap
  solusi ideal, tetapi butuh temuan #1 beres lebih dulu dan akan mematahkan 15
  test yang memang dirancang di atas data nyata (lihat temuan #13).

### #8 - User/Role/Permission CRUD tanpa authorization server-side

- Severity: P0
- Lokasi: `app/Http/Controllers/RoleController.php` (seluruh file),
  `app/Http/Controllers/PermissionController.php`, `app/Http/Controllers/UserController.php`.
- Gejala: ketiga controller hanya dilindungi middleware `auth` di
  `routes/web.php:96-99`. Tidak ada `can()`, `authorize()`, `abort_unless()`,
  policy, maupun middleware `can:` pada route.
- Bukti: `RoleController@store` (`:64`) langsung `Role::create()` lalu
  `givePermissionTo($request->input('permissions'))`. `UserController@store`
  (`:58`) langsung `syncRoles()`. Tidak ada folder `app/Policies`.
  Pembatasan hanya di frontend: `resources/js/Layouts/Sidebar.jsx:51`
  `hasPermission("atur hak akses")` - yang hanya menyembunyikan menu.
- Dampak: user terautentikasi mana pun dapat POST `/roles` atau PUT `/users/{id}`
  dan memberikan dirinya permission `atur hak akses` maupun
  `atur data master manajemen risiko`, lalu mengakses seluruh modul kinerja,
  mutu, dan risk register. Privilege escalation penuh.
- Bandingkan: `PeriodeKinerjaController.php:18-25` sudah memakai constructor
  middleware `abort_unless(...can(...), 403)` - pola itu yang perlu ditiru.
- Status: FIXED di lokal via `prompt/tasks/TASK_09_authorize_access_module.md`
  (2026-09-19). Constructor middleware `hasRole('super admin') || can('atur hak akses')`
  pada ketiga controller, plus `tests/Feature/AccessModuleAuthorizationTest.php`.
- Pertanyaan nama permission TERJAWAB dari kode: `Sidebar.jsx:51` memakai
  `atur hak akses` untuk menggerbangi ketiga menu; permission itu ada di DB
  (id 11) dan dipegang role `super admin`.
- Status deployment dicatat di luar repo; lihat bagian "Temuan Server Deploy".

### #9 - Ukuran halaman `load` tidak dibatasi

- Severity: P1
- Lokasi: 34 controller memanggil `fastPaginate($request->load)` tanpa validasi,
  contoh `ControlValueController.php:27`, `IdentificationSourceController.php:29`,
  `IKP/Master/IKPDampakController.php:24`, `RoleController.php:29`.
- Gejala: nilai `load` diteruskan mentah ke paginator.
- Dampak: `?load=999999` memaksa query menarik seluruh tabel ke memori;
  pada tabel risk register/IKP yang besar ini menghabiskan memori PHP.
- Bandingkan: `CelahPengendalianController.php:28` sudah benar -
  `'load' => 'nullable|integer|min:1|max:100'`.
- Rekomendasi: bisa digabung dengan task #3 sebagai satu middleware sanitasi
  parameter list (`field`, `direction`, `load`).

### #10 - Timezone aplikasi UTC

- Severity: P2
- Lokasi: `config/app.php:72` -> `'timezone' => 'UTC'`.
- Gejala: tidak ada `Asia/Jakarta`, `setTimezone`, atau `APP_TIMEZONE` di mana pun
  dalam `app/` maupun `.env.example`.
- Dampak: `now()` menghasilkan waktu UTC. Contoh konkret:
  `IndikatorKinerjaController.php:28` memakai `now()->year` sebagai default tahun
  periode - antara 00:00 dan 07:00 WIB tanggal 1 Januari, sistem masih membaca
  tahun sebelumnya. Cap waktu `created_at` pada history risk register juga
  tercatat 7 jam lebih awal dari waktu kejadian nyata.
- Rekomendasi: perlu konfirmasi ke user apakah data historis sudah terlanjur
  tersimpan sebagai UTC atau sebagai waktu lokal - menentukan apakah perubahan
  config butuh migrasi data.

### #11 - Modul Kinerja/Cascading tidak terpetakan di dokumen

- Severity: P2
- Lokasi: `app/Http/Controllers/PeriodeKinerjaController.php` (388 baris),
  `IndikatorKinerjaController.php`, `DirectorCascadingController.php`,
  dan 21 file di `app/Services/`.
- Gejala: `ARCHITECTURE_MAP.md` tidak menyebut modul ini sama sekali.
  `CONVENTIONS.md` menyatakan "belum ada service layer dominan", padahal modul
  ini seluruhnya berbasis service.
- Pola berbeda yang dipakai modul ini dan belum terdokumentasi:
  - Service layer di `app/Services/` dengan `app(X::class)` resolution.
  - Query lewat `DB::table()` builder, bukan Eloquent model.
  - Authorization lewat constructor middleware + `abort_unless`.
  - `DB::transaction` + `lockForUpdate` pada operasi tulis.
  - Soft-deactivate (`is_active = false`) alih-alih delete, menjaga audit trail.
  - `activity()->performedOn()->causedBy()->log()` untuk audit.
- Dampak: sesi berikutnya yang menyentuh modul ini akan meniru konvensi lama
  yang salah, atau justru menganggap kode baru sebagai anti-pola.
- Rekomendasi: update `ARCHITECTURE_MAP.md` dan `CONVENTIONS.md`. Modul ini
  justru contoh terbaik di repo untuk validasi, authz, dan audit trail.

### #13 - Test bergantung pada baris data tertentu di `dev_simdalin`

- Severity: P2
- Lokasi: `tests/Feature/MutuYearFilterTest.php:22-23`,
  `tests/Feature/IkpRiskLinkTest.php`, `tests/Feature/CascadingFeaturesTest.php`.
- Gejala: test memakai `firstOrFail()` atas data yang harus sudah ada, contoh
  `MutuUnit::whereHas('mutu_indikator')->firstOrFail()` dan
  `Pic::where('location_id', '>', 0)->firstOrFail()`. Pada database ini data
  tersebut tidak ada sehingga 5 test gagal dengan `ModelNotFoundException` atau
  pesan validasi "Siapkan periode indikator untuk tahun register terlebih dahulu".
- Dampak: hasil test bergantung isi database lokal masing-masing developer.
  Suite tidak bisa dijadikan gerbang CI dan baseline berbeda antar mesin.
- Ditemukan saat: TASK_08, ketika suite penuh pertama kali bisa berjalan utuh.
- Rekomendasi: factory/seeder khusus test untuk entitas Mutu, IKP, dan Cascading.
  Cukup besar untuk task sendiri; tidak mendesak selama baseline dicatat.
- Tambahan 2026-09-20 (review TASK_11):
  `CascadingFeaturesTest::test_add_and_delete_performance_indicators_preserves_export_history_and_checks_access`
  flaky. Di HEAD `2d78ae0b` tanpa perubahan lokal gagal 3/3, pada kode lain
  kadang lulus. Gejala: nilai sel workbook konsep lama berakhiran spasi
  (`'Persentase Capaian SPM Keuangan '`) sedangkan `indikator_kinerjas.name`
  sudah di-`trim` oleh `CascadingWorkbookImportService:25`. Baris sumber dipilih
  dengan `->get()->first(...)` tanpa urutan (`CascadingFeaturesTest.php:190`),
  sehingga hasil bergantung baris yang terpilih. Bukan regresi TASK_11.

### #12 - Path skill salah + sisa debug

- Severity: P3
- Lokasi: `CLAUDE.md` bagian "Struktur Dokumen", `resources/js/**`.
- Gejala: dokumen menunjuk `.claude/skills/simdalin-ui/SKILL.md`; folder `.claude`
  tidak ada. File nyata berada di `.codex/skills/simdalin-ui/SKILL.md`.
  Terdapat 15 `console.log` tersisa di `resources/js`.
- Dampak: minor, tetapi membuat instruksi sesi tidak dapat diikuti.

## Detail Temuan Lama (status dikoreksi)

### #1 - Migration `risk_registers` tidak ada di folder aktif

- Severity: P1 · Status: REGRESSED
- Verifikasi 2026-09-19: `database/migrations/` berisi 29 file, tidak ada
  `create_risk_registers_table`. File tersebut ada di
  `database/migrations/done/2023_02_04_154257_create_risk_registers_table.php`
  sehingga tidak ikut dijalankan, sementara
  `2023_08_13_043031_create_fgd_actuals_table.php` aktif dan membuat FK ke
  tabel yang belum ada.
- Catatan: perbaikan ini baru bisa diverifikasi setelah temuan #7 beres.

### #2 - Route dashboard/home memiliki trailing space

- Severity: P1 · Status: REGRESSED
- Verifikasi 2026-09-19: `routes/web.php:91-94` masih berbunyi
  `Route::get('/ ', ...)`, `Route::get('/dashboard ', ...)`,
  `Route::get('/notifications ', ...)`, `Route::get('/requeststatus ', ...)`.

### #3 - Endpoint list memakai sort field langsung dari request

- Severity: P0 · Status: REGRESSED
- Verifikasi 2026-09-19: `app/Http/Middleware/SanitizeSortParameters.php` yang
  diklaim TASK_04 tidak ada, dan tidak terdaftar di `app/Http/Kernel.php`.
  Terdapat 144 pemakaian `$request->field`/`$request->direction` di 41 controller
  yang masih mentah. Hanya `UserController.php:27` yang memiliki whitelist
  `in_array($request->field, ['name', 'email', 'created_at'], true)`.

### #4 - Delete risk register menghapus data terkait

- Severity: P1 · Status: REGRESSED
- Verifikasi 2026-09-19: `RiskRegisterKlinisController.php:434-453` masih
  menghapus `FgdInherent`, `FgdResidual`, `FgdTreated`, `FgdActual` sebelum
  `$riskRegister->delete()`.
- Catatan: `FormulirRca` di-query pada `:441` tetapi tidak pernah dipakai -
  variabel mati.

### #5 - Model domain banyak memakai guarded kosong

- Severity: P2 · Status: REGRESSED
- Verifikasi 2026-09-19: 18 dari 65 model memakai `$guarded = []`.
  `app/Models/RiskRegister.php` sudah punya konstanta `FORM_FIELDS` tetapi belum
  dipakai sebagai `$fillable`.

### #6 - File copy/debug lama tersisa

- Severity: P2 · Status: REGRESSED
- Verifikasi 2026-09-19: masih tracked di git -
  `app/Exports/FormatBPKPNonKlinisExport copy.php`,
  `app/Http/Controllers/OpsiPengendalianController - Copy.php`,
  `app/Http/Controllers/RiskRegisterNonKlinisController copy.php`,
  `resources/js/Components/ComboboxMultiple copy.jsx`,
  `resources/js/Components/Modal/ExportModal copy.jsx`,
  `resources/js/Layouts/Sidebar copy.jsx`,
  `resources/js/Pages/Dashboard copy.jsx`, `AGENTS - Copy.md`.

## Pertanyaan Untuk User

1. Database test: boleh dibuatkan koneksi terpisah (`test_simdalin` atau sqlite
   in-memory) di `phpunit.xml`, atau ada kendala tertentu sehingga test sengaja
   diarahkan ke `dev_simdalin`?
2. Permission untuk manajemen user/role: apakah memakai `atur hak akses` yang
   sudah ada, atau ada nama permission lain yang dipakai di produksi?
3. Timezone: apakah `created_at` yang sudah tersimpan mencerminkan waktu UTC
   atau sebenarnya sudah waktu WIB yang tersimpan tanpa konversi?
4. TASK_02-TASK_07: apakah pekerjaan itu memang pernah ada lalu di-revert, atau
   dokumennya ditulis tanpa commit? Menentukan apakah bisa di-recover atau harus
   dikerjakan ulang dari nol.
