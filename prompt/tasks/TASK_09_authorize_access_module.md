# TASK 09 - AUTHORIZE USER/ROLE/PERMISSION MODULE

| Field | Isi |
|-------|-----|
| ID | TASK_09 |
| Severity | P0 |
| Tipe | security - privilege escalation |
| Status | DONE |
| Temuan | `prompt/docs/FINDINGS_LOG.md` #8 |

## Masalah

`UserController`, `RoleController`, dan `PermissionController` hanya dilindungi
middleware `auth`. Tidak ada `can()`, `authorize()`, policy, maupun `can:` pada
route. Pembatasan satu-satunya ada di frontend:
`resources/js/Layouts/Sidebar.jsx:51` menyembunyikan menu "Akses Sistem" bila
user tidak punya `atur hak akses` - dan menyembunyikan menu bukan otorisasi.

Akibatnya user terautentikasi mana pun bisa POST `/roles` dengan daftar seluruh
permission, menugaskannya ke dirinya sendiri, lalu memegang seluruh aplikasi.

Status penerapan di server deploy dicatat di luar repo - lihat bagian "Temuan
Server Deploy" pada `prompt/docs/FINDINGS_LOG.md`.

## Root Cause

Modul akses dibangun pada fase awal ketika otorisasi masih diasumsikan cukup di
menu. Controller yang ditulis belakangan sudah memakai constructor middleware,
misalnya `PeriodeKinerjaController.php:18` dan `CelahPengendalianController.php:13`,
tetapi modul akses tidak pernah ikut disusulkan.

## Perubahan

Constructor middleware pada tiga controller, meniru persis pola
`CelahPengendalianController.php:13-23`:

```php
public function __construct()
{
    $this->middleware(function ($request, $next) {
        $user = $request->user();
        abort_unless($user && ($user->hasRole('super admin')
            || $user->can('atur hak akses')), 403);

        return $next($request);
    });
}
```

- `app/Http/Controllers/UserController.php`
- `app/Http/Controllers/RoleController.php`
- `app/Http/Controllers/PermissionController.php`

Nama permission `atur hak akses` diambil dari frontend, bukan ditebak:
`Sidebar.jsx:51` memakainya untuk menggerbangi ketiga menu tersebut. Permission
itu ada di database (id 11) dan dipegang role `super admin`.

Fallback `hasRole('super admin')` sengaja disertakan. Tanpa itu, mencabut
`atur hak akses` dari role super admin akan mengunci semua orang dari modul
akses secara permanen - pemulihannya hanya lewat tinker atau SQL langsung.

Test baru: `tests/Feature/AccessModuleAuthorizationTest.php`, memakai
`DatabaseTransactions` sesuai TASK_08.

## Verifikasi

```
php artisan test tests/Feature/AccessModuleAuthorizationTest.php
Tests: 4 passed
```

Cakupan test:

- User tanpa permission ditolak 403 pada 3 endpoint index dan 6 endpoint tulis
  (`users.store/update/destroy`, `roles.store/update`, `permissions.store`).
  Setiap verb ditulis eksplisit, tidak disampel, karena masing-masing bisa
  menyerahkan seluruh aplikasi.
- Skenario eskalasi sesungguhnya: user tersebut POST `roles.store` dengan
  seluruh permission, lalu diperiksa bahwa jumlah role tidak berubah, role
  tidak terbentuk, dan user tetap tidak punya `atur hak akses`.
- User yang memegang permission tetap dapat 200.
- Super admin tanpa permission eksplisit tetap dapat 200 - membuktikan fallback
  role berfungsi.

Suite penuh, dibandingkan baseline TASK_08:

```
Sebelum : 6 failed, 133 passed
Sesudah : 6 failed, 137 passed
```

Empat tambahan adalah test baru ini; tidak ada kegagalan baru.

Database bersih setelah run - rollback terverifikasi:
role `super admin` tetap memegang `atur hak akses`, 8 role, 107 user, tidak ada
role sisa test.

### Catatan teknis test

Simulasi "super admin tanpa permission" tidak bisa memakai
`Gate::before(fn () => false)` seperti `MutuIndicatorAdminAccessTest`. Spatie
mendaftarkan `Gate::before` miliknya sendiri lebih dulu; ketika user benar-benar
memegang permission, callback Spatie mengembalikan `true` dan memutus rantai
sebelum callback test dijalankan. Karena itu test mencabut permission dari role
untuk sementara lalu memanggil `PermissionRegistrar::forgetCachedPermissions()`,
dan transaksi mengembalikannya.

### Pint

Ketiga controller gagal `vendor/bin/pint --test`, tetapi kegagalan itu sudah ada
sebelum perubahan ini - diverifikasi dengan menjalankan pint pada versi `HEAD`
di direktori terpisah, hasilnya rule yang sama persis. Menjalankan pint akan
mereformat seluruh file dan melanggar aturan diff minimal. File test baru lulus
pint.

## Blast Radius

- Menu "Akses Sistem" sudah tersembunyi dari non-pemegang permission, jadi tidak
  ada alur sah yang berubah bagi pengguna biasa.
- `resources/js/Pages/Casemix/Create.jsx` dan `Edit.jsx` memanggil `users.store`
  dan `users.update`, tetapi route `casemix` dikomentari di `routes/web.php:97`
  sehingga halaman itu tidak terjangkau.
- `AuthenticatedLayout.jsx` memuat link `users.index` tanpa gerbang, tetapi
  seluruh blok `<nav>` tersebut dikomentari - kode mati.

## Risiko Sisa

- Status penerapan di server deploy dicatat di luar repo. Ini item paling
  mendesak di backlog.
- Guard ini melindungi modul akses saja. Controller lain yang belum punya
  otorisasi tetap terbuka; hanya 20 dari 73 controller memiliki pemeriksaan
  apa pun (lihat temuan #3 dan audit awal).
- `atur hak akses` adalah gerbang tunggal untuk ketiga modul. Tidak ada pemisahan
  antara "lihat daftar user" dan "ubah role". Bila nanti diperlukan pemisahan,
  itu task tersendiri.
