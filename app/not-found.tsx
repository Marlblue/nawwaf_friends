import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import PageTransition from "@/components/PageTransition";
import SiteShell from "@/components/SiteShell";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: `Halaman tidak ditemukan | ${site.name}` };

// Harus tetap di akar app/ (hanya file ini yang dipakai untuk URL yang tidak cocok rute mana pun),
// jadi layout grup (site) tidak ikut dirender; kerangkanya dipasang sendiri lewat SiteShell.
export default function NotFound() {
  return (
    <SiteShell>
      <PageTransition>
        <PageHero eyebrow="404" title="Halaman tidak ditemukan" subtitle="Mungkin tautannya salah atau halaman sudah dipindahkan." />
        <div className="flex flex-wrap justify-center gap-3 px-5 pb-28">
          <Link href="/menu" className="btn btn-primary">
            Lihat menu
          </Link>
          <Link href="/" className="btn btn-secondary">
            Ke beranda
          </Link>
        </div>
      </PageTransition>
    </SiteShell>
  );
}
