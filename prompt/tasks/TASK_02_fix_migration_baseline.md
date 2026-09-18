# TASK 02 - FIX MIGRATION/TEST BASELINE

| Field | Isi |
|-------|-----|
| ID | TASK_02 |
| Severity | P1 |
| Tipe | bugfix |
| Status | DONE |

## Masalah

`php artisan test` baseline gagal dari fresh database. Error awal:
`Failed to open the referenced table 'risk_registers'` ketika migration
`fgd_actuals` menambahkan foreign key ke `risk_registers`.

## Root Cause

- Migration lama pembuat tabel inti berada di subfolder `database/migrations/done`
  dan `database/migrations/ikp`, tidak ikut urutan top-level migration normal.
- Beberapa migration lama memiliki dependency timestamp yang tidak sesuai, misalnya
  `risk_registers` membutuhkan `indikator_fitur04s`.
- Schema lama belum selaras dengan migration/kode baru: `username` wajib, beberapa
  kolom `risk_gradings` belum ada, dan `risk_registers` belum punya kolom yang
  dipakai model/middleware.
- Test scaffold `ExampleTest` masih mengharapkan `/` publik 200, padahal SIMDALIN
  mengarahkan guest ke login.

## Perubahan

- `database/migrations/2023_01_01_000000_run_archived_migrations.php`
  menjalankan migration archived sebelum migration aktif.
- `database/migrations/done/2023_02_04_154257_create_risk_registers_table.php`
  menambahkan kolom `kode_risiko`, `currently_id`, dan `deleted_at`.
- `database/migrations/done/2023_02_12_123351_add_username_field_in_users_table.php`
  membuat `username` nullable agar sesuai controller register/factory.
- `database/migrations/2026_05_26_064429_add_per_type_colors_to_risk_gradings_table.php`
  menambahkan kolom nama grading dasar yang dipakai migration/kode berikutnya.
- `database/migrations/2026_05_26_151000_add_copy_metadata_to_risk_registers_table.php`
  memakai fallback `after('target_waktu')` bila `pihak_terkena` belum ada.
- `tests/Feature/ExampleTest.php` mengharapkan redirect guest ke `/login`.

## Verifikasi

`php artisan test` lulus:

```
Tests: 24 passed
Time: 5.67s
```

## Risiko Sisa

Fresh test sudah hijau, tetapi schema migration lama masih perlu audit lanjutan
terhadap backup produksi karena ada indikasi kolom yang dipakai kode tidak selalu
terwakili lengkap di migration historis.
