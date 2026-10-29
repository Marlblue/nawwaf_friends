import type { Metadata } from "next";
import NotFoundView from "@/components/NotFoundView";
import SiteShell from "@/components/SiteShell";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: `Halaman tidak ditemukan | ${site.name}` };

// Harus tetap di akar app/ (hanya file ini yang dipakai untuk URL yang tidak cocok rute mana pun),
// jadi layout grup (site) tidak ikut dirender; kerangkanya dipasang sendiri lewat SiteShell.
// notFound() dari halaman di dalam (site) memakai app/(site)/not-found.tsx, bukan file ini.
export default function NotFound() {
  return (
    <SiteShell>
      <NotFoundView />
    </SiteShell>
  );
}
