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

// Kartu lebar di atas beranda: foto latar berganti pelan (fade), konten hero di atasnya
export default function HeroBanner({ children }: { children: React.ReactNode }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || prefersReducedMotion()) return;
    const t = setInterval(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % photos.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [index, paused]);

  return (
    <div
      className="hero-banner hero-rise"
      onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setPaused(false)}
    >
      {photos.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          sizes="(min-width: 1400px) 1320px, 100vw"
          className="hero-banner-photo"
          data-active={i === index || undefined}
          preload={i === 0}
        />
      ))}
      <div className="hero-banner-overlay" aria-hidden />

      <div className="relative z-10 flex w-full flex-col items-center">{children}</div>

      <SliderDots
        count={photos.length}
        index={index}
        onSelect={setIndex}
        label={(i) => `Foto ${i + 1}`}
        tone="light"
        className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2"
      />
    </div>
  );
}
