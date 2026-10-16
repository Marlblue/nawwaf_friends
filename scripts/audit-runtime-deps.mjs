/**
 * Gerbang audit dependensi yang sempit, dijalankan di CI dan deploy sebelum build:
 *
 *   node scripts/audit-runtime-deps.mjs
 *
 * `pnpm audit` polos tidak bisa jadi gerbang: advisory baru terus datang dari pohon Sanity
 * Studio/CLI yang cuma jalan saat build, dan perbaikannya menunggu rilis induknya. Yang
 * diperiksa di sini hanya paket yang ikut melayani pengunjung; daftar lengkap tetap ada di
 * `pnpm audit`. Sama dengan versi sdbi dan kalih-signature kecuali RUNTIME_PACKAGES.
 */
import { exec } from "node:child_process";
import { promisify } from "node:util";

/**
 * Paket yang ada di jalur permintaan pengunjung. Daftar tetap, bukan diturunkan dari
 * `dependencies`: `sanity`, `@sanity/vision`, dan `styled-components` ada di sana tapi cuma
 * dimuat di /studio.
 */
export const RUNTIME_PACKAGES = new Set([
  "next",
  "react",
  "react-dom",
  // Optimizer gambar Next (/_next/image) untuk foto venue dan banner.
  "sharp",
  // Client Sanity dipanggil saat render halaman artikel (lib/sanity/client.ts).
  "next-sanity",
  "@portabletext/react",
  "@sanity/image-url",
  // Google Analytics/Tag Manager di components/SiteShell.tsx, dimuat di tiap halaman.
  "@next/third-parties",
]);

/**
 * Segmen jalur yang menandai advisory-nya di luar jalur pengunjung walaupun akarnya paket
 * runtime: `next-sanity` menarik seluruh pohon Studio/CLI lewat `next-sanity > sanity > ...`.
 */
export const OFF_REQUEST_PATH = new Set(["sanity", "@sanity/vision"]);

// `exec`, bukan `execFile`: di Windows `pnpm` berkas .cmd yang butuh shell, dan execFile
// dengan shell memicu DEP0190. Perintahnya tetap, jadi tidak ada yang perlu di-escape.
const run = promisify(exec);

/** `pnpm audit` keluar bukan nol kalau ada advisory; yang menentukan stdout-nya JSON atau bukan. */
async function auditJson() {
  try {
    const { stdout } = await run("pnpm audit --json", { maxBuffer: 32 * 1024 * 1024 });
    return JSON.parse(stdout);
  } catch (error) {
    try {
      return JSON.parse(error.stdout ?? "");
    } catch {
      return null;
    }
  }
}

/**
 * Apakah advisory ini menyentuh paket yang melayani pengunjung. Yang dicek jalurnya, bukan
 * cuma nama paketnya: advisory `nanoid` lewat ".>next>postcss>nanoid" harus tertangkap karena
 * akarnya (segmen sesudah ".") paket runtime. Jalur yang lewat OFF_REQUEST_PATH dibuang.
 * `module_name` tetap dicocokkan sebagai cadangan kalau bentuk `findings` berubah.
 */
export function touchesRequestPath(advisory) {
  if (advisory.module_name !== undefined && RUNTIME_PACKAGES.has(advisory.module_name)) {
    return true;
  }

  return (advisory.findings ?? [])
    .flatMap((finding) => finding.paths ?? [])
    .some((path) => {
      const segments = path.split(">");
      const root = segments[1];
      return (
        root !== undefined &&
        RUNTIME_PACKAGES.has(root) &&
        !segments.some((segment) => OFF_REQUEST_PATH.has(segment))
      );
    });
}

async function main() {
  const report = await auditJson();

  if (report === null) {
    // Registry tidak terjangkau atau keluarannya berubah bentuk: jangan tahan deploy karena itu.
    console.warn("PERINGATAN: keluaran `pnpm audit --json` tidak bisa diurai, gerbang dilewati.");
    return 0;
  }

  const advisories = Object.values(report.advisories ?? {});
  const blocking = advisories.filter(touchesRequestPath);

  if (blocking.length === 0) {
    console.log(
      `OK: ${advisories.length} advisory ditemukan, tidak ada yang menyentuh paket di jalur permintaan pengunjung.`
    );
    return 0;
  }

  console.error(`GAGAL: ${blocking.length} advisory menyentuh paket yang melayani pengunjung.\n`);
  for (const advisory of blocking) {
    console.error(`  [${advisory.severity ?? "?"}] ${advisory.module_name}: ${advisory.title ?? "-"}`);
    if (advisory.url) console.error(`    ${advisory.url}`);
  }
  console.error(
    "\nIni bukan advisory dari pohon Sanity Studio/CLI yang biasa dilewati. " +
      "Naikkan versinya lewat overrides di pnpm-workspace.yaml, atau kalau memang " +
      "tidak berlaku untuk repo ini, catat alasannya dan keluarkan paketnya dari " +
      "RUNTIME_PACKAGES di berkas ini."
  );
  return 1;
}

// Cuma saat dipanggil langsung, supaya fungsinya bisa diimpor tanpa menembak registry.
if (import.meta.main) {
  main().then(
    (code) => process.exit(code),
    (error) => {
      console.error('Gerbang audit gagal dijalankan:', error);
      process.exit(1);
    }
  );
}
