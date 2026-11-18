"use client";

import Image from "@/components/SiteImage";
import { useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import SliderDots from "@/components/SliderDots";
import { ArrowLeft, ArrowRight } from "@/components/Icons";

// Foto ruangan venue yang punya lebih dari satu gambar. Geser pakai scroll-snap bawaan browser
// (swipe di HP & trackpad), titik di atas foto dan panah (md ke atas) untuk pindah slide.
// Tanpa autoplay.

const ARROW = "icon-btn absolute top-1/2 hidden -translate-y-1/2 shadow-md transition-opacity duration-200 md:inline-flex";
const ARROW_ON = "opacity-0 group-hover/room:opacity-100 focus-visible:opacity-100";
const ARROW_OFF = "pointer-events-none opacity-0";

export default function RoomSlider({ images, alt, tag }: { images: string[]; alt: string; tag: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const goTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: i * track.clientWidth, behavior: prefersReducedMotion() ? "instant" : "smooth" });
  };

  const onScroll = () => {
    const track = trackRef.current;
    if (track) setIndex(Math.round(track.scrollLeft / track.clientWidth));
  };

  return (
    <div role="region" aria-roledescription="carousel" aria-label={`Foto ${alt}`} className="media group/room aspect-[4/3]">
      <div ref={trackRef} onScroll={onScroll} tabIndex={0} className="no-scrollbar absolute inset-0 flex snap-x snap-mandatory overflow-x-auto">
        {images.map((src, i) => (
          <div key={src} aria-roledescription="slide" aria-label={`${i + 1} dari ${images.length}`} className="relative h-full w-full shrink-0 snap-start">
            <Image src={src} alt={`${alt} ${i + 1}`} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
        ))}
      </div>
      {/* Panah untuk pengguna mouse, muncul saat kursor di atas foto (atau difokus keyboard);
          di layar sentuh cukup diusap. Panah di ujung yang tidak bisa digeser lagi disembunyikan. */}
      <button
        type="button"
        onClick={() => goTo(index - 1)}
        disabled={index === 0}
        aria-label="Foto sebelumnya"
        className={`${ARROW} left-4 ${index === 0 ? ARROW_OFF : ARROW_ON}`}
      >
        <ArrowLeft width={18} height={18} />
      </button>
      <button
        type="button"
        onClick={() => goTo(index + 1)}
        disabled={index === images.length - 1}
        aria-label="Foto berikutnya"
        className={`${ARROW} right-4 ${index === images.length - 1 ? ARROW_OFF : ARROW_ON}`}
      >
        <ArrowRight width={18} height={18} />
      </button>
      <span className="absolute left-4 top-4 rounded-full bg-cream px-3 py-1 text-xs font-medium">{tag}</span>
      <SliderDots
        count={images.length}
        index={index}
        onSelect={goTo}
        label={(i) => `Foto ${i + 1}`}
        tone="light"
        className="absolute inset-x-0 bottom-2"
      />
    </div>
  );
}
