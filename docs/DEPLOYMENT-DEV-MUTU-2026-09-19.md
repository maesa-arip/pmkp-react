# Deploy dev-mutu dan cascading 2024–2026 — 19 September 2026

## Target dan rilis

Permintaan pengguna: commit/push perubahan lokal, deploy hanya ke dev-mutu, backup dev_pmkp, restore salinan pmkp ke dev_pmkp dengan mempertahankan data risk_gradings dan risk_grading_settings dari dev, lalu terapkan cascading sesuai catatan 2024–2026.

- GitHub: maesa-arip/pmkp-react, branch `codex/indikator-tahunan-lokal`.
- Commit aplikasi: `ad350073ccdd1854238c74071c02ba07e63f26bc`.
- Host: `10.60.11.102`; checkout dev: `/var/www/dev-pmkp`.
- URL: https://dev-mutu.balimandarahospital.com ; upstream Nginx HTTPS port 9011.
- Database efektif: `dev_pmkp`.
- Checkout production `/var/www/pmkp-react` tetap pada `61fb174ce7de1e57edb35702d7040bdd4d6abe4a`, tanpa perubahan tracked. Tidak ada deployment production atau operasi tulis ke database `pmkp`.
- Perubahan branding lama pada checkout dev disimpan dalam patch, arsip build, dan Git stash. Branding yang sama sudah ada di rilis baru. Branch dev lama tetap tersedia.

## Backup dan restore

Seluruh backup, checksum, skrip audit, dan laporan rinci disimpan privat di server:

`/root/backups/dev-mutu-20260919-061919`

| File | SHA-256 |
| --- | --- |
| dev_pmkp-before.sql | 1d477e3d7dfd8418a580279f8c6d042f257bce5bfdc178f0405f0ed5973fc1c9 |
| dev-risk-tables.sql | b6ec33718914e63ad42c69cdea39401f6ee23b49efe8c35559e86d4d363167cb |
| pmkp-source.sql | 1c93aaa4d0f53b27b50b6913d18933677cd2e7cf54c4417ba1056acd741594e1 |
| dev-before-migrations.sql | 7428617bf764f26055480850016ebf7f397a83768dce9da52e9ffbcb8d6aaf71 |
| dev-before-cascading.sql | 9b9bdaa06a7e61fb002d87ee8a25b51fa5ecb836dfd5378be1d32f0af8243e53 |

Backup awal dev berukuran 9.424.244 byte. Restore uji serta mysqlcheck berhasil; sidik isi seluruh 69 tabel identik. Dump sumber pmkp juga berhasil diuji restore. Restore ke dev menghasilkan 70 tabel yang identik dengan snapshot pmkp, kecuali dua tabel grading yang diverifikasi identik dengan dev sebelum restore: 50 baris risk_gradings dan 5 baris risk_grading_settings.

Autentikasi GitHub sempat tertunda. Dev diaktifkan kembali dengan kode sebelumnya selama penantian. Sebelum melanjutkan deploy, seluruh sidik isi database diperiksa kembali dan tetap identik dengan hasil restore. Tidak dilakukan restore ulang.

## Migrasi dan cascading

Sepuluh migrasi tertunda dari `2026_09_08_030000_add_annual_indicator_periods` sampai `2026_09_18_120000_add_cascading_color_to_indikator_fitur1s` ditinjau dan diterapkan secara eksplisit. Penambahan kolom tahunan serta dukungan DATETIME tidak memindahkan transaksi lama ke periode. Isi kolom asli dibandingkan dengan snapshot sebelum migrasi dan tetap identik.

Uji `cascading:prepare-2024-2026` berhasil; audit sebelum/sesudah membuktikan rollback seluruh perubahan data. Counter ID dapat maju selama uji, sehingga ID server berbeda dari lokal. Penerapan permanen kemudian dilakukan satu kali dengan backup `dev-before-cascading.sql`.

| Tahun | ID periode dev | Status | Sasaran | Fitur 1 | Fitur 2 | Fitur 3 | Fitur 4 | Indikator kinerja |
| --- | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 2024 | 4 | ditutup | 10 | 4 | 25 | 55 | 571 | 0 |
| 2025 | 5 | ditutup | 10 | 4 | 25 | 55 | 571 | 0 |
| 2026 | 6 | aktif | 2 | 3 | 9 | 19 | 325 | 58 |

- Sumber lama tanpa periode tetap utuh, termasuk ID dan hubungan asal. Empat sasaran tanpa induk diverifikasi dari data server, bukan diasumsikan dari ID lokal.
- Workbook memakai SHA-256 `25fc54c8581e38592648a4f49c10978528ed883b35efba0801a5963243bfdab2`; 438 konsep tersimpan.
- Sebelas jabatan dihubungkan berdasarkan nama PIC. Empat nama memiliki duplikat pada lokasi sama; PIC asli yang dipilih command terhubung ke pengguna, sedangkan duplikatnya tidak memiliki pengguna. Tidak ada perubahan pada master PIC.
- Tidak ada pemetaan unit tambahan. Keputusan akses 18 indikator kelompok gabungan Pendidikan/Pelatihan/Penelitian dan Kepegawaian tetap terbuka sesuai panduan; tidak dibagi atau diberi akses bersama secara asumsi.

## Verifikasi

- Build frontend berhasil. Seluruh 95 kasus regresi yang dipilih lulus melalui pengujian awal dan pengujian ulang kasus terdampak. Fixture risiko/mutu diperbaiki agar tidak mengasumsikan transaksi historis sudah mempunyai periode dan agar memakai izin edit yang sesuai middleware.
- Audit seluruh **79 tabel** setelah migrasi memastikan hanya tabel dalam daftar persetujuan cascading berubah. Jumlah ini berasal dari server; tidak diasumsikan sama dengan 80 tabel lokal.
- Seluruh data lama, 1.257 risk_registers, dan dua tabel grading dev tetap utuh. Transaksi risiko/mutu lama tetap tanpa periode.
- Ekspor 2024 dan 2025 masing-masing memuat 655 baris fitur. Sebanyak 2.788 koordinat sel beserta gaya diperiksa dan identik selain judul tahun; merge juga identik.
- Ekspor 2026 memakai template versi 6. Sebanyak 1.202 sel berisi data di empat sheet non-Direktur cocok dengan workbook, termasuk gaya, merge, ukuran kolom/baris. Enam kegiatan/indikator pada sheet Direktur cocok dengan database sesuai perubahan ekspor versi 6. Arsip ekspor dev: 1 (2024), 2 (2025), 3 (2026).
- Props controller ketiga tahun mempunyai jumlah fitur yang benar dan tidak melaporkan hubungan terputus.
- Smoke test GET melalui kernel HTTP Laravel, middleware Inertia, dan otorisasi admin asli menghasilkan HTTP 200 untuk Kinerja 2024/2025/2026, MutuIndikator 2026, serta risk register klinis/nonklinis 2026. Identitas hanya dipasang dalam memori proses pengujian; tidak mengubah akun atau password.
- Browser headless membuka login dev melalui upstream HTTPS: HTTP 200, judul `Log in - SIMDALIN`, kedua field login dan stylesheet tersedia, tanpa kegagalan request atau galat JavaScript. Tangkapan layar diperiksa.
- Cache konfigurasi/view diperbarui, cache route lama dibersihkan, permission storage/cache dev dipulihkan, dan maintenance dev dinonaktifkan. Tidak ada restart service bersama.

File bukti server: `SHA256SUMS`, `cascading-applied.json`, `cascading-export-verification.json`, `cascading-table-audit.json`, `original-data-final.json`, `http-smoke.json`, dan `dev-final.json`. Ekspor XLSX ketiga tahun ada di direktori backup privat yang sama.

Jangan menjalankan ulang command persiapan pada database dev ini; periode sudah tersedia. Pemulihan harus memakai backup dan kondisi server yang diverifikasi. Panduan production tetap memerlukan permintaan eksekusi production tersendiri.