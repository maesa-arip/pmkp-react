# TASK 06 - Whitelist Risk Register Mass Assignment

## Tujuan

Mengurangi risiko mass assignment pada `RiskRegister` tanpa mengubah perilaku
form risk register klinis/non-klinis.

## Perubahan

- Mengganti `protected $guarded = []` pada `RiskRegister` dengan `protected
  $fillable`.
- Menambahkan `RiskRegister::FORM_FIELDS` sebagai daftar field yang boleh
  diisi dari form risk register.
- Mengubah `RiskRegisterKlinisController::store` dan
  `RiskRegisterNonKlinisController::store` agar hanya mengirim field form plus
  field server-side (`user_id`, `tipe_id`) ke `RiskRegister::create`.
- Mengubah `RiskRegisterKlinisController::update` dan
  `RiskRegisterNonKlinisController::update` agar tidak lagi memakai request
  mentah lewat `except`.

## Verifikasi

- `php artisan test` - 27 passed.

## Catatan

Perbaikan ini sengaja dimulai dari `RiskRegister`, sesuai finding audit. Model
lain yang masih memakai `$guarded = []` bisa ditangani bertahap saat controller
terkait disentuh, supaya blast radius tetap kecil.
