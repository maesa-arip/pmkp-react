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

## Entitas / Model Data

| Entitas | Relasi penting | Catatan |
|---------|----------------|---------|
| User | hasMany RiskRegister, belongsTo Pic, HasRoles | `app/Models/User.php` |
| RiskRegister | belongsTo master data, user, indikator; hasOne FGD/RCA/request/verification; hasMany history | memakai SoftDeletes dan activity log; `$guarded=[]` |
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

`php artisan route:list` berhasil dan menampilkan 293 routes. Ringkasan kelompok:

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
```

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
