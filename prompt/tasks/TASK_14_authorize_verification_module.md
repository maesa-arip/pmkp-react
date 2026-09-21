# TASK 14 - AUTHORIZE VERIFICATION/SUPERVISION MODULE

| Field | Isi |
|-------|-----|
| ID | TASK_14 |
| Severity | P2 |
| Tipe | security - missing authorization |
| Status | DONE |
| Temuan | `prompt/docs/FINDINGS_LOG.md` #33 |

## Masalah

`VerificationController` hanya dilindungi middleware `auth` di `routes/web.php`.
Kedelapan method-nya - 4 layar index dan 4 endpoint tulis - tidak memeriksa
permission, kepemilikan register, maupun policy. `VerificationController`
memvalidasi `keterangan` saja.

Pembatasan satu-satunya ada di frontend, dan itupun tidak lengkap:
`Sidebar.jsx` menggerbangi accordion "Verifikasi Berjalan" dengan
`lihat data verifikasi`, tetapi accordion "Verifikasi Prioritas" tidak
digerbangi sama sekali.

Akibatnya user unit mana pun bisa PUT `/verification/priority/admin` dengan
`id` register milik siapa pun - termasuk register miliknya sendiri - dan
menandatangani supervisinya sendiri. Supervisi seharusnya dikerjakan Admin
Risiko dan Level Manajemen, bukan pihak yang disupervisi.

Ditemukan saat menambahkan tombol Supervisi di drawer risk register, yang
memakai kembali kedua endpoint prioritas tersebut.

## Root Cause

Modul verifikasi ditulis pada fase ketika otorisasi masih diasumsikan cukup di
menu, pola yang sama dengan temuan #8 (modul akses). Controller yang ditulis
belakangan sudah memakai constructor middleware, misalnya
`CelahPengendalianController.php:13-23` dan `PeriodeKinerjaController.php:18`,
tetapi modul verifikasi tidak pernah ikut disusulkan.

## Perubahan

`app/Http/Controllers/VerificationController.php` - constructor middleware,
meniru persis pola TASK_09:

```php
public function __construct()
{
    $this->middleware(function ($request, $next) {
        $user = $request->user();
        abort_unless($user && ($user->hasRole('super admin')
            || $user->can('lihat data verifikasi')), 403);

        return $next($request);
    });
}
```

Nama permission diambil dari kode, bukan ditebak: `Sidebar.jsx` sudah memakai
`lihat data verifikasi` untuk menggerbangi "Verifikasi Berjalan"; permission itu
ada di DB (id 13) dan dipegang role `super admin` serta `Admin Manajemen Risiko`.
Fallback `hasRole('super admin')` disertakan dengan alasan yang sama seperti
TASK_09: mencabut permission dari role itu tidak boleh mengunci semua orang.

Validasi foreign key pada keempat method store, supaya baris verifikasi yatim
tidak bisa dibuat:

- `storeoccurringadmin` / `storeoccurringmanagement`:
  `'request_update_id' => ['required', 'exists:request_updates,id']`
- `storepriorityadmin` / `storeprioritymanagement`:
  `'id' => ['required', Rule::exists('risk_registers', 'id')->whereNull('deleted_at')]`
  (`whereNull` karena `RiskRegister` memakai SoftDeletes)

`resources/js/Layouts/Sidebar.jsx` - accordion "Verifikasi Prioritas"
digerbangi `lihat data verifikasi`, menyamakan dengan "Verifikasi Berjalan".

Diff controller: 24 insertions, 0 deletions. Pint sengaja TIDAK dijalankan pada
file itu karena akan ikut memformat ulang baris lama (urutan import, spasi
concat, trailing comma) di luar scope task.

## Verifikasi

```
php artisan test --filter=VerificationAuthorizationTest
Tests: 5 passed

php artisan test
Tests: 1 failed, 163 passed
```

Baseline sebelum task ini 158 passed; 5 tambahan adalah test baru. Satu-satunya
kegagalan adalah `ExampleTest` (temuan #2) yang memang selalu merah.

Test dibuktikan benar-benar menjaga celahnya: dengan `abort_unless` dinonaktifkan
sementara, 2 dari 5 test gagal (`user without the verification permission is
refused`, `the refused user can not supervise its own register`); setelah
dipulihkan, kelimanya hijau.

Cakupan `tests/Feature/VerificationAuthorizationTest.php`
(memakai `DatabaseTransactions` sesuai TASK_08):

- User tanpa permission ditolak 403 pada 4 layar index dan 4 endpoint tulis.
  Tiap endpoint ditulis eksplisit, tidak disampel, karena masing-masing
  menandatangani supervisi sebuah register.
- Skenario penyalahgunaan sesungguhnya: pemilik register mencoba menyupervisi
  registernya sendiri, lalu diperiksa bahwa tidak ada baris verifikasi yang
  bertambah.
- User dengan `lihat data verifikasi` tetap bisa membuka keempat layar.
- Super admin yang permission eksplisitnya dicabut tetap bisa masuk.
- Supervisi atas register yang tidak ada ditolak validasi.

`npm run build` sukses.

## Blast radius / risiko sisa

Hanya `super admin` (3 user) dan `Admin Manajemen Risiko` (1 user) yang memegang
`lihat data verifikasi`. 101 user role `PIC` kehilangan akses ke layar
Verifikasi Prioritas yang sebelumnya terbuka untuk semua - itu memang inti
celahnya, tetapi merupakan perubahan perilaku yang terlihat pengguna.
`verification_priority_admins` hanya berisi 2 baris dan
`verification_priority_management` kosong, jadi fiturnya nyaris belum terpakai.

Bila ternyata ada unit yang memang ditugaskan memverifikasi, solusinya memberi
mereka permission `lihat data verifikasi`, bukan mencabut gerbangnya.

Belum dikerjakan di sini: pemisahan permission baca vs tulis verifikasi. Saat ini
`lihat data verifikasi` memberi keduanya, konsisten dengan TASK_09 yang juga
memakai satu permission untuk baca dan tulis.

## Aman di-merge?

YA. Diff kecil dan terisolasi, tidak ada perubahan route, props Inertia, atau
skema DB. Uji manual yang disarankan: login sebagai user role `PIC`, pastikan
menu Verifikasi Prioritas hilang dan PUT langsung ke endpointnya menghasilkan
403; lalu login sebagai `Admin Manajemen Risiko` dan pastikan keempat layar serta
tombol Supervisi tetap berfungsi.
