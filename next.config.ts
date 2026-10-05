import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hosting cPanel (Setup Node.js App): .next/standalone berisi server.js +
  // node_modules minimal, jadi bisa diupload tanpa npm install di server.
  output: "standalone",
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
