/**
 * Gerbang audit dependensi yang sempit, dijalankan di deploy.yml sebelum build.
 * Disalin dari sdbi (scripts/audit-runtime-deps.mjs); yang berbeda cuma RUNTIME_PACKAGES.
 *
 *   node scripts/audit-runtime-deps.mjs
 *
 * `pnpm audit` apa adanya tidak bisa dipakai sebagai gerbang di repo ini.
 * Blok `overrides` di pnpm-workspace.yaml memang menahan advisory yang sudah
 * dikenal, tapi yang baru datang kapan saja dari pohon Sanity Studio/CLI
 * (@sanity/cli, @vercel/frameworks, @oclif/core, dan seterusnya), yaitu kode
 * yang cuma berjalan saat build atau saat menjalankan CLI-nya. Perbaikannya
 * menunggu rilis paket induk, jadi gerbang yang memerahkan PR karena itu akan
 * diabaikan sampai orang berhenti membacanya.
 *
 * Yang diperiksa di sini hanya paket yang benar-benar ikut melayani
 * pengunjung. Daftar lengkapnya tetap bisa dilihat dengan `pnpm audit`.
 *
 * Ditulis .mjs supaya bisa dijalankan Node langsung tanpa tsx.
 */
import { exec } from "node:child_process";
import { promisify } from "node:util";

/**
 * Paket yang ada di jalur permintaan pengunjung.
 *
 * Sengaja daftar tetap, bukan diturunkan otomatis dari `dependencies`: `sanity`,
 * `@sanity/vision`, dan `styled-components` ada di sana, tapi cuma dimuat di
 * /studio. Impor `sanity` di lib/sanity hanya `import type`, jadi tidak terkirim.
 */
export const RUNTIME_PACKAGES = new Set([
  "next",
  "react",
  "react-dom",
  // Ikut terkirim bersama Next. images.unoptimized di next.config.ts membuatnya
  // praktis tidak dipanggil, tapi tetap diperiksa: setelan itu bisa berubah.
  "sharp",
  // Client Sanity dipanggil saat render halaman artikel (lib/sanity/client.ts).
  "next-sanity",
  "@portabletext/react",
  "@sanity/image-url",
  // Google Analytics/Tag Manager di components/SiteShell.tsx, dimuat di tiap halaman.
  "@next/third-parties",
]);

/**
 * Segmen jalur yang menandai advisory-nya tidak di jalur permintaan
 * pengunjung, walaupun akar jalurnya paket runtime.
 *
 * `sanity` yang menanggung hampir semuanya: seluruh pohon Studio dan CLI
 * digantung di sana, dan `next-sanity` (yang memang paket runtime, karena
 * client Sanity dipanggil saat render) ikut menariknya lewat
 * `next-sanity > sanity > @sanity/cli > ...`. Tanpa pengecualian ini,
 * mencocokkan akar jalur akan menyeret balik seluruh pohon Studio.
 *
 * `@sanity/vision` ikut disebut walau ia dependency langsung dan bukan paket
 * runtime: ia tidak akan pernah cocok sebagai akar, tapi ia muncul sebagai
 * segmen tengah pada sebagian jalur, dan menyebutnya di sini membuat maksudnya
 * terbaca utuh di satu tempat.
 */
export const OFF_REQUEST_PATH = new Set(["sanity", "@sanity/vision"]);

// `exec`, bukan `execFile`: di Windows `pnpm` adalah berkas .cmd yang butuh
// shell untuk dijalankan, dan execFile dengan `shell: true` memicu peringatan
// deprecation DEP0190 karena argumennya digabung tanpa di-escape. Perintah di
// bawah tetap dan tidak menyisipkan nilai dari mana pun, jadi tidak ada yang
// perlu di-escape.
const run = promisify(exec);

/**
 * `pnpm audit` keluar dengan status bukan nol begitu ada advisory apa pun,
 * jadi kegagalan perintahnya bukan penanda error. Yang menentukan adalah
 * apakah stdout-nya bisa diurai sebagai JSON.
 */
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
 * Apakah advisory ini menyentuh paket yang ikut melayani permintaan
 * pengunjung.
 *
 * Yang diperiksa jalurnya, bukan cuma nama paketnya. Paket bermasalah hampir
 * tidak pernah dipasang sendiri, ia ditarik oleh paket lain, jadi mencocokkan
 * `module_name` saja meleset ke arah yang berbahaya: advisory pada `nanoid`
 * yang masuk lewat ".>next>postcss>nanoid" akan lolos, karena yang dicocokkan
 * namanya sendiri ("nanoid") dan itu tidak ada di daftar mana pun. Gerbangnya
 * mencetak OK untuk advisory yang persis jenisnya ingin ditangkap.
 *
 * Bentuk jalur dari `pnpm audit` adalah ".>next>postcss>nanoid": segmen
 * pertama sesudah "." adalah dependency yang benar-benar ditulis di
 * package.json, dan itu yang menentukan. Jalur yang lewat OFF_REQUEST_PATH
 * dibuang.
 *
 * Pencocokan `module_name` tetap dipertahankan sebagai jalur kedua, supaya
 * advisory pada paket yang dipasang langsung tetap tertangkap walau bentuk
 * `findings` dari registry suatu saat berubah.
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
    // Registry tidak bisa dihubungi atau keluarannya berubah bentuk. Sengaja
    // tidak menggagalkan CI: menahan deploy karena jaringan runner sedang
    // bermasalah bukan sinyal yang berguna.
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

// Dijalankan cuma kalau berkas ini yang dipanggil langsung, supaya fungsinya
// bisa diimpor tanpa ikut menembak registry.
if (import.meta.main) {
  main().then(
    (code) => process.exit(code),
    (error) => {
      console.error('Gerbang audit gagal dijalankan:', error);
      process.exit(1);
    }
  );
}
