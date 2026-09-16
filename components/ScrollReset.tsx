"use client";

import { useEffect } from "react";

// Browser menyimpan posisi scroll sebelum halaman ditinggalkan, lalu memulihkannya
// di load berikutnya. Masalahnya, saat halaman dimuat ada pergeseran tata letak kecil
// (font & gambar masuk belakangan) yang membuat browser mengoreksi posisi itu beberapa
// piksel ke bawah. Nilai hasil koreksi ikut tersimpan, dipulihkan lagi, dikoreksi lagi,
// sehingga tiap refresh halaman merambat makin ke bawah.
//
// Jadi pemulihan bawaan browser dimatikan dan setiap kali halaman dibuka dari nol
// dimulai dari atas. Ini hanya berlaku untuk pemuatan halaman penuh (refresh, buka
// tautan langsung); pindah halaman di dalam situs tetap ditangani router Next.
export default function ScrollReset() {
  useEffect(() => {
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;

    // Tombol back/forward beda urusan: di situ posisi scroll sebelumnya justru yang
    // diharapkan pengguna, jadi jangan disentuh sama sekali. Yang dibereskan hanya
    // refresh dan membuka alamat langsung.
    if (nav?.type === "back_forward") return;

    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    // Jangan ganggu tautan seperti /venue#booking yang memang minta lompat ke bagian tertentu
    if (window.location.hash) return;

    // "instant" wajib: tanpa itu guliran ini ikut `scroll-behavior: smooth` milik situs,
    // beranimasi dari posisi pulihan, dan sempat terlihat menggeser sendiri saat dibuka.
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return null;
}
