"use client";

import Image from "@/components/SiteImage";
import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";

type Photo = { image: string; caption: string };

// Galeri venue. Kartu foto tinggi berselang naik-turun: kartu genap turun sedikit.
// HP & tablet: digeser ke samping dengan titik penanda di bawah; desktop: lima kolom sejajar.
export default function VenueGallery({ photos }: { photos: Photo[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const [index, setIndex] = useState(0);
  // Posisi berhenti yang bisa dicapai; kartu terakhir berbagi satu posisi di ujung kanan.
  // Kosong di desktop (grid tidak bisa digeser), jadi titiknya ikut hilang.
  const [stops, setStops] = useState<number[]>([]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      if (max <= 4) return setStops([]);
      const cards = Array.from(track.children) as HTMLElement[];
      const first = cards[0]?.offsetLeft ?? 0;
      const list = cards.map((c) => Math.min(c.offsetLeft - first, max));
      setStops(list.filter((s, i) => i === 0 || s - list[i - 1] > 4));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(track);
    return () => ro.disconnect();
  }, []);

  // Hitung titik aktif sekali per frame saja supaya geser tetap mulus
  const onScroll = () => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const left = trackRef.current?.scrollLeft ?? 0;
      const dist = stops.map((s) => Math.abs(s - left));
      setIndex(dist.indexOf(Math.min(...dist)));
    });
  };

  const goTo = (i: number) => {
    trackRef.current?.scrollTo({ left: stops[i], behavior: prefersReducedMotion() ? "instant" : "smooth" });
  };

  return (
    <div data-reveal className="mt-10">
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory items-start gap-4 overflow-x-auto overscroll-x-contain scroll-px-5 px-5 md:-mx-10 md:scroll-px-10 md:gap-6 md:px-10 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0"
      >
        {photos.map((g, i) => (
          <figure key={g.image} className={`w-[62%] shrink-0 snap-start sm:w-[40%] md:w-[30%] lg:w-auto ${i % 2 === 1 ? "mt-12" : ""}`}>
            <div className="media aspect-[4/5] !rounded-2xl">
              <Image src={g.image} alt={g.caption} fill sizes="(min-width: 1024px) 20vw, (min-width: 640px) 40vw, 62vw" className="object-cover" />
            </div>
            <figcaption className="mt-4 text-base font-semibold text-brand sm:text-lg">{g.caption}</figcaption>
          </figure>
        ))}
      </div>
      {stops.length > 1 && (
        <div className="mt-6 flex items-center justify-center gap-1.5 lg:hidden">
          {stops.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Geser ke posisi ${i + 1}`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-4 bg-brand" : "w-1.5 bg-black/15 hover:bg-black/30"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
