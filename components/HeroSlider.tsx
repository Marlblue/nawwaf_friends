"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";

const dishes = [
  { src: "/images/menu/mix-half.webp", alt: "Nasi Mix Mandhi & Kebuli" },
  { src: "/images/menu/nasi-mandhi-ayam.webp", alt: "Nasi Mandhi Ayam" },
  { src: "/images/menu/nasi-kebuli-kambing.webp", alt: "Nasi Kebuli Kambing" },
  { src: "/images/menu/mandhi-half-ayam.webp", alt: "Nasi Mandhi ½ Nampan Ayam" },
  { src: "/images/menu/sambosa.webp", alt: "Sambosa" },
  { src: "/images/menu/kebuli-half-kambing.webp", alt: "Nasi Kebuli ½ Nampan Kambing" },
  { src: "/images/menu/ummu-ali.webp", alt: "Ummu Ali" },
  { src: "/images/menu/nasi-kebuli-ayam.webp", alt: "Nasi Kebuli Ayam" },
];

const n = dishes.length;
const MAX_SLOT = 3;
const AUTOPLAY_MS = 5000;

// Posisi relatif kartu terhadap kartu tengah, dibatasi -3..3 (slot ±3 = tersembunyi di luar layar)
function slotOf(i: number, index: number) {
  let d = (((i - index) % n) + n) % n;
  if (d > n / 2) d -= n;
  return Math.max(-MAX_SLOT, Math.min(MAX_SLOT, d));
}

// Carousel ala hero Latte: 5 kartu, kartu bergeser & berubah ukuran saat slide.
// Tampilan per slot diatur di globals.css (.hero-card[data-slot]).
export default function HeroSlider() {
  const [{ index, dir }, setState] = useState({ index: 0, dir: 0 });
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);

  const go = (step: number) => setState((s) => ({ index: (s.index + step + n) % n, dir: step }));

  // Ganti foto otomatis; berhenti saat di-hover/fokus, tab tidak aktif, atau "kurangi gerakan" aktif.
  // index ikut jadi dependency supaya hitungan mulai ulang setelah pengguna menggeser manual.
  useEffect(() => {
    if (paused || prefersReducedMotion()) return;
    const t = setInterval(() => {
      if (!document.hidden) setState((s) => ({ index: (s.index + 1) % n, dir: 1 }));
    }, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [index, paused]);

  return (
    <div
      className="hero-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Foto menu pilihan"
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(-1);
        if (e.key === "ArrowRight") go(1);
      }}
      onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setPaused(false)}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      {dishes.map((dish, i) => {
        const slot = slotOf(i, index);
        const prevSlot = slotOf(i, index - dir);
        // Kartu yang pindah dari ujung kiri ke ujung kanan (atau sebaliknya) dilompatkan tanpa animasi
        const jump = Math.abs(slot - prevSlot) > 1;
        const clickable = Math.abs(slot) === 1;
        return (
          <div
            key={dish.src}
            className="hero-card hero-rise"
            data-slot={slot}
            data-jump={jump || undefined}
            aria-hidden={slot !== 0}
            onClick={clickable ? () => go(slot) : undefined}
            style={{ "--rise": `${40 + Math.abs(slot) * 40}px`, "--delay": `${0.25 + Math.abs(slot) * 0.08}s` } as React.CSSProperties}
          >
            <Image
              src={dish.src}
              alt={dish.alt}
              fill
              sizes="(min-width: 810px) 30vw, 72vw"
              className="object-cover"
              priority={Math.abs(slot) <= 1}
            />
          </div>
        );
      })}

      <button type="button" className="hero-arrow hero-arrow--prev hero-rise" onClick={() => go(-1)} aria-label="Foto sebelumnya">
        <Chevron />
        <Chevron />
      </button>
      <button type="button" className="hero-arrow hero-arrow--next hero-rise" onClick={() => go(1)} aria-label="Foto berikutnya">
        <Chevron />
        <Chevron />
      </button>

      <p className="sr-only" aria-live={paused ? "polite" : "off"}>
        {dishes[index].alt}, foto {index + 1} dari {n}
      </p>
    </div>
  );
}

// Dua chevron kiri: saat hover yang pertama keluar, yang kedua masuk (tombol kanan diputar 180°)
function Chevron() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden>
      <path d="M11.813 14.625 6.188 9l5.625-5.625" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
