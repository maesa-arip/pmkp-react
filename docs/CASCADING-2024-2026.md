# Cascading 2024, 2025, dan 2026

Diterapkan 17 September 2026 setelah database dikembalikan ke master lama. Pengguna menyetujui daftar tabel, status periode dan penanganan empat sasaran tanpa induk sebelum penerapan.

## Hasil

| Tahun | ID periode | Status | Sasaran | Fitur 1 | Fitur 2 | Fitur 3 | Fitur 4 | Indikator kinerja terpisah |
| --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 2024 | 354 | ditutup | 10 | 4 | 25 | 55 | 571 | 0 |
| 2025 | 355 | ditutup | 10 | 4 | 25 | 55 | 571 | 0 |
| 2026 | 356 | aktif | 2 | 3 | 9 | 19 | 325 | 58 |

2024 dan 2025 merupakan salinan isi master tanpa periode. Relasi di setiap salinan menggunakan ID pada tahun masing-masing. Seluruh kolom isi, termasuk uraian, tujuan, kode dan unit, dicocokkan dengan sumber. Baris sumber asli tidak diubah, termasuk lineage dan timestamp-nya.

Sasaran sumber ID 6, 9, 10 dan 12 memiliki induk yang sudah tidak tersedia. Pada kedua salinan, sasaran ini menjadi akar. ID induk lama dicatat dalam reconstruction_notes. Nama dan isi sasaran dipertahankan.

2026 menggunakan docs/CASCADING.xlsx, SHA-256 25fc54c8581e38592648a4f49c10978528ed883b35efba0801a5963243bfdab2. Struktur fitur mengikuti kesepakatan: IKU Direktur → kegiatan Wadir → kegiatan Kabag/Kabid → indikator mutu unit/KATIM. Indikator kinerja Wadir dan Kabag/Kabid melekat pada kegiatannya melalui indikator_kinerjas.

Master 11 jabatan dihubungkan dengan PIC yang namanya sama. Tidak ada relasi unit tambahan yang dapat diturunkan dari jabatan pada master lama, sehingga kinerja_penanggung_jawab_units tetap kosong. Akses tim pada indikator mutu 2026 mengikuti pemetaan nama tim pada sumber.

## Batas cakupan

- Transaksi risk_registers, mutu_indikators, mutu_units dan tabel di luar daftar persetujuan tetap sama.
- Data transaksi lama tetap belum dipetakan ke periode; pekerjaan ini menyiapkan cascading.
- 18 indikator kelompok gabungan Pendidikan/Pelatihan/Penelitian dan Kepegawaian sudah tersimpan serta diekspor. Pembagian akses kepada dua tim yang terpisah masih menunggu keputusan pengguna. Tidak diberikan akses bersama secara otomatis.
- Metadata tahun 2027 pada dokumen pekerjaan sebelumnya merupakan riwayat sebelum pemulihan database. Periode aktif saat ini adalah 2026.

## Cadangan dan hasil ekspor

Direktori:
storage/app/cascading-template-qa/annual-2024-2026-20260917-041518/

- before.sql: cadangan lengkap 80 tabel, 9.560.185 byte.
- SHA-256 cadangan: d7f63a6dda8d74df5d509ce2dbe5130bcb4172f6bfad9b407d0d1df2e854a333.
- Cascading-2024.xlsx: arsip 76, template versi 3.
- Cascading-2025.xlsx: arsip 77, template versi 3.
- Cascading-2026.xlsx: arsip 78, template versi 5.
- baseline.json dan audit.json: pemeriksaan sidik isi tabel sebelum/sesudah.
- export-verification.json: hasil pencocokan ekspor.

## Verifikasi

- Uji persiapan penuh dalam transaksi rollback berhasil sebelum penerapan permanen.
- Salinan database 2024 dan 2025 cocok dengan sumber, dengan pengecualian metadata versi dan relasi yang disetujui.
- Ekspor historis memuat seluruh 655 baris fitur per tahun. 2.788 koordinat sel yang diperiksa identik selain tahun judul. Baris baru CRLF dari database dinormalisasi menjadi LF oleh format Excel.
- Ekspor 2026 memuat lima sheet sumber; 1.241 sel berisi data beserta gaya, penggabungan sel, lebar kolom dan tinggi baris cocok. Judul menggunakan tahun 2026.
- Tidak ada relasi fitur yang terputus atau lintas tahun.
- Audit 80 tabel memastikan hanya tabel yang disetujui berubah. Sumber tanpa tahun dan data transaksi tetap identik.
- Pemeriksaan props controller dan browser memakai data aktual tiga tahun berhasil. Label historis mengikuti struktur lama; kontrol edit tidak tersedia pada periode ditutup.
- Build React/Vite berhasil.

## Perintah penerapan

php artisan cascading:prepare-2024-2026

Tanpa --apply, perintah menjalankan persiapan dan membatalkan transaksinya. Penerapan membutuhkan --apply dan --backup dengan path cadangan SQL. Perintah menolak pengulangan jika periode sudah tersedia agar tidak menggandakan data. Tidak menjalankan ulang perintah setelah penerapan ini.
