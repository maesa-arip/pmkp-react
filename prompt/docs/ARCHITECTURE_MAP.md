# ARCHITECTURE MAP - SIMDALIN

Peta faktual codebase existing. Update saat struktur berubah. Semua path merujuk
file nyata di repo ini.

## Stack & Perintah

```
Stack : Laravel 9 / PHP ^8.0.2, MySQL, Inertia Laravel, React 18, Vite 4, Tailwind CSS 3
Build : npm run build
Test  : php artisan test (baseline terbaru di CLAUDE.md)
Run   : php artisan serve dan npm run dev
Lint  : vendor/bin/pint (Laravel Pint tersedia via composer, tidak ada script lint npm)
```

Sumber: `composer.json`, `package.json`, `vite.config.js`, `tailwind.config.js`.

## Struktur Folder Utama

```
app/                 - controller, model, middleware, resource Laravel
app/Http/Controllers - endpoint web/Inertia dan action domain
app/Http/Resources   - transform data untuk props/resource collection
app/Models           - Eloquent model domain SIMDALIN
database/migrations  - migration aktif; sebagian migration lama ada di migrations/done dan ikp
database/backups     - backup SQL gzip untuk restore lokal
resources/js         - frontend React/Inertia
resources/js/Pages   - halaman per domain
resources/js/Layouts - layout aplikasi, sidebar, navbar, auth layout
resources/js/Components - komponen tombol, modal, input, pagination, table helper
resources/views      - blade root Inertia, PDF/table view
routes/web.php       - route utama aplikasi setelah login
routes/auth.php      - route auth Laravel Breeze
routes/api.php       - route API user Sanctum default
config/permission.php - konfigurasi Spatie Permission
```

## Modul & Tanggung Jawab

| Modul | Tanggung jawab | File kunci |
|-------|----------------|-----------|
| Auth/Profile | Login, register, reset password, profile | `routes/auth.php`, `app/Http/Controllers/Auth/*`, `app/Http/Controllers/ProfileController.php` |
| Dashboard | Dashboard, notifikasi, request status | `app/Http/Controllers/HomeController.php`, `resources/js/Pages/Dashboard.jsx` |
| User/Role/Permission | Manajemen user dan akses | `app/Http/Controllers/UserController.php`, `RoleController.php`, `PermissionController.php`, `app/Models/User.php` |
| Master Risiko | Kategori, sumber identifikasi, lokasi, jenis risiko, nilai dampak/probabilitas/kontrol | `RiskCategoryController.php`, `ImpactValueController.php`, `ProbabilityValueController.php`, `ControlValueController.php` |
| Risk Register | Register risiko klinis/non-klinis, OSD, pengendalian, RCA, FGD, status, history | `RiskRegisterKlinisController.php`, `RiskRegisterNonKlinisController.php`, `RiskRegister.php`, `RiskRegisterHistory.php` |
| IKP | Master IKP dan data pasien/insiden | `app/Http/Controllers/IKP/**`, `app/Models/IKP/**`, `resources/js/Pages/IKP/**` |
| Mutu | Kategori mutu, indikator mutu, unit, PDSA, penyebut | `app/Http/Controllers/MUTU/**`, `app/Models/MUTU/**`, `resources/js/Pages/MUTU/**` |
| Indikator tahunan & cascading | Periode kinerja, hierarki fitur 1-3 per tahun, fitur 4 master tetap + penautan per tahun, bagan dan ekspor cascading | `PeriodeKinerjaController.php`, `app/Services/AnnualIndicatorService.php`, `app/Services/Fitur4Master.php`, `app/Services/CascadingExportService.php`, `resources/js/Pages/Kinerja/Index.jsx` |
| Export/PDF/Excel | Export risk register, IKP, PDSA, PDF, Excel | `ExportController.php`, `ExportPDFController.php`, `ExcelController.php`, `resources/views/pdfview.blade.php` |

## Alur Request Contoh

Master data kategori risiko:
```
GET riskCategories
-> routes/web.php Route::Resource('riskCategories', RiskCategoryController::class)
-> app/Http/Controllers/RiskCategoryController.php@index
-> App\Models\RiskCategory query/filter/sort
-> App\Http\Resources\RiskCategoryResource::collection(...)->additional(...)
-> inertia('Master/RiskCategory/Index')
-> resources/js/Pages/Master/RiskCategory/Index.jsx
-> resources/js/Components/MasterDataIndex.jsx
```

Risk register klinis:
```
GET riskRegisterKlinis
-> routes/web.php Route::apiResource('riskRegisterKlinis', RiskRegisterKlinisController::class)
-> RiskRegisterKlinisController@index
-> RiskRegister::query()->where('tipe_id', 1)->with(...)
-> RiskRegisterResource collection + supporting master data props
-> Inertia::render('RiskRegister/Klinis/Index')
```

## Autentikasi & Otorisasi

- Auth berbasis session Laravel Breeze: `routes/auth.php`, controller di
  `app/Http/Controllers/Auth`.
- Route aplikasi utama dibungkus `Route::middleware('auth')->group(...)` di
  `routes/web.php`.
- Role/permission memakai Spatie Permission: `spatie/laravel-permission`,
  `App\Models\User` memakai `HasRoles`, konfigurasi di `config/permission.php`.
- Beberapa authorization dilakukan inline lewat `auth()->user()->can(...)`, contoh
  `RiskRegisterKlinisController@index` membatasi data berdasarkan permission
  `lihat data semua risk register`.
- Controller yang sudah dijaga constructor middleware
  `abort_unless(... hasRole('super admin') || can(...), 403)`:
  `CelahPengendalianController`, `PeriodeKinerjaController`, `UserController`,
  `RoleController`, `PermissionController` (TASK_09), dan
  `VerificationController` dengan `lihat data verifikasi` (TASK_14). Pola itu
  yang dipakai untuk modul baru, bukan gerbang di sidebar saja.

## Entitas / Model Data

| Entitas | Relasi penting | Catatan |
|---------|----------------|---------|
| User | hasMany RiskRegister, belongsTo Pic, HasRoles | `app/Models/User.php` |
| RiskRegister | belongsTo master data, user, indikator; hasOne FGD/RCA/request/verification; hasMany history | memakai SoftDeletes dan activity log; mass assignment dibatasi `$fillable` dan `FORM_FIELDS`; `location_id` nullable (unit pada form non-klinis) |
| RiskRegisterHistory | belongsTo RiskRegister/User | menyimpan event dan snapshot status/copy |
| RiskCategory, RiskType, RiskVariety | master risk register | CRUD master |
| ImpactValue, ProbabilityValue, ControlValue, RiskGrading | nilai/grading risiko | dipakai hitung OSD dan grading |
| FgdInherent/Residual/Treated/Actual | hasOne dari RiskRegister | data penilaian responden |
| FormulirRca, RequestUpdate | hasOne dari RiskRegister | RCA dan request perubahan status |
| Pic, Location, IdentificationSource, JenisSebab | master referensi | dipakai risk register dan filter user |
| IKP models | IkpPasien dan master IKP | folder `app/Models/IKP` |
| MUTU models | MutuKategori, MutuIndikator, MutuUnit, MutuPenyebut, MutuPdsa | folder `app/Models/MUTU`; kamus `MutuIndikator` tidak berperiode dan menunjuk master fitur 4 |
| PeriodeKinerja | hasMany fitur 1-3 dan penautan fitur 4 | status draft/aktif/ditutup; ditutup mengunci hierarki, bukan transaksi |
| IndikatorFitur4 | master (`periode_kinerja_id` null) atau penautan tahun (`master_id`, `indikator_fitur3_id` nullable) | global scope `annual` hanya menampilkan penautan; relasi dari RiskRegister/MutuIndikator melepas scope karena menyimpan ID master |

## Endpoint / Route

`php artisan route:list` berhasil dan menampilkan 296 routes. Ringkasan kelompok:

```
Auth: login, register, logout, forgot/reset password, verify email, confirm password
Profile: GET/PATCH/DELETE profile
Dashboard: home, dashboard, notifications, requeststatus
Master: riskCategories, riskGradings, riskGradingSettings, opsiPengendalians,
        identificationSources, locations, riskVarieties, riskTypes, pics,
        impactValues, probabilityValues, controlValues, jenisSebabs
IKP: IkpJenisInsidens, IkpTipeInsiden, IkpSpesialisasi, IkpPelapor,
     IkpGrupLayanan, IkpPenanggung, IkpLokasi, IkpPenindak, IkpDampak,
     IkpProbabilitas, IkpPasien, hasilinvestigasi
MUTU: MutuKategori, MutuPenyebut, MutuIndikator, MutuIndikatorApproved,
      MutuUnit, formulirpdsa
Risk Register: riskRegisterCopy, riskRegisterKlinis, riskRegisterNonKlinis,
               riskRegisterKlinisPengendalian, klinisOpsiPengendalian,
               riskRegisterKlinisOsd2, formulirrca, requestupdatestatus,
               updatestatus, fgdinherent, fgdresidual, fgdtreated, fgdactual
Verification: verification/occurring/*, verification/priority/*
Export: export/*, export-excel, riskregister* reports, ikpdata*, print-* PDF routes
        termasuk riskregisterklinismrterbaru, riskregisternonklinismrterbaru,
        dan riskregisterketerjadian (menu "Report Risiko" di sidebar)
```

Hierarki fitur 1-3 pada export register **tidak** dibaca dari induk master.
Register menyimpan ID master fitur 4, dan master sengaja tidak memuat
`indikator_fitur3_id`, jadi semua export memakai `App\Services\RegisterHierarchyResolver`:
master -> penempatan tahun (`master_id` + periode tahun `tgl_register`) -> fitur
3/2/1 -> `sasaran_strategis`. **Tidak ada cadangan ke induk master**: indikator
yang belum ditautkan pada tahun register membuat kolom Sasaran/IKU/Program/
Kegiatan kosong, disengaja supaya export menjadi daftar periksa penautan. Nama
indikator dan Pemilik Risiko tetap terisi sehingga baris kosong tetap terbaca.
Aliasnya sama dengan nama tabel sehingga `select` lama tetap berlaku, dan
pemanggilannya lewat `->tap(...)`. Query yang mengelompok per register memakai
`RegisterHierarchyResolver::groupBy()` sebagai pengaman `only_full_group_by`
(tidak wajib pada MySQL 8 lokal, lihat temuan #34). Lihat temuan #22 dan TASK_13.

Export workbook di `app/Exports` memakai satu kelas `WithMultipleSheets` per
format. `FormatMRTerbaruExport` menerima `tipe_id` (1 klinis / 2 non klinis)
sehingga satu kelas melayani dua menu, dan label peringkat risikonya memakai
setting `export_lars_dhp_klinis` / `export_lars_dhp_nonklinis` yang sudah ada.
Sheet `6. pemantauan RTP risiko` pada `FormatMRTerbaruExport` memuat dua pasang
kolom supervisi: `Supervisi Admin Risiko` (Keterangan + Tanggal Supervisi) dan
`Supervisi Level Manajemen` (Keterangan + Tanggal Supervisi). Sumbernya
`verification_priority_admins` / `verification_priority_management` yang ditulis
tombol Supervisi di register, dengan cadangan `verification_admins` /
`verification_management` (verifikasi berjalan lewat `request_updates`) agar data
lama tetap terbaca.

`FormatKeterjadianRisikoExport` adalah satu-satunya export yang barisnya bukan
register: sheet pertamanya satu baris per kejadian, diambil dari
`risk_register_histories` (`currently_id = 1`, `event_type` null atau
`status_changed`) sehingga satu register bisa muncul berkali-kali, dan
periodenya diukur pada tanggal kejadian, bukan `tgl_register`.

## Props Inertia Yang Diturunkan Server

- `Kinerja/Index` props `nodes[level][]`: selain kolom tabel, server menambahkan
  `display_code` (CascadingHierarchyService), `unit_names`, dan
  `penanggung_jawab`. `penanggung_jawab` adalah nama PIC di balik jabatan
  (`kinerja_penanggung_jawabs.pic_id` -> `pics.name`). Fitur 4 sebaliknya
  mendahulukan PIC unitnya (`pics.location_id`), lalu PIC jabatan, lalu kolom
  `jabatan` sebagai cadangan terakhir. Kolom `jabatan` di DB dan ekspor
  Cascading tidak berubah.
- Jabatan fitur 4 (`penanggung_jawab_id`, `jabatan`) disimpan **per tahun**,
  bukan di master (`Fitur4Master::SHARED` hanya nama, tujuan, unit). Saat
  indikator yang sudah ada disimpan di `/kinerja` (termasuk "Hubungkan ke
  kegiatan"), `saveNode` mengambil jabatannya dari kegiatan fitur 3 yang dipilih,
  dan form tidak menampilkan pilihan jabatan. Pengecualian: indikator yang punya
  jabatan sendiri, berbeda dari kegiatannya (dibuat lewat "Tambah"), tetap
  memakai jabatan itu dan tetap bisa diubah.
- `RiskRegister/Klinis/Index` dan `RiskRegister/NonKlinis/Index` props
  `verificationpriorityadmin` dan `verificationprioritymanagement` per baris
  register (relasi `hasOne` di `RiskRegister`). Dipakai tombol **Supervisi** di
  drawer register: `RiskSupervisionModal` menampilkan keterangan dan tanggal
  supervisi terakhir, lalu menyimpan lewat route yang sudah ada
  `riskregister.storeverificationadminpriority` /
  `riskregister.storeverificationmanagementpriority` (PUT, `updateOrCreate` per
  `risk_register_id`, jadi satu baris per level dan menyimpan ulang menimpa yang
  lama). Tombolnya hanya tampil untuk permission `lihat data verifikasi`, sama
  seperti menu Verifikasi di sidebar.
- `MUTU/MutuIndikator/Index` prop `UnplacedIndicators`: daftar `master_id` fitur
  4 yang tertaut pada tahun terpilih tetapi `indikator_fitur3_id`-nya masih
  kosong. Relasi `location` pada tiap kamus ikut memuat `pic`, dan tiap baris
  membawa `can_edit` yang meniru `MutuIndicatorInput::authorize()`.
- `MUTU/MutuIndikator/Index` props `IndikatorFitur4`
  (`MutuIndicatorInput::options($user, $periodId)`) dan `IndikatorFitur3` hanya
  memuat data **tahun terpilih**. Memilih indikator yang sudah ada tidak
  menyentuh hierarki fitur 1-3 - pemindahannya dikerjakan di `/kinerja` - tetapi
  membuat indikator baru wajib menyertakan kegiatan fitur 3 aktif tahun itu.
  Lihat temuan #29.

## Test

- Test ada di `tests/Feature` dan `tests/Unit`; berjalan di atas `dev_simdalin`
  dengan `DatabaseTransactions` (TASK_08), fixture dibuat di dalam test.
- Baseline terbaru: lihat bagian Status di `CLAUDE.md`.
- `Tests\Feature\ExampleTest` mengharapkan `/` status 200, tetapi aplikasi
  mengembalikan 302 karena `/` berada di group `auth` (temuan #2).
- `PreloadResponseHeadersTest` gagal bila `public/hot` (Vite dev server) ada.

## Catatan & Area Berisiko

- Banyak controller menerima `field` dan `direction` langsung untuk `orderBy`.
- Beberapa route dashboard memiliki trailing space di path.
- Risk register menyimpan data penting dan history; delete action menghapus data
  terkait dan history, sehingga perlu hati-hati.
- Banyak model menggunakan `$guarded=[]`; validasi controller menjadi garis
  pertahanan utama.
- Ada file copy seperti `Dashboard copy*.jsx` dan controller copy; jangan jadikan
  acuan kecuali task khusus membutuhkannya.
