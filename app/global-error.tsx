"use client";

import { useEffect } from "react";
import { site } from "@/lib/site";
import "./globals.css";

// Cadangan terakhir kalau layout akar sendiri yang gagal. File ini menggantikan seluruh
// dokumen, jadi <html>/<body> dan stylesheet-nya dipasang sendiri, dan SiteShell sengaja
// tidak dipakai: bisa jadi justru bagian itu yang rusak.
export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error("[global error]", error.digest ?? "(tanpa digest)", error);
  }, [error]);

  return (
    <html lang="id">
      <body className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
        <title>{`Terjadi kesalahan | ${site.name}`}</title>
        <h1 className="mb-3 text-2xl font-semibold">Terjadi kesalahan</h1>
        <p className="mb-8 max-w-md text-muted">Situs sedang bermasalah. Coba lagi sebentar, atau pesan langsung lewat WhatsApp.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => retry()} className="btn btn-primary">
            Coba lagi
          </button>
          <a href={`https://wa.me/${site.whatsapp}`} className="btn btn-secondary">
            WhatsApp {site.whatsappDisplay}
          </a>
        </div>
        {error.digest && <p className="mt-6 text-xs text-muted">Kode kesalahan: {error.digest}</p>}
      </body>
    </html>
  );
}
