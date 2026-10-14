import type { NextConfig } from "next";

/**
 * Header keamanan, mengikuti kalih-signature minus kebijakan CSP lengkapnya.
 *
 * CSP yang ditegakkan cuma direktif yang tidak bergantung pada daftar host: situs ini
 * tidak punya <base>, <object>, maupun <embed>, dan tidak ada situs lain yang perlu
 * membingkainya. `form-action` sengaja belum ikut: di sdbi direktif itu memblokir event
 * Meta Pixel yang dikirim lewat form POST ke facebook.com, dan container GTM situs ini
 * belum dicek memakai jalur yang sama atau tidak.
 */
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: ["base-uri 'self'", "object-src 'none'", "frame-ancestors 'self'"].join("; "),
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
  images: {
    // sharp tidak di-build (pnpm allowBuilds), jadi gambar disajikan apa adanya
    unoptimized: true,
  },
};

export default nextConfig;
