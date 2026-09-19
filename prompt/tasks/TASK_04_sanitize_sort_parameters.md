# TASK 04 - SANITIZE SORT PARAMETERS

| Field | Isi |
|-------|-----|
| ID | TASK_04 |
| Severity | P0 |
| Tipe | security hardening |
| Status | REGRESSED - perubahan tidak ada di branch aktif (audit 2026-09-19) |

## Masalah

Banyak endpoint list memanggil `orderBy($request->field, $request->direction)`
langsung dari request. Parameter sort yang dimanipulasi dapat memicu SQL error
dan membuka risiko identifier/order injection.

## Root Cause

Pola sorting frontend generik mengirim `field` dan `direction`, tetapi backend
belum memiliki guard terpusat sebelum controller memakai nilai tersebut.

## Perubahan

- Menambahkan `app/Http/Middleware/SanitizeSortParameters.php`.
- Mendaftarkan middleware tersebut di group `web` pada `app/Http/Kernel.php`.
- Menambahkan `tests/Unit/SanitizeSortParametersTest.php`.

Middleware hanya mengizinkan:

- `field` berbentuk identifier kolom sederhana, termasuk satu segmen dot seperti
  `users.name`.
- `direction` bernilai `asc` atau `desc`, dan dinormalisasi lowercase.

Jika salah satu tidak valid, `field` dan `direction` dibuang dari request sehingga
controller tidak menjalankan `orderBy` dari input tersebut.

## Verifikasi

- `php artisan test tests\Unit\SanitizeSortParametersTest.php` lulus:

```
Tests: 3 passed
```

- `php artisan test` lulus:

```
Tests: 27 passed
Time: 5.54s
```

## Risiko Sisa

Ini hardening terpusat dengan allowlist bentuk identifier dan direction. Untuk
kontrol paling ketat per resource, controller masih bisa ditingkatkan lagi dengan
whitelist kolom spesifik per halaman pada task terpisah.
