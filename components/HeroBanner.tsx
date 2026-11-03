"use client";

import Image from "@/components/SiteImage";
import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import SliderDots from "@/components/SliderDots";

// Foto sementara dari menu; ganti dengan foto suasana jamuan asli kalau sudah ada
const photos = [
  "/images/menu/mix-full.webp",
  "/images/menu/mandhi-full-kambing.webp",
  "/images/menu/kebuli-full-kambing.webp",
];

const AUTOPLAY_MS = 4500;

/**
 * Foto kedua dan seterusnya baru dipasang setelah foto pertama selesai dimuat. Ketiganya
 * berukuran penuh (220-250 KB, foto menu tidak punya varian, lihat SiteImage.tsx) dan dulu
 * diunduh serentak dengan prioritas tinggi, jadi foto pertama berebut koneksi dengan dua
 * foto yang belum tampil: di HP dengan koneksi lambat, foto hero baru muncul setelah 6,8
 * detik (Lighthouse CI, 3 November 2026). Foto kedua baru dibutuhkan AUTOPLAY_MS kemudian.
 * Batas waktu ini menjaga slideshow tetap jalan kalau onLoad foto pertama tidak terpanggil.
 */
const BATAS_TUNGGU_MS = 3000;

// Kartu lebar di atas beranda: foto latar berganti pelan (fade), konten hero di atasnya
export default function HeroBanner({ children }: { children: React.ReactNode }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [semuaFoto, setSemuaFoto] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSemuaFoto(true), BATAS_TUNGGU_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    // Autoplay menunggu foto berikutnya terpasang, supaya tidak berpindah ke slide kosong.
    if (!semuaFoto || paused || prefersReducedMotion()) return;
    const t = setInterval(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % photos.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [index, paused, semuaFoto]);

  return (
    <div
      className="hero-banner hero-rise"
      onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setPaused(false)}
    >
      {(semuaFoto ? photos : photos.slice(0, 1)).map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          sizes="(min-width: 1400px) 1320px, 100vw"
          className="hero-banner-photo"
          data-active={i === index || undefined}
          preload={i === 0}
          onLoad={i === 0 ? () => setSemuaFoto(true) : undefined}
        />
      ))}
      <div className="hero-banner-overlay" aria-hidden />

      <div className="relative z-10 flex w-full flex-col items-center">{children}</div>

      <SliderDots
        count={photos.length}
        index={index}
        onSelect={(i) => {
          setSemuaFoto(true);
          setIndex(i);
        }}
        label={(i) => `Foto ${i + 1}`}
        tone="light"
        className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2"
      />
    </div>
  );
}
