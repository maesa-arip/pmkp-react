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
| 27 | P2 | Akses baca kamus MUTU lebih luas daripada akses ubah, dan UI-nya tidak membedakan | `app/Services/MutuIndicatorInput.php` `canViewAll()` vs `authorize()` | `canViewAll()` menerima role `super admin`, `authorize()` hanya menerima permission `lihat semua data indikator mutu`. Akun `adminmr` melihat 373 kamus tapi hanya boleh mengubah 29 milik unitnya; sisanya 403 tanpa keterangan | FIXED di lokal (belum commit/deploy) | - |
| 29 | P1 | Kamus MUTU terikat hierarki fitur 1-3 padahal tidak menyimpannya | `app/Services/MutuIndicatorInput.php`, `MutuIndikatorController::validated()`, `MUTU/MutuIndikator/{Form,Create,Edit}.jsx` | Simpan kamus bisa gagal karena kegiatan fitur 3, dan membuat indikator baru dari MUTU ikut menulis hierarki. Opsi indikator juga mengirim seluruh 2.609 penempatan semua tahun | FIXED di lokal (belum commit/deploy) | - |
| 28 | P1 | Form edit kamus MUTU mengirim induk fitur 3 milik master, bukan milik penempatan tahun itu | `resources/js/Pages/MUTU/MutuIndikator/Edit.jsx:12` | Simpan selalu gagal "Pilih kegiatan Kabag/Kabid aktif pada tahun yang sama." karena `master.indikator_fitur3_id` menunjuk pohon legacy (periode null) yang tidak ada di periode mana pun | FIXED di lokal (belum commit/deploy) | - |
| 25 | P2 | Tiap `Format*Export` mendeklarasikan `App\Exports\Sheet1..Sheet11` dengan nama sama | `app/Exports/Format*Export.php` | Dua export register tidak bisa dimuat dalam satu proses PHP: fatal "Cannot declare class App\Exports\Sheet1". Membatasi test dan menghalangi penggabungan export | OPEN | - |
| 26 | P3 | Tiga halaman export mati mengirim ke route yang tidak ada | `resources/js/Pages/Export/{LarsDHP,BPKPKlinis,BPKPNonKlinis}.jsx` | Tidak diimpor di mana pun; BPKPKlinis/BPKPNonKlinis POST ke `/riskregisterklinisbpkp` dan `/riskregisternonklinisbpkp` yang tidak terdaftar. Membingungkan pencarian | OPEN | - |
| 23 | P1 | Export register lintas tahun melebur register berbeda jadi satu baris | `FormatBPKPNonKlinisExport.php:84` `groupBy(...)` dan sheet sejenis di export lain | Tanpa rentang tanggal, 619 register non-klinis menyusut jadi 343 baris; 276 register hilang dari laporan. 98 grup mencampur lebih dari satu tahun | FIXED di lokal (belum commit/deploy) | - |
| 24 | P2 | `kode_risiko` ganda pada 436 register | data `risk_registers.kode_risiko` | 218 kode dipakai lebih dari satu register (mis. #970 memakai `ROO.24.02.43.395` milik #395), jadi kode tidak bisa jadi kunci pembeda di laporan | OPEN | - |
| 22 | P1 | Export register risiko memakai hierarki tahun lama; penautan fitur 4 per tahun tidak terbaca | `app/Exports/FormatBPKP*.php`, `FormatLARSDHP*.php`, `FormatSedangTerjadiExport.php` (join `indikator_fitur4s.id = risk_registers.indikator_fitur4_id`) | Kolom Sasaran/Program/Kegiatan/Tujuan pada 975 register - termasuk 129 register 2026 - diambil dari pohon legacy 4/25/55, bukan cascading 2026 (3/9/19) | OPEN | `prompt/tasks/TASK_12_penautan_massal_fitur4.md`, `prompt/tasks/TASK_13_export_register_ikut_tahun.md` |
| 37 | P2 | Simpan master penanggung jawab bisa menimpa unit fitur 4 yang jabatannya mengikuti kegiatan (hanya periode schema v1 terbuka) | `PeriodeKinerjaController::saveResponsible` | Unit indikator berubah diam-diam bila periode 2023-2025 dibuka lagi | OPEN | - |
| 21 | P3 | 5 unit tidak punya PIC sehingga penanggung jawab indikatornya kosong | data `pics.location_id` vs `locations` | Kolom "Penanggung jawab" di /kinerja tab Fitur 1-4 dan panel Indikator Mutu menampilkan "Belum diisi" untuk indikator milik unit itu | OPEN | - |
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
| 13 | P2 | 5 test bergantung pada baris data tertentu di `dev_simdalin`, satu di antaranya non-deterministik | `tests/Feature/MutuYearFilterTest.php:22`, `IkpRiskLinkTest.php`, `CascadingFeaturesTest.php:210` | Test gagal di database yang datanya berbeda; tidak bisa jadi gerbang CI. `CascadingFeaturesTest::test_add_and_delete_performance_indicators...` merah/hijau berganti antar-run **meski dijalankan sendiri** - dua run berurutan perintah yang sama memberi hasil berbeda | OPEN | - |
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

### #29 - Kamus MUTU dilepas dari hierarki fitur 1-3

- Severity: P1
- Keputusan user 2026-09-20, setelah tiga galat berurutan (#27, #28, lalu
  "Kamus sudah digunakan"): **kamus MUTU tidak boleh berpengaruh apa pun pada
  fitur 1-3, hanya penanda**; pengeditan hierarki ada di /kinerja. Selain itu
  daftar indikator fitur 4 harus mengikuti tahun.
- Perubahan:
  - `MutuIndikatorController::validated()` tidak lagi menerima
    `indikator_fitur3_id`. Kiriman lama diabaikan, bukan ditolak.
  - `MutuIndicatorInput::save()` melepas logika induk untuk pemilihan indikator
    yang sudah ada. Nilai `indikator_fitur3_id` yang terkirim pada jalur itu
    diabaikan.
  - `MutuIndicatorInput::options(User $user, ?int $periodId)` menyaring per
    periode. Prop `IndikatorFitur4` pada halaman menyusut dari **2.609 menjadi
    896** baris, dan prop `IndikatorFitur3` dihapus seluruhnya.
  - Formulir: pemilih tahun di dalam modal diganti teks yang mengikuti filter
    tahun daftar.
- Penegasan user 2026-09-20: bila "Buat indikator baru?" dijawab **Ya**, kegiatan
  fitur 3 **wajib** dipilih saat itu juga. Jadi:
  - Pilih indikator yang sudah ada -> tidak ada urusan dengan fitur 1-3.
  - Buat indikator baru -> `indikator_fitur3_id` wajib, harus aktif dan milik
    tahun yang sama, induk fitur 2 dan fitur 1-nya juga harus aktif. Indikator
    lahir langsung berinduk beserta `sasaran_strategis_id`, `jabatan`,
    `penanggung_jawab_id`, dan `cascading_concepts` dari kegiatan itu.
  - Pemindahan indikator yang sudah ada tetap hanya lewat /kinerja.
  - Pemeriksaan nama duplikat kini per tahun + unit, tidak lagi per kegiatan,
    jadi satu unit tidak bisa punya dua indikator bernama sama pada satu tahun.
- Catatan: pesan "Kamus sudah digunakan. Buat kamus baru untuk perubahan
  definisi." **bukan** bagian dari masalah ini dan tidak diubah. Itu penjaga
  `MutuIndikator::booted()` yang melindungi pengukuran yang sudah ada; menyimpan
  ulang tanpa mengubah definisi terbukti tidak memicunya.
- Test yang menyesuaikan kontrak baru:
  `CascadingFeaturesTest::test_mutu_dictionary_ignores_the_hierarchy_unless_it_creates_a_new_indicator`,
  `MutuIndicatorAdminAccessTest::{test_options_offer_only_the_indicators_of_the_requested_year,test_editing_a_dictionary_never_touches_the_feature_hierarchy}`.

### #28 - Form edit kamus MUTU memakai induk milik master

- Severity: P1
- Dilaporkan user 2026-09-20, muncul tepat setelah #27 diperbaiki: 403 tidak lagi
  menghentikan mereka, jadi validasi berikutnya yang gagal.
- Akar: `Edit.jsx` mengisi `indikator_fitur3_id` dari
  `model.indikator_fitur4?.indikator_fitur3_id`. Relasi itu menunjuk **master**
  permanen, dan induk master masih menunjuk pohon fitur 3 legacy
  (`periode_kinerja_id` null). `MutuIndicatorInput::save()` mencari ID itu di
  dalam periode terpilih dan tidak menemukannya.
- Reproduksi: kamus #131 -> master #340 -> `indikator_fitur3_id` 52 (periode
  null). Tidak ada di periode 2026. Nilai yang benar adalah induk **penempatan**
  2026 (#422246), yaitu null karena indikator itu belum tertaut.
- Perbaikan: `Edit.jsx` tidak lagi menebak induk; `Form.jsx` menyelaraskan
  `indikator_fitur3_id` dari opsi penempatan tahun terpilih setiap kali indikator
  atau tahun berubah, dan tidak menyentuh mode indikator baru.
- Test: `MutuIndicatorAdminAccessTest::test_editing_a_dictionary_uses_the_parent_of_the_year_not_the_master`
  mengunci keduanya - mengirim induk master ditolak 422, dan menyimpan tanpa induk
  berhasil serta penempatannya tetap tidak tertaut.

### #27 - Baca kamus MUTU lebih luas daripada ubah

- Severity: P2
- Dilaporkan user 2026-09-20: login `adminmr`, buka indikator mutu yang bertanda
  "belum terhubung fitur 1-3", tekan simpan, dapat 403 Forbidden.
- Reproduksi: `adminmr` (id 2, `pic_id` 75, unit 75) punya role `super admin` dan
  `Admin Manajemen Risiko`, tetapi **tidak** punya permission
  `lihat semua data indikator mutu`. `MutuIndicatorInput::canViewAll()` menerima
  role, jadi daftar menampilkan 373 kamus dari semua unit;
  `MutuIndicatorInput::authorize()` hanya menerima permission, jadi jatuh ke
  perbandingan unit. Kamus #131 milik unit 6 -> 403. Kamus #12 milik unit 75 -> lolos.
  Hanya 29 dari 373 kamus yang boleh diubah `adminmr`.
- Asimetri ini disengaja dan dijaga
  `MutuIndicatorAdminAccessTest::test_super_admin_read_access_does_not_grant_edit_or_delete_access_to_other_units`.
  Yang salah adalah UI-nya: tombol Edit/Hapus/Approve tampil untuk 344 kamus yang
  pasti gagal, dan 403 muncul tanpa keterangan.
- Diperbaiki di lokal: `MutuIndikatorResource` mengirim `can_edit` yang meniru
  `authorize()`, dan tombol Edit/Hapus/Approve di tabel maupun panel detail hanya
  tampil bila `can_edit`. Ada test yang membandingkan `can_edit` tiap baris dengan
  hasil `authorize()` sebenarnya.
- Keputusan user 2026-09-20: **berikan** permission `lihat semua data indikator
  mutu` ke role `super admin`. Diterapkan lewat migration
  `2026_09_20_120000_grant_all_mutu_dictionary_access_to_super_admin` yang
  idempotent dan punya `down()`. Role itu ternyata bukan izin-penuh: sebelumnya
  memegang 13 dari 17 permission, kini 14. Berlaku untuk 3 akun ber-role tersebut.
  Terverifikasi: `adminmr` sekarang lolos `authorize()` untuk kamus unit 6.
- Tiga permission yang masih belum dimiliki `super admin` bila nanti diperlukan:
  `approved indikator mutu`, `lihat semua data ikp`, `regrading data ikp`.
- Deploy: ikut `php artisan migrate` yang sudah menjadi langkah pertama runbook,
  tidak perlu perintah tambahan.
- Efek samping pada test: `Gate::before(fn () => false)` tidak bisa lagi memalsukan
  "super admin tanpa permission itu", karena Spatie mendaftarkan before-callback
  lebih dulu sehingga permission yang sudah diberikan menang. Helper
  `MutuIndicatorAdminAccessTest::superAdmin()` kini mencabut permission itu dari
  role di dalam transaksi test.
- Catatan penting: mengedit kamus **tidak pernah** menautkan indikator ke fitur 3.
  `mutu_indikators` tidak punya kolom induk; penautan ada pada penempatan fitur 4
  di /kinerja. Keterangan di panel detail sudah diperbaiki agar menyatakan itu dan
  menautkan langsung ke /kinerja bila akunnya berhak.

### #23 - Export lintas tahun melebur register

- Severity: P1
- Ditemukan: 2026-09-20 saat user menanyakan export tanpa memilih tahun.
- `startDate`/`endDate` hanya `$request->input(...)` tanpa validasi
  (`ExportController.php:48`) dan berawal `""` di form (`Export/BPKP.jsx:17`),
  jadi export tanpa tanggal memuat 2023-2026 dalam satu file.
- Sheet BPKP mengelompokkan atas nama sasaran/program/kegiatan/tujuan/indikator,
  nama pemilik, kategori risiko, dan tiga nilai OSD1 - tanpa tanggal dan tanpa ID
  register. Register hasil copy tahunan yang nilainya belum berubah saling
  menelan.
- Terukur (tipe_id 2): 619 register -> 343 baris; 276 register lebur; 98 grup
  mencampur >1 tahun (291 register). Contoh: #23 (2023-01-02), #395 (2024-01-02),
  #970 (2025-01-01) - indikator 191, OSD 3/2/2 - menjadi satu baris.
- Keputusan user 2026-09-20: wajibkan rentang tanggal sehingga satu berkas berisi
  satu tahun, plus tombol export setahun penuh dan pilihan triwulan.
- Perbaikan: `ExportController::registerRange()` mewajibkan `startDate`/`endDate`,
  menolak `endDate` sebelum `startDate`, dan menolak rentang yang melewati batas
  tahun. Dipakai empat endpoint export register (`riskregisterbpkp`,
  `riskregisterklinislarsdhp`, `riskregisternonklinislarsdhp`,
  `riskregistersedangterjadi`). Nama berkas kini memuat tahunnya.
- UI: `resources/js/Components/ExportPeriodPicker.jsx` menyediakan pilihan tahun,
  tombol Setahun penuh dan Triwulan I-IV, serta dua date picker yang dibatasi ke
  tahun terpilih. Dipakai `Export/{BPKP,LarsDHPKlinis,LarsDHPNonKlinis,SedangTerjadi}.jsx`.
  Pesan galat server kini ditampilkan, sebelumnya hanya `console.error`.
- Belum diubah: export IKP (`ikpdatainsiden`, `ikpdataevaluasi`) masih menerima
  rentang kosong; sheet-nya tidak memakai grouping hierarki yang sama.
- Grouping sheet sendiri tidak diubah, jadi dalam satu tahun register copy yang
  nilainya identik masih dapat lebur. Itu perilaku dokumen per tahun yang berlaku
  sebelumnya dan tidak termasuk keputusan ini.

### #22 - Export register risiko mengabaikan penautan fitur 4 per tahun

- Severity: P1 (pemblokir laporan BPKP/LARSDHP tahun 2026)
- Ditemukan: 2026-09-20 atas petunjuk user, diverifikasi di `dev_simdalin`.
- Rantai join yang dipakai semua export register (`FormatBPKPExport`,
  `FormatBPKPKlinisExport`, `FormatBPKPNonKlinisExport`, `FormatLARSDHP*`,
  `FormatSedangTerjadiExport`):
  `risk_registers.indikator_fitur4_id` -> `indikator_fitur4s.id` ->
  `indikator_fitur3_id` -> fitur 2 -> fitur 1 -> `sasaran_strategis`.
- Akar: 975 dari 975 register menyimpan **ID master** (`periode_kinerja_id`
  null), jadi join di atas selalu mendarat di baris master, lalu menaiki
  `master.indikator_fitur3_id`. `Fitur4Master::SHARED` sengaja tidak memuat
  `indikator_fitur3_id`, sehingga induk penempatan tahunan tidak pernah sampai
  ke master. Tidak ada export yang memfilter `periode_kinerja_id`, dan tidak ada
  export yang membaca `risk_registers.indikator_snapshot` (975 baris juga masih
  null; `AnnualRiskObserver` baru mengisinya untuk simpanan setelah TASK_11).
- Bukti: probe ber-rollback menautkan penempatan #422310 ke kegiatan 2026
  #15989. Kolom kegiatan hasil join tetap "Meningkatnya Mutu Pelayanan Rumah
  Sakit" (pohon legacy) dan `master.indikator_fitur3_id` tetap 53.
- Dampak terukur: 129 register bertanggal 2026 semuanya mencetak pohon legacy;
  2023/2024/2025 (241/294/311 register) juga, tetapi di sana isinya memang
  setara karena penempatan 2024/2025 adalah salinan pohon 55 kegiatan itu.
- Konsekuensi untuk perbaikan: penautan fitur 4 ke fitur 3 (satuan maupun
  massal) hanya memperbaiki Bagan dan Ekspor Cascading; laporan register tidak
  berubah sampai rantai join export diperbaiki.
- Urutan aman: 129 register 2026 memakai 54 master dan **semuanya belum
  tertaut**. Kalau export diperbaiki lebih dulu, kolom Sasaran/Program/Kegiatan
  2026 akan kosong. Tautkan 54 master itu dulu (berasal dari 18 kegiatan 2024,
  tersebar di 28 unit), atau kirim kedua perubahan bersamaan.
- Keputusan user 2026-09-20: register 2023 memakai hierarki lama yang sama
  dengan 2024/2025; hanya 2026 ke atas yang berubah fitur 1-3. Supaya tiap tahun
  register punya penempatan, periode 2023 dibuat sebagai salinan periode 2024
  berstatus ditutup. Sudah diterapkan di `dev_simdalin` (periode id 2037,
  4/25/55/571, lineage dan master identik dengan 2024, 241 register 2023
  menemukan penempatannya, teks laporan tidak bergeser).
- Efek samping yang disengaja: mengubah PIC pada register 2023 sekarang diperiksa
  terhadap cakupan unit indikator pada penempatan 2023, sama seperti 2024/2025.
  Sebelum ada periode 2023 pemeriksaan itu dilewati `AnnualRiskObserver` karena
  `$period` null. `IkpRiskLinkTest` ikut merah karena fixture-nya hanya menyetel
  `location_id` pada master; sudah diperbaiki agar menyetel master beserta semua
  penempatannya. Uji manual: edit PIC register 2023 milik unit lain harus
  ditolak, dan milik unit sendiri harus tersimpan.
- Cara menjalankannya berbeda per lingkungan, lihat
  `docs/CASCADING-PRODUCTION-2024-2026.md`: production yang belum punya periode
  memakai `cascading:prepare-2023-2026` **sekali saja** dan itu sudah mencakup
  2023-2026; server yang periodenya sudah dibuat sebelum keputusan ini
  (dev-mutu) memakai `cascading:prepare-2023`. Jangan menjalankan keduanya.
- Rantai resolusi yang disepakati untuk perbaikan export, dari yang paling
  dipercaya: (1) `risk_registers.indikator_snapshot` bila ada, (2) penempatan
  tahun register, (3) induk master seperti perilaku sekarang. Simulasi dengan
  periode 2023 tersedia: 975 dari 975 register menghasilkan teks **identik**
  dengan keluaran sekarang dan nol kolom kosong, jadi perbaikan ini
  non-regresif; 2026 baru bergeser ke cascading baru setelah indikatornya
  ditautkan.
- Status sisi export: FIXED 2026-09-21 via
  `prompt/tasks/TASK_13_export_register_ikut_tahun.md`. Rantai join dipindah ke
  `App\Services\RegisterHierarchyResolver` dan dipakai lima export
  (BPKP, LARS DHP Klinis, LARS DHP Non Klinis, Sedang Terjadi, MR Terbaru).
  Langkah 1 (snapshot) belum dipakai karena kolomnya masih null di 975/975.
- Keputusan user 2026-09-21: **cadangan induk master dihapus**. Indikator yang
  belum tertaut pada tahun register dibiarkan kosong supaya export sekaligus
  menjadi daftar periksa penautan. Aman karena 2023/2024/2025 tidak pernah
  memakai cadangan (241/241, 294/294, 311/311 lewat penempatan); hanya 129
  register 2026 yang jadi kosong. Kolom Indikator dan Pemilik Risiko tetap
  terisi pada baris kosong, jadi tetap terbaca indikator milik unit mana yang
  perlu ditautkan. Verifikasi: 2025 nol sel berbeda dari 122.225 sel; 2026
  berubah 903 sel (BPKP) dan 648 sel (LARS DHP Klinis), seluruhnya teks hierarki
  menjadi kosong.
- Konsekuensi: laporan 2026 belum siap dikirim ke BPKP/LARS DHP selama penautan
  belum selesai.
- **Status sisi data: MASIH TERBUKA.** 54 master yang dipakai 129 register 2026
  punya penempatan 2026 tetapi `indikator_fitur3_id`-nya null semua, jadi
  keluaran 2026 masih memakai cadangan induk master alias pohon lama. Tidak bisa
  dipetakan otomatis: cascading 2026 adalah pohon baru (19 kegiatan) dan nol
  lineage-nya sama dengan 55 kegiatan 2024/2025. Selesai lewat TASK_12.

### #21 - 5 unit tanpa PIC

- Severity: P3
- Ditemukan: 2026-09-20 saat penanggung jawab indikator dialihkan ke PIC.
- Fakta: 105 baris `pics` menutupi 100 `location_id` unik, jadi 5 unit tidak
  punya PIC dan 5 unit lain punya PIC ganda (nama yang tampil mengikuti baris
  terakhir). Dari 571 penautan master fitur 4 tahun 2026 yang belum punya
  jabatan, 566 dapat nama PIC unit dan 5 tetap kosong.
- Dampak: kolom "Penanggung jawab" menampilkan "Belum diisi" untuk indikator
  milik 5 unit itu. Tidak memblokir input.
- Saran: lengkapi master PIC, atau tetapkan jabatan penanggung jawab pada
  indikatornya lewat /kinerja.
- Cek ulang 2026-09-21 (periode 2026): 5 indikator fitur 4 aktif masih kosong.
  1 milik unit SIMRS (location 35, belum punya PIC - isi lewat Master > PIC
  `/pics`), 4 lainnya berunit `0`/semua unit (#422144, #422149-#422151) sehingga
  memang tidak punya PIC unit; keempatnya terisi PIC Kabag/Kabid setelah
  dihubungkan ke kegiatan, karena jabatan fitur 4 kini mengikuti kegiatan fitur 3.
  Unit Kabag/Kabid 99-104 juga tanpa PIC, tetapi tidak dipakai indikator 2026.

### #37 - Simpan master penanggung jawab bisa menimpa unit fitur 4 di periode schema v1 yang terbuka

- Severity: P2 (laten: semua periode schema v1 saat ini ditutup)
- Ditemukan: 2026-09-21 saat jabatan fitur 4 dibuat mengikuti kegiatan fitur 3.
- Fakta: `PeriodeKinerjaController::saveResponsible` menulis `location_id` =
  unit jabatan ke semua fitur 4 dengan `penanggung_jawab_id` itu pada periode
  terbuka schema v1, lalu `Fitur4Master::syncFromPlacement` menyebarkannya ke
  semua tahun. Fitur 4 yang kini mewarisi jabatan Kabag/Kabid dari kegiatannya
  akan ikut mendapat unit Kabag/Kabid bila periode v1 dibuka lagi.
- Dampak: unit indikator (dan akses PIC unit) berubah diam-diam. Tidak terjadi
  di 2026 (schema v2 dikecualikan).
- Saran: kecualikan fitur 4 yang jabatannya sama dengan kegiatan induknya dari
  sinkron unit itu, atau hapus sinkron unit untuk fitur 4 sama sekali.

### #30 - `fgd_inherents` punya baris ganda per register

- Severity: P3
- Ditemukan: 2026-09-21 saat membangun export Laporan MR Terbaru.
- Fakta: 2 `risk_register_id` punya lebih dari satu baris di `fgd_inherents`
  (`fgd_residuals`/`fgd_treateds`/`fgd_actuals` bersih). Form FGD sekarang
  memakai `updateOrCreate`, jadi ini sisa data lama.
- Dampak: join polos ke `fgd_inherents` menggandakan baris. Terlihat di
  `FormatSedangTerjadiExport` sheet "Formulir FGD Inherent" yang masih memakai
  join polos; export MR Terbaru sudah dikunci ke baris `MAX(id)` per register.
- Saran: rapikan baris ganda di DB, lalu tambahkan unique index pada
  `risk_register_id` di keempat tabel FGD.

### #31 - 218 `kode_risiko` dipakai lebih dari satu register

- Severity: P2
- Ditemukan: 2026-09-21 saat memverifikasi keluaran export Keterjadian Risiko.
- Fakta: `select kode_risiko from risk_registers where deleted_at is null group
  by kode_risiko having count(*) > 1` mengembalikan 218 kode.
- Dampak: dua baris export dengan kode yang sama bisa menampilkan peringkat
  risiko berbeda karena `concatdp1`-nya berbeda; pembaca laporan menganggap
  kode risiko unik. Terkait tema temuan #19.
- Saran: telusuri asal duplikat (copy antar tahun?) sebelum memutuskan apakah
  kode perlu dibuat unik.

### #32 - Merge header template MR Terbaru tidak konsisten

- Severity: P4
- Ditemukan: 2026-09-21 saat menyalin `docs/FORMAT LAPORAN MR TERBARU KLINIS DAN
  NON KLINIS.xlsm`.
- Fakta: pada sheet FGD, judul "Skor Probabilitas" di template hanya di-merge
  `L4:Q4` padahal kolom respondennya sampai `S`; sheet "10. FGD Aktual"
  diberi judul sel "FORMULIR FGD TREATED RISK" sama seperti sheet 11.
- Dampak: tidak ada, hanya tampilan template asli.
- Keputusan: export memakai merge `L:S` dan judul "FORMULIR FGD AKTUAL RISK"
  agar header tidak menggantung. Beri tahu user bila template asli mau ditiru
  apa adanya.

### #33 - Endpoint verifikasi/supervisi tanpa otorisasi server-side

- Severity: P2
- Ditemukan: 2026-09-21 saat menambahkan tombol Supervisi di register risiko.
- Fakta: `riskregister.storeverificationadminpriority`,
  `storeverificationmanagementpriority`, `storeverificationadminoccurring`, dan
  `storeverificationmanagementoccurring` hanya dibungkus middleware `auth`.
  `VerificationController` memvalidasi `keterangan` saja, tidak memeriksa
  permission maupun kepemilikan register. Accordion "Verifikasi Prioritas" di
  `Sidebar.jsx` juga tidak digerbang permission, padahal "Verifikasi Berjalan"
  digerbang `lihat data verifikasi`.
- Dampak: user unit mana pun yang tahu route-nya bisa menulis supervisi atas
  register milik unit lain, termasuk register miliknya sendiri. Tombol Supervisi
  disembunyikan di UI dengan `lihat data verifikasi`, tetapi itu hanya penjagaan
  tampilan - lihat temuan #8 yang menegaskan otorisasi harus di server.
- Status: FIXED di lokal via `prompt/tasks/TASK_14_authorize_verification_module.md`
  (2026-09-21). Constructor middleware `hasRole('super admin') ||
  can('lihat data verifikasi')` pada `VerificationController` (menjaga 8 method),
  accordion "Verifikasi Prioritas" digerbangi permission yang sama, dan keempat
  method store memvalidasi foreign key-nya. Test:
  `tests/Feature/VerificationAuthorizationTest.php` (5 passed).
- Blast radius saat fix: hanya role `super admin` (3 user) dan
  `Admin Manajemen Risiko` (1 user) yang memegang `lihat data verifikasi`. 101
  user role `PIC` kehilangan akses ke layar Verifikasi Prioritas yang sebelumnya
  terbuka untuk semua - itu memang inti celahnya. Tabel prioritas hanya berisi 2
  baris (`verification_priority_admins`), jadi fiturnya nyaris belum terpakai.
  Bila ada unit yang memang ditugaskan memverifikasi, beri mereka permission
  `lihat data verifikasi`, jangan cabut gerbangnya.

### #34 - Unique index hilang pada penempatan fitur 4 dan periode

- Severity: P3
- Ditemukan: 2026-09-21 saat mengerjakan TASK_13.
- Fakta: `indikator_fitur4s (master_id, periode_kinerja_id)` dan
  `periode_kinerjas (tahun)` sama-sama tidak punya unique index, padahal
  keduanya unik di data sekarang (0 duplikat untuk keduanya).
- Dampak: MySQL tidak bisa membuktikan kolom hierarki bergantung fungsional pada
  `GROUP BY risk_registers.id`, sehingga TASK_13 harus menambahkan
  `RegisterHierarchyResolver::groupBy()` pada empat query. Tanpa index itu, tiap
  query baru yang mengelompok per register akan menabrak `only_full_group_by`
  lagi. Index-nya juga akan mencegah kelas bug penempatan ganda.
- Tidak dikerjakan sekarang: migration unique index bisa gagal bila production
  ternyata punya duplikat, dan itu belum bisa diperiksa dari sini.
- Saran: periksa duplikat di tiap server dulu, baru tambahkan unique index, lalu
  `RegisterHierarchyResolver::groupBy()` bisa dikosongkan.

### #35 - Export PERGUB Non Klinis gagal total (`only_full_group_by`)

- Severity: P1 (menu "PERGUB Non Klinis" di Report Risiko tidak menghasilkan berkas)
- Ditemukan: 2026-09-21 saat menyiapkan pembanding TASK_13.
- Fakta: `FormatLARSDHPNonKlinisExport` sheet REGISTER RISIKO memilih grading
  lewat `CASE COALESCE((SELECT value FROM risk_grading_settings ...))` yang
  menyentuh **delapan** kolom `risk_gradings.name_*`, tetapi `groupBy`-nya hanya
  mendaftar tiga (`name_nonklinis`, `name_nonklinis_pergub`, `name_bpkp`).
  MySQL menolak: `Expression #N ... nonaggregated column
  'risk_gradings.name_klinis_pergub'`.
- Bukti: gagal dengan pesan identik **sebelum maupun sesudah** TASK_13, jadi
  bukan regresi dari task itu. Export BPKP, LARS DHP Klinis, dan Sedang Terjadi
  berhasil pada periode yang sama.
- Saran: lengkapi daftar `groupBy` dengan seluruh kolom yang disentuh CASE, atau
  ganti CASE dengan `RiskGrading::selectNameSql` yang hanya menyentuh satu kolom
  (setting dibaca di PHP, bukan di SQL) seperti yang sudah dipakai sheet lain.
- Cakupan sebenarnya lebih luas dari dugaan awal: versi asli gagal untuk
  **semua** tahun (diuji 2024, 2025, 2026), bukan hanya 2026. Menu "PERGUB Non
  Klinis" tidak pernah menghasilkan berkas.
- Status: FIXED 2026-09-21 via `prompt/tasks/TASK_15_fix_export_pergub_nonklinis.md`.
  Opsi kedua yang dipakai: CASE diganti `RiskGrading::selectNameSql(...)` dan
  ketiga entri grading di `groupBy` diganti satu
  `DB::raw(RiskGrading::nameColumnSql(...))`. Select dan groupBy sekarang memanggil
  helper yang sama, jadi mengubah setting tidak bisa lagi membuat keduanya tidak
  sinkron. Terbukti: keempat tahun menghasilkan berkas.

### #36 - Peringkat residual/treated/actual mengabaikan setting grading

- Severity: P2 (laporan PERGUB mencampur dua penamaan dalam satu sheet)
- Ditemukan: 2026-09-21 setelah temuan #35 diperbaiki dan sheet-nya bisa dibaca.
- Fakta: pada sheet REGISTER RISIKO, kolom peringkat risiko inherent memakai
  setting (`RiskGrading::selectNameSql`), tetapi `grading2`, `grading3`, dan
  `grading4` dipilih sebagai `grading2.name` / `grading3.name` / `grading4.name`
  - kolom `name` mentah, yaitu penamaan **klinis**.
- Bukti pada `nk-2025.xlsx`: kolom S (inherent) berisi EKSTRIM/TINGGI/SEDANG/
  RENDAH/SANGAT RENDAH, sedangkan kolom AA (residual) berisi
  Extreme/Moderate/High/Low pada sheet yang sama.
- Terdampak: `FormatLARSDHPNonKlinisExport`. `FormatLARSDHPKlinisExport` memakai
  pola yang sama tetapi kebetulan benar karena setting-nya memang `klinis`.
- Tidak diperbaiki bersama #35 karena mengubah teks yang terlihat pengguna, dan
  itu keputusan pemilik laporan. Perbaikannya kecil: tiga `grading*.name` diganti
  `RiskGrading::selectNameSql('grading2', 'export_lars_dhp_nonklinis',
  'nonklinis_pergub', 'grading2_name')` dan seterusnya, plus groupBy-nya.

### #37 - Filter unit pada Copy Risk Register melewatkan register ber-PIC format lama

- Severity: P2 (copy per unit diam-diam tidak lengkap; tidak ada data rusak)
- Ditemukan: 2026-09-21 saat memeriksa hasil copy 2025 -> 2026 (233 tersalin,
  78 `unit_mismatch`, tanpa duplikat; copy tanpa filter unit tidak terdampak).
- Fakta: `RiskRegisterYearCopyService::buildSourceQuery` menyaring `pic_id` dan
  `source_pic_id` dengan `whereJsonContains('pic_id', id)`. Kolom `pic_id` berisi
  skalar (`"44"`) atau string ber-encode berulang (`"\"21,8,73\""`), yang tidak
  cocok untuk JSON contains kecuali skalar tunggal. Parser yang benar sudah ada:
  `AnnualIndicatorService::ids()`.
- Bukti register 2025: 70 dari 83 unit menghasilkan jumlah berbeda, misalnya
  unit 44 nyata 10 vs filter 5, unit 21 nyata 11 vs filter 2, unit 8 nyata 11
  vs filter 3. Register ROO.25.02.43.928 (PIC 21,8,73) tidak terjaring filter
  unit mana pun.
- Terdampak: filter "Unit" pada copy antar tahun dan unit sumber pada copy antar
  unit (`/riskRegisterCopy`).
- Status: FIXED 2026-09-21. `buildSourceQuery` kini menyaring lewat
  `idsWithPic()` yang memakai `AnnualIndicatorService::ids()`. Pada data lokal,
  82 dari 83 unit kini cocok (sisanya unit 0 = sentinel semua unit, yang ditolak
  validasi `exists:pics`). Test: `test_unit_filters_match_legacy_encoded_pic_ids`
  (gagal tanpa perbaikan).

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
