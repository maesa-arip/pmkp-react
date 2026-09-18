# Master Celah Pengendalian

Tersedia melalui **Data Master → Celah Pengendalian**, route `/celahPengendalians`.

- Tambah, edit, pencarian, pengurutan, pagination, hapus, dan status aktif/nonaktif.
- Pengelolaan memerlukan role `super admin` atau permission `atur data master manajemen risiko` / `edit data master manajemen risiko`. Akun `adminmr@rsbm.com` memiliki permission edit master.
- Pilihan aktif digunakan oleh form tambah/edit Risk Register Klinis dan Non Klinis. Nilai selain master aktif ditolak untuk pilihan baru.
- Nilai celah pada register tetap disimpan sebagai teks historis. Mengganti nama/nonaktifkan master tidak mengubah isi register lama. Saat edit, nilai lama tetap dapat dipertahankan atau diganti dengan pilihan aktif.
- Master yang namanya sedang digunakan pada register (termasuk yang soft-deleted) tidak dapat dihapus; nonaktifkan melalui Edit.
- Migration mengimpor nama celah yang sudah ada pada register, tanpa mengubah register. Tidak ada daftar contoh yang otomatis ditambahkan.

## Aktivasi

Migration khusus: `database/migrations/2026_09_18_000000_create_celah_pengendalians_table.php`.

Sudah diterapkan ke database lokal `dev_simdalin` pada 18 September 2026. Data master awal kosong karena tidak ada nilai celah lama di database lokal. Pengguna dapat menambahkan pilihan melalui menu master.

Belum diterapkan ke production. Pada deployment, jalankan migration sebelum melayani kode baru:

```sh
php artisan migrate --path=database/migrations/2026_09_18_000000_create_celah_pengendalians_table.php --force
```

## Verifikasi

- Database QA terpisah: 30 test / 254 assertion lulus (`CelahPengendalianTest`, `RiskRegisterInputTest`, `MutuIndicatorAdminAccessTest`, `MutuIndicatorPenyebutTest`).
- Browser fixture: daftar master, modal tambah/edit, nama/keterangan/status, pencegahan simpan ganda, mobile dark, dropdown tambah/edit kedua jenis risiko, nilai historis, ganti/hapus pilihan, dan panduan master kosong lulus.
- `npm run build` client dan SSR lulus.
- Bukti lokal: `storage/app/celah-master-qa/backend.log`, `backend.xml`, `browser.log`, `build.log`, dan screenshot.
- Browser memakai komponen asli dengan transport Inertia fixture. Penyimpanan sesungguhnya diverifikasi lewat route Laravel dan database QA; belum pengujian login browser end-to-end.

Test browser: `node tests/Browser/celah-pengendalian.cjs`. Memerlukan fixture risiko dari `tests/Audit/export-risk-fixtures.php` pada salinan QA.

Perubahan ini menyelesaikan RR-01 pada laporan audit 18 September 2026. Temuan audit lainnya tidak dinyatakan selesai oleh perubahan ini.