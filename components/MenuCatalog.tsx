"use client";

import Image from "next/image";
import { startTransition, useEffect, useLayoutEffect, useMemo, useRef, useState, ViewTransition } from "react";
import { categories, menu } from "@/lib/menu";
import { services, type ServiceId } from "@/lib/services";
import { addressText, openingHoursLines, site, waLink } from "@/lib/site";
import Highlight from "./Highlight";
import { ArrowRight, Check, Clock, MapPin, Search, Whatsapp } from "./Icons";
import MenuItemRow from "./MenuItemRow";

export default function MenuCatalog({ initialQuery = "", initialCategory }: { initialQuery?: string; initialCategory?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [active, setActive] = useState<ServiceId>(
    services.some((s) => s.id === initialCategory) ? (initialCategory as ServiceId) : "delivery",
  );
  const trackRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const q = query.trim().toLowerCase();
  const groups = useMemo(() => {
    return categories
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
  }, [q]);

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

  // Safari iOS belum mendukung interactive-widget: keyboard cuma menutupi layar tanpa
  // mengecilkan halaman, jadi bilah filter yang sticky ter-pin di titik yang tertutup
  // keyboard dan seolah hilang begitu digulir. Melepas fokus saat pengguna mulai
  // menggulir mengembalikan bilahnya, sekaligus mengembalikan ruang layar yang terpakai.
  // Dipasang di touchmove, bukan scroll, supaya lompatan scroll otomatis waktu mengetik
  // tidak ikut menutup keyboard di tengah pengetikan.
  useEffect(() => {
    const onTouchMove = (e: TouchEvent) => {
      const input = inputRef.current;
      if (!input || document.activeElement !== input) return;
      if (e.target === input) return; // sedang menggeser kursor di dalam kolomnya sendiri
      input.blur();
    };
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => window.removeEventListener("touchmove", onTouchMove);
  }, []);

  const selectCategory = (id: ServiceId) => {
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
          <div className="-mx-5 min-w-0 px-5 md:mx-0 md:px-0">
            <div ref={trackRef} className="chip-track no-scrollbar relative flex gap-2 overflow-x-auto">
              <span ref={indicatorRef} className="chip-indicator" aria-hidden />
              {services.map((s) => (
                <button key={s.id} type="button" onClick={() => selectCategory(s.id)} aria-pressed={active === s.id} className="chip min-h-10">
                  {s.title}
                </button>
              ))}
            </div>
          </div>
          {active === "delivery" && (
            <label className="relative shrink-0 md:ml-auto md:w-72">
              <span className="sr-only">Cari menu</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink" width={18} height={18} />
              <input
                ref={inputRef}
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
          )}
        </div>
      </div>

      <ViewTransition key={active} name="menu-list" share="menu-swap" enter="menu-swap" default="none">
        <div ref={listRef}>
          {active !== "delivery" ? (
            <ServicePanel id={active} />
          ) : groups.length === 0 ? (
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
                    <h2 className="display-2">
                      <Highlight text={g.name} query={q} />
                    </h2>
                    <p className="mt-2 text-muted">
                      {g.blurb} · {g.items.length} menu
                    </p>
                    <div className="mt-6 divide-y divide-black/10 border-y border-black/10">
                      {g.items.map((item) => (
                        <MenuItemRow key={item.id} item={item} query={q} />
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

// Tab selain Delivery: ringkasan layanan + tombol tanya/pesan lewat WhatsApp
function ServicePanel({ id }: { id: Exclude<ServiceId, "delivery"> }) {
  const s = services.find((x) => x.id === id)!;
  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
      <div className="media aspect-[4/3] lg:aspect-[4/5]">
        <Image src={s.image} alt={s.title} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
        <span className="absolute right-4 top-4 rounded-full border border-black/10 bg-white/90 px-3 py-1 text-xs font-semibold text-brand backdrop-blur-sm">
          {s.badge}
        </span>
      </div>
      <div className="flex flex-col lg:py-6">
        <h2 className="display-2">{s.title}</h2>
        <p className="lead mt-4 max-w-xl">{s.text}</p>
        <p className="mt-4 text-sm font-semibold text-brand">{s.note}</p>

        {id === "dine-in" ? (
          <ul className="mt-8 space-y-4 border-y border-black/10 py-6 text-[15px]">
            <li className="flex gap-3">
              <MapPin width={20} height={20} className="mt-0.5 shrink-0 text-brand" />
              <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand hover:underline">
                {addressText}
              </a>
            </li>
            <li className="flex gap-3">
              <Clock width={20} height={20} className="mt-0.5 shrink-0 text-brand" />
              <span>
                {openingHoursLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </span>
            </li>
          </ul>
        ) : (
          <ul className="mt-8 space-y-3 border-y border-black/10 py-6 text-[15px]">
            {s.points.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <Check width={20} height={20} className="mt-0.5 shrink-0 text-brand" />
                {point}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <a href={waLink(s.waText)} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            <Whatsapp width={18} height={18} /> {id === "dine-in" ? "Reservasi via WhatsApp" : "Pesan via WhatsApp"}
          </a>
          {id === "dine-in" && (
            <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              Buka Google Maps <ArrowRight width={18} height={18} />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
