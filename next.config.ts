import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // sharp tidak di-build (pnpm allowBuilds), jadi gambar disajikan apa adanya
    unoptimized: true,
  },
};

export default nextConfig;
