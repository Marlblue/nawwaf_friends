// Membuat salinan gambar public/ dalam beberapa lebar saat build, supaya sharp tidak pernah
// jalan di hosting. Optimizer Next (/_next/image) dulu memperkecil gambar di server cPanel,
// dan dengan cache kosong (tiap habis deploy) satu kunjungan memicu belasan proses sharp
// serentak; sebagian dibalas 508 karena batas proses akun. Pola yang sama dengan sdbi.
//
// Hasil: public/_img/w<lebar>/<path asli>.webp, ikut di-commit.
// Manifest: lib/localImageVariants.ts — lebar varian terbesar dan hash pendek tiap sumber,
// dibaca lib/image-loader.ts (yang juga jalan di browser, jadi tidak bisa membaca disk).
//
// Pemakaian: node scripts/generate-image-variants.mjs (dijalankan otomatis oleh build:cpanel).
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");
const OUT_DIR = path.join(PUBLIC_DIR, "_img");
const MANIFEST = path.join(ROOT, "lib", "localImageVariants.ts");

// Mengikuti deviceSizes di next.config.ts (1920 diganti 1600: di atas itu berkas asli
// dipakai). 256 untuk slot kecil di layar 2x. Sumber hanya mendapat varian yang lebih
// sempit darinya, jadi tidak ada yang diperbesar.
const LADDER = [256, 384, 480, 640, 828, 1080, 1280, 1600];
// Di bawah ini, penghematannya lebih kecil dari biaya berkas tambahannya (jatah inode).
const MIN_SOURCE_BYTES = 15 * 1024;
const QUALITY = 80;
const EXTENSIONS = [".webp", ".png", ".jpg", ".jpeg"];
// Foto menu sudah dipotong tangan dan tidak lewat loader (components/SiteImage.tsx).
const SKIP_DIRS = [OUT_DIR, path.join(PUBLIC_DIR, "images", "menu")];

async function findSources(dir) {
  const results = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.includes(full)) results.push(...(await findSources(full)));
    } else if (EXTENSIONS.includes(path.extname(entry.name).toLowerCase())) {
      results.push(full);
    }
  }
  return results;
}

const toPublicPath = (full) => "/" + path.relative(PUBLIC_DIR, full).split(path.sep).join("/");
const toVariantPath = (publicPath, width) => `/_img/w${width}${publicPath.replace(/\.(webp|png|jpe?g)$/i, ".webp")}`;
const stem = (p) => p.replace(/\.(webp|png|jpe?g)$/i, "");

// Varian yang sumbernya sudah dihapus atau diganti nama; tidak ada yang lain yang membuangnya.
async function removeOrphans(publicPaths) {
  const live = new Set([...publicPaths].map(stem));
  let removed = 0;
  async function sweep(dir) {
    for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await sweep(full);
        if ((await fs.readdir(full)).length === 0) await fs.rmdir(full);
        continue;
      }
      // "_img/w640/venue.webp" -> "/venue"
      const rel = path.relative(OUT_DIR, full).split(path.sep).slice(1).join("/");
      if (!live.has(stem("/" + rel))) {
        await fs.unlink(full);
        removed++;
      }
    }
  }
  await sweep(OUT_DIR).catch((err) => {
    if (err.code !== "ENOENT") throw err;
  });
  return removed;
}

const sources = await findSources(PUBLIC_DIR);
const manifest = {};
const versions = {};
let written = 0;

for (const source of sources) {
  const publicPath = toPublicPath(source);
  const buf = await fs.readFile(source);
  // Hash sumber dipakai sebagai ?v=: gambar disajikan immutable setahun, jadi berkas yang
  // diganti dengan nama sama butuh URL baru. Juga untuk gambar yang terlalu kecil diberi varian.
  versions[publicPath] = createHash("sha1").update(buf).digest("hex").slice(0, 8);
  if (buf.length < MIN_SOURCE_BYTES) continue;

  const { width } = await sharp(buf).metadata();
  const steps = LADDER.filter((step) => step < width);
  if (steps.length === 0) continue;

  for (const step of steps) {
    const out = path.join(PUBLIC_DIR, toVariantPath(publicPath, step).slice(1));
    // Selalu dibuat ulang (cuma belasan gambar, beberapa detik): gambar yang diganti dengan
    // nama sama tidak boleh tertinggal dengan varian lama. Hasil sharp deterministik, jadi
    // berkas yang tidak berubah juga tidak muncul di git diff.
    await fs.mkdir(path.dirname(out), { recursive: true });
    await sharp(buf).resize(step, null, { withoutEnlargement: true }).webp({ quality: QUALITY }).toFile(out);
    written++;
  }
  manifest[publicPath] = steps[steps.length - 1];
}

const removed = await removeOrphans(new Set(sources.map(toPublicPath)));
const lines = (obj, fmt) => Object.keys(obj).sort().map((k) => `  ${JSON.stringify(k)}: ${fmt(obj[k])},`).join("\n");

await fs.writeFile(
  MANIFEST,
  `// DIBUAT OTOMATIS oleh scripts/generate-image-variants.mjs. Jangan diedit tangan.

export const VARIANT_LADDER = [${LADDER.join(", ")}] as const;

/** Lebar varian terbesar tiap gambar public/ yang punya varian di /_img. */
export const localImageVariants: Record<string, number> = {
${lines(manifest, String)}
};

/** Hash pendek tiap berkas sumber, dipasang loader sebagai ?v=. */
export const localImageVersions: Record<string, string> = {
${lines(versions, JSON.stringify)}
};
`,
);

console.log(`OK ${Object.keys(manifest).length} gambar punya varian, ${written} varian ditulis${removed ? `, ${removed} yatim dihapus` : ""}`);
