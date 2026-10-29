import type { NextConfig } from "next";

/**
 * Header keamanan. CSP yang ditegakkan cuma direktif yang tidak bergantung pada daftar
 * host: situs ini tidak punya <base>, <object>, atau <embed>, tidak perlu dibingkai situs
 * lain, dan tidak punya form yang dikirim ke luar (form mem-POST lewat fetch ke /api,
 * pesanan dibuka sebagai link WhatsApp).
 *
 * form-action juga tidak memblokir Meta Pixel, karena di sini pixel-nya cuma mengirim beacon
 * GET (diuji 15 Oktober 2026). Kalau template Meta di GTM diganti, cek ulang: di sdbi ada
 * template yang mengirim form POST ke facebook.com/tr dan ikut terblokir.
 */
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: ["base-uri 'self'", "object-src 'none'", "frame-ancestors 'self'", "form-action 'self'"].join("; "),
  },
  // Jangan menebak tipe file dari isinya, supaya berkas yang menyamar sebagai gambar
  // tidak ikut dieksekusi sebagai script.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Padanan frame-ancestors untuk browser lama.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Ke domain lain cukup kirim origin, path halaman form tidak ikut bocor.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Tidak ada fitur di situs ini yang butuh kamera, mikrofon, atau lokasi.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  // Dua tahun, sengaja tanpa includeSubDomains: subdomain lain di domain ini belum tentu
  // semuanya HTTPS, dan HSTS yang menjangkau subdomain akan membuatnya tidak bisa dibuka.
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
];

const nextConfig: NextConfig = {
  // Hosting cPanel (Setup Node.js App): .next/standalone berisi server.js +
  // node_modules minimal, jadi bisa diupload tanpa npm install di server.
  output: "standalone",
  // Versi Next.js tidak perlu diumumkan ke pemindai otomatis.
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Varian dari lib/image-loader.ts selalu membawa ?v=<hash sumber>, jadi aman di-cache
      // setahun: gambar yang diganti mendapat URL baru. Tanpa ini Next menyajikan public/
      // dengan max-age=0 dan tiap kunjungan tetap mengetuk server untuk tiap gambar. Hanya
      // /_img: foto menu tidak membawa ?v=, jadi foto yang diganti harus tetap divalidasi ulang.
      {
        source: "/_img/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
  // www.nawwafresto.com dan nawwafresto.com tampil sama; satukan ke tanpa www supaya
  // Google tidak menganggapnya dua situs dengan konten ganda.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.nawwafresto.com" }],
        destination: "https://nawwafresto.com/:path*",
        permanent: true,
      },
    ];
  },
  // Optimizer Next tidak dipakai: gambar public/ diperkecil saat build oleh
  // scripts/generate-image-variants.mjs dan dipilih lib/image-loader.ts, karena sharp di server
  // cPanel memicu 508 (batas proses akun) tiap cache kosong. Foto menu yang transparan dan
  // gambar Sanity tetap `unoptimized`; aturannya ada di components/SiteImage.tsx.
  images: {
    loaderFile: "./lib/image-loader.ts",
    // 384 dan 480 untuk kartu setengah layar di ponsel; tanpa keduanya kandidat terkecil
    // 640px dan ponsel mengunduh gambar jauh lebih besar dari yang ditampilkan.
    deviceSizes: [384, 480, 640, 828, 1080, 1280, 1920],
  },
};

export default nextConfig;
