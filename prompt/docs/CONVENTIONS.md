# CONVENTIONS - SIMDALIN

Pola yang wajib ditiru saat mengedit repo ini, diturunkan dari kode yang sudah
ada. Tujuannya agar perubahan baru menyatu dengan aplikasi existing.

## Backend

| Aspek | Konvensi repo ini | Contoh file |
|-------|-------------------|-------------|
| Layering | Controller langsung berisi query Eloquent, validasi, update model, lalu return Inertia/back; belum ada service layer dominan | `app/Http/Controllers/RiskCategoryController.php`, `app/Http/Controllers/RiskRegisterKlinisController.php` |
| Validasi | Mayoritas inline `$request->validate(...)` atau `$this->validate(...)`; Form Request hanya terlihat pada Profile/Login scaffold | `RiskCategoryController.php`, `RiskRegisterKlinisController.php`, `app/Http/Requests/ProfileUpdateRequest.php` |
| Otorisasi | Route utama memakai `auth`; permission memakai Spatie `can()` inline untuk beberapa pembatasan data | `routes/web.php`, `app/Http/Controllers/RiskRegisterKlinisController.php`, `app/Models/User.php` |
| Format response | Halaman memakai `inertia()`/`Inertia::render`; operasi CRUD kembali `back()->with(['type'=>..., 'message'=>...])` | `RiskCategoryController.php`, `RiskRegisterKlinisController.php` |
| Resource pagination | List memakai Resource collection + `additional(['attributes'=>..., 'filtered'=>...])` + `fastPaginate(...)->withQueryString()` | `RiskCategoryController.php` |
| Relasi Eloquent | Method snake_case untuk banyak relasi lama, beberapa camelCase tambahan untuk kompatibilitas | `app/Models/RiskRegister.php` |
| Penamaan route | Resource name sering camelCase/PascalCase sesuai domain existing | `routes/web.php` |
| Status/enum | Status masih numeric/string langsung; history risk register punya konstanta event | `RiskRegisterKlinisController.php`, `app/Models/RiskRegisterHistory.php` |
| Delete | CRUD master langsung `$model->delete()` dan flash success | `RiskCategoryController.php` |

## Frontend

| Aspek | Konvensi repo ini | Contoh file |
|-------|-------------------|-------------|
| Framework | React 18 + Inertia, page resolver dari `resources/js/Pages/**/*.jsx` | `resources/js/app.jsx` |
| Layout | Page menetapkan `Index.layout = ...`; master data sederhana memakai `MasterDataIndex.layout` | `resources/js/Pages/Master/RiskCategory/Index.jsx`, `resources/js/Components/MasterDataIndex.jsx` |
| Pemanggilan API | Inertia router dan form helper, bukan REST client terpisah untuk page CRUD | `resources/js/Components/MasterDataIndex.jsx`, `resources/js/Pages/Master/RiskCategory/Create.jsx` |
| Loading/empty/error | Empty state terpusat di `MasterDataIndex`; error form lewat `InputError`; loading eksplisit belum seragam | `MasterDataIndex.jsx`, `resources/js/Components/InputError.jsx` |
| Form | Form menerima `errors`, `data`, `setData`, `submit`, `closeButton`; input memakai komponen existing | `resources/js/Pages/Master/RiskCategory/Form.jsx` |
| Modal | Create/Edit/Destroy memakai komponen modal existing | `resources/js/Components/Modal/AddModal.jsx`, `EditModal.jsx`, `DestroyModal.jsx` |
| Combobox | Opsi `ComboboxPage` boleh membawa `badge`; teks itu tampil sebagai chip di bawah nama dan ikut dicari. Pakai itu untuk keterangan tambahan (unit, penanggung jawab), jangan menempel ke `name` dengan strip. Setelah dipilih, tampilkan chip yang sama di bawah field karena input hanya memuat nama | `resources/js/Components/ComboboxPage.jsx`, `MUTU/MutuIndikator/Form.jsx`, `Components/RiskRegisterAnnualFields.jsx` |
| Notifikasi | Flash Laravel dibaca dari `usePage().props.flash`, tampil via `react-hot-toast` | `resources/js/Layouts/AuthenticatedLayout.jsx` |
| Warna/token | Tailwind utility dominan; warna modern di master data memakai slate/sky/cyan dan dark mode class | `MasterDataIndex.jsx`, `tailwind.config.js` |
| Icon | Heroicons dipakai pada komponen master data; Tabler juga tersedia di dependencies | `MasterDataIndex.jsx`, `package.json` |
| Tanggal | `dayjs` dan `moment` tersedia; cek file sekitar sebelum memilih | `package.json` |

## Git / Commit

Belum dipetakan dari history. Default untuk pekerjaan berikutnya: commit kecil
dan fokus per task bila user meminta commit.

## Anti-Pola Yang Ada Di Repo

- Route dengan trailing space pada `routes/web.php:80-83`.
- Sort field langsung dari request di banyak controller, misalnya
  `RiskCategoryController.php:26` dan `RiskRegisterKlinisController.php:74`.
- File copy tersisa (`Dashboard copy*.jsx`, `*Controller copy.php`) dapat
  membingungkan pencarian.
- Banyak model memakai `$guarded=[]`; jangan perluas mass assignment tanpa validasi.
- Banyak komentar/debug lama (`dd()` yang dikomentari) di controller besar.

## Keputusan Teknis Terkunci

- Jangan upgrade Laravel, React, Vite, Tailwind, Inertia, atau Spatie packages
  tanpa task khusus.
- Jangan ubah nama route/props Inertia tanpa memperbarui page frontend yang
  memakainya.
- Jangan ubah migration/schema risk register tanpa rencana migrasi data dari
  backup `database/backups`.
