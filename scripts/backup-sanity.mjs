/**
 * Salin dokumen Sanity (artikel dan metadata gambar) ke NDJSON, dan kalau diminta
 * juga berkas gambarnya.
 *
 *   node scripts/backup-sanity.mjs [folder-tujuan] [--gambar]
 *
 * Berkas ini sama persis di nawwaf_friends, kalih-signature, dan sdbi; ubah ketiganya bersamaan.
 * Dijalankan oleh .github/workflows/sanity-backup.yml: dokumen setiap hari, gambar
 * sebulan sekali (gambar jauh lebih besar dan nyaris tidak pernah berubah).
 *
 * Tanpa token: dataset ini publik dan situsnya sendiri membacanya tanpa token, jadi
 * backup tidak perlu kunci baru di GitHub. Akibatnya yang tersimpan cuma dokumen yang
 * sudah dipublish. Draft di Studio tidak ikut, dan memang bukan bagian dari situs.
 *
 * Project ID dan dataset dibaca dari env NEXT_PUBLIC_SANITY_* (sama dengan build),
 * atau dari .env.local kalau dijalankan di laptop.
 *
 * Keluar dengan kode bukan nol kalau jumlah dokumen tidak cocok dengan hitungan
 * server, atau ada gambar yang gagal diunduh.
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');

function bacaEnvLocal() {
  const berkas = path.join(ROOT, '.env.local');
  if (!fs.existsSync(berkas)) return {};
  const hasil = {};
  for (const baris of fs.readFileSync(berkas, 'utf8').split(/\r?\n/)) {
    const m = baris.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) hasil[m[1]] = m[2].trim().replace(/^(['"])(.*)\1$/, '$2');
  }
  return hasil;
}

const env = { ...bacaEnvLocal(), ...process.env };
const PROJECT = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = env.NEXT_PUBLIC_SANITY_DATASET || 'production';
if (!PROJECT) {
  console.error('NEXT_PUBLIC_SANITY_PROJECT_ID kosong.');
  process.exit(1);
}

const args = process.argv.slice(2);
const denganGambar = args.includes('--gambar');
const tujuan = path.resolve(args.find((a) => !a.startsWith('--')) || 'backup-sanity');
fs.mkdirSync(tujuan, { recursive: true });

async function groq(query) {
  const url = `https://${PROJECT}.api.sanity.io/v2025-01-01/data/query/${DATASET}?query=${encodeURIComponent(query)}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(60_000) });
  if (!res.ok) throw new Error(`GROQ HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return (await res.json()).result;
}

// Dua query terpisah dengan sengaja: hitungannya dipakai membuktikan tidak ada dokumen
// yang terpotong dari respons besar.
const total = await groq('count(*)');
const dokumen = await groq('*[] | order(_id asc)');
if (dokumen.length !== total) {
  console.error(`Terbaca ${dokumen.length} dokumen, server menghitung ${total}.`);
  process.exit(1);
}

// NDJSON: satu dokumen per baris, format yang dibaca `sanity dataset import`.
fs.writeFileSync(path.join(tujuan, `${DATASET}.ndjson`), dokumen.map((d) => JSON.stringify(d)).join('\n') + '\n');

const perTipe = {};
for (const d of dokumen) perTipe[d._type] = (perTipe[d._type] ?? 0) + 1;
console.log(`${dokumen.length} dokumen:`, perTipe);

let gagal = 0;
let jumlahGambar = 0;
if (denganGambar) {
  const folder = path.join(tujuan, 'gambar');
  fs.mkdirSync(folder, { recursive: true });
  for (const aset of dokumen.filter((d) => d._type === 'sanity.imageAsset' && d.url)) {
    try {
      const res = await fetch(aset.url, { signal: AbortSignal.timeout(60_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      // Nama berkas di CDN Sanity = hash isi + dimensi, jadi unik dan bisa dicocokkan
      // kembali ke dokumen asetnya lewat field `url`.
      fs.writeFileSync(path.join(folder, path.basename(new URL(aset.url).pathname)), Buffer.from(await res.arrayBuffer()));
      jumlahGambar++;
    } catch (err) {
      gagal++;
      console.error(`Gagal mengunduh ${aset.url}: ${err.message}`);
    }
  }
  console.log(`${jumlahGambar} gambar diunduh, ${gagal} gagal.`);
}

fs.writeFileSync(
  path.join(tujuan, 'ringkasan.json'),
  JSON.stringify(
    { dibuat: new Date().toISOString(), project: PROJECT, dataset: DATASET, dokumen: perTipe, gambar: denganGambar ? jumlahGambar : 'tidak diunduh', gambarGagal: gagal },
    null,
    2
  ) + '\n'
);
process.exit(gagal ? 1 : 0);
