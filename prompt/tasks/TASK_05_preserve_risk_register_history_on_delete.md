# TASK 05 - Preserve Risk Register History On Delete

## Tujuan

Memastikan penghapusan register risiko tidak ikut menghapus audit trail di
`risk_register_histories`.

## Perubahan

- Menghapus pemanggilan `RiskRegisterHistory::where(...)->delete()` dari
  `RiskRegisterKlinisController::destroy`.
- Menghapus pemanggilan `RiskRegisterHistory::where(...)->delete()` dari
  `RiskRegisterNonKlinisController::destroy`.
- Relasi operasional FGD tetap dihapus seperti sebelumnya.
- `RiskRegister` tetap dihapus lewat model, sehingga mengikuti konfigurasi
  `SoftDeletes`.

## Verifikasi

- `php artisan test` - 27 passed.

## Catatan

Perubahan ini mempertahankan perilaku hapus yang sudah ada untuk data turunan
operasional, tetapi menjaga history sebagai audit trail. Bila bisnis ingin
mencatat event delete secara eksplisit, tambahkan event history baru pada task
terpisah agar label/event-nya disepakati.
