# FINDINGS LOG - SIMDALIN

Backlog temuan audit + status perbaikannya. Mencatat bukan memperbaiki;
perbaikan dibuat sebagai task terpisah di `prompt/tasks/`.

Severity: P0 keamanan/kehilangan data, P1 bug fungsional, P2 inkonsistensi atau
technical debt, P3 kosmetik/minor.

| # | Sev | Judul | Lokasi | Dampak | Status | Task |
|---|-----|-------|--------|--------|--------|------|
| 1 | P1 | Test suite gagal karena urutan migration FK risk_registers | `database/migrations/2023_08_13_043031_create_fgd_actuals_table.php` | Fresh test/migrate tidak bisa hijau dari database kosong | FIXED | `prompt/tasks/TASK_02_fix_migration_baseline.md` |
| 2 | P1 | Route dashboard/home memiliki trailing space | `routes/web.php:80` | URL normal `/` atau `/dashboard` berpotensi tidak cocok dengan definisi yang diharapkan | FIXED | `prompt/tasks/TASK_03_fix_trailing_space_routes.md` |
| 3 | P0 | Banyak endpoint list memakai sort field langsung dari request | `app/Http/Controllers/RiskCategoryController.php:26` | Risiko SQL error atau injection identifier/order bila parameter dimanipulasi | FIXED | `prompt/tasks/TASK_04_sanitize_sort_parameters.md` |
| 4 | P1 | Delete risk register menghapus history audit | `app/Http/Controllers/RiskRegisterKlinisController.php:609` | Jejak perubahan risiko hilang saat register dihapus | FIXED | `prompt/tasks/TASK_05_preserve_risk_register_history_on_delete.md` |
| 5 | P2 | Model domain banyak memakai `$guarded=[]` | `app/Models/RiskRegister.php:15` | Validasi controller menjadi satu-satunya proteksi mass assignment; raw request update lebih riskan | FIXED | `prompt/tasks/TASK_06_whitelist_risk_register_mass_assignment.md` |
| 6 | P2 | Banyak file copy/debug lama tersisa | `resources/js/Pages/Dashboard copy.jsx` | Pencarian dan maintenance rawan salah acuan | FIXED | `prompt/tasks/TASK_07_remove_stale_copy_files.md` |

## Detail Temuan

### #1 - Test suite gagal karena urutan migration FK risk_registers

- Severity: P1
- Lokasi: `database/migrations/2023_08_13_043031_create_fgd_actuals_table.php`
- Gejala: `php artisan test` baseline menghasilkan 23 failed / 1 passed; error utama `Failed to open the referenced table 'risk_registers'`.
- Dugaan penyebab: migration FGD aktif bertanggal 2023_08_13 berjalan sebelum migration `risk_registers` yang berada di `database/migrations/done`.
- Dampak: test dan fresh install berbasis migration tidak dapat berjalan bersih.
- Rekomendasi: task khusus untuk menata migration aktif atau strategi testing DB tanpa merusak database backup.
- Status: FIXED via `prompt/tasks/TASK_02_fix_migration_baseline.md`

### #2 - Route dashboard/home memiliki trailing space

- Severity: P1
- Lokasi: `routes/web.php:80-83`
- Gejala: route didefinisikan sebagai `/ `, `/dashboard `, `/notifications `, `/requeststatus `.
- Dugaan penyebab: typo whitespace pada string route.
- Dampak: URL normal tanpa spasi dapat redirect/404 atau tidak sesuai ekspektasi route helper.
- Rekomendasi: task kecil untuk koreksi path dan verifikasi route/frontend link terkait.
- Status: FIXED via `prompt/tasks/TASK_03_fix_trailing_space_routes.md`

### #3 - Banyak endpoint list memakai sort field langsung dari request

- Severity: P0
- Lokasi: contoh `app/Http/Controllers/RiskCategoryController.php:26`, `RiskRegisterKlinisController.php:74`.
- Gejala: `$query->orderBy($request->field, $request->direction)` tanpa whitelist kolom/direction.
- Dugaan penyebab: pola table sorting generik belum diberi whitelist server-side.
- Dampak: parameter sort yang tidak valid dapat menyebabkan SQL error; identifier injection perlu diaudit.
- Rekomendasi: task bertahap membuat whitelist per controller/list, mulai dari endpoint yang paling sering dipakai.
- Status: FIXED via `prompt/tasks/TASK_04_sanitize_sort_parameters.md`

### #4 - Delete risk register menghapus history audit

- Severity: P1
- Lokasi: `app/Http/Controllers/RiskRegisterKlinisController.php:609`, `RiskRegisterNonKlinisController.php:299`.
- Gejala: destroy menghapus FGD/RCA/history lalu menghapus risk register.
- Dugaan penyebab: cascade manual lama; padahal `RiskRegister` memakai SoftDeletes dan history dipakai audit.
- Dampak: audit trail perubahan risiko hilang, termasuk status/copy history.
- Rekomendasi: task khusus untuk kebijakan delete risk register dan verifikasi kebutuhan bisnis.
- Status: FIXED via `prompt/tasks/TASK_05_preserve_risk_register_history_on_delete.md`

### #5 - Model domain banyak memakai guarded kosong

- Severity: P2
- Lokasi: `app/Models/RiskRegister.php:15` dan model lain.
- Gejala: banyak model memakai `protected $guarded=[]`.
- Dugaan penyebab: pola CRUD cepat.
- Dampak: update berbasis request mentah lebih rawan jika validasi tidak lengkap.
- Rekomendasi: jangan ubah massal; saat menyentuh model/controller terkait, pastikan whitelist input jelas.
- Status: FIXED via `prompt/tasks/TASK_06_whitelist_risk_register_mass_assignment.md`

### #6 - Banyak file copy/debug lama tersisa

- Severity: P2
- Lokasi: contoh `resources/js/Pages/Dashboard copy.jsx`, `resources/js/Pages/Dashboard copy 2.jsx`, `app/Http/Controllers/OpsiPengendalianController - Copy.php`.
- Gejala: file copy tersimpan di source tree.
- Dugaan penyebab: backup manual saat development.
- Dampak: maintenance rawan salah edit/import dan hasil pencarian berisik.
- Rekomendasi: task cleanup terpisah setelah memastikan tidak ada route/import yang memakai file copy.
- Status: FIXED via `prompt/tasks/TASK_07_remove_stale_copy_files.md`
