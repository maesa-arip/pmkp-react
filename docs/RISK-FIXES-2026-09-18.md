# Perbaikan Risk Register Klinis dan Non Klinis — 18 September 2026

Enam temuan lanjutan RR-02 sampai RR-07 telah diperbaiki. Master Celah Pengendalian dan data yang telah diisi pengguna tidak diubah dalam pekerjaan ini.

## Perubahan

| Temuan | Perilaku setelah perbaikan |
| --- | --- |
| RR-02: kirim edit ganda | Tombol simpan dan batal terkunci selama request. Guard ref juga mencegah dua submit sebelum React selesai render. Setelah request selesai, termasuk gagal, guard dilepas dan tombol bisa digunakan kembali. Berlaku pada edit utama Klinis/Non Klinis, empat FGD, RCA, dan OSD Residual. |
| RR-03: Semua Unit gagal | Pilihan Semua Unit tetap tersedia. Nilai disimpan sebagai sentinel `[0]`, termasuk normalisasi payload campuran `0,1`. UI mengganti pilihan individual ketika Semua Unit dipilih. Cakupan indikator akun tetap diperiksa; pilihan ini tidak menambah izin edit. Daftar risiko menampilkan SEMUA UNIT. |
| RR-04: kronologi edit | Edit kategori insiden `risk_category_id=6` mewajibkan kronologi, sama seperti tambah. |
| RR-05: izin edit | Backend memeriksa hak edit sebelum validasi/perubahan record atau child. Super admin atau `edit data semua risk register` dapat mengedit. Permission `edit data risk register sesuai lokasi` dibatasi pada pemilik atau lokasi pemilik/PIC yang tersimpan. Permission lihat saja tidak mengizinkan edit. PIC Semua Unit tidak digunakan untuk memberikan akses edit ke semua akun. |
| RR-06: endpoint jenis lain | Endpoint utama Klinis hanya menerima `tipe_id=1`, Non Klinis hanya `tipe_id=2`; jenis tidak cocok menghasilkan 404. FGD/RCA/OSD yang memang dipakai bersama tetap menerima kedua jenis dengan pemeriksaan izin. |
| RR-07: FGD tersimpan sebagian | Semua nilai responden dan skor agregat divalidasi sebelum menulis. Penyimpanan responden dan register berada dalam satu transaksi dengan lock register. Gagal menyimpan register membatalkan perubahan responden, termasuk saat mengedit data yang sudah ada. |

Pengaman juga mencakup endpoint pengendalian/opsi pengendalian lama dan perubahan status yang bisa dipakai sebagai jalur alternatif untuk menulis register. Endpoint pengendalian lama khusus Klinis dibatasi jenis Klinis. Kebijakan permission diperiksa terhadap record yang sudah tersimpan, bukan `user_id` atau PIC pengganti dalam request.

Implementasi utama:

- `app/Http/Middleware/EnsureRiskRegisterWriteAccess.php` dan `app/Services/RiskRegisterWriteAccess.php`.
- `app/Http/Controllers/RiskRegisterKlinisController.php` dan `RiskRegisterNonKlinisController.php`.
- `app/Services/AnnualIndicatorService.php`.
- Delapan pasangan komponen Edit/Form pada `resources/js/Pages/RiskRegister/`.
- `resources/js/Components/ComboboxMultiple.jsx`: perilaku eksklusif Semua Unit diaktifkan khusus pada form risiko.

## Pengujian

- Audit backend: **65 test, 1.067 assertion, seluruhnya lulus**.
- Regresi risiko, master Celah Pengendalian, dan Mutu: **30 test, 254 assertion, seluruhnya lulus**.
- Total backend: **95 test / 1.321 assertion lulus**.
- Browser form utama: kedua edit mengirim tepat satu request ketika diklik dua kali selama pending; setelah selesai bisa mengirim lagi. Memilih unit individual lalu Semua Unit menghasilkan `0` saja. Tidak ada error JavaScript.
- Browser subform: 24 skenario pengisian awal/edit dari 6 subform × 2 jenis risiko; klik berulang saat pending ditahan, dan pengiriman setelah selesai kembali berfungsi.
- Pengujian backend mencakup sukses tambah/edit Semua Unit, penolakan indikator di luar cakupan akun, owner/lokasi/global editor yang sah, akun tanpa izin, akun hanya bisa melihat, manipulasi kepemilikan/PIC request, endpoint jenis salah, seluruh subform, dan jalur update alternatif.
- Delapan skenario FGD sengaja membuat penyimpanan register gagal setelah penulisan child; transaksi terbukti membatalkan perubahan data responden lama.

## Lingkungan dan batas verifikasi

Seluruh pengujian tulis dijalankan pada database QA terpisah `simdalin_qa_input_20260917_144352` menggunakan transaksi rollback. Tidak mengubah data master pengguna atau menjalankan perubahan database production. Perubahan ini tidak membutuhkan migration baru.

Browser menggunakan komponen React asli dengan transport Inertia fixture. Payload dikirim terpisah lewat route Laravel dalam test backend dan hasil database diperiksa. Ini belum pengujian login browser end-to-end terhadap jaringan/CSRF aplikasi berjalan.

Bukti lokal: `storage/app/risk-fixes-qa/audit.log`, `audit.xml`, `regression.log`, `regression.xml`, `browser-main.log`, `browser-subforms.log`, `build.log`.

Reproduksi audit tetap berada pada `tests/Audit/ScopedInputEditAuditTest.php` karena memakai fixture dan guard database QA. Assertion yang dahulu mereproduksi kegagalan kini harus lulus; Semua Unit diubah menjadi skenario berhasil sesuai instruksi pengguna.
Verifikasi akhir frontend: build client + SSR lulus. Regresi browser Celah Pengendalian, filter tahun/indikator, dan Mutu admin juga lulus; log masing-masing `browser-celah.log`, `browser-year.log`, dan `browser-mutu.log` tersedia pada folder bukti yang sama.
