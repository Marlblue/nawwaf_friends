"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gallery } from "@/lib/gallery";
import { prefersReducedMotion } from "@/lib/motion";
import { ArrowLeft, ArrowRight } from "./Icons";

const AUTOPLAY_MS = 5000;

// Slider galeri beranda. Geser pakai scroll-snap bawaan browser (swipe di HP & trackpad jalan
// tanpa kode tambahan); tombol, titik, dan autoplay cukup menggulir track-nya.
export default function GallerySlider() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = gallery.length;

  const goTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const next = (i + n) % n;
    track.scrollTo({ left: next * track.clientWidth, behavior: prefersReducedMotion() ? "instant" : "smooth" });
  };

  // Titik aktif mengikuti posisi gulir, termasuk saat digeser manual
  const onScroll = () => {
    const track = trackRef.current;
    if (track) setIndex(Math.round(track.scrollLeft / track.clientWidth));
  };

  useEffect(() => {
    if (paused || prefersReducedMotion()) return;
    const t = setInterval(() => {
      if (!document.hidden) goTo(index + 1);
    }, AUTOPLAY_MS);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, paused]);

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Galeri perjamuan & catering"
      onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setPaused(false)}
    >
      <div className="flex justify-end gap-3">
        <button type="button" onClick={() => goTo(index - 1)} className="icon-btn" aria-label="Slide sebelumnya">
          <ArrowLeft width={18} height={18} />
        </button>
        <button type="button" onClick={() => goTo(index + 1)} className="icon-btn" aria-label="Slide berikutnya">
          <ArrowRight width={18} height={18} />
        </button>
      </div>

      <div className="mt-6 rounded-[32px] border border-black/8 bg-sand p-2 shadow-[0_16px_40px_-20px_rgb(42_16_19/0.25)] sm:p-3">
        <div ref={trackRef} onScroll={onScroll} className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto rounded-[24px]">
          {gallery.map((slide, i) => (
            <figure
              key={slide.title}
              aria-roledescription="slide"
              aria-label={`${i + 1} dari ${n}`}
              className="relative flex min-h-[380px] w-full shrink-0 snap-start items-end overflow-hidden p-6 sm:min-h-[460px] sm:p-10"
            >
              <Image src={slide.image} alt={slide.title} fill sizes="(min-width: 1400px) 1320px, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10" aria-hidden />
              <figcaption className="relative max-w-2xl text-left text-white">
                <span className="inline-block rounded-full border border-white/20 bg-brand px-3.5 py-1 text-[11px] font-semibold tracking-wide">{slide.badge}</span>
                <h3 className="mt-3 text-2xl font-bold leading-snug sm:text-3xl">{slide.title}</h3>
                {slide.text && <p className="mt-2 text-sm leading-relaxed text-white/90 sm:text-base">{slide.text}</p>}
                {slide.tags && (
                  <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs font-semibold text-accent sm:text-sm">
                    {slide.tags.map((tag) => (
                      <span key={tag}>✓ {tag}</span>
                    ))}
                  </p>
                )}
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="flex justify-center gap-2 py-4">
          {gallery.map((slide, i) => (
            <button
              key={slide.title}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              aria-current={i === index}
              className={`h-2 rounded-full transition-all duration-300 ${i === index ? "w-8 bg-brand" : "w-2 bg-black/20 hover:bg-brand"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
