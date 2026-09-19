# Indikator tahunan di lokal

Pekerjaan indikator yang ditunda dari production dipulihkan dari commit `50a8e6c`
di branch `codex/indikator-tahunan-lokal`, dengan basis `61fb174`.
Perbaikan IKP dan filter tahun transaksi MUTU pada basis tersebut tetap tersedia.

## Membuka dan mengelola indikator

Buka `http://simdalin.test/kinerja`, lalu login dengan akun yang memiliki izin
`atur data master manajemen risiko` atau `atur hak akses`.
Menu: **Master Data → Indikator Tahunan & Cascading**.

Urutan hierarki:

1. Sasaran (fitur 1).
2. Program (fitur 2), memilih sasaran induk.
3. Kegiatan (fitur 3), memilih program induk.
4. Indikator (fitur 4), memilih kegiatan induk dan unit pemakai.

Pilih **Buat tahun baru** untuk membuat periode draft kosong atau menyalin
hierarki tahun sebelumnya. Pada tab **Hierarki indikator**, pilih tingkat lalu
tambah/edit nama, tujuan, jabatan, kode, urutan, dan status aktif. Induk harus
berasal dari tahun yang sama. Indikator fitur 1–4 dapat diedit pada periode draft
dan aktif, melalui tombol Edit pada kartu bagan atau daftar hierarki. Penambahan
indikator baru dilakukan pada draft. Periode yang ditutup bersifat baca saja.
Perubahan indikator dicatat dalam log aktivitas. Snapshot risiko dan arsip
Cascading sebelumnya tetap tersimpan. Pada periode aktif, induk yang dipilih
harus aktif; induk dengan anak aktif tidak dapat dinonaktifkan.

Tab **Bagan Cascading** menampilkan hubungan keempat tingkat. **Ekspor Cascading**
menghasilkan Excel dan menyimpan snapshot arsip. Copy Risk Register memetakan
indikator ke tahun tujuan, mereset evaluasi, dan menandai hasil untuk direview.

## Kondisi pemulihan 11 September 2026

Database terverifikasi: `127.0.0.1`, `dev_simdalin`. Kedua migrasi indikator
tahunan sudah tercatat dan periode lama masih tersimpan, sehingga tidak dilakukan
migrasi atau rekonstruksi ulang. Tidak ditemukan risk register tanpa periode
atau transaksi MUTU yang mengacu ke kamus tanpa periode.

Data tahun 2026: 4 sasaran, 25 program, 55 kegiatan, dan 571 indikator.
Periode 2000 juga masih tersimpan sebagai hasil rekonstruksi data lama.

Validasi: build frontend dan SSR berhasil; 37 pengujian pada AnnualIndicatorsTest,
CascadingLayoutTest, RiskRegisterInputTest, IkpRiskLinkTest, IkpRiskAccessTest,
dan MutuYearFilterTest lulus. Pengujian database menggunakan transaksi rollback.
Tampilan editor diperiksa di browser menggunakan data contoh Tailwind;
halaman aplikasi langsung memerlukan login pengguna.

Perubahan indikator disimpan pada branch `codex/indikator-tahunan-lokal`.
Branch `main` tetap pada commit rilis production `61fb174`.
Branch indikator belum di-push atau dideploy ke production.

## Editor fitur 1–4, 14 September 2026

Tombol Edit tersedia pada kartu bagan dan daftar hierarki untuk periode draft
dan aktif. Pemindahan induk menyelaraskan konteks sasaran seluruh turunannya.
Validasi: 20 pengujian AnnualIndicatorsTest, CascadingLayoutTest, dan
PreloadResponseHeadersTest lulus; build frontend dan SSR berhasil. Editor
keempat tingkat serta pembatasan periode ditutup diperiksa di browser dengan
data contoh. Pengujian penyimpanan menggunakan transaksi database yang di-rollback.

## Modal dan master penanggung jawab

Editor fitur 1–4 sekarang berupa modal, baik dari bagan maupun daftar hierarki.
Pilih **Master penanggung jawab** di bagian atas `/kinerja` untuk menambah atau
mengedit jabatan dan memilih beberapa unit bawahannya. Master digunakan bersama
antarperiode. Nama jabatan lama dipindahkan ke master; hubungan unit bawahannya
harus diatur secara eksplisit dan tidak ditebak dari data lama.

Pada fitur 4, penanggung jawab wajib dipilih. Unit pemakai tampil otomatis dari
master dan ditentukan kembali oleh server saat penyimpanan. Daftar unit kiriman
browser tidak digunakan. Perubahan master menyelaraskan nama jabatan pada fitur
1–4 dan unit fitur 4 pada periode draft/aktif. Periode ditutup, snapshot risiko,
dan arsip ekspor tetap dipertahankan. Copy ke tahun baru menggunakan pengaturan
master terkini. Jabatan yang masih dipakai indikator aktif pada periode terbuka
tidak dapat dinonaktifkan.

Pemilihan induk dimulai dari sasaran fitur 1, dilanjutkan program fitur 2 dan
kegiatan fitur 3 sesuai tingkat yang diedit. Mengganti induk atas mengosongkan
pilihan di bawahnya agar tidak tersimpan relasi dari cabang yang berbeda.

Migrasi lokal `2026_09_14_000000_add_indicator_responsible_positions.php` sudah
dijalankan. Validasi terbaru: 23 pengujian lulus, build frontend dan SSR berhasil,
serta modal, pergantian unit otomatis, penyaringan induk, dan master jabatan
diperiksa melalui browser dengan data contoh Tailwind.

## Fitur 4 sebagai master tetap, 20 September 2026 (TASK_11)

Indikator fitur 4 (indikator mutu unit) sekarang **master tetap lintas tahun**:
baris `indikator_fitur4s` dengan `periode_kinerja_id` kosong. Baris berperiode
adalah **penautan** master ke tahun itu (kolom `master_id`) dan hanya menyimpan
induk fitur 3, status aktif tahun itu, urutan, dan kode. Nama, tujuan, unit,
penanggung jawab, dan jabatan sama di semua tahun; edit dari `/kinerja` langsung
diselaraskan ke master dan seluruh tahun. Riwayat redaksi dijaga oleh
`indikator_snapshot` pada risk register.

- Risk register dan kamus MUTU selalu menyimpan ID master. Kamus MUTU tidak
  berperiode; tahun hanya ada pada tanggal pengukuran.
- Data lama (termasuk 2023 tanpa periode dan periode ditutup) tetap dapat diedit.
  Register baru, ganti indikator, atau ganti tahun wajib punya periode dan
  penautan aktif. Pengukuran MUTU baru wajib memakai kamus aktif & disetujui dan,
  bila tahunnya punya periode, penautan aktif.
- Periode ditutup mengunci hierarki dan penautan, bukan transaksi.
- Penautan tanpa induk (belum ditempatkan di bawah kegiatan) tampil sebagai info
  di `/kinerja`, tidak ikut bagan dan ekspor cascading.
- **Buat tahun baru** menyalin penautan dari tahun sumber; kamus MUTU tidak disalin.
- Ekspor cascading 2026: sel KATIM yang nonaktif dibiarkan kosong (keputusan
  user 2026-09-20).

Command:

- `php artisan indikator:link-masters {tahun} [--deactivate-existing] [--apply]`
  menautkan semua master aktif yang belum tertaut ke tahun itu, tanpa induk.
  Tanpa `--apply` hanya menampilkan angka. `--deactivate-existing` menonaktifkan
  penautan yang sudah ada beserta masternya dan ditolak bila tahun itu sudah
  pernah ditautkan ke master (mencegah jalan ulang menonaktifkan indikator unit).
- `indikator:initialize-years` dihapus karena bertentangan dengan model ini.

Data lokal setelah migration `2026_09_20_000000_make_fitur4_permanent_masters`
dan `indikator:link-masters 2026 --deactivate-existing --apply`: 896 master
(571 aktif); 2026 berisi 325 KATIM nonaktif dan 571 indikator unit tanpa induk.
Backup sebelum perubahan: `storage/app/backups/before-task11-20260920-004621.sql`.

Urutan deploy (setelah backup terverifikasi): `php artisan migrate`; khusus
production jalankan `cascading:prepare-2024-2026` sesuai runbook; lalu
`indikator:link-masters 2026 --deactivate-existing` (dry-run), periksa angka,
ulangi dengan `--apply`.
