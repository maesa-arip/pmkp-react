# PIC jabatan dan akses indikator risiko

Master jabatan kinerja dapat dihubungkan ke PIC yang sudah ada. ID pada
pics, users.pic_id, dan risk_registers.pic_id tetap dipertahankan.
Unit seperti Instalasi Farmasi tetap merupakan PIC unit.

## Pengaturan melalui /kinerja

1. Buka Master penanggung jawab, lalu Tambah/Edit jabatan.
2. Pilih PIC jabatan. Nama mengikuti PIC; perubahan nama dilakukan pada master PIC.
3. Pilih atasan langsung sesuai struktur organisasi.
4. Aktifkan "Izinkan PIC jabatan ini memakai indikator jabatan bawahan" jika diperlukan.
5. Pilih cakupan unit pelaksana. Boleh kosong untuk jabatan yang sudah terhubung ke PIC.
6. Pada indikator/sasaran/program/kegiatan, pilih jabatan penanggung jawab.

Akun yang terhubung ke PIC jabatan dapat memakai indikator fitur 4 milik jabatan
tersebut, termasuk turunan dari sasaran/program/kegiatan yang menjadi tanggung
jawabnya. Akses ke jabatan lain dalam struktur organisasi memerlukan izin
indikator bawahan pada jabatan akun. Cabang jabatan yang tidak aktif tidak
ditelusuri.

Pilihan indikator risiko mengikuti tahun tanggal register dan status indikator.
PIC unit tetap mendapat indikator yang mencakup lokasi unitnya. Indikator umum
legacy (location_id 0) tetap tersedia. Semua PIC yang dipilih dalam risiko harus
memenuhi cakupan indikator; pilihan form dan validasi server memakai layanan yang sama.

Pengaturan ini tidak memberi izin untuk melihat seluruh risk register.
Izin "lihat data semua risk register" yang sudah ada tetap berlaku.

## Riwayat

Perubahan master berlaku pada indikator periode draft/aktif. Snapshot risiko,
indikator periode ditutup, dan arsip ekspor tidak ditulis ulang. Indikator lama
di luar cakupan baru tetap ditampilkan pada edit risiko yang sudah memakainya;
pemilihan baru atau perubahan PIC/tahun harus lolos validasi cakupan saat ini.

## Penerapan

Jalankan migrasi 2026_09_14_120000_link_kinerja_positions_to_pics.php sebelum memakai
kode baru. Impor PIC dilakukan dengan ID yang telah diverifikasi, bukan menebak
jabatan dari nama unit:

    php artisan kinerja:link-pics --pic=1 --pic=2
    php artisan kinerja:link-pics --pic=1 --pic=2 --apply

Tanpa --apply hanya menampilkan pratinjau. Perintah dapat diulang; PIC yang sudah
terhubung tidak dibuat ulang. Nama yang sudah terhubung ke PIC lain ditolak.
Impor tidak menetapkan atasan, mengaktifkan akses bawahan, memilih unit pelaksana,
atau mengubah penanggung jawab indikator secara otomatis.

Pada database lokal dev_simdalin, PIC 1–11 telah diverifikasi sebagai Direktur,
tiga Wadir, tiga Kabag, dan empat Kabid. PIC duplikat lain tidak digabung atau dihapus.
