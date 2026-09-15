// Animasi kecil berbasis Web Animations API. Semua dilewati jika pengguna
// mengaktifkan "kurangi gerakan" di perangkatnya.

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Efek "memantul" untuk badge/ikon keranjang saat item ditambahkan
export function bump(el: Element | null, scale = 1.45) {
  if (!el || prefersReducedMotion()) return;
  el.animate(
    [
      { transform: "scale(1)" },
      { transform: `scale(${scale})`, offset: 0.3 },
      { transform: "scale(0.88)", offset: 0.55 },
      { transform: "scale(1.08)", offset: 0.8 },
      { transform: "scale(1)" },
    ],
    { duration: 650, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
  );
}

// Goyangan singkat untuk ikon keranjang
export function wiggle(el: Element | null) {
  if (!el || prefersReducedMotion()) return;
  el.animate(
    [
      { transform: "rotate(0)" },
      { transform: "rotate(-14deg)", offset: 0.25 },
      { transform: "rotate(10deg)", offset: 0.5 },
      { transform: "rotate(-5deg)", offset: 0.75 },
      { transform: "rotate(0)" },
    ],
    { duration: 550, easing: "ease-out" },
  );
}

// Jeda bertahap untuk elemen `data-reveal` dalam satu grup (dibatasi supaya tidak terlalu lama)
export function revealDelay(index: number, step = 0.08, base = 0) {
  return { "--reveal-delay": `${base + Math.min(index, 6) * step}s` } as React.CSSProperties;
}
