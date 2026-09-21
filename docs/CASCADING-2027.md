# Cascading 2027

Periode 2027 (ID 242) berstatus **draft**. Data berasal dari lima sheet pada `docs/CASCADING.xlsx`: `cascading`, `direktur`, `ASD ` (spasi akhir mengikuti sumber), `PELAYANAN`, dan `PENUNJANG`.

## Konsep dan jumlah data

| Jenis | Jumlah |
| --- | ---: |
| Tujuan strategis | 1 |
| Program | 1 |
| Sasaran strategis | 2 |
| Indikator Kinerja Utama (IKU) | 3 |
| Kegiatan | 45 |
| Indikator kinerja | 61 |
| Indikator mutu | 325 |
| **Total** | **438** |

Kegiatan terdiri dari 3 kegiatan direktur, 9 kegiatan Wadir, 19 kegiatan Kabag/Kabid, dan 14 kegiatan tim kerja. Sembilan turunan Wadir diklasifikasikan sebagai kegiatan sesuai penjelasan pengguna. Data organisasi yang berulang pada beberapa sheet disimpan sekali dan dihubungkan ke seluruh sel terkait.

Jenis data disimpan secara eksplisit di `cascading_concepts`; indikator kinerja Wadir tidak lagi ditampilkan sebagai program. Pada 16 September 2026, tabel operasional 2027 diselaraskan dengan konsep pengguna. ID 19 kegiatan Kabag/Kabid dipertahankan; record pada level yang salah diganti setelah pemeriksaan referensi dan pencadangan. Indikator mutu disimpan dengan redaksi lengkap; target dan unit yang tertulis dalam uraian belum dipecah menjadi kolom pengukuran terpisah.

## Fitur 1–4 dalam database

| Level | Isi | Jumlah 2027 | Induk |
| --- | --- | ---: | --- |
| Sasaran | Sasaran strategis | 2 | Tujuan organisasi |
| indikator_fitur1s | IKU Direktur | 3 | Sasaran |
| indikator_fitur2s | Kegiatan Wadir | 9 | Fitur 1 |
| indikator_fitur3s | Kegiatan Kabag/Kabid | 19 | Fitur 2 |
| indikator_fitur4s | Indikator mutu unit/KATIM | 325 | Fitur 3 |
| indikator_kinerjas | Indikator kinerja Wadir dan Kabag/Kabid | 58 | Fitur 2 atau Fitur 3 |

feature_schema_version = 2 menandai susunan baru. Data periode lama tidak diklasifikasi ulang. Sebanyak 18 indikator kinerja Wadir dan 40 indikator kinerja Kabag/Kabid melekat pada kegiatan. Tiga indikator kinerja Direktur dan kegiatan tim tetap disimpan pada konsep sumber untuk ekspor lengkap.

### Alur input

- /kinerja?tahun=2027: tab **Fitur 1–4** mengelola struktur; tab hierarki/bagan mempertahankan rincian sumber.
- /IndikatorKinerja?tahun=2027: Wadir/Kabag/Kabid memilih kegiatan miliknya dan mengisi indikator kinerja. Administrator dapat mengelola seluruh kegiatan.
- /MutuIndikator: pilih tahun → kegiatan Kabag/Kabid dari **indikator_fitur3s** → pilih atau buat indikator mutu **indikator_fitur4s** → lengkapi kategori, formula dan standar.
- Pilihan indikator mutu dibatasi tahun, kegiatan dan akses unit/tim. Indikator baru menjadi milik unit/tim akun. Kamus mutu memerlukan periode aktif; 2027 masih draft.
- 325 indikator yang diimpor merupakan katalog fitur 4. Kamus pengukuran belum dibuat otomatis karena numerator, denominator, kategori dan standar harus ditetapkan saat input.
- Salinan tahun membawa struktur, 58 indikator kinerja, pemilik mutu, konsep, dan pemetaan workbook. Pengulangan salinan tidak menggandakan data.
- Data baru di luar sel sumber ditambahkan pada sheet **Tambahan** saat ekspor; lima sheet sumber tetap dipertahankan.
- Data yang terikat sel Excel tetap mengikuti induk asalnya agar bagan dan posisi ekspor konsisten.

### Pemilik yang masih perlu konfirmasi

18 indikator sumber berada dalam kelompok gabungan **TIM KERJA PENDIDIKAN,PELATIHAN, PENELITIAN DAN KEPEGAWIAN**, sedangkan master memiliki dua tim terpisah. Indikatornya sudah masuk fitur 4 dan ekspor, tetapi location_id belum dibagikan kepada kedua tim. Perlu keputusan pengguna apakah akses bersama atau pembagian indikator per tim. Pemetaan lain menggunakan nama tim yang sama atau padanan eksplisit dalam config/cascading.php.

## Hubungan dan catatan sumber

Hubungan utama mengikuti penjelasan pengguna: Tujuan → dua Sasaran → tiga IKU Direktur → Kegiatan Wadir → Kegiatan Kabag/Kabid. Indikator kinerja melekat pada kegiatan masing-masing.

Jalur abu-abu mengikuti Nilai Evaluasi Manajemen Kinerja; kuning mengikuti IKM pelayanan BLUD; pink mengikuti IKM pelayanan kesehatan. Warna ungu pada PELAYANAN!D17 dan PENUNJANG!C20 telah dikonfirmasi pengguna mengikuti abu-abu pada sheet cascading. Warna lain yang belum dikenal atau bertentangan tidak diberi induk berdasarkan perkiraan.

Total 34 baris tetap memiliki catatan kode sumber: 33 awalan kode berbeda dan 1 kode berulang. Catatan tersedia melalui filter di aplikasi.

Tiga nomor tanpa uraian tidak dibuat sebagai record kosong: `PENUNJANG!D34`, `ASD !B81`, dan `ASD !B89`. Sel sumber tetap dipertahankan pada workbook. Penomoran asli tidak dikoreksi secara diam-diam.

## Impor dan cadangan

Migrasi yang diperlukan:

- `2026_09_15_120000_create_cascading_workbook_templates_table.php`
- `2026_09_15_130000_create_cascading_concepts_table.php`

Untuk periode yang sudah berisi hasil impor awal:

```powershell
php artisan cascading:import-concepts 2027
php artisan cascading:import-concepts 2027 --apply
```

Tanpa `--apply`, perintah hanya membaca sumber. Penerapan membutuhkan periode draft dan pemetaan impor awal. Sumber yang sama tidak menggandakan record. Jika aturan hubungan diperbaiki, perintah memperbarui jenis/induk/catatan dengan cadangan, mempertahankan ID, kode, uraian yang telah diedit, serta snapshot arsip lama. Sumber berubah setelah impor konsep membutuhkan rekonsiliasi. Cadangan periode, pemetaan workbook, dan record lama disimpan sebelum perubahan dalam `storage/app/cascading-import-backups`.

Impor aktual menghasilkan cadangan `2027-concept-20260915-061128-67956f.json`. Koreksi 28 hubungan menghasilkan cadangan `2027-relations-20260915-064826-8be44d.json`. Hash SHA-256 sumber: `25fc54c8581e38592648a4f49c10978528ed883b35efba0801a5963243bfdab2`.

Migrasi tambahan: 2026_09_15_140000_add_operational_indicator_structure.php dan 2026_09_16_010000_scope_performance_lineage_to_period.php.

Penyelarasan operasional dijalankan dengan **php artisan cascading:align-features 2027**. Perintah memerlukan draft lengkap dan menolak penggantian record yang sudah dipakai transaksi/pemetaan/salinan. Penerapan ulang pada versi 2 tidak menggandakan data. Cadangan aktual: 2027-features-20260916-013819-d602e7.json.

## Tampilan dan ekspor

Halaman Kinerja menampilkan bagan bertingkat serta tabel dengan filter jenis, jabatan, pencarian, dan catatan sumber. Warna penanda setiap jalur mengikuti IKU induknya. Uraian/kode dapat diedit selama periode belum ditutup. Perubahan record terhubung diteruskan ke tabel lama.

Ekspor versi **5** berisi kelima sheet dalam urutan di atas. Salinan workbook dan nilai database disimpan pada snapshot arsip sehingga unduhan arsip tidak bergantung pada file docs atau perubahan data berikutnya. Format teks kaya pada sel yang tidak berubah dipertahankan dari sumber; teks hasil edit ditulis sebagai teks literal, termasuk awalan `=`.

Sel, warna, font, penggabungan sel, lebar kolom, dan tinggi baris mengikuti sumber. Tahun judul menjadi 2027. Area cetak dibatasi pada isi laporan masing-masing sheet.

## Verifikasi

Ekspor aktual `storage/app/cascading-template-qa/Cascading-2027-lengkap.xlsx` tersimpan sebagai arsip **69**, versi **5**. Seluruh **1.241 sel berisi data** cocok dengan sumber, dengan penggantian tahun judul:

- cascading: 212
- direktur: 39
- ASD: 245
- PELAYANAN: 519
- PENUNJANG: 226

Pengujian otomatis mencakup kelengkapan baris berkode, klasifikasi data, hubungan sumber, pelestarian ID, ekspor lima sheet, perubahan teks literal, snapshot arsip, serta penolakan edit periode ditutup. Pengujian browser mencakup filter 325 indikator mutu, pencarian, jabatan, pagination, modal edit, mode gelap, dan ukuran desktop/ponsel.

Pengujian tambahan mencakup relasi fitur 1–4, pemisahan 58 indikator kinerja, penolakan referensi yang sudah dipakai, validasi input mutu berdasarkan kegiatan/tahun/hak akses, indikator mutu baru, salinan antarperiode berikut pemilik dan ekspor tambahan, serta alur form desktop/ponsel.
