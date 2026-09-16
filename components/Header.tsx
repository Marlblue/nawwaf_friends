"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { bump, wiggle } from "@/lib/motion";
import { nav, site } from "@/lib/site";
import { useCart, useOnCartAdd } from "./CartProvider";
import { CartIcon } from "./Icons";

export default function Header() {
  const pathname = usePathname();
  const { count, drawerOpen, setDrawerOpen } = useCart();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hiddenOnScroll, setHiddenOnScroll] = useState(false);
  const lastY = useRef(0);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      const delta = y - lastY.current;
      // Abaikan getaran scroll kecil; sembunyi saat turun, muncul lagi saat naik
      if (Math.abs(delta) > 6) {
        setHiddenOnScroll(delta > 0 && y > 160);
        lastY.current = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const hidden = hiddenOnScroll && !open && !drawerOpen;

  // Elemen sticky lain (mis. filter menu) ikut naik saat header sembunyi
  useEffect(() => {
    document.documentElement.toggleAttribute("data-header-hidden", hidden);
  }, [hidden]);

  useOnCartAdd(() => {
    bump(badgeRef.current);
    wiggle(iconRef.current);
  });

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      onFocusCapture={() => setHiddenOnScroll(false)}
      style={{ viewTransitionName: "site-header" }}
      className={`sticky top-0 z-50 border-b transition-[translate,background-color,border-color] duration-300 ease-out ${
        hidden ? "-translate-y-full" : ""
      } ${
        // backdrop-blur membuat panel fixed di dalamnya ikut terpotong, jadi dimatikan saat menu terbuka
        open ? "border-black/8 bg-cream" : scrolled ? "border-black/8 bg-cream/90 backdrop-blur-md" : "border-transparent bg-cream"
      }`}
    >
      <nav className="container-x flex h-[var(--header-h)] items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Image src="/images/logo.png" alt="" width={44} height={44} className="h-11 w-11 rounded-full object-cover" priority />
          <span className="leading-tight">
            <span className="block text-base font-semibold">{site.name}</span>
            <span className="block text-xs text-muted">{site.tagline}</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`text-[15px] underline-offset-[6px] transition hover:underline ${
                  isActive(item.href) ? "font-medium text-ink underline" : "text-ink-soft"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="icon-btn relative"
            aria-label={`Keranjang, ${count} item`}
          >
            <span ref={iconRef} className="flex">
              <CartIcon />
            </span>
            {count > 0 && (
              <span
                ref={badgeRef}
                className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[11px] font-semibold text-white"
              >
                {count}
              </span>
            )}
          </button>
          <Link href="/menu" className="btn btn-primary btn-sm hidden sm:inline-flex">
            Pesan Antar
          </Link>
          <button
            type="button"
            className="icon-btn flex-col gap-[5px] lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            <span className={`h-[1.5px] w-5 rounded bg-current transition duration-400 ease-[var(--ease)] ${open ? "translate-y-[6.5px] rotate-45" : ""}`} />
            <span className={`h-[1.5px] w-5 rounded bg-current transition duration-300 ease-[var(--ease)] ${open ? "scale-x-0 opacity-0" : ""}`} />
            <span className={`h-[1.5px] w-5 rounded bg-current transition duration-400 ease-[var(--ease)] ${open ? "-translate-y-[6.5px] -rotate-45" : ""}`} />
          </button>
        </div>
      </nav>

      <div
        id="mobile-nav"
        className={`fixed inset-x-0 bottom-0 top-[var(--header-h)] overflow-y-auto overflow-x-hidden bg-cream transition-[opacity,visibility] duration-300 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <ul className="container-x flex flex-col pt-4">
          {nav.map((item, i) => (
            <li
              key={item.href}
              className={`border-b border-black/8 transition-[opacity,translate] duration-500 ease-[var(--ease)] ${open ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"}`}
              style={{ transitionDelay: open ? `${80 + i * 45}ms` : "0ms" }}
            >
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={`block py-4 text-2xl ${isActive(item.href) ? "font-medium text-brand" : "text-ink"}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div
          className={`container-x mt-8 transition-[opacity,translate] duration-500 ease-[var(--ease)] ${open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
          style={{ transitionDelay: open ? `${80 + nav.length * 45}ms` : "0ms" }}
        >
          <Link href="/menu" onClick={() => setOpen(false)} className="btn btn-primary w-full">
            Pesan Antar
          </Link>
        </div>
      </div>
    </header>
  );
}
