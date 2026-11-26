"use client";

import { useState } from "react";
import { giftSetGroups, giftSetItemWa } from "@/lib/gift-set";
import { rupiah } from "@/lib/site";

// Daftar harga Gift Set ala kartu menu: nama + isi di kiri, harga rata kanan.
// Tiap baris langsung membuka WhatsApp dengan paket yang dipilih.
//
// - default: di HP cuma satu ukuran yang tampil, dipilih lewat tombol 1 Nampan / ½ Nampan
//   (10 baris sekaligus bikin section terlalu panjang); mulai sm kedua kolom tampil bersisian.
// - compact: semua baris ditumpuk tanpa pilihan, untuk panel buka-tutup di /hubungi.
export default function GiftSetPriceList({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      {!compact && (
        <div role="group" aria-label="Ukuran nampan" className="mb-5 grid grid-cols-2 gap-1 rounded-full bg-white/70 p-1 sm:hidden">
          {giftSetGroups.map(({ size }, i) => (
            <button
              key={size}
              type="button"
              aria-pressed={active === i}
              onClick={() => setActive(i)}
              className="rounded-full py-2 text-sm font-semibold text-brand-700 transition-colors aria-pressed:bg-brand aria-pressed:text-white"
            >
              {size}
            </button>
          ))}
        </div>
      )}
      <div className={compact ? "grid gap-6" : "grid gap-8 sm:grid-cols-2 sm:gap-10"}>
        {giftSetGroups.map(({ size, items }, i) => (
          <div key={size} className={compact || active === i ? undefined : "max-sm:hidden"}>
            <h3 className={`border-b-2 border-brand pb-2 text-lg font-bold text-brand ${compact ? "" : "max-sm:sr-only"}`}>{size}</h3>
            <ul className={compact ? undefined : "max-sm:border-t-2 max-sm:border-brand"}>
              {items.map((item) => (
                <li key={item.name} className="border-b border-dashed border-brand/20">
                  <a
                    href={giftSetItemWa(item, size)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group -mx-2 flex items-start justify-between gap-4 rounded-lg px-2 py-3 transition-colors hover:bg-white/70 focus-visible:bg-white/70"
                  >
                    <span className="min-w-0">
                      <span className="block text-[15px] font-semibold leading-snug transition-colors group-hover:text-brand">{item.name}</span>
                      <span className="mt-0.5 block text-[13px] leading-snug text-ink-soft">{item.contents}</span>
                    </span>
                    <span className="shrink-0 pt-px text-[15px] font-bold tabular-nums text-brand">{rupiah(item.price)}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
