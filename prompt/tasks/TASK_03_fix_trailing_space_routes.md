# TASK 03 - FIX TRAILING SPACE ROUTES

| Field | Isi |
|-------|-----|
| ID | TASK_03 |
| Severity | P1 |
| Tipe | bugfix |
| Status | REGRESSED - perubahan tidak ada di branch aktif (audit 2026-09-19) |

## Masalah

Empat route utama memiliki trailing space di path:

- `/ `
- `/dashboard `
- `/notifications `
- `/requeststatus `

## Root Cause

String path di `routes/web.php` berisi spasi sebelum quote penutup.

## Perubahan

`routes/web.php`:

- `'/ '` menjadi `'/'`
- `'/dashboard '` menjadi `'/dashboard'`
- `'/notifications '` menjadi `'/notifications'`
- `'/requeststatus '` menjadi `'/requeststatus'`

## Verifikasi

- `php artisan route:list --name=dashboard` menampilkan `GET|HEAD dashboard`.
- `php artisan test` lulus:

```
Tests: 24 passed
Time: 6.06s
```

## Risiko Sisa

Perubahan hanya menghapus whitespace typo pada path route. Link yang memakai
`route('dashboard')`, `route('notifications')`, atau `route('requeststatus')`
akan menghasilkan URL normal tanpa spasi.
