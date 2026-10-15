import type { NextConfig } from "next";

/**
 * Header keamanan, mengikuti kalih-signature minus kebijakan CSP lengkapnya.
 *
 * CSP yang ditegakkan cuma direktif yang tidak bergantung pada daftar host: situs ini
 * tidak punya <base>, <object>, maupun <embed>, dan tidak ada situs lain yang perlu
 * membingkainya.
 *
 * `form-action 'self'` aman karena tidak ada <form> yang dikirim ke luar: form kolaborasi
 * dan komunitas mem-POST lewat fetch ke /api sendiri, dan pesanan dibuka sebagai link
 * WhatsApp. Yang dikhawatirkan adalah Meta Pixel, yang di sdbi mengirim sebagian event
 * lewat form POST ke facebook.com/tr dan ikut terblokir. Diuji 15 Oktober 2026 di 10
 * halaman situs ini (Chrome headless, CSP ini disisipkan sebagai Report-Only, dengan sdbi
 * sebagai pembanding yang memang tertangkap): Meta Pixel di sini hanya mengirim beacon GET,
 * dan tidak ada satu pun pelanggaran. Kalau tag GTM untuk Meta diganti template lain,
 * cek ulang ke arah yang sama.
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
    return [{ source: "/:path*", headers: securityHeaders }];
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
  // Optimizer jalan di server cPanel memakai binary sharp prebuilt untuk Linux, yang ikut
  // terbawa karena build dikerjakan di runner GitHub (pola yang sama dengan kalih-signature).
  // Foto menu yang transparan dan gambar Sanity sengaja dilewatkan; aturannya ada di
  // components/SiteImage.tsx.
  images: {
    // WebP saja. AVIF di kalih-signature merusak alpha, dan sumber semua gambar di sini
    // memang sudah WebP.
    formats: ["image/webp"],
    // 384 dan 480 untuk kartu setengah layar di ponsel; tanpa keduanya kandidat terkecil
    // 640px dan ponsel mengunduh gambar jauh lebih besar dari yang ditampilkan.
    deviceSizes: [384, 480, 640, 828, 1080, 1280, 1920],
    // 30 hari, bukan setahun seperti kalih: gambar di public/ tidak punya hash di namanya,
    // jadi foto yang diganti dengan nama yang sama baru sampai ke pengunjung setelah ini lewat.
    minimumCacheTTL: 2592000,
  },
};

export default nextConfig;
