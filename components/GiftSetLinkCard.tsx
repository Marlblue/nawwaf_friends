"use client";

import { useId, useState } from "react";
import Image from "@/components/SiteImage";
import { ChevronRight, Whatsapp } from "@/components/Icons";
import GiftSetPriceList from "@/components/GiftSetPriceList";

// Kartu Gift Set di /hubungi: foto box mengisi penuh setengah kiri (setinggi kartu), teks dan
// tombol di setengah kanan. Daftar 10 harga dibuka di bawah kartu selebar penuh, bukan di kolom
// kanan yang sempit; karena letaknya di luar kolom tombol, pakai state, bukan <details>.
// Fotonya versi potret (gift-box-potret.webp: box utuh, latar krem foto aslinya diperpanjang
// ke atas-bawah), supaya kolom kiri yang tinggi-ramping tidak memangkas sisi box.
export default function GiftSetLinkCard({ minPrice, waHref }: { minPrice: string; waHref: string }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div data-reveal className="overflow-hidden rounded-3xl bg-kraft shadow-[0_16px_36px_-22px_rgb(42_16_19/0.4)]">
      <div className="grid grid-cols-2">
        <span className="relative block min-h-[200px]">
          <Image
            src="/images/gift-set/gift-box-potret.webp"
            alt="Box kado Abu Nawwaf berpita maroon dengan gift tag Nawwaf & Friends"
            fill
            sizes="(min-width: 640px) 290px, 50vw"
            preload
            className="object-cover"
          />
        </span>
        <div className="flex min-w-0 flex-col p-3">
          <span className="self-start rounded-full bg-brand px-2 py-px text-[10px] font-semibold uppercase tracking-wider text-accent">Baru</span>
          <h2 className="mt-1.5 text-[15px] font-bold leading-tight tracking-[-0.01em] text-balance text-brand-700">Nawwaf Signature Gift Set</h2>
          <p className="mt-1 text-[13px] text-ink-soft">
            Mulai <strong className="text-[15px] font-bold tabular-nums text-brand">{minPrice}</strong>
          </p>
          <div className="mt-auto grid gap-1.5 pt-2.5">
            <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm w-full whitespace-nowrap">
              <Whatsapp width={16} height={16} /> Pesan
            </a>
            <button
              type="button"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpen((v) => !v)}
              className="flex items-center justify-center gap-1 rounded-full bg-white/70 py-1.5 text-[13px] font-semibold text-brand transition-colors hover:bg-white"
            >
              Lihat harga
              <ChevronRight width={15} height={15} className={`shrink-0 transition-transform ${open ? "rotate-90" : ""}`} />
            </button>
          </div>
        </div>
      </div>
      <div id={panelId} hidden={!open} className="border-t border-brand/10 bg-white/60 px-4 pb-4 pt-3">
        <GiftSetPriceList compact />
      </div>
    </div>
  );
}
