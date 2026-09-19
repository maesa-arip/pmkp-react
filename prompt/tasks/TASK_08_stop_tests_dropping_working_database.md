# TASK 08 - STOP TESTS DROPPING THE WORKING DATABASE

| Field | Isi |
|-------|-----|
| ID | TASK_08 |
| Severity | P0 |
| Tipe | safety / test infrastructure |
| Status | DONE |
| Temuan | `prompt/docs/FINDINGS_LOG.md` #7 |

## Masalah

`php artisan test` menghapus seluruh tabel database kerja `dev_simdalin`.

`phpunit.xml` mengomentari `DB_CONNECTION` dan `DB_DATABASE`, sehingga test
memakai koneksi dari `.env`. Tujuh test scaffold Laravel Breeze memakai trait
`RefreshDatabase` yang menjalankan `migrate:fresh` - drop semua tabel, lalu
migrate ulang dari nol.

Yang membuatnya berbahaya: `CLAUDE.md`, `prompt/MASTER_PROMPT.md`, dan
`prompt/AUDIT_CHECKLIST.md` semuanya memerintahkan menjalankan `php artisan test`
sebagai baseline di setiap sesi. Mengikuti instruksi dokumen sendiri akan
menghancurkan data kerja.

## Root Cause

Dua konvensi test hidup berdampingan di repo ini:

- 15 test yang ditulis tim memakai `DatabaseTransactions`. Test ini sengaja
  berjalan di atas data nyata `dev_simdalin` dan me-rollback perubahannya.
  Contoh `tests/Feature/MutuYearFilterTest.php:22` memakai
  `MutuUnit::whereHas('mutu_indikator')->firstOrFail()` - butuh data existing.
- 7 sisa scaffold Breeze masih memakai `RefreshDatabase` bawaan Laravel, yang
  mengasumsikan database test terpisah dan sekali pakai.

Karena keduanya menunjuk database yang sama, trait kedua menghancurkan basis
kerja trait pertama.

## Perubahan

- `tests/TestCase.php` - menambahkan guard `guardAgainstDestructiveDatabaseTraits()`
  yang dipanggil SEBELUM `parent::setUp()`, karena `parent::setUp()` yang
  menjalankan hook trait. Guard melempar `RuntimeException` bila sebuah test
  memakai `RefreshDatabase` atau `DatabaseMigrations`. Escape hatch tersedia
  lewat `ALLOW_DESTRUCTIVE_DATABASE_TESTS=true` di `phpunit.xml` bila suatu saat
  database test terpisah benar-benar disiapkan.
- Mengganti `RefreshDatabase` menjadi `DatabaseTransactions` pada 7 file, mengikuti
  konvensi dominan repo:
  - `tests/Feature/Auth/AuthenticationTest.php`
  - `tests/Feature/Auth/EmailVerificationTest.php`
  - `tests/Feature/Auth/PasswordConfirmationTest.php`
  - `tests/Feature/Auth/PasswordResetTest.php`
  - `tests/Feature/Auth/PasswordUpdateTest.php`
  - `tests/Feature/Auth/RegistrationTest.php`
  - `tests/Feature/ProfileTest.php`

Diff per file test hanya 2 baris: import dan pemakaian trait.

`phpunit.xml` sengaja TIDAK diubah. Mengarahkan test ke database kosong akan
mematahkan 15 test tim yang memang dirancang sebagai integration test di atas
data nyata.

## Verifikasi

Snapshot database sebelum dan sesudah menjalankan suite penuh:

```
TABLES_BEFORE=81   USERS=107   RISK=1246
TABLES_AFTER =81   USERS=107   RISK=1246
```

Logika guard diuji terpisah tanpa menyentuh database (kelas tiruan untuk tiap
trait), karena menguji guard dengan benar-benar menjalankan test `RefreshDatabase`
berarti mempertaruhkan database bila guard cacat:

```
RefreshDatabase        blocked=true  expected=true  PASS
DatabaseMigrations     blocked=true  expected=true  PASS
DatabaseTransactions   blocked=false expected=false PASS
```

Test yang sebelumnya merusak, sekarang lulus:

```
php artisan test tests/Feature/Auth tests/Feature/ProfileTest.php
Tests: 17 passed
```

Suite penuh:

```
php artisan test
Tests: 6 failed, 133 passed
Time: 201.25s
```

Bandingkan baseline lama yang tercatat: 23 failed, 1 passed. Angka lama itu
memang hasil database yang sudah di-drop di tengah run.

## Sisa Kegagalan (bukan disebabkan task ini)

6 kegagalan tersisa, semuanya karena temuan lain yang masih terbuka:

- `ExampleTest` - `GET /` mengembalikan 302, bukan 200. Ini temuan #2 (route
  trailing space) dan sudah tercatat di `ARCHITECTURE_MAP.md`.
- `CascadingFeaturesTest`, `IkpRiskLinkTest` (3 test), `MutuYearFilterTest` -
  bergantung pada baris data tertentu di `dev_simdalin` yang tidak ada di
  database ini. Dicatat sebagai temuan #13.
- `PreloadResponseHeadersTest`.

## Risiko Sisa

- Test tetap berjalan di atas `dev_simdalin`. `DatabaseTransactions` me-rollback
  perubahan, tetapi test yang sengaja melakukan `commit` atau memakai koneksi
  kedua tidak akan ter-rollback. Saat ini tidak ada test seperti itu.
- Guard hanya menangkap dua trait bawaan Laravel. Kode yang memanggil
  `Artisan::call('migrate:fresh')` langsung di dalam test tidak tertangkap.
- Solusi tuntas jangka panjang tetap database test terpisah yang di-seed, tetapi
  itu butuh temuan #1 (migration tidak bisa jalan dari database kosong) beres
  lebih dulu.
