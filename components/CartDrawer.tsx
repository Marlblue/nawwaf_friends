"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { thumb } from "@/lib/menu";
import { bump, prefersReducedMotion } from "@/lib/motion";
import { rupiah } from "@/lib/site";
import { useCart, useOnCartAdd } from "./CartProvider";
import { CartIcon, Check, Close, Minus, Plus } from "./Icons";

export default function CartDrawer() {
  const { lines, count, subtotal, drawerOpen, setDrawerOpen, setQty } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen, setDrawerOpen]);

  return (
    <>
      <FloatingCartButton visible={count > 0 && pathname !== "/order" && !drawerOpen} />
      {count > 0 && pathname !== "/order" && <div className="h-20 sm:h-24" aria-hidden />}

      <div
        className={`fixed inset-0 z-[70] bg-black/40 transition-opacity ${drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden
      />
      {/* Pembungkus fixed + overflow-hidden: menahan drawer yang digeser ke luar layar
          supaya tidak bikin halaman bisa di-scroll ke samping di HP */}
      <div className="pointer-events-none fixed inset-0 z-[80] overflow-hidden">
        <aside
          className={`pointer-events-auto absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream transition-transform duration-300 sm:right-3 sm:top-3 sm:h-[calc(100%-24px)] sm:overflow-hidden sm:rounded-[32px] ${
            drawerOpen ? "translate-x-0" : "translate-x-[calc(100%+24px)]"
          }`}
          aria-label="Keranjang belanja"
          aria-hidden={!drawerOpen}
          inert={!drawerOpen}
        >
          <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
            <h2 className="display-3">Keranjang ({count})</h2>
            <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Tutup keranjang" className="icon-btn">
              <Close width={18} height={18} />
            </button>
          </div>

          {lines.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-sand">
                <CartIcon width={32} height={32} />
              </span>
              <p className="text-muted">Keranjang masih kosong.</p>
              <Link href="/menu" onClick={() => setDrawerOpen(false)} className="btn btn-primary">
                Lihat Menu
              </Link>
            </div>
          ) : (
            <>
              <ul className="flex-1 divide-y divide-black/10 overflow-y-auto px-6">
                {lines.map((line) => (
                  <li key={line.optionId} className="flex gap-3 py-4">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-sand">
                      <Image src={line.image ? thumb(line.image) : "/images/logo.webp"} alt="" width={64} height={64} className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium leading-snug">{line.itemName}</p>
                      {line.showOption && <p className="text-sm text-muted">{line.optionLabel}</p>}
                      <div className="mt-2 flex items-center justify-between">
                        <QtyControl qty={line.qty} onChange={(q) => setQty(line.optionId, q)} />
                        <span className="text-sm font-medium tabular-nums">{rupiah(line.price * line.qty)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="border-t border-black/10 bg-sand p-6">
                <div className="mb-1 flex items-baseline justify-between">
                  <span className="text-muted">Subtotal</span>
                  <span className="text-xl font-medium tabular-nums">{rupiah(subtotal)}</span>
                </div>
                <p className="mb-5 text-sm text-muted">Ongkos kirim dikonfirmasi admin sesuai jarak.</p>
                <Link href="/order" onClick={() => setDrawerOpen(false)} className="btn btn-primary w-full">
                  Lanjut ke checkout
                </Link>
              </div>
            </>
          )}
        </aside>
      </div>
    </>
  );
}

// Tombol keranjang melayang. Selalu terpasang (hanya disembunyikan) supaya animasi
// tambah-item juga jalan saat item pertama masuk.
function FloatingCartButton({ visible }: { visible: boolean }) {
  const { count, subtotal, setDrawerOpen } = useCart();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const toastRef = useRef<HTMLSpanElement>(null);

  useOnCartAdd(() => {
    bump(countRef.current, 1.3);
    bump(buttonRef.current, 1.04);
    const reduce = prefersReducedMotion();
    const timing = { duration: 1800, easing: "ease-out" };
    labelRef.current?.animate([{ opacity: 1 }, { opacity: 0, offset: 0.1 }, { opacity: 0, offset: 0.82 }, { opacity: 1 }], timing);
    toastRef.current?.animate(
      [
        { opacity: 0, transform: reduce ? "none" : "translateY(8px)" },
        { opacity: 1, transform: "none", offset: 0.12 },
        { opacity: 1, transform: "none", offset: 0.8 },
        { opacity: 0, transform: reduce ? "none" : "translateY(-6px)" },
      ],
      timing,
    );
  });

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={() => setDrawerOpen(true)}
      inert={!visible}
      aria-hidden={!visible}
      style={{ viewTransitionName: "floating-cart" }}
      className={`fixed inset-x-4 bottom-4 z-40 flex items-center justify-between gap-6 rounded-full bg-ink py-2 pl-2 pr-6 text-cream shadow-[0_12px_40px_rgba(0,0,0,0.25)] transition-[translate,opacity,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-ink-soft sm:inset-x-auto sm:bottom-6 sm:right-6 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-8 opacity-0"
      }`}
    >
      <span className="flex items-center gap-3">
        <span ref={countRef} className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
          {count}
        </span>
        <span className="grid text-sm font-medium">
          <span ref={labelRef} className="[grid-area:1/1]">
            Lihat keranjang
          </span>
          <span ref={toastRef} className="inline-flex items-center gap-1 text-accent opacity-0 [grid-area:1/1]" aria-hidden>
            <Check width={16} height={16} /> Ditambahkan
          </span>
        </span>
      </span>
      <span className="font-medium tabular-nums">{rupiah(subtotal)}</span>
    </button>
  );
}

export function QtyControl({ qty, onChange, size = "sm" }: { qty: number; onChange: (qty: number) => void; size?: "sm" | "md" }) {
  const btn = size === "sm" ? "h-9 w-9" : "h-10 w-10";
  return (
    <div className="inline-flex items-center rounded-full border border-black/12 bg-white">
      <button type="button" className={`${btn} flex items-center justify-center rounded-full hover:bg-sand`} onClick={() => onChange(qty - 1)} aria-label="Kurangi">
        <Minus width={14} height={14} />
      </button>
      <span className="w-7 text-center text-sm font-medium tabular-nums" aria-live="polite">
        {qty}
      </span>
      <button type="button" className={`${btn} flex items-center justify-center rounded-full hover:bg-sand`} onClick={() => onChange(qty + 1)} aria-label="Tambah">
        <Plus width={14} height={14} />
      </button>
    </div>
  );
}
