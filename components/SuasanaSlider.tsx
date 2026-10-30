"use client";

import Image from "@/components/SiteImage";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import SliderDots from "@/components/SliderDots";

type Photo = { image: string; caption: string };

// Slider foto suasana di halaman /hubungi. Di HP digeser pakai swipe + scroll-snap bawaan
// browser; di desktop bisa ditarik pakai mouse. Satu geseran = pindah satu posisi.
export default function SuasanaSlider({ photos, alt }: { photos: Photo[]; alt: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, moved: false, x: 0, left: 0, from: 0 });
  const frame = useRef(0);
  const [index, setIndex] = useState(0);
  // Posisi berhenti yang benar-benar bisa dicapai. Kartu-kartu terakhir tidak bisa rata kiri
  // (track keburu habis), jadi semuanya berbagi satu posisi di ujung kanan. Titik = posisi ini.
  const [stops, setStops] = useState<number[]>([0]);

  const measure = () => {
    const track = trackRef.current;
    if (!track) return [0];
    const cards = Array.from(track.children) as HTMLElement[];
    const max = track.scrollWidth - track.clientWidth;
    const first = cards[0]?.offsetLeft ?? 0;
    const list = cards.map((c) => Math.min(c.offsetLeft - first, max));
    return list.filter((s, i) => i === 0 || s - list[i - 1] > 4);
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => setStops(measure());
    update();
    const ro = new ResizeObserver(update);
    ro.observe(track);
    return () => ro.disconnect();
  }, []);

  const nearest = () => {
    const left = trackRef.current?.scrollLeft ?? 0;
    const dist = stops.map((s) => Math.abs(s - left));
    return dist.indexOf(Math.min(...dist));
  };

  // Hitung titik aktif sekali per frame saja supaya geser tetap mulus
  const onScroll = () => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => setIndex(nearest()));
  };

  const goTo = (i: number) => {
    const next = Math.max(0, Math.min(stops.length - 1, i));
    trackRef.current?.scrollTo({ left: stops[next], behavior: prefersReducedMotion() ? "instant" : "smooth" });
  };

  // Tarik pakai mouse (touch sudah ditangani browser). Snap dimatikan selama ditarik;
  // saat dilepas pindah satu posisi sesuai arah tarikan, lalu snap dinyalakan lagi.
  const onPointerDown = (e: React.PointerEvent) => {
    const track = trackRef.current;
    if (e.pointerType !== "mouse" || !track) return;
    drag.current = { active: true, moved: false, x: e.clientX, left: track.scrollLeft, from: nearest() };
    track.style.scrollSnapType = "none";
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const track = trackRef.current;
    if (!drag.current.active || !track) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 5) drag.current.moved = true;
    track.scrollLeft = drag.current.left - dx;
  };

  const endDrag = () => {
    const track = trackRef.current;
    if (!drag.current.active || !track) return;
    drag.current.active = false;
    const dx = track.scrollLeft - drag.current.left;
    goTo(Math.abs(dx) > 40 ? drag.current.from + Math.sign(dx) : drag.current.from);
    setTimeout(() => (track.style.scrollSnapType = ""), 450);
  };

  return (
    <>
      <div
        ref={trackRef}
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        // Klik setelah menarik jangan dianggap membuka link
        onClickCapture={(e) => drag.current.moved && (e.preventDefault(), (drag.current.moved = false))}
        className="no-scrollbar -mx-5 mt-5 flex cursor-grab snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-px-5 px-5 pb-2 select-none active:cursor-grabbing sm:-mx-10 sm:scroll-px-10 sm:px-10 lg:mx-0 lg:scroll-px-0 lg:px-0"
      >
        {photos.map(({ image, caption }, i) => (
          <Link
            key={image}
            href="/venue"
            draggable={false}
            className={`group relative h-44 w-[78%] max-w-[300px] shrink-0 snap-always overflow-hidden rounded-3xl border border-black/10 bg-sand sm:h-52 sm:w-[300px] ${i === photos.length - 1 ? "snap-end" : "snap-start"}`}
          >
            <Image
              src={image}
              alt={`${caption} ${alt}`}
              fill
              draggable={false}
              sizes="300px"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <span className="absolute inset-x-3 bottom-3 text-sm font-semibold text-white drop-shadow-sm">{caption}</span>
          </Link>
        ))}
      </div>
      {stops.length > 1 && (
        <SliderDots count={stops.length} index={index} onSelect={goTo} label={(i) => `Geser ke posisi ${i + 1}`} size="sm" className="mt-0" />
      )}
    </>
  );
}
