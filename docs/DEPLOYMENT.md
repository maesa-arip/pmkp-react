# Deployment production

Alur kode: **lokal → GitHub (`maesa-arip/pmkp-react`, branch `main`) → server production**.
Server menggunakan deploy key khusus dengan akses baca saja. Private key tetap
di home user deployment pada server; hanya public key yang didaftarkan ke GitHub.
Deploy key menyediakan akses Git, bukan pemicu deployment otomatis.

Server tujuan: `root@10.60.11.102`, port SSH `22`. Aplikasi berada di bawah
`/var/www`; tentukan folder checkout yang berisi `.git` sebelum menjalankan
langkah `connect` dan deployment.

## Pemasangan pertama

Jalankan sebagai user Linux pemilik checkout production, agar user yang melakukan
`git fetch` memakai key dan konfigurasi Git yang sama. Salin skrip
`scripts/setup-deploy-key.sh` ke server untuk bootstrap; kode aplikasi selanjutnya
tetap diambil dari GitHub. Skrip ini ditujukan untuk checkout Git yang sudah ada.

Contoh dari PowerShell lokal setelah autentikasi SSH tersedia:

```powershell
scp -P 22 scripts/setup-deploy-key.sh root@10.60.11.102:/root/setup-simdalin-deploy-key.sh
ssh -p 22 root@10.60.11.102
```

Pada sesi SSH server:

```bash
bash /root/setup-simdalin-deploy-key.sh prepare
find /var/www -maxdepth 3 -type d -name .git -print
```

Skrip membuat `~/.ssh/simdalin-production/id_ed25519` tanpa passphrase untuk
deployment noninteraktif, melindunginya dengan izin `600`, dan menampilkan public
key. Menjalankan `prepare` kembali menggunakan private key yang sama.

Buka [Deploy keys repository](https://github.com/maesa-arip/pmkp-react/settings/keys),
pilih **Add deploy key**, isi judul `simdalin-production`, lalu tempel public key.
Biarkan **Allow write access** tidak dicentang.

Setelah public key terdaftar, ganti path contoh berikut dengan folder production:

```bash
bash /root/setup-simdalin-deploy-key.sh connect /path/to/production
```

Skrip memverifikasi akses ke branch `main` sebelum mengganti `origin` checkout
production ke SSH dan memasang `core.sshCommand` khusus repository. Konfigurasi
Git lokal pengembang tetap menggunakan kredensial GitHub pengembang. Host key
GitHub diverifikasi menggunakan key Ed25519 yang diterbitkan dalam
[dokumentasi resmi GitHub](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/githubs-ssh-key-fingerprints).
Jika key host berubah, verifikasi ulang melalui dokumentasi resmi sebelum
memperbaruinya.

## Mengirim rilis

Di lokal, selesaikan pemeriksaan perubahan dan build frontend:

```bash
npm ci
npm run build
git status --short
# Stage hanya file rilis yang ditinjau, termasuk public/build bila berubah.
# Buat commit rilis sebelum push; jangan sertakan .env, private key, atau backup database.
git push origin main
```

`public/build` saat ini dilacak Git, sehingga aset hasil build harus masuk commit
rilis. `bootstrap/ssr` diabaikan Git; bila production menjalankan Inertia SSR,
bundle SSR harus dibangun di server dan proses SSR direstart sesuai konfigurasi
server.

Di server, pastikan branch aktif `main` dan working tree bersih. Jika ada
perubahan server atau commit yang menyimpang, tinjau dahulu; jangan memakai
`reset --hard` untuk melewatinya.

```bash
cd /path/to/production
git branch --show-current
git status --short
git fetch origin main
git log --oneline HEAD..origin/main
git diff --stat HEAD origin/main
```

Setelah commit rilis ditinjau dan backup yang diperlukan siap, gunakan
`git merge --ff-only origin/main` untuk mengambil kode. Jalankan
`composer install --no-dev --prefer-dist --optimize-autoloader` jika dependensi
berubah, lalu `php artisan config:cache` dan `php artisan view:cache`.
Migrasi database (`php artisan migrate --force`) hanya dilakukan jika rilis
memerlukannya, sesudah meninjau migrasi dan menyiapkan backup. Restart worker
queue/SSR bila digunakan, lalu periksa halaman aplikasi dan log production.

Panduan ini belum menetapkan proses maintenance, restart service, atau pemicu
otomatis karena konfigurasi server production perlu dikonfirmasi terlebih dahulu.


## Cascading 2024–2026

Untuk permintaan eksekusi cascading production, ikuti [panduan khusus cascading 2024–2026](CASCADING-PRODUCTION-2024-2026.md). Panduan tersebut memuat sumber, status setiap tahun, cakupan tabel, prasyarat command, backup, serta audit. [Hasil lokal](CASCADING-2024-2026.md) merupakan acuan verifikasi, bukan database atau ID yang disalin langsung ke production.
