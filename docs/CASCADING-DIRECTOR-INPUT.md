# Input kegiatan dan indikator kinerja Direktur

Perubahan lokal 18 September 2026:

- Admin: Indikator Tahunan & Cascading > Fitur 1–4 > IKU Direktur (fitur 1). Pengelolaan kegiatan dan indikator Direktur berada di bawah daftar IKU.
- Pengguna Direktur: menu Kinerja Kegiatan. Akses mengikuti PIC pada penanggung jawab IKU aktif; tidak diberikan berdasarkan nama akun.
- Tambah/edit kegiatan dengan IKU induk dan tambah/edit indikator dengan kegiatan induk pada periode draft/aktif. Periode ditutup tetap baca saja.
- Data Direktur menggunakan cascading_concepts, termasuk enam baris yang sudah diimpor. Tidak ada impor ulang atau penghapusan data lama.
- Ekspor baru untuk struktur fitur 2 memakai template_version 6. Bagian kegiatan/indikator sheet direktur dibersihkan dan disusun ulang dari snapshot database, termasuk input baru, perubahan induk, dan jumlah indikator yang bertambah. Template hanya menyediakan tampilan bagian tersebut.
- Input Direktur tampil langsung di sheet direktur, tidak digandakan di Tambahan. Sheet Tambahan tetap digunakan untuk input fitur lainnya.
- Arsip versi 5 atau sebelumnya tetap mengikuti snapshot dan tata letak saat dibuat. Unduh Ekspor Cascading baru untuk memperoleh perubahan terakhir.
- Tidak membutuhkan migrasi database. Uji backend menggunakan transaksi rollback.

Pengujian: DirectorCascadingTest, regresi CascadingConceptTest/CascadingFeaturesTest/CascadingIkuColorTest/CascadingTemplateExportTest, tests/Browser/director-activities.cjs, dan npm run build.
