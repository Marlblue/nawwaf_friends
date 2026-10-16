# Nawwaf & Friends

Website [nawwafresto.com](https://nawwafresto.com): resto Arabian food di Ciangsana, Bogor.
Menu dan pesan antar lewat WhatsApp, venue, form kolaborasi KOL dan komunitas, dan artikel.

Next.js 16 (App Router) + Tailwind CSS 4, artikel dikelola lewat Sanity CMS, dan form
kolaborasi disimpan ke Google Sheet lewat Google Apps Script. Dihosting di DomaiNesia
sebagai aplikasi Node.js di cPanel (Passenger), bukan Vercel. Deploy otomatis setiap
push ke `main`.

Stack dan cara deploy-nya sama dengan kalih-signature dan sdbi, jadi perbaikan di salah
satunya biasanya bisa dipakai juga di sini.

## Menjalankan secara lokal

Butuh Node 24 dan pnpm (versinya dikunci lewat `packageManager` di `package.json`).

```bash
pnpm install
cp .env.example .env.local   # lalu isi nilainya
pnpm dev
```

`.env.example` adalah catatan semua env var yang dibutuhkan, lengkap dengan tempat
mengisinya di produksi. Setiap menambah env var baru, tambahkan juga di sana.

| Perintah            | Kegunaan                                                         |
| ------------------- | ---------------------------------------------------------------- |
| `pnpm dev`          | Server pengembangan                                              |
| `pnpm lint`         | ESLint                                                           |
| `pnpm typecheck`    | `tsc --noEmit`                                                   |
| `pnpm test`         | Unit test `lib/**/*.test.ts` (test runner bawaan Node lewat tsx)  |
| `pnpm cek:audit`    | Audit dependensi yang melayani pengunjung saja, bukan pohon Sanity |
| `pnpm build:cpanel` | Build produksi lalu rakit bundel cPanel di `deploy/`              |

`lint`, `typecheck`, `test`, `cek:audit`, dan build dijalankan otomatis di setiap pull request
lewat `.github/workflows/ci.yml`.

## Struktur

```
app/(site)/           Halaman situs publik (kebagian navbar dan footer lewat SiteShell)
app/studio/           Sanity Studio di /studio, sengaja di luar (site)
app/api/              Route handler form kolaborasi/komunitas dan webhook revalidate
components/           Komponen halaman; components/forms berisi field form
lib/site.ts           Nama, kontak, WhatsApp, alamat, jam buka, ID GTM
lib/menu.ts           Katalog menu dan harga
lib/forms/            Validasi, honeypot, dan pengiriman ke Apps Script
lib/sanity/           Client, query GROQ, dan helper gambar Sanity
lib/ops-alert.ts      Kabar ke grup Telegram
scripts/apps-script/  Isi Google Apps Script per form, bukan kode yang ikut di-build
```

Pesanan menu tidak disimpan di server: keranjang dirakit di browser lalu dikirim
sebagai pesan WhatsApp.

## Artikel (Sanity)

Editor membuka **/studio** di situs ini. Webhook Sanity memanggil `/api/revalidate`
setiap artikel dipublish, jadi tulisan baru langsung tampil tanpa deploy ulang (secret
`SANITY_REVALIDATE_SECRET`, lihat komentar di `app/api/revalidate/route.ts`).

### Backup

`.github/workflows/sanity-backup.yml` menyalin semua dokumen yang sudah dipublish ke
`production.ndjson` setiap hari jam 03.30 WIB, disimpan 90 hari; berkas gambarnya ikut
setiap tanggal 1 dan disimpan 35 hari. Draft di Studio tidak ikut. Tanpa token, karena
dataset-nya publik. Kalau gagal, grup Telegram dikabari.

Memulihkan artikel yang terhapus atau tertimpa:

1. Actions > Sanity backup > run terakhir sebelum kejadian > unduh `sanity-dokumen-*`.
2. Dari root repo ini: `pnpm exec sanity login`, lalu
   `pnpm exec sanity datasets import production.ndjson --project-id o8iiwin1 --dataset production --replace`.
   `--replace` menimpa dokumen dengan `_id` yang sama dan membiarkan yang lain; pakai
   `--missing` untuk cuma mengembalikan yang hilang. Cara yang sama sudah diuji di
   kalih-signature (lihat README-nya).

Backup manual dari laptop: `node scripts/backup-sanity.mjs [folder] [--gambar]`.

## Deploy

`.github/workflows/deploy.yml` jalan setiap push ke `main`: lint, audit, build di runner
GitHub (RAM shared hosting tidak cukup untuk `next build`), kirim hasilnya lewat rsync,
lalu restart Passenger dengan menyentuh `tmp/restart.txt`. Hasilnya dikabarkan ke grup
Telegram.

- Env var server (URL Apps Script, `FORMS_SHARED_SECRET`, `SANITY_REVALIDATE_SECRET`,
  `OPS_ALERT_WEBHOOK_URL`) diisi di cPanel > Setup Node.js App.
- `NEXT_PUBLIC_*` dibaca saat build, jadi diisi sebagai repository Variables GitHub.
- Secrets SSH-nya tercantum di komentar pembuka `deploy.yml`.

`.github/workflows/uptime.yml` mengecek situs tiap 30 menit dan mengabari grup Telegram
kalau mati.
