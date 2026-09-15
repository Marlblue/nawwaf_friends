import { ViewTransition } from "react";

// Membungkus isi setiap page.tsx supaya pindah halaman crossfade halus.
// Harus dipasang di page, bukan layout: layout tetap terpasang saat navigasi,
// jadi animasi masuk/keluar tidak akan terpicu di sana.
export default function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      {children}
    </ViewTransition>
  );
}
