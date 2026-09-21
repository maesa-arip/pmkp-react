# TASK 12 - PENAUTAN MASSAL FITUR 4 KE KEGIATAN FITUR 3

| Field | Isi |
|-------|-----|
| ID | TASK_12 |
| Severity | P1 (prasyarat TASK_13; tanpa ini laporan 2026 tidak bisa memakai cascading baru) |
| Tipe | fitur baru - alat bantu penempatan hierarki |
| Status | BELUM DIKERJAKAN - menunggu persetujuan rancangan |
| Temuan | `prompt/docs/FINDINGS_LOG.md` #22 (urutan aman), #19 (master duplikat) |
| Mendahului | TASK_13 |

## Tujuan

571 penautan fitur 4 pada periode 2026 belum punya induk fitur 3. Menautkannya
satu per satu lewat tombol "Hubungkan ke kegiatan" di /kinerja tab Fitur 1-4
berarti 571 keputusan pada daftar 15 baris per halaman.

Task ini menurunkan jumlah keputusan menjadi puluhan dengan cara mengelompokkan
indikator yang belum tertaut, tanpa pernah menebak tujuannya sendiri. **Tidak ada
pemetaan otomatis.** Setiap grup tetap dipilihkan kegiatan fitur 3 oleh pengguna.

## Fakta Data (`dev_simdalin`, 2026-09-20)

| Data | Kondisi |
|------|---------|
| Fitur 4 periode 2026 | 896 penautan; 325 punya induk, **571 belum** |
| Struktur 2026 | 3 IKU, 9 kegiatan Wadir, **19 kegiatan Kabag/Kabid** milik 7 jabatan (id 173-179) |
| Struktur 2023/2024/2025 | 4/25/55 tiap tahun, salinan pohon legacy yang sama |
| Lineage fitur 3 yang sama antara 2024 dan 2026 | **0** - pohon 2026 hasil impor Excel, tidak bisa dipetakan mekanis |
| Asal 571 master itu di hierarki 2024 | **42 kegiatan**; terbesar 173, median 7, terkecil 1 |
| Grup pembuangan | 173 di bawah "Meningkatnya Mutu Pelayanan Rumah Sakit" (nama identik di fitur 1/2/3) dan 23 di bawah "LAIN - LAIN" = 196 dari 571 (34%) |
| Unit pada 571 itu | 73 unit layanan |
| Unit pada 325 yang sudah tertaut | 11 unit tim kerja, **irisan 0** dengan 73 unit di atas |
| `kinerja_penanggung_jawab_units` | **0 baris** - belum ada peta unit -> jabatan |
| Register 2026 | 129, memakai **54 indikator master** yang berbeda, semuanya belum tertaut, berasal dari 18 kegiatan 2024, tersebar di 28 unit |
| Rincian 54 itu | **4 indikator ber-`location_id` 0 (semua unit) dipakai 75 register** - #234 ".LAIN - LAIN" sendiri 62 register - dan 50 indikator milik unit tertentu dipakai 54 register |
| Kamus MUTU | 373, **semuanya** menunjuk master yang belum tertaut 2026 |

Kesimpulan: riwayat penempatan ada di 2024/2025, tetapi 55 kegiatan lama tidak
punya padanan mekanis ke 19 kegiatan baru. Pengelompokan boleh diturunkan dari
data; pemilihan target tidak boleh.

## Lingkup

Termasuk:
- Panel penautan massal pada /kinerja tab Fitur 1-4 tingkat 4.
- Endpoint baru untuk menyimpan satu grup dalam satu transaksi.
- Log aktivitas per operasi agar dapat diaudit dan dibalik.

Tidak termasuk:
- Perubahan rantai join export (itu TASK_13).
- Penggabungan master duplikat (temuan #19).
- Pengisian `kinerja_penanggung_jawab_units` (lihat "Pengungkit" di bawah).

## Rancangan

### Prioritas kerja

Untuk membuat laporan 2026 benar, yang **wajib** ditautkan hanya **54 indikator
master** yang dipakai register 2026 (18 grup asal). "Master" di sini berarti baris
`indikator_fitur4s` tanpa periode - kamus indikator mutu permanen hasil TASK_11
yang disimpan `risk_registers.indikator_fitur4_id`. Bukan PIC dan bukan unit; 129
register itu melibatkan 43 `pic_id` dan 28 unit, angka yang berbeda.

Sisa 517 hanya memengaruhi kelengkapan bagan dan Ekspor Cascading dan boleh
menyusul. Panel harus bisa menyaring "hanya yang dipakai register tahun ini"
supaya 18 grup itu dikerjakan lebih dulu.

Empat indikator terbesar layak dikerjakan manual lebih dulu karena
`location_id`-nya 0 (berlaku semua unit) dan menutupi 75 dari 129 register:

| Master | Register | Nama |
|--------|----------|------|
| #234 | 62 | `.LAIN - LAIN` |
| #239 | 8 | Meningkatnya Mutu Pelayanan Rumah Sakit |
| #241 | 3 | Meningkatnya Tingkat Kemandirian Keuangan |
| #240 | 2 | Tercapainya Standar Pelayanan Minimal RS |

Keempatnya indikator pembuangan tanpa unit pemilik, jadi kegiatan fitur 3
tujuannya murni keputusan pengguna dan tidak ada petunjuk data yang bisa
membantu. 50 indikator sisanya milik unit tertentu dan menutupi 54 register.

### UI

Panel baru di tab Fitur 1-4 ketika tingkat 4 dipilih, di samping badge
"Belum terhubung fitur 1-3" yang sudah ada:

1. Daftar grup indikator yang belum tertaut. Sumbu grup dapat ditukar:
   - **asal kegiatan tahun sebelumnya** (42 grup untuk seluruh 571),
   - **unit** (73 grup).
2. Tiap grup menampilkan konteks asalnya - nama fitur 1 / 2 / 3 tahun sumber,
   jumlah indikator, daftar unit, dan penanda bila dipakai register tahun ini.
3. Target: **satu pilihan kegiatan fitur 3** tahun aktif, konsisten dengan form
   satuan yang sudah ada. Fitur 1 dan 2 mengikuti pilihan itu.
4. Checkbox per baris di dalam grup supaya grup besar (173 baris) dapat dipecah.
5. Pratinjau sebelum simpan: jumlah baris, unit, kegiatan tujuan, dan kode
   cascading hasilnya.

Grup "Meningkatnya Mutu Pelayanan Rumah Sakit" (173) dan "LAIN - LAIN" (23)
adalah tempat pembuangan. Untuk keduanya sumbu **unit** yang lebih masuk akal,
karena indikator satu unit layanan hampir selalu jatuh ke satu Kabag/Kabid.

### Endpoint

`POST kinerja/{period}/nodes/4/bulk` (nama menyusul konvensi `kinerja.nodes`).

Validasi:
- `indikator_fitur3_id` wajib, `exists` pada periode itu dan `is_active`.
- `ids` array penautan fitur 4 milik periode itu.
- Periode harus `draft` atau `aktif`; ditutup ditolak.

Penyimpanan per baris memakai jalur yang sama dengan `saveNode` tingkat 4 supaya
tidak ada logika kedua: set `indikator_fitur3_id`, `sasaran_strategis_id`
turunan dari kegiatan, lalu `OperationalConceptLink::sync`. Baris yang sudah
punya induk **dilewati**, tidak ditimpa, kecuali pengguna mencentang "timpa".

### Aturan bisnis

- Unit indikator tidak berubah; `Fitur4Master::SHARED` tetap tidak memuat
  `indikator_fitur3_id`, jadi penautan tetap milik tahun itu saja.
- Satu entri `activity('indikator_tahunan')` per operasi massal berisi daftar ID
  dan kegiatan tujuan.
- Idempotent: menjalankan grup yang sama dua kali tidak mengubah apa pun.

### Pengungkit yang disarankan lebih dulu

Mengisi `kinerja_penanggung_jawab_units` (opsi (a) temuan #18) membuat panel bisa
menyaring 19 kegiatan menjadi 2-3 kegiatan milik Kabag/Kabid yang membawahi unit
tersebut. Pilihan 19-arah menjadi 3-arah, dan temuan #18 (78 akun PIC unit tidak
bisa input risiko 2026) ikut selesai. Tabel itu sekarang kosong karena 571 master
legacy tidak punya `jabatan`, sehingga `CascadingYearsPreparation::positions()`
tidak menemukan apa pun untuk ditautkan.

## Tahapan

1. Endpoint massal + test, tanpa UI.
2. Panel UI dengan sumbu grup "asal kegiatan" dan pratinjau.
3. Sumbu grup "unit" dan saringan "dipakai register tahun ini".
4. Penautan 54 master prioritas oleh pengguna (bukan oleh kode).

## Verifikasi

- Test baru dengan `DatabaseTransactions`: satu grup tersimpan, baris yang sudah
  punya induk dilewati, periode ditutup ditolak, kegiatan tidak aktif ditolak,
  dan `sasaran_strategis_id` mengikuti kegiatan tujuan.
- `php artisan test` dibanding baseline di `CLAUDE.md`.
- `npm run build`.
- Manual: tautkan satu grup kecil, periksa bagan Cascading dan Ekspor Cascading
  memuat indikatornya, lalu periksa banner "belum ditempatkan" berkurang sesuai
  jumlahnya.

## Risiko

- Operasi massal menyentuh banyak baris sekaligus. Mitigasi: satu transaksi,
  pratinjau wajib, log aktivitas, dan tidak menimpa baris yang sudah tertaut.
- Setelah 571 tertaut, bagan 2026 tumbuh dari 325 menjadi 896 node. Ekspor
  Cascading ikut membesar. Perlu dipastikan pengguna memang menginginkan seluruh
  571 masuk dokumen, bukan hanya yang dilaporkan ke BPKP.

## Pertanyaan Untuk User

1. Apakah seluruh 571 memang harus masuk dokumen Cascading, atau cukup yang
   dilaporkan? Jawaban ini menentukan apakah pekerjaan berhenti di 54 atau lanjut
   ke 571.
2. Isi `kinerja_penanggung_jawab_units` dulu supaya pilihan kegiatan menyempit?

## Aman di-merge?

Belum dikerjakan.
