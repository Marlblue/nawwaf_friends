"use client";

import { useEffect } from "react";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { site } from "@/lib/site";

// Di dalam grup (site), jadi navbar dan footer dari layout grup tetap tampil: pengunjung
// yang kena error masih bisa pindah halaman atau langsung pesan lewat WhatsApp.
export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  // `digest` sama dengan kode yang dicatat server, jadi kalau ada pengunjung melapor,
  // kodenya bisa dicocokkan dengan log aplikasi di cPanel.
  useEffect(() => {
    console.error("[error boundary]", error.digest ?? "(tanpa digest)", error);
  }, [error]);

  return (
    <>
      <PageHero eyebrow="Ups" title="Terjadi kesalahan" subtitle="Halaman ini gagal dimuat. Coba lagi, atau pesan langsung lewat WhatsApp." />
      <div className="flex flex-wrap justify-center gap-3 px-5 pb-28">
        <button type="button" onClick={() => retry()} className="btn btn-primary">
          Coba lagi
        </button>
        <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
          Pesan via WhatsApp
        </a>
        <Link href="/" className="btn btn-secondary">
          Ke beranda
        </Link>
      </div>
      {error.digest && <p className="pb-10 text-center text-xs text-muted">Kode kesalahan: {error.digest}</p>}
    </>
  );
}
