# Audit input dan edit Risk Register & Mutu Indikator

Tanggal: 18 September 2026. Hasil: **belum seluruhnya lulus; tujuh kelompok bug dikonfirmasi pada Risk Register.**

Cakupan hanya `/riskRegisterKlinis`, `/riskRegisterNonKlinis`, dan `/MutuIndikator`, termasuk FGD Inherent/Residual/Treated/Actual, RCA, OSD Residual, serta pencatatan kejadian yang dibuka dari dua halaman risiko. Modul lain tidak menjadi kesimpulan laporan ini.

## Lingkungan dan metode

- Backend diuji pada salinan database lokal `simdalin_qa_input_20260917_144352`, menggunakan transaksi yang dibatalkan setelah setiap test. Tidak menjalankan pengujian tulis ke production.
- Pengujian audit menggunakan akun `adminmr@rsbm.com` dari salinan database, tanpa `Gate::before` untuk meloloskan izin. Akun tanpa role dibuat sementara hanya untuk menguji penolakan akses.
- Browser Puppeteer menjalankan komponen React asli dengan Tailwind dan opsi yang diekspor dari controller. Transport Inertia diganti fixture untuk menangkap payload. Payload form utama dan subform kemudian dikirim ke route Laravel sebenarnya oleh pengujian backend, dan hasil database diperiksa.
- Ini pengujian UI dan backend yang dihubungkan lewat payload, **bukan sesi browser login end-to-end pada aplikasi berjalan**. Cookie, CSRF, proxy, dan koneksi browser-server langsung belum diverifikasi dalam audit ini.

## Rekap pengujian

| Kelompok | Hasil |
| --- | --- |
| Regression backend `RiskRegisterInputTest`, `MutuIndicatorAdminAccessTest`, `MutuIndicatorPenyebutTest` | 25 lulus, 182 assertion |
| Audit backend tambahan `ScopedInputEditAuditTest` | 40 test: 28 lulus, 12 gagal; 850 assertion; tidak ada error setup/runtime |
| Gabungan backend dalam cakupan | **65 test: 53 lulus, 12 gagal; 1.032 assertion** |
| Browser form utama risiko | 4 payload tambah/edit ditangkap; bug celah, kirim ganda, dan PIC 0 terkonfirmasi; tidak ada error JavaScript |
| Browser subform risiko | 24 payload dari 6 form × 2 jenis risiko × input awal/edit; tidak ada error JavaScript; semua tombol simpan subform masih dapat mengirim ganda |
| Browser Mutu dengan opsi admin | Lulus; 325 indikator tahun 2026 muncul setelah Ya → Tidak; empat penyebut tetap string |
| Build client + SSR | `npm run build` lulus |

Dua belas kegagalan backend adalah reproduksi bug yang disengaja: kronologi 2 kasus, akses akun 2 kasus, salah endpoint jenis risiko 2 kasus, dan simpan sebagian FGD 6 kasus. Pengujian diagnostik browser mencatat masalah UI tanpa sengaja menggagalkan seluruh proses, sehingga exit code 0 pada script browser **tidak berarti bebas bug**.

## Alur yang berhasil

1. **Risk Register Klinis dan Non Klinis:** tambah dari input browser, edit field teks, pilihan master, PIC/indikator yang cocok, tanggal, target waktu 90 → 365, dan numerator menjadi 0 tersimpan. Kode risiko dan snapshot indikator terbentuk.
2. **FGD Inherent, Residual, Treated, Actual:** pengisian awal dan edit responden pada kedua jenis risiko tersimpan; nilai dampak dan probabilitas hasil form tersimpan pada register.
3. **RCA:** Why 1–5 dan akar penyebab tersimpan dan dapat diedit. Periode ditutup menolak penambahan RCA.
4. **OSD Residual:** penilaian, status pelaksanaan/efektivitas (termasuk nilai 0), kendala, usulan, output, dokumen, implementasi, dan realisasi tersimpan dan dapat diedit.
5. **Catat kejadian:** status berubah menjadi sedang terjadi; riwayat baru dan dampak kejadian tersimpan, diuji lewat backend menggunakan payload model seperti modal.
6. **Mutu Indikator:** akun admin berhasil tambah dengan indikator baru maupun lama dan edit untuk `%`, `‰`, `Menit`, `Satuan`. Target 95,5 dan 0, operator, serta nama denominator tersimpan. Error penyebut harus string yang dilaporkan sebelumnya tidak muncul pada nilai dropdown yang benar.
7. **Mutu UI:** dropdown Ya/Tidak, pemilihan tahun/induk, validasi, batal, pencegahan kirim ganda, mode terang/gelap, dan lebar 320/390/1440 px lulus. Form utama risiko tidak meluber horizontal pada 390 px.

Hasil berhasil ini berlaku untuk skenario dan data yang diuji; tidak menghapus kegagalan di bawah.

## Bug yang masih ditemukan

### RR-01 — Celah Pengendalian tidak dapat diisi/diganti (sedang)

**Lokasi:** form tambah dan edit Klinis serta Non Klinis.

**Reproduksi:** buka Tambah → Celah Pengendalian. Daftar berisi **0 pilihan**. Buka Edit dengan nilai tersimpan `Celah lama`: daftar hanya berisi nilai lama tersebut, tanpa cara memasukkan atau memilih nilai pengganti.

**Penyebab:** opsi dropdown dibentuk dari nilai field itu sendiri, sedangkan komponen Select tidak menerima input bebas.

- [Klinis/Form.jsx:70](C:/laragon/www/simdalin/resources/js/Pages/RiskRegister/Klinis/Form.jsx:70)
- [NonKlinis/Form.jsx:44](C:/laragon/www/simdalin/resources/js/Pages/RiskRegister/NonKlinis/Form.jsx:44)

**Harapan:** pengguna dapat menulis celah pengendalian atau memilih dari sumber opsi yang lengkap. Data dapat disimpan dengan field kosong karena backend menjadikannya nullable; keberhasilan simpan tidak membuktikan field ini berfungsi.

### RR-02 — Tombol simpan edit dan subform dapat mengirim dua kali (sedang)

**Reproduksi:** klik Simpan, biarkan request pending, klik lagi. Pengujian browser mencatat **2 pemanggilan request**; tombol tetap aktif.

**Terkena:** Edit Klinis/Non Klinis, FGD Inherent/Residual/Treated/Actual, RCA, dan OSD Residual. Tombol tambah utama risiko dan tambah/edit Mutu lulus pengaman processing.

**Penyebab:** `processing` tidak diambil dari `useForm`, tidak diteruskan ke tombol, dan handler tidak memiliki guard request pending.

- [Klinis/Edit.jsx:64](C:/laragon/www/simdalin/resources/js/Pages/RiskRegister/Klinis/Edit.jsx:64)
- [NonKlinis/Edit.jsx:66](C:/laragon/www/simdalin/resources/js/Pages/RiskRegister/NonKlinis/Edit.jsx:66)
- [KlinisFGDInherent/Edit.jsx:47](C:/laragon/www/simdalin/resources/js/Pages/RiskRegister/KlinisFGDInherent/Edit.jsx:47)
- [KlinisFGDResidual/Edit.jsx:42](C:/laragon/www/simdalin/resources/js/Pages/RiskRegister/KlinisFGDResidual/Edit.jsx:42)
- [KlinisFGDTreated/Edit.jsx:41](C:/laragon/www/simdalin/resources/js/Pages/RiskRegister/KlinisFGDTreated/Edit.jsx:41)
- [KlinisFGDActual/Edit.jsx:41](C:/laragon/www/simdalin/resources/js/Pages/RiskRegister/KlinisFGDActual/Edit.jsx:41)
- [KlinisFormulirRCA/Edit.jsx:27](C:/laragon/www/simdalin/resources/js/Pages/RiskRegister/KlinisFormulirRCA/Edit.jsx:27)
- [KlinisOsd2/Edit.jsx:58](C:/laragon/www/simdalin/resources/js/Pages/RiskRegister/KlinisOsd2/Edit.jsx:58)

Temuan ini membuktikan pengiriman ganda dari UI; audit belum menguji race condition dua transaksi serentak.

### RR-03 — Pilihan SEMUA UNIT tidak sesuai kontrak backend (sedang)

**Reproduksi:** pilih SEMUA UNIT pada PIC Unit Terkait. UI menghasilkan `pic_id: "0"`. Kirim data lain valid dengan nilai ini: kedua endpoint menolak pada `indikator_fitur4_id` dan tidak membuat register.

**Penyebab:** shared combobox selalu menambahkan opsi 0, tetapi `acceptsPics()` secara eksplisit menolak PIC 0. Pengguna diberi pilihan yang tidak bisa disimpan.

- [ComboboxMultiple.jsx:46](C:/laragon/www/simdalin/resources/js/Components/ComboboxMultiple.jsx:46)
- [AnnualIndicatorService.php:219](C:/laragon/www/simdalin/app/Services/AnnualIndicatorService.php:219)

**Harapan:** pilihan PIC sesuai aturan backend; jika semua unit didukung, UI perlu mengirim daftar PIC konkret yang cocok dengan indikator.

### RR-04 — Edit kategori insiden melewati kewajiban kronologi (sedang)

**Reproduksi:** tambah register kategori 5 dengan data valid. Edit kategori menjadi 6, biarkan `kronologi` kosong. Update berhasil. Payload kategori 6 yang sama ditolak ketika digunakan untuk tambah.

**Penyebab:** `required_if:risk_category_id,6` hanya ada pada store; tidak ada di validasi update.

- [RiskRegisterKlinisController.php:226](C:/laragon/www/simdalin/app/Http/Controllers/RiskRegisterKlinisController.php:226), bandingkan store baris 147.
- [RiskRegisterNonKlinisController.php:229](C:/laragon/www/simdalin/app/Http/Controllers/RiskRegisterNonKlinisController.php:229), bandingkan store baris 144.

**Harapan:** tambah dan edit menerapkan kewajiban kronologi yang sama.

### RR-05 — Akun tanpa hak risiko dapat mengubah register milik akun lain (tinggi)

**Reproduksi di QA:** admin membuat register. Login pengujian sebagai akun baru tanpa role, tanpa permission, dan tanpa PIC. Kirim PUT ke ID register tersebut dengan indikator, tahun, dan PIC tetap, tetapi ubah `resiko`. Respons HTTP 302 dan perubahan **benar-benar tersimpan**, untuk kedua jenis risiko.

**Penyebab:** update mengambil record berdasarkan ID tanpa pemeriksaan izin pemilik/cakupan; observer hanya memeriksa cakupan indikator ketika indikator, tahun, atau PIC berubah.

- [RiskRegisterKlinisController.php:284](C:/laragon/www/simdalin/app/Http/Controllers/RiskRegisterKlinisController.php:284)
- [RiskRegisterNonKlinisController.php:288](C:/laragon/www/simdalin/app/Http/Controllers/RiskRegisterNonKlinisController.php:288)
- [AnnualRiskObserver.php:38](C:/laragon/www/simdalin/app/Observers/AnnualRiskObserver.php:38)

**Harapan:** backend menolak akun yang tidak berhak sebelum perubahan apa pun. Menyembunyikan tombol di UI tidak cukup.

### RR-06 — Endpoint edit menerima register jenis lain (sedang)

**Reproduksi:** kirim update register Klinis melalui `riskRegisterNonKlinis.update`, lalu sebaliknya. Perubahan field tersimpan pada kedua percobaan.

**Penyebab:** pencarian record hanya memakai ID, tanpa pembatasan `tipe_id`. Lokasi sama dengan RR-05.

**Harapan:** endpoint tiap jenis hanya menerima record jenis tersebut. Temuan ini dilaporkan terpisah dari akses akun karena dapat terjadi walaupun pemanggil adalah admin.

### RR-07 — FGD gagal validasi tetapi data responden terlanjur tersimpan (tinggi)

**Reproduksi:** kirim 8 nilai dampak dan 8 probabilitas valid, tetapi kosongkan skor agregat `osd2_dampak`, `osd3_dampak`, atau `osd4_dampak`. Respons berisi error validasi, namun row responden FGD sudah ada di database. Direproduksi pada Residual, Treated, Actual, masing-masing untuk Klinis dan Non Klinis.

**Penyebab:** `updateOrCreate()` dijalankan sebelum validasi skor agregat, tanpa transaksi yang membatalkan perubahan saat validasi berikutnya gagal.

- [RiskRegisterKlinisController.php:439](C:/laragon/www/simdalin/app/Http/Controllers/RiskRegisterKlinisController.php:439) — Residual.
- [RiskRegisterKlinisController.php:498](C:/laragon/www/simdalin/app/Http/Controllers/RiskRegisterKlinisController.php:498) — Treated.
- [RiskRegisterKlinisController.php:555](C:/laragon/www/simdalin/app/Http/Controllers/RiskRegisterKlinisController.php:555) — Actual.

**Harapan:** validasi seluruh payload dilakukan sebelum menulis, dan perubahan child/register dilakukan dalam satu transaksi. Kasus ini memakai payload tidak valid secara sengaja; payload normal hasil browser untuk ketiga FGD berhasil disimpan.

## Bukti dan cara mengulang

- [Audit backend](C:/laragon/www/simdalin/tests/Audit/ScopedInputEditAuditTest.php).
- [Ekspor fixture risiko dari QA](C:/laragon/www/simdalin/tests/Audit/export-risk-fixtures.php).
- [Audit browser form utama](C:/laragon/www/simdalin/tests/Browser/risk-register-input-edit-audit.cjs).
- [Audit browser subform](C:/laragon/www/simdalin/tests/Browser/risk-register-subforms-audit.cjs).
- [Log audit backend](C:/laragon/www/simdalin/storage/app/input-edit-qa/scoped-audit.log) dan [JUnit](C:/laragon/www/simdalin/storage/app/input-edit-qa/scoped-audit-junit.xml).
- [Observasi browser utama](C:/laragon/www/simdalin/storage/app/input-edit-qa/browser-risk-observations.json), [subform](C:/laragon/www/simdalin/storage/app/input-edit-qa/browser-risk-subform-observations.json), [Mutu admin](C:/laragon/www/simdalin/storage/app/input-edit-qa/browser-mutu-admin.log).

Perintah PowerShell berikut memakai salinan QA yang telah disiapkan. Jangan mengganti DB_DATABASE dengan database operasional. File fixture/log berada di storage lokal dan tidak perlu dipublikasikan.

```powershell
$qa = Get-Content storage/app/input-edit-qa/databases.json | ConvertFrom-Json
$env:DB_DATABASE = $qa.populated
$env:APP_CONFIG_CACHE = Join-Path (Get-Location) 'storage/app/input-edit-qa/unused-config.php'
php tests/Audit/export-risk-fixtures.php
node tests/Browser/risk-register-input-edit-audit.cjs
node tests/Browser/risk-register-subforms-audit.cjs
php vendor/bin/phpunit tests/Audit/ScopedInputEditAuditTest.php --log-junit storage/app/input-edit-qa/scoped-audit-junit.xml
```

Audit ditempatkan di `tests/Audit` agar pengujian diagnostik yang saat ini masih merah tidak otomatis masuk suite Feature reguler. Ada guard nama database QA. Pengujian ini perlu fixture dari langkah sebelumnya dan master/data salinan yang tersedia pada audit.

## Status pekerjaan

Perbaikan Mutu sebelumnya telah diuji ulang. Tujuh bug risiko di atas **masih terbuka**; pada tahap audit ini yang ditambahkan adalah reproduksi, bukti pengujian, dan laporan, sesuai permintaan melaporkan kegagalan. Belum ada klaim bahwa ketiga modul bebas bug atau seluruh kombinasi input telah diuji.
## Pembaruan setelah pembuatan master Celah Pengendalian

18 September 2026: **RR-01 telah diperbaiki** melalui master Celah Pengendalian dan integrasi dropdown tambah/edit kedua jenis risiko. Detail penggunaan dan pengujian ada di [CELAH-PENGENDALIAN.md](C:/laragon/www/simdalin/docs/CELAH-PENGENDALIAN.md). Pengujian khusus dan regresi: 30 test / 254 assertion lulus; browser fixture dan build lulus. Hasil audit sebelumnya di atas merupakan catatan sebelum perbaikan. Enam kelompok temuan lain belum dinyatakan selesai.
## Pembaruan: RR-02 sampai RR-07 diperbaiki

18 September 2026: enam temuan lanjutan telah ditangani, termasuk tetap mendukung pilihan Semua Unit sesuai instruksi pengguna. Audit dan regresi backend kini **95 test / 1.321 assertion lulus**. Rincian perubahan, pengujian, serta batas verifikasi ada di [RISK-FIXES-2026-09-18.md](C:/laragon/www/simdalin/docs/RISK-FIXES-2026-09-18.md). Angka kegagalan dan status terbuka di bagian terdahulu adalah catatan historis sebelum perbaikan.