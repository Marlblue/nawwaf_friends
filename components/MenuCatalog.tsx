"use client";

import Image from "next/image";
import { startTransition, useLayoutEffect, useMemo, useRef, useState, ViewTransition } from "react";
import { categories, menu, type CategoryId } from "@/lib/menu";
import { Search } from "./Icons";
import MenuItemRow from "./MenuItemRow";

export default function MenuCatalog({ initialQuery = "", initialCategory }: { initialQuery?: string; initialCategory?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [active, setActive] = useState<CategoryId | "all">(
    categories.some((c) => c.id === initialCategory) ? (initialCategory as CategoryId) : "all",
  );
  const trackRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const q = query.trim().toLowerCase();
  const groups = useMemo(() => {
    return categories
      .filter((c) => active === "all" || c.id === active)
      .map((c) => {
        // Nama kategori ikut dicari, supaya mengetik "porsian" atau "snack" menampilkan
        // seluruh isi kategorinya. Tanpa ini hasilnya nol, karena tidak ada satu pun
        // nama/deskripsi item yang memuat kata kategorinya.
        const categoryMatch = !!q && c.name.toLowerCase().includes(q);
        return {
          ...c,
          items: menu.filter(
            (m) =>
              m.category === c.id &&
              (!q || categoryMatch || `${m.name} ${m.description ?? ""}`.toLowerCase().includes(q)),
          ),
        };
      })
      .filter((g) => g.items.length > 0);
  }, [active, q]);

  // Geser penanda (pill gelap) ke kategori aktif; posisinya diukur langsung dari tombol
  useLayoutEffect(() => {
    const track = trackRef.current;
    const indicator = indicatorRef.current;
    if (!track || !indicator) return;

    const place = () => {
      const btn = track.querySelector<HTMLElement>('[aria-pressed="true"]');
      if (!btn) return;
      indicator.style.width = `${btn.offsetWidth}px`;
      indicator.style.transform = `translateX(${btn.offsetLeft}px)`;
    };

    if (track.dataset.ready) {
      place();
      track.querySelector('[aria-pressed="true"]')?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
    } else {
      // Posisi awal tanpa animasi, baru aktifkan setelah frame berikutnya
      indicator.style.transition = "none";
      place();
      requestAnimationFrame(() => {
        indicator.style.transition = "";
        track.dataset.ready = "true";
      });
      document.fonts?.ready.then(place);
    }

    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [active]);

  // Bawa awal daftar ke bawah bilah filter supaya judul kategori pertama tidak ketutupan.
  // Jaraknya diukur langsung, bukan angka tetap: tinggi bilah beda jauh antara HP
  // (kolom cari & chip bertumpuk) dan desktop (sebaris). Header ikut dihitung karena
  // lompatan ini menggulir ke atas, yang otomatis memunculkan lagi header yang tersembunyi.
  const scrollListToTop = () => {
    const list = listRef.current;
    if (!list) return;
    const headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 72;
    const clearance = headerH + (barRef.current?.offsetHeight ?? 0) + 16;
    const top = list.getBoundingClientRect().top;
    if (top < clearance) window.scrollTo({ top: top + window.scrollY - clearance, behavior: "instant" });
  };

  const selectCategory = (id: CategoryId | "all") => {
    if (id === active) return;
    startTransition(() => {
      setActive(id);
      scrollListToTop();
    });
  };

  return (
    <div>
      <div ref={barRef} className="sticky-below-header sticky z-30 -mx-5 mb-12 border-b border-black/8 bg-cream/95 px-5 py-3 backdrop-blur-md md:-mx-10 md:px-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <label className="relative shrink-0 md:w-72">
            <span className="sr-only">Cari menu</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink" width={18} height={18} />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                scrollListToTop();
              }}
              placeholder="Cari menu, mis. kebuli"
              className="field field-search"
            />
          </label>
          <div className="-mx-5 min-w-0 px-5 md:mx-0 md:px-0">
            <div ref={trackRef} className="chip-track no-scrollbar relative flex gap-2 overflow-x-auto">
              <span ref={indicatorRef} className="chip-indicator" aria-hidden />
              {[{ id: "all" as const, name: "Semua" }, ...categories].map((c) => (
                <button key={c.id} type="button" onClick={() => selectCategory(c.id)} aria-pressed={active === c.id} className="chip min-h-10">
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ViewTransition key={active} name="menu-list" share="menu-swap" enter="menu-swap" default="none">
        <div ref={listRef}>
          {groups.length === 0 ? (
            <p className="py-16 text-center text-muted">Menu &ldquo;{query}&rdquo; tidak ditemukan.</p>
          ) : (
            <div className="space-y-20 lg:space-y-28">
              {groups.map((g, i) => (
                <section
                  key={g.id}
                  id={g.id}
                  data-reveal
                  className="grid scroll-mt-44 gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16"
                >
                  <div className={`hidden lg:block ${i % 2 ? "lg:order-2" : ""}`}>
                    <div className="media sticky top-44 aspect-[4/5]">
                      <Image src={g.image} alt={g.name} fill sizes="40vw" className="object-cover" />
                    </div>
                  </div>
                  <div>
                    <h2 className="display-2">{g.name}</h2>
                    <p className="mt-2 text-muted">
                      {g.blurb} · {g.items.length} menu
                    </p>
                    <div className="mt-6 divide-y divide-black/10 border-y border-black/10">
                      {g.items.map((item) => (
                        <MenuItemRow key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </ViewTransition>
    </div>
  );
}
