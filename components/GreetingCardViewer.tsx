"use client";

import { useEffect, useId, useRef } from "react";
import { Close } from "@/components/Icons";
import { GreetingCardFace, GreetingCardPair } from "@/components/GiftSet";

// Kartu ucapan di section Gift Set bisa diklik untuk dilihat besar.
// Memakai <dialog> bawaan lewat showModal(): browser sudah mengurus fokus, Esc, tombol back
// di HP, dan halaman di belakang jadi tidak bisa diklik. closedby="any" menambah tutup dengan
// klik di luar kartu; Safari belum mendukungnya, jadi untuk itu ada cadangan di useEffect.
export default function GreetingCardViewer({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || "closedBy" in HTMLDialogElement.prototype) return;
    const onClick = (e: MouseEvent) => {
      // Klik di backdrop menargetkan <dialog> itu sendiri, tapi begitu juga klik di padding-nya,
      // jadi posisi pointer dicek terhadap kotak dialog.
      if (e.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (!inside) dialog.close();
    };
    dialog.addEventListener("click", onClick);
    return () => dialog.removeEventListener("click", onClick);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        aria-haspopup="dialog"
        className={`group relative block cursor-zoom-in rounded-lg text-left ${className}`}
      >
        <GreetingCardPair className="w-full transition-transform duration-500 [transition-timing-function:var(--ease)] group-hover:-translate-y-1" />
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-brand shadow-[0_8px_20px_-8px_rgb(42_16_19/0.45)] transition-colors group-hover:bg-brand group-hover:text-white">
          Lihat kartu
        </span>
      </button>

      <dialog
        ref={ref}
        {...({ closedby: "any" } as object)}
        aria-labelledby={titleId}
        className="gift-card-dialog m-auto max-h-[calc(100dvh-24px)] w-[min(560px,calc(100vw-24px))] rounded-[24px] bg-kraft p-4 text-ink shadow-[0_30px_80px_-20px_rgb(0_0_0/0.6)] sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            {/* h2, bukan h1: dialog ini tetap ada di DOM saat tertutup, dan beranda wajib punya
                satu h1 saja (e2e/situs.spec.ts) */}
            <h2 id={titleId} className="text-lg font-bold text-brand-700 sm:text-xl">
              Kartu ucapan personal
            </h2>
            <p className="mt-0.5 text-sm text-ink-soft">Contoh pesan. Tulis pesan Anda sendiri saat memesan, kami cetak di kartu ini.</p>
          </div>
          <form method="dialog" className="shrink-0">
            <button
              autoFocus
              aria-label="Tutup"
              className="grid size-10 place-items-center rounded-full bg-white text-ink transition-colors hover:bg-brand hover:text-white"
            >
              <Close width={20} height={20} />
            </button>
          </form>
        </div>
        {/* Lebar kartu dibatasi tinggi layar, supaya kartu utuh terlihat tanpa scroll di laptop. */}
        <div className="mx-auto mt-4 sm:mt-5" style={{ width: "min(100%, calc((100dvh - 180px) * 0.6725))" }}>
          <GreetingCardFace sizes="(min-width: 640px) 480px, 90vw" className="rounded-md shadow-[0_16px_36px_-16px_rgb(42_16_19/0.55)]" />
        </div>
      </dialog>
    </>
  );
}
