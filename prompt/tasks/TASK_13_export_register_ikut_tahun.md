# TASK 13 - EXPORT REGISTER MENGIKUTI HIERARKI TAHUNNYA

| Field | Isi |
|-------|-----|
| ID | TASK_13 |
| Severity | P1 (laporan BPKP/LARS DHP 2026 mencetak pohon 2023) |
| Tipe | perbaikan bug - resolusi hierarki pada export |
| Status | DONE 2026-09-21 - rantai join diperbaiki; 2026 baru bergeser setelah TASK_12 |
| Temuan | `prompt/docs/FINDINGS_LOG.md` #22 |
| Bergantung pada | TASK_12 (tautkan 54 master yang dipakai register 2026) - MASIH BELUM |

## Masalah

Semua export register mengambil Sasaran/Program/Kegiatan/Tujuan lewat rantai:

```
risk_registers.indikator_fitur4_id -> indikator_fitur4s.id
  -> indikator_fitur3_id -> fitur 2 -> fitur 1 -> sasaran_strategis
```

975 dari 975 register menyimpan **ID master** (`periode_kinerja_id` null), jadi
join itu selalu mendarat di baris master lalu menaiki `master.indikator_fitur3_id`.
`Fitur4Master::SHARED` sengaja tidak memuat `indikator_fitur3_id`, sehingga induk
penautan tahunan tidak pernah sampai ke master.

Akibatnya 129 register bertanggal 2026 mencetak pohon legacy 4/25/55, bukan
cascading 2026 yang 3/9/19.

Bukti (probe ber-rollback, 2026-09-20): penautan #422310 ditautkan ke kegiatan
2026 #15989 lalu `Fitur4Master::syncFromPlacement` dijalankan. Kolom kegiatan
hasil join tetap "Meningkatnya Mutu Pelayanan Rumah Sakit" dan
`master.indikator_fitur3_id` tetap 53.

## Rantai Resolusi

Rancangan awal memakai tiga langkah dengan induk master sebagai cadangan.
**Keputusan user 2026-09-21 mengubah langkah 3: cadangan dihapus.** Indikator
yang belum tertaut pada tahun register dibiarkan **kosong** supaya export
sekaligus menjadi daftar periksa indikator mana yang belum ditautkan. Mencetak
pohon lama sebagai cadangan justru menyembunyikan pekerjaan yang belum selesai.

Rantai yang berlaku sekarang:

1. `risk_registers.indikator_snapshot` bila ada - kebenaran yang dibekukan saat
   input. Saat ini **0 dari 975** baris terisi, jadi belum dibaca.
2. Penautan tahun register: `master_id` + `periode_kinerja_id` tahun itu, lalu
   naik ke fitur 3 / 2 / 1 tahun itu.
3. Tidak ada cadangan - kolom hierarki dikosongkan.

Kolom yang tetap terisi pada baris kosong: No, Kode Risiko, Pernyataan Risiko,
**Indikator** (atribut master), dan **Pemilik Risiko**. Jadi baris kosong tetap
memberi tahu indikator milik unit mana yang perlu ditautkan.

### Ukuran dampak keputusan itu

| Tahun | Register | Lewat penempatan | Lewat cadangan (jadi kosong) |
|-------|----------|------------------|------------------------------|
| 2023 | 241 | 241 | 0 |
| 2024 | 294 | 294 | 0 |
| 2025 | 311 | 311 | 0 |
| 2026 | 129 | 0 | 129 |

Tahun tertutup tidak menyentuh cadangan sama sekali, jadi menghapus cadangan
hanya mengosongkan 129 register 2026 - tepat yang belum tertaut.

### Bukti non-regresi

Simulasi pada data nyata sesudah periode 2023 dibuat (`ifnull(penautan.indikator_fitur3_id, master.indikator_fitur3_id)`):

| Tahun | Register | Ada penautan | Teks sama | Berubah |
|-------|----------|--------------|-----------|---------|
| 2023 | 241 | 241 | 241 | 0 |
| 2024 | 294 | 294 | 294 | 0 |
| 2025 | 311 | 311 | 311 | 0 |
| 2026 | 129 | 129 | 129 | 0 |

2026 masih "sama" karena 54 master yang dipakainya belum tertaut. Setelah
TASK_12, barisan 2026 itulah yang bergeser ke cascading baru - dan hanya itu.

## Lokasi Perubahan

Empat export register yang benar-benar terpasang di Sidebar:

| File | join fitur 4 | naik ke fitur 3 | `sasaran_strategis` dari fitur 4 |
|------|--------------|-----------------|----------------------------------|
| `FormatBPKPExport.php` | 11 | 1 | 4 |
| `FormatLARSDHPKlinisExport.php` | 6 | 5 | 2 |
| `FormatLARSDHPNonKlinisExport.php` | 5 | 4 | 1 |
| `FormatSedangTerjadiExport.php` | 11 | 1 | 4 |

`sasaran_strategis.id = indikator_fitur4s.sasaran_strategis_id` juga membaca
master, jadi ikut diperbaiki.

Tidak disentuh: `FormatBPKPNonKlinisExport`, `FormatBPKPKlinisExport`,
`FormatLARSDHPExport`, `FormatFitur4Export` - route atau halamannya sudah mati
(lihat temuan #26).

## Rancangan

Buat satu tempat resolusi, misalnya `App\Services\RegisterHierarchyResolver`,
yang menyediakan potongan join siap pakai. Tidak bisa memakai kelas induk
bersama untuk sheet, karena tiap `Format*Export.php` mendeklarasikan
`App\Exports\Sheet1..Sheet11` dengan nama yang sama (temuan #25).

Bentuk join per sheet:

```
leftJoin periode_kinerjas pk  ON pk.tahun = year(risk_registers.tgl_register)
leftJoin indikator_fitur4s m  ON m.id = risk_registers.indikator_fitur4_id
leftJoin indikator_fitur4s pl ON pl.master_id = m.id AND pl.periode_kinerja_id = pk.id
leftJoin indikator_fitur3s f3 ON f3.id = ifnull(pl.indikator_fitur3_id, m.indikator_fitur3_id)
leftJoin indikator_fitur2s f2 ON f2.id = f3.indikator_fitur2_id
leftJoin indikator_fitur1s f1 ON f1.id = f2.indikator_fitur1_id
```

Nama indikator tetap diambil dari `m.name` karena master yang permanen.
Tahun diambil dari `year(tgl_register)`, bukan `risk_registers.periode_kinerja_id`,
karena kolom itu masih null pada seluruh 975 baris.

Langkah 1 (snapshot) dapat ditambahkan belakangan sebagai `coalesce` di atas
hasil join, atau ditunda sampai ada backfill. Catat keputusannya di task ini.

## Urutan Yang Aman

1. TASK_12: tautkan 54 master yang dipakai register 2026.
2. TASK_13: ubah rantai join.

Bila dibalik, kolom Sasaran/Program/Kegiatan 2026 tetap terisi karena cadangan
langkah 3 - tetapi isinya masih pohon lama, jadi tidak ada gunanya merilis
TASK_13 lebih dulu.

## Verifikasi

- Harness pembanding: ambil teks Sasaran|Program|Kegiatan|Indikator per register
  sebelum dan sesudah perubahan, kelompokkan per tahun. Sasaran: 2023/2024/2025
  nol baris berubah, 2026 berubah tepat sebanyak register yang indikatornya sudah
  ditautkan di TASK_12.
- Test baru dengan `DatabaseTransactions`: satu register tahun tertutup tetap
  memakai pohon tahunnya; satu register yang indikatornya belum tertaut jatuh ke
  cadangan master; tidak ada kolom hierarki kosong.
- Catatan test: hanya **satu** export register boleh dibangun per proses PHP
  (temuan #25). Uji unduhan pada satu endpoint saja; uji resolusi lewat service,
  bukan lewat empat endpoint sekaligus.
- `php artisan test` dibanding baseline di `CLAUDE.md`.
- Manual: unduh BPKP triwulan I 2026 dan bandingkan kolom hierarkinya dengan
  bagan Cascading 2026.

## Risiko

- Menyentuh 33 titik join di empat berkas besar. Mitigasi: satu service, satu
  bentuk join, dan harness pembanding per tahun sebelum/sesudah.
- `year(tgl_register)` tidak terindeks. Volume sekarang 975 baris sehingga tidak
  terasa; catat bila data tumbuh.
- Register yang tahunnya tidak punya periode akan jatuh ke cadangan. Saat ini
  tidak ada - 2023 sampai 2026 semuanya punya periode - dan
  `AnnualIndicatorsTest` sudah menjaga invarian itu.

## Hasil Pengerjaan 2026-09-21

`app/Services/RegisterHierarchyResolver.php` (baru) memegang satu bentuk join.
Aliasnya sengaja sama dengan nama tabel (`indikator_fitur3s`, `sasaran_strategis`,
dst) sehingga tiap sheet hanya menukar blok join-nya dan **seluruh `select` lama
tetap berlaku**. Pemanggilannya menyatu dalam rantai lewat `->tap(...)`.

Diterapkan pada 5 berkas:

| Berkas | Titik resolver | Baris join dihapus |
|--------|----------------|--------------------|
| `FormatBPKPExport.php` | 11 | 8 |
| `FormatLARSDHPKlinisExport.php` | 5 | 15 |
| `FormatLARSDHPNonKlinisExport.php` | 5 | 15 |
| `FormatSedangTerjadiExport.php` | 11 | 8 |
| `FormatMRTerbaruExport.php` | 1 (`baseQuery`) | 5 |

`FormatKeterjadianRisikoExport` tidak disentuh: ia hanya memakai
`indikator_fitur4s.location_id`, atribut master yang memang tidak berubah per tahun.

### only_full_group_by

Rantai baru menjoin fitur 3 lewat `IFNULL(penempatan, master)` dan menjoin
penempatan lewat `master_id` + `periode_kinerja_id` yang bukan unique key, jadi
MySQL tidak lagi bisa membuktikan kolom hierarki bergantung fungsional pada
`GROUP BY risk_registers.id` seperti pada rantai master lama. Empat query yang
mengelompok per register ditambahi `...RegisterHierarchyResolver::groupBy()`.
Kolomnya 1:1 dengan register sehingga keluarannya tidak berubah. Alternatif yang
lebih bersih - unique index pada `indikator_fitur4s (master_id, periode_kinerja_id)`
dan `periode_kinerjas (tahun)` - dicatat sebagai temuan #34 dan sengaja tidak
dikerjakan di sini karena bisa gagal pada data production yang belum diperiksa.

### Keputusan langkah 1 (snapshot)

`risk_registers.indikator_snapshot` **belum** dibaca: masih null di 975/975 baris,
jadi menambahkannya sekarang hanya menambah cabang mati. Ditunda sampai ada
backfill; tempatnya sudah ditandai di docblock resolver.

## Verifikasi

Harness pembanding tingkat SQL (975 register, teks Sasaran|IKU|Program|Kegiatan|
Tujuan|Indikator lama vs baru):

| Tahun | Register | Sama | Berubah |
|-------|----------|------|---------|
| 2023 | 241 | 241 | 0 |
| 2024 | 294 | 294 | 0 |
| 2025 | 311 | 311 | 0 |
| 2026 | 129 | 0 | **129 (sengaja dikosongkan)** |

Perbandingan tingkat berkas (satu export per proses, temuan #25).

**Tahun tertutup 2025 - harus nol perubahan:**

| Export | Sel dibandingkan | Sel berbeda |
|--------|------------------|-------------|
| `FormatBPKPExport` | 55.543 | 0 |
| `FormatLARSDHPKlinisExport` | 11.139 | 0 |
| `FormatSedangTerjadiExport` | 55.543 | 0 |

**Tahun aktif 2026 - perubahan yang diharapkan:**

| Export | Sel dibandingkan | Sel berbeda |
|--------|------------------|-------------|
| `FormatBPKPExport` | 23.249 | 903 |
| `FormatLARSDHPKlinisExport` | 6.393 | 648 |

Seluruh selisih berbentuk teks hierarki lama menjadi string kosong. Contoh baris
`Penetapan Konteks` pada BPKP 2026: Sasaran/Program/Kegiatan/Tujuan kosong,
sedangkan Indikator ("Jam visite dokter spesialis") dan Pemilik Risiko ("JEPUN")
tetap terisi.

`FormatLARSDHPNonKlinisExport` tidak bisa dibandingkan terhadap keadaan sebelum
sesi ini karena **sudah gagal total sebelumnya** - lihat temuan #35 dan TASK_15.

Probe maju ber-rollback: penempatan 2026 #422310 ditautkan ke kegiatan #15989,
lalu kolom register 1480 bergeser dari pohon legacy ke cascading 2026 penuh
(Sasaran/IKU/Program/Kegiatan berubah), sementara kolom Indikator tetap dari
master. Inilah yang dulu tidak terjadi.

```
php artisan test --filter=RegisterHierarchyResolverTest
Tests: 4 passed

php artisan test
Tests: 1 failed, 167 passed
```

Baseline sebelum task ini 163 passed; 4 tambahan adalah test baru. Satu-satunya
merah adalah `ExampleTest` (temuan #2). `CascadingFeaturesTest` sempat merah pada
satu run; diverifikasi **bukan** regresi dengan mengembalikan seluruh perubahan
task ini lalu menjalankannya ulang - tetap merah dengan pesan identik (selisih
spasi di sel workbook konsep), sesuai temuan #13.

## Aman di-merge?

YA untuk tahun tertutup: 2023/2024/2025 terbukti tidak bergeser satu sel pun.

**Perhatian untuk tahun 2026.** Sesuai keputusan user, kolom
Sasaran/Program/Kegiatan/Tujuan pada 129 register 2026 sekarang **kosong** sampai
indikatornya ditautkan. Itu disengaja - export dipakai sebagai daftar periksa -
tetapi berarti laporan 2026 **belum siap dikirim ke BPKP/LARS DHP** selama
penautan belum selesai. Yang menutup celah ini adalah TASK_12, bukan perubahan
kode lagi: begitu satu master ditautkan, baris register-nya langsung terisi
cascading 2026.

Uji manual yang disarankan: unduh BPKP dan LARS DHP Klinis setahun penuh 2025,
pastikan isinya sama persis dengan sebelum perubahan; lalu unduh 2026 dan
pastikan kolom hierarkinya kosong sementara kolom Indikator dan Pemilik Risiko
tetap terisi; terakhir tautkan satu indikator di /kinerja dan pastikan baris
register-nya terisi kegiatan 2026.
