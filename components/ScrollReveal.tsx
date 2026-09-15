"use client";

import { useEffect } from "react";

// Memunculkan elemen bertanda `data-reveal` saat pertama kali masuk layar (sekali saja).
// Status tampil disimpan di atribut `data-revealed` (bukan class) supaya tidak ikut
// terhapus saat React me-render ulang className elemen tersebut.
// Elemen yang sudah terlihat saat halaman dibuka langsung ditandai tampil tanpa animasi.
// Konten yang ditambahkan belakangan (ganti halaman, filter menu) ikut dipantau.
export default function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    if (!("IntersectionObserver" in window)) return;

    // Disimpan per efek (bukan di DOM), supaya aman saat efek dijalankan dua kali di mode dev
    const observed = new WeakSet<Element>();

    const reveal = (el: Element) => el.setAttribute("data-revealed", "");

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target);
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    const scan = () => {
      const pending = [...document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])")].filter((el) => !observed.has(el));
      if (!pending.length) return;
      // Anggap semua tampil dulu sebelum diukur, supaya elemen yang sudah di layar tidak ikut fade
      for (const el of pending) reveal(el);
      for (const el of pending) {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) continue;
        // Di luar layar: sembunyikan tanpa transisi, lalu tunggu sampai di-scroll masuk
        el.style.transition = "none";
        el.removeAttribute("data-revealed");
        void el.offsetHeight;
        el.style.transition = "";
        observed.add(el);
        io.observe(el);
      }
    };

    root.setAttribute("data-reveal-ready", "");
    scan();

    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      // Tampilkan semua yang masih tersembunyi supaya tidak ada konten yang "hilang"
      document.querySelectorAll("[data-reveal]:not([data-revealed])").forEach(reveal);
      root.removeAttribute("data-reveal-ready");
    };
  }, []);

  return null;
}
