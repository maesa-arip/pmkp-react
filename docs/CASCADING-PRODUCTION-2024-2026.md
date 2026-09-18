# Panduan production: cascading 2024–2026

## Instruksi pengguna yang disimpan

Pada 17 September 2026 pengguna meminta agar pekerjaan cascading ini diingat untuk dieksekusi di production ketika diminta nanti. Permintaan mengingat ini hanya menyimpan panduan, bukan menjalankan perubahan production sekarang.

Acuan terbaru adalah **2024–2026**, menggantikan rencana 2027 pada percakapan/dokumen sebelumnya. Hasil penerapan lokal ada di [CASCADING-2024-2026.md](CASCADING-2024-2026.md).

## Hasil yang diminta

| Tahun | Sumber | Status akhir |
| --- | --- | --- |
| 2024 | Salinan master lama yang ada di database production sebelum persiapan | ditutup / arsip |
| 2025 | Salinan dari sumber yang sama, isinya identik dengan 2024 | ditutup / arsip |
| 2026 | docs/CASCADING.xlsx | aktif |

Struktur baru 2026:
- indikator_fitur1s = 3 IKU Direktur.
- indikator_fitur2s = 9 kegiatan Wadir.
- indikator_fitur3s = 19 kegiatan Kabag/Kabid.
- indikator_fitur4s = 325 indikator mutu unit/KATIM; induknya fitur 3.
- indikator_kinerjas = 58 indikator kinerja (18 Wadir dan 40 Kabag/Kabid), terhubung ke fitur 2 atau fitur 3.
- 2 sasaran di atas 3 IKU; seluruh rincian workbook berjumlah 438 konsep.

Lima sheet sumber: cascading, direktur, ASD (nama tab memiliki satu spasi akhir), PELAYANAN, PENUNJANG. Hash sumber yang diuji:
25fc54c8581e38592648a4f49c10978528ed883b35efba0801a5963243bfdab2.

Warna abu-abu, kuning dan pink menentukan jalur IKU. Dua warna ungu pada PELAYANAN!D17 dan PENUNJANG!C20 sudah disetujui mengikuti abu-abu pada sheet cascading. Warna berbeda lainnya tidak boleh ditebak.

## Batas perubahan yang disetujui

Tabel yang boleh ditulis untuk pekerjaan cascading ini:
- periode_kinerjas
- sasaran_strategis
- indikator_fitur1s, indikator_fitur2s, indikator_fitur3s, indikator_fitur4s
- indikator_kinerjas
- kinerja_penanggung_jawabs
- kinerja_penanggung_jawab_units (hanya hubungan unit yang jelas dari sumber)
- cascading_concepts
- cascading_workbook_templates
- cascading_exports
- activity_log

Baris master sumber tanpa periode harus dipertahankan beserta ID, isi, lineage dan timestamp asalnya. Buat salinan dengan ID serta hubungan induk per tahun. Penanggung jawab dihubungkan berdasarkan nama PIC/jabatan yang cocok, bukan memakai ID hasil lokal.

Data transaksi risk_registers, mutu_indikators, mutu_units dan tabel lain berada di luar cakupan. Pemindahan tahun transaksi bukan bagian pekerjaan ini. Jangan menyalin seluruh database lokal untuk menggantikan database production.

## Pemeriksaan sebelum eksekusi

1. Baca panduan deployment dan pastikan host, folder checkout, koneksi database, serta commit yang akan dipakai benar. Jangan mencetak kredensial.
2. Periksa database production secara read-only. Jangan menganggap kondisinya identik dengan lokal.
3. Periksa status migrasi dan kolom yang diperlukan. Jangan menjalankan seluruh migrasi tertunda secara buta; migrasi yang mengubah tabel transaksi harus dipisahkan dari cakupan cascading.
4. Pastikan command dan service berikut beserta dependensinya sudah ada pada rilis:
   - app/Console/Commands/PrepareCascadingYears.php
   - app/Services/CascadingYearsPreparation.php
   - service impor workbook, konsep, penyelarasan fitur dan ekspor
   - config/cascading.php serta docs/CASCADING.xlsx
   - tampilan yang membedakan feature_schema_version 1 dan 2.
5. Pastikan workbook masih sama dengan sumber yang diuji. Jika berubah, baca ulang dan rekonsiliasi; jangan mengasumsikan jumlah/relasi tetap sama.
6. Buat cadangan lengkap database production yang dapat dipulihkan, simpan di lokasi privat, dan catat checksum serta baseline jumlah/sidik isi tabel. Gunakan alat cadangan pada server; helper lokal memakai path Windows dan bukan skrip production portabel.
7. Lakukan dalam jendela maintenance yang sesuai agar tidak ada transaksi paralel selama penyalinan dan audit.

### Prasyarat command saat ini

Command sengaja khusus untuk kondisi awal yang telah diuji:
- periode_kinerjas kosong;
- kinerja_penanggung_jawabs, kinerja_penanggung_jawab_units, cascading_concepts, cascading_workbook_templates, indikator_kinerjas kosong;
- sumber tanpa periode: 10 sasaran, 4 fitur 1, 25 fitur 2, 55 fitur 3, 571 fitur 4, 0 fitur 04;
- PIC 11 jabatan tersedia dengan nama yang sesuai;
- sasaran tanpa induk yang ditemukan pada sumber lokal: ID 6, 9, 10, 12.

Pengguna menyetujui empat sasaran tersebut menjadi akar pada salinan 2024/2025, sementara hubungan asal dicatat dalam reconstruction_notes dan sumber tetap utuh.

Jika prasyarat production berbeda, rekonsiliasi kondisi sebenarnya dan sesuaikan rencana/implementasi dalam cakupan yang diminta. **Jangan mengosongkan tabel, menghapus periode, atau melewati pemeriksaan untuk memaksa command berjalan.** Identifikasi sasaran production berdasarkan data sebenarnya; jangan menganggap ID lokal berlaku di server.

## Pelaksanaan ketika pengguna meminta eksekusi production

Dari folder aplikasi yang sudah diverifikasi:

```bash
php artisan cascading:prepare-2024-2026
```

Tanpa --apply, persiapan dijalankan dalam transaksi yang di-rollback. Ini bukan kueri read-only: counter AUTO_INCREMENT dapat maju dan file cadangan impor dapat dibuat. Jalankan setelah backup, dalam lingkungan/jendela yang telah disiapkan.

Jika hasil uji cocok dengan cakupan yang diminta:

```bash
php artisan cascading:prepare-2024-2026 --apply --backup=/path/privat/cadangan-production.sql
```

Ganti path contoh dengan cadangan production yang sudah diverifikasi. Command hanya memeriksa keberadaan dan ukuran minimum file; keberhasilan backup harus diverifikasi tersendiri.

Penerapan bersifat satu kali. Command menolak pengulangan bila periode sudah ada. Sesudah berhasil, lakukan audit; jangan mengulang penerapan untuk sekadar mengecek hasil. ID periode, jabatan, indikator dan arsip di server boleh berbeda dari lokal.

## Pembaruan input Direktur (18 September 2026)

Baca juga [CASCADING-DIRECTOR-INPUT.md](CASCADING-DIRECTOR-INPUT.md). Ekspor baru versi 6 pada struktur fitur 2 menyusun bagian kegiatan/indikator Direktur dari database. Pemeriksaan kesamaan Excel di bawah merupakan baseline impor awal; setelah input diedit, bagian Direktur wajib cocok dengan input terbaru, termasuk tambahan baris, bukan disamakan kembali ke Excel sumber. Arsip lama tetap dipertahankan.

## Pemeriksaan sesudah penerapan

- 2024 dan 2025 ditutup; 2026 aktif.
- Isi kedua tahun historis sama dengan sumber; hubungan telah dipetakan ke ID tahun masing-masing.
- Sumber lama tanpa periode tidak berubah.
- Tidak ada hubungan fitur yang putus atau lintas tahun.
- Ekspor kedua tahun historis identik selain tahun judul.
- Ekspor 2026 cocok dengan 1.241 sel berisi data di lima sheet sumber, termasuk gaya, merge, lebar kolom dan tinggi baris; tahun judul menjadi 2026.
- Periksa halaman /kinerja untuk ketiga tahun, label historis, status baca-saja dan indikator kinerja pada kegiatan 2026.
- /MutuIndikator memilih kegiatan fitur 3 sebelum memilih/membuat fitur 4.
- Bandingkan seluruh tabel dengan baseline; hanya tabel dalam daftar perubahan yang boleh berbeda. Data transaksi tetap utuh.
- Simpan laporan hasil, path cadangan dan arsip ekspor production. Catatan ID lokal tidak menjadi target hard-coded.
- Jika gagal, baca keadaan transaksi dan audit sebelum mencoba lagi; pulihkan hanya melalui prosedur yang telah ditinjau untuk kondisi server.

## Keputusan yang masih terbuka

18 indikator dalam kelompok gabungan TIM KERJA PENDIDIKAN,PELATIHAN, PENELITIAN DAN KEPEGAWIAN sudah termasuk data dan ekspor. Master mempunyai dua tim terpisah. Pembagian akses belum diputuskan; jangan memberikan akses bersama atau membagi indikator secara asumsi. Gunakan keputusan terbaru pengguna bila sudah diberikan sebelum pelaksanaan production.
