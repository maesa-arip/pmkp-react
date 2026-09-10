# Rancangan indikator tahunan, copy risk register, dan Cascading

Status: fondasi periode tahunan, editor hierarki, penyesuaian copy risiko/MUTU, serta ekspor dan arsip Cascading sudah diimplementasikan dan diterapkan pada database lokal tanggal 8 September 2026. Database produksi belum diperiksa atau dimigrasikan. Bagian rancangan di bawah mencatat alasan desain; cakupan implementasi dan panduan operasional ada di bagian akhir.

## Penyesuaian 9 September 2026

Hierarki operasional adalah **Sasaran (fitur 1) → Program (fitur 2) → Kegiatan (fitur 3) → Indikator (fitur 4)**, mengikuti pemakaian pada laporan LARS. `sasaran_strategis` bukan tingkat tambahan yang perlu dikelola. Seluruh 655 indikator legacy memakai sasaran ID 1; sembilan sasaran lainnya tidak dirujuk indikator. Tabel dan FK lama dipertahankan untuk kompatibilitas BPKP dan data historis. Formulir mengisi referensi kompatibilitas secara internal; tidak meminta pengguna memilih sasaran legacy. Aktivasi memeriksa hubungan fitur 1–4.

Tab **Bagan Cascading** menampilkan hubungan induk–anak dalam kotak bercabang, termasuk jabatan yang tersedia. Bagan bisa difilter berdasarkan sasaran fitur 1 dan detail indikator dapat dibuka per kegiatan. Data aktif yang memiliki induk tidak aktif/putus dilaporkan dan memblokir ekspor agar tidak hilang dari dokumen tanpa penjelasan.

Kode otomatis mengikuti urutan tampil dan induk: `1`, `1.1`, `1.1.a`, `1.1.a.1`. Huruf kegiatan berlanjut sampai `z`, `aa`, dan seterusnya. Kode tidak menggunakan ID database. Field **Kode Cascading khusus** menerima penomoran dari dokumen, misalnya `1.1.b`; anak otomatis meneruskan kode tersebut menjadi `1.1.b.1`. Kode khusus ganda pada induk yang sama ditolak. Kode kosong diisi otomatis dengan menghindari kode khusus yang sudah dipakai. Menyembunyikan baris tidak aktif tidak menggeser kode saudaranya.

Ekspor **template versi 2** menggunakan bagan bercabang dengan garis penghubung, kode sebagai teks Excel, serta kotak kegiatan dan indikator di bawah program masing-masing. Cabang lebar dibagi menjadi kelompok maksimal tiga kolom dengan sasaran diulang sebagai konteks. Jumlah baris dan area cetak mengikuti data; keluaran landscape A3 dapat terdiri dari beberapa halaman. Arsip versi 2 menyimpan pohon beserta kode yang tampil; arsip versi 1 tetap memakai renderer lama. Dokumen referensi tidak diubah dan data nama/jabatan tahun 2025 di dalamnya tidak otomatis menggantikan database.

Bagian rancangan awal di bawah adalah catatan keputusan sebelumnya. Jika bertentangan, gunakan penyesuaian 9 September dan panduan operasional terbaru ini.

Validasi penyesuaian: 11 skenario tahunan dan 5 skenario Cascading lulus, termasuk alur tanpa sasaran legacy, kode khusus ganda, kode huruf setelah `z`, induk tidak aktif, dan dispatch arsip versi 1. Build frontend/SSR berhasil. Hasil Excel dari data lokal 2025 memuat seluruh **571 kode indikator fitur 4 tepat satu kali**, disimpan sebagai teks. Render Excel serta pratinjau bagan desktop/ponsel mode gelap sudah diperiksa. Tidak ada migrasi atau penulisan ulang data bisnis existing pada penyesuaian ini.

## Temuan sebelum perubahan

- `indikator_fitur1s` sampai `indikator_fitur4s` belum memiliki periode. Hubungan induknya berantai melalui `indikator_fitur1_id`, `indikator_fitur2_id`, dan `indikator_fitur3_id`. Semuanya juga menunjuk `sasaran_strategis`.
- Database lokal berisi 4 indikator fitur 1, 25 fitur 2, 55 fitur 3, dan 571 fitur 4. `indikator_fitur04s` kosong. Kolom indikator yang benar-benar ada pada `risk_registers` lokal adalah `indikator_fitur4_id`; sebagian model dan migrasi lama masih menyebut fitur 04.
- Risiko tersedia untuk 2023, 2024, 2025, dan 2026. Beberapa indikator fitur 4 dipakai lintas tahun. Tahun risiko saat ini ditentukan dari `tgl_register`.
- `RiskRegisterYearCopyService::copy()` dan `copyUnit()` menggunakan `replicate()`, mengganti tanggal dan metadata copy, tetapi mempertahankan referensi indikator sumber. Banyak nilai evaluasi pada baris risiko juga ikut tersalin.
- `RiskRegister::effectiveRiskRegisterHistories()` menggabungkan history sumber dengan history hasil copy. Tampilan lintas tahun perlu membedakan riwayat referensi dengan evaluasi tahun berjalan.
- Indikator fitur 4 juga digunakan modul MUTU. Migrasi relasi tidak boleh hanya memeriksa risk register.
- Ada perbedaan antara skema lokal dan migrasi lama. Implementasi harus memakai migrasi tambahan yang diuji pada database baru maupun salinan database existing.

## Pilihan desain yang direkomendasikan

Gunakan versi data per periode tahunan. Baris tahun sebelumnya tetap tersimpan. Tahun baru mendapatkan ID baru, walaupun nama indikator tetap sama. Prinsip mempertahankan versi lama dengan kunci baru sejalan dengan [Type 2: Add New Row, Kimball Group](https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/type-2/). Rancangan di bawah merupakan adaptasi untuk aplikasi operasional ini, bukan penerapan data warehouse secara penuh.

Pertahankan tabel fitur 1–4 untuk tahap awal agar perubahan integrasi terukur. Belum ada bukti bahwa kedalaman hierarki perlu berubah setiap tahun. Jika kelak level organisasi bisa bertambah atau berkurang, evaluasi model node hierarki umum sebagai pekerjaan tersendiri.

| Data | Usulan |
| --- | --- |
| `periode_kinerjas` | `id`, `tahun` unik, status `draft/aktif/ditutup`, waktu dan pengguna aktivasi/penutupan |
| `sasaran_strategis`, fitur 1–4 | `periode_kinerja_id`, identitas tetap lintas tahun (`lineage_id`), `copied_from_id`, status aktif indikator dan urutan tampil |
| Relasi induk | Mengarah ke versi induk dalam periode yang sama; berlaku juga untuk `sasaran_strategis.parent_id` |
| Penanggung jawab dan struktur organisasi | Penempatan jabatan/unit per periode, parent jabatan/unit, nama tampilan historis dan urutan cabang; gunakan referensi ke master unit yang stabil |
| `risk_registers` | `periode_kinerja_id`, FK indikator versi periode tersebut, metadata sumber copy yang sudah tersedia, penanda perlu review hasil copy |
| Perubahan setelah digunakan | Snapshot konteks indikator/sasaran/unit pada register dan history terkait, disertai audit perubahan |

`lineage_id` menunjukkan kelanjutan indikator yang secara makna tetap sama. Nama dan nomor urut bukan identitas: keduanya dapat berubah. Indikator dengan definisi/pengukuran baru mendapat identitas baru. Pecah/gabung indikator membutuhkan pemetaan eksplisit, bukan pencocokan otomatis berdasarkan kemiripan nama.

Pada rancangan awal, satu periode sama dengan satu tahun kalender dan tahun `tgl_register` harus konsisten dengan periode. `created_at` tetap tanggal input sebenarnya. `tgl_selesai` boleh melewati akhir tahun. Semua filter, dashboard, penilaian dan ekspor harus memakai aturan periode yang sama.

Periode ditutup menjadi baca saja. Indikator yang sudah digunakan tidak dihapus permanen. Perubahan makna atau pemindahan cabang setelah dipakai menghasilkan versi pengganti; register lama tetap menunjuk konteks asal. Koreksi administratif dicatat dalam audit. Snapshot dokumen resmi menyimpan versi konteks yang dipakai saat diterbitkan.

## Alur tahun baru dan copy risiko

1. Buat periode tujuan sebagai draft.
2. Salin sasaran dan struktur indikator sumber, dari induk ke anak. Simpan peta ID sumber ke ID tujuan dan lineage. Parent tujuan selalu memakai ID baru dalam periode tujuan. Copy master yang diulang tidak menggandakan data atau menimpa perubahan draft.
3. Pengelola menyesuaikan sasaran, indikator, penempatan unit/jabatan, urutan, serta indikator yang dihentikan atau diganti. Aktifkan periode setelah hierarki valid.
4. Buka copy risk register dan pilih tahun sumber, tahun tujuan, jenis risiko, serta unit sesuai fitur sekarang.
5. Preview menampilkan risiko siap disalin, sudah disalin, kemungkinan duplikat, indikator tidak tersedia, pemetaan ambigu, dan indikator tidak berlaku pada unit tujuan.
6. Risiko yang pemetaannya valid dapat disalin. Risiko tanpa pemetaan tetap pada sumber dan ditampilkan dengan alasan; pengguna dapat menyelesaikan pemetaannya lalu mengulang copy. Tidak ada fallback diam-diam ke indikator tahun sumber.
7. Simpan hasil copy sebagai perlu review. Validasi ulang pemetaan dan izin ketika eksekusi, karena data bisa berubah sesudah preview.

### Copy antarunit

Pada tahun yang sama, indikator dapat dipertahankan jika memang berlaku untuk unit tujuan. Pada tahun berbeda, indikator harus terlebih dahulu dipetakan ke versi periode tujuan. Validasi kesesuaian unit indikator menggunakan relasi PIC ke location yang dipakai sistem, bukan menyamakan ID kedua tabel tersebut. Indikator umum tetap mengikuti aturan akses unit umum yang berlaku.

Pemilihan user dan unit tujuan harus lolos otorisasi di server, bukan hanya validasi bahwa user berasal dari unit tersebut.

### Isi hasil copy

| Komponen | Perlakuan yang disarankan |
| --- | --- |
| Pernyataan risiko, sebab, dampak | Salin sebagai bahan review tahun tujuan |
| Indikator, sasaran, cabang organisasi | Gunakan versi dan unit tujuan |
| PIC dan user | Pertahankan jika masih sesuai untuk copy tahun; sesuaikan pada copy unit |
| Pengendalian dan rencana tindak lanjut | Boleh disalin sebagai rencana yang harus ditinjau ulang |
| Skor tahun sebelumnya | Tampilkan sebagai pembanding; nilai penilaian tahun tujuan belum dianggap sah sebelum review |
| Realisasi, output, bukti, efektivitas residual/aktual, evaluasi pelaksanaan | Mulai kosong/belum dinilai untuk periode baru |
| Persetujuan, kejadian IKP, RCA/FGD, dokumen dan history evaluasi | Tetap milik sumber, tidak dijadikan hasil tahun tujuan |
| Kode risiko dan tanggal | Kode baru; tanggal register tahun tujuan, tanggal selesai dihitung ulang sesuai rencana |
| Jejak copy | Sumber, periode, unit, pelaku, waktu dan hasil pemetaan tercatat |

Aturan nilai awal harus memakai status belum dinilai secara eksplisit. Jangan membuat nilai nol tampak sebagai evaluasi sah. Perubahan ini perlu selaras dengan validasi formulir dan perhitungan skor yang sekarang ada.

History sumber tetap dapat dibuka dengan label tahun/unit asal. Rekap evaluasi periode tujuan hanya menghitung evaluasi milik periode tersebut. History sumber tidak digandakan secara fisik.

Copy harus aman diulang dan terhadap dua permintaan bersamaan. Gunakan transaksi dan constraint unik untuk identitas copy: sumber, periode tujuan, mode, dan cakupan unit tujuan. Cakupan copy tahun harus mempunyai nilai eksplisit, bukan hanya NULL yang dapat meloloskan duplikat pada unique index. Untuk unit ber-PIC banyak, tetapkan cakupan deterministik. Pencocokan teks risiko hanya menjadi peringatan kemungkinan duplikat, karena kalimat yang sama bisa terkait indikator berbeda.

Tanggal 29 Februari perlu aturan eksplisit ketika tahun tujuan bukan tahun kabisat, misalnya 28 Februari. Default tahun copy di controller yang sekarang tetap 2025/2026 diganti berdasarkan pilihan periode.

## Keluaran Cascading

Referensi: `docs/Cascading.xlsx`, sheet `cascading 2025 (EDIT,171224)`. Judul berada pada B2, tujuan direktur pada B4 dan F4, sasaran/indikator direktur pada B6:G9, cabang wakil direktur pada C11/L11/U11, dan cabang kabag/kabid pada A29/E29/H29/L29/Q29/U29/Z29. Dokumen menggunakan merge cells dan orientasi landscape.

File tersebut adalah Cascading kinerja. Sumber utamanya harus hierarki sasaran dan indikator periode terpilih, termasuk indikator yang belum memiliki risiko. Membentuknya hanya dari risk register akan menghilangkan indikator tanpa risiko dan menggandakan indikator yang memiliki banyak risiko.

Sistem perlu menyediakan pilihan tahun dan tombol Ekspor Cascading Excel. Tata letak mengikuti contoh: judul rumah sakit dan tahun, tujuan, kelompok jabatan, sasaran, nomor dan indikator. Jumlah baris/cabang, merge, tinggi baris dan area cetak dihitung dari data. Hindari koordinat tetap untuk setiap indikator atau nama jabatan yang ditanam langsung dalam kode.

Pemilik jabatan dan struktur organisasi belum tersimpan lengkap pada setiap level indikator. Isi `name`, `tujuan`, serta `sasaran_strategis` existing juga perlu pemetaan makna ke label dokumen; jangan menyimpulkan pemetaannya hanya dari nama kolom. Tambahkan data penanggung jawab dan urutan yang diperlukan sebelum menjanjikan ekspor identik. Contoh workbook tidak menjadi bukti bahwa nilai database lama berlaku untuk semua tahun.

Implementasi aplikasi dapat memakai Laravel Excel/PhpSpreadsheet yang sudah tercantum pada dependensi proyek. PDF bisa menjadi tahap berikutnya jika dibutuhkan. Ekspor resmi harus menyimpan tahun/versi data dan versi template sehingga dokumen lama dapat ditelusuri. Tampilan saat ini dan cetak ulang dokumen resmi perlu dibedakan jika terjadi revisi data.

## Migrasi existing

1. Inventarisasi skema nyata, pemakaian lintas tahun, relasi putus, serta konsistensi sasaran dan parent. Periksa produksi secara terpisah sebelum migrasi produksi.
2. Tambah tabel/kolom periode secara nullable terlebih dahulu. Simpan pemetaan migrasi yang dapat dipakai ulang dan rollback.
3. Bentuk versi hierarki untuk tahun-tahun existing berdasarkan pemakaian risk register dan data tahunan MUTU. Jangan memberi semua master satu tahun lalu menganggap seluruh register sudah benar.
4. Bila master historis asli tidak tersedia, tandai versi hasil rekonstruksi dari master existing. Rekonstruksi mencegah perubahan ke depan, tetapi tidak membuktikan redaksi tersebut persis sama dengan tahun asal. Gunakan arsip yang tersedia untuk koreksi terverifikasi.
5. Remap FK register ke indikator periode masing-masing tanpa mengganti ID register, sehingga relasi history, IKP dan dokumen tetap utuh. Perlakukan indikator tanpa register berdasarkan inventaris master, jangan membuangnya.
6. Sesuaikan modul MUTU yang memakai fitur 4; bila satu master mutu dipakai banyak tahun, rancang versi atau relasi periode eksplisit. Jangan remap seluruh master mutu ke satu tahun secara membabi buta.
7. Aktifkan validasi periode dan constraint setelah rekonsiliasi relasi, jumlah data, dan laporan lolos. Hapus jalur kompatibilitas hanya setelah semua pembaca/penulis beralih.

## Urutan implementasi dan kriteria selesai

Urutan: fondasi periode dan migrasi -> pengelolaan/copy hierarki -> formulir serta filter risiko/MUTU -> pemetaan copy risiko -> ekspor Cascading.

Verifikasi minimum:

- Mengubah indikator tahun tujuan tidak mengubah konteks register/laporan tahun sumber.
- Parent, sasaran dan indikator beda periode ditolak di server; indikator yang sudah dipakai tetap bisa dibaca.
- Copy tahun dan unit menghasilkan referensi yang sesuai periode/unit; pemetaan hilang atau ambigu dilaporkan.
- Pengulangan dan permintaan copy bersamaan tidak membuat duplikat, termasuk perbedaan mode/unit.
- Hasil copy tidak mewarisi realisasi/evaluasi sah tahun sebelumnya; riwayat asal tetap tersedia dan berlabel.
- Rekap dan grading memakai periode yang sama dengan register; histori lintas tahun tidak masuk ke perhitungan tahun tujuan.
- Jumlah register sebelum/sesudah migrasi cocok dan relasi history, IKP, serta MUTU tetap valid.
- Ekspor menampilkan seluruh hierarki tahun terpilih tanpa penggandaan akibat jumlah risiko, mempertahankan teks panjang, dan menangani cabang yang bertambah tanpa terpotong.

## Implementasi dan penggunaan

Menu **Master → Indikator Tahunan & Cascading** (`/kinerja`) tersedia bagi pengguna dengan izin `atur data master manajemen risiko` atau `atur hak akses`.

1. Pilih tahun untuk melihat bagan dan empat tingkat fitur 1–4. Gunakan tab Hierarki indikator untuk pengelolaan.
2. Buat tahun berikutnya sebagai **draft**, dengan menyalin tahun sumber atau mulai kosong. Penyalinan membuat ID tahunan baru dan mempertahankan lineage. Transaksi risiko/MUTU tidak dibuat oleh langkah ini.
3. Sesuaikan hierarki draft: nama, tujuan, jabatan penanggung jawab, kode Cascading khusus bila diperlukan, urutan, induk fitur, unit, dan status indikator. Indikator baru mendapat lineage baru. Nonaktifkan indikator yang sudah tidak digunakan.
4. Lengkapi identitas organisasi dan tujuan periode, lalu **aktifkan**. Aktivasi memeriksa konsistensi hubungan induk fitur 1–4. Struktur periode aktif dikunci; transaksi dapat diinput selama periode aktif. Periode yang ditutup menjadi baca saja.
5. Buka fitur **Copy Risk Register**, pilih tahun sumber/tujuan, lalu preview. Sistem memetakan ke indikator tujuan berdasarkan lineage atau pemetaan eksplisit dan memeriksa kesesuaian unit. Jika indikator berubah makna, tentukan pemetaan dari ID indikator sumber ke indikator tujuan melalui menu tahunan. Pemetaan ini satu sumber ke satu tujuan; pecah menjadi beberapa risiko memerlukan input tersendiri.
6. Salin baris yang siap. Hasilnya berstatus **perlu review**, dengan penilaian/evaluasi dan bukti dikosongkan. Sumber dan rencana tetap tersedia. Nilai kembali risiko di tahun tujuan, kemudian gunakan tombol review. Copy yang diulang tidak menggandakan hasil yang sudah pernah disalin, termasuk yang sudah dihapus secara soft delete.
7. Gunakan filter tahun pada daftar risiko, tahapan pengendalian klinis, indikator MUTU, dan transaksi MUTU. Tahun indikator formulir mengikuti tanggal register/transaksi. Master MUTU yang disalin ke tahun baru belum disetujui; selesaikan persetujuannya sebelum input transaksi.
8. Pilih **Ekspor Cascading**. Excel memuat seluruh hierarki aktif dalam tahun tersebut, termasuk indikator tanpa risiko. Arsip menyimpan snapshot isi dan versi template, sehingga unduhan arsip tidak mengambil ulang data master terbaru.

### Penerapan pada database lokal

- Backup lengkap sebelum migrasi: `storage/app/backups/before-annual-indicators-20260908-103909.sql`.
- Migrasi tambahan: `2026_09_08_030000_add_annual_indicator_periods` dan `2026_09_08_040000_support_annual_dates_and_reconstruction_notes`.
- `php artisan indikator:initialize-years` menampilkan rencana; `--apply` merekonstruksi dan memetakan relasi dalam transaksi. Master legacy dipertahankan. Periode hasil rekonstruksi dibuat aktif agar operasi existing dapat berlanjut; pengelola menentukan tahun yang siap ditutup.
- Jumlah risiko, termasuk soft delete, tetap: 2023 **251**, 2024 **362**, 2025 **440**, 2026 **193**. ID register tetap dipertahankan. Pemeriksaan setelah migrasi tidak menemukan register tanpa periode, relasi indikator risiko lintas periode, atau transaksi MUTU yang menunjuk master tanpa periode.
- Satu transaksi MUTU lama, ID **461**, bertanggal **2000-04-01**. Periode 2000 dipertahankan berdasarkan tanggal tersebut; tidak dikoreksi dengan menebak tahun yang dimaksud.
- Sasaran sumber **6, 9, 10, 12** memiliki induk lama yang tidak ditemukan. Sumber tidak diubah; salinan rekonstruksi ditempatkan sementara sebagai akar dan diberi catatan pada periode. Relasi legacy ini bukan acuan bagan baru dan tidak ditampilkan sebagai hierarki operasional.

Untuk lingkungan lain, buat backup dan periksa skema nyata terlebih dahulu, jalankan kedua migrasi tambahan, periksa preview rekonstruksi, kemudian terapkan dan rekonsiliasi. Baseline migrasi lama pada database kosong belum divalidasi oleh pekerjaan ini. Rollback data tahunan memerlukan pemulihan backup yang sudah diverifikasi; migrasi fondasi sengaja menolak penghapusan referensi tahunan lewat `down()`.

### Validasi dan batas cakupan

- Pengujian gabungan: **32 lulus** (11 skenario tahunan, integrasi IKP, otorisasi, dan sanitasi sorting). Setelah perluasan pemeriksaan halaman, 11 skenario tahunan kembali lulus. Build frontend dan SSR berhasil.
- Ekspor Excel diperiksa isinya dan dirender untuk memeriksa keterbacaan. UI editor diperiksa dengan fixture browser; endpoint dengan autentikasi diuji melalui feature test. Login interaktif pengguna tidak dipakai untuk pengujian ini.
- Workbook `docs/Cascading.xlsx` tetap menjadi referensi asli. Ekspor menggunakan tata letak dinamis berkelompok, sel gabungan, serta cetak landscape A3. Struktur kolom tidak menjanjikan salinan posisi sel identik dengan contoh. Jabatan/tujuan yang belum ada tidak dikarang dan ditandai belum diisi.
- Data lama merupakan **rekonstruksi dari master existing**, bukan bukti bahwa redaksi tersebut benar untuk setiap tahun historis. Lengkapi dan verifikasi metadata di draft tahun baru sebelum aktivasi.
- Revisi formal beberapa versi dalam satu tahun, audit lengkap setiap perubahan draft, struktur jabatan sebagai entitas tersendiri, serta ekspor PDF belum termasuk implementasi ini. Periode aktif tidak bisa dikembalikan ke draft melalui UI.
