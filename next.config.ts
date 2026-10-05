import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hosting cPanel (Setup Node.js App): .next/standalone berisi server.js +
  // node_modules minimal, jadi bisa diupload tanpa npm install di server.
  output: "standalone",
  images: {
    // sharp tidak di-build (pnpm allowBuilds), jadi gambar disajikan apa adanya
    unoptimized: true,
  },
};

export default nextConfig;
