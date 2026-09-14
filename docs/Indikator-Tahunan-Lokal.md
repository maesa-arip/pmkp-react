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
