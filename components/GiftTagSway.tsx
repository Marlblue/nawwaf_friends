"use client";

import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/motion";

// Hang tag Gift Set di hero ikut terayun saat halaman di-scroll, lalu diam lagi.
// Simulasi pegas teredam sederhana: kecepatan scroll memberi dorongan ke sudut tag, pegas
// menariknya kembali ke 0, redaman menghabiskan ayunannya dalam ±1 detik. Hasilnya ditulis ke
// variabel --sway, yang dipakai `rotate` di globals.css (.gift-tag, .gift-tag-mini).
//
// - Loop animasi hanya jalan selama tag bergerak; begitu diam, berhenti sampai scroll berikutnya.
// - Scroll diabaikan selama tag tidak terlihat (IntersectionObserver), jadi tidak ada kerja sia-sia
//   saat pengunjung sudah jauh di bawah hero.
// - Pengunjung yang memilih "kurangi gerakan" tidak mendapat efek ini sama sekali.
const STIFFNESS = 70; // tarikan pegas ke posisi diam
const DAMPING = 6.5; // redaman; makin besar makin cepat diam
const PUSH = 0.55; // derajat/detik per piksel scroll
const MAX_ANGLE = 12; // derajat
const MAX_SPEED = 140; // derajat/detik

export default function GiftTagSway() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const tags = Array.from(document.querySelectorAll<HTMLElement>(".gift-tag, .gift-tag-mini"));
    if (tags.length === 0) return;

    let angle = 0;
    let speed = 0;
    let lastY = window.scrollY;
    let lastT = 0;
    let frame = 0;
    let visible = true;

    const write = () => {
      const v = `${angle.toFixed(3)}deg`;
      for (const t of tags) t.style.setProperty("--sway", v);
    };

    const step = (now: number) => {
      // dt dibatasi supaya tab yang lama tidak aktif tidak membuat sudutnya melompat
      const dt = Math.min((now - (lastT || now)) / 1000, 1 / 30);
      lastT = now;
      speed += (-STIFFNESS * angle - DAMPING * speed) * dt;
      angle = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, angle + speed * dt));
      write();
      if (Math.abs(angle) < 0.02 && Math.abs(speed) < 0.05) {
        angle = 0;
        speed = 0;
        write();
        frame = 0;
        lastT = 0;
        return;
      }
      frame = requestAnimationFrame(step);
    };

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      lastY = y;
      if (!visible || delta === 0) return;
      // Halaman bergerak naik saat scroll ke bawah; tag "tertinggal", jadi terayun berlawanan arah.
      speed = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, speed - delta * PUSH));
      if (!frame) frame = requestAnimationFrame(step);
    };

    const io = new IntersectionObserver((entries) => {
      visible = entries.some((e) => e.isIntersecting);
    });
    for (const t of tags) io.observe(t);

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
      cancelAnimationFrame(frame);
      for (const t of tags) t.style.removeProperty("--sway");
    };
  }, []);

  return null;
}
