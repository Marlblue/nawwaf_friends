import Link from "next/link";
import PageHero from "@/components/PageHero";
import PageTransition from "@/components/PageTransition";

export default function NotFound() {
  return (
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
  );
}
