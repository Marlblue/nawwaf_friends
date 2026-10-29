import type { Metadata } from "next";
import ArticleList from "@/components/ArticleList";
import PageHero from "@/components/PageHero";
import PageTransition from "@/components/PageTransition";
import { paginateArticles } from "@/lib/articles";
import { getArticles } from "@/lib/sanity/queries";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  // Selama belum ada artikel, halaman kosong ini tidak perlu masuk indeks Google.
  const kosong = (await getArticles()).length === 0;
  return {
    title: "Artikel",
    description: "Cerita kuliner Timur Tengah, tips pesan antar, catering, dan aqiqah dari Nawwaf & Friends.",
    alternates: { canonical: "/artikel" },
    ...(kosong && { robots: { index: false } }),
  };
}

export default async function ArtikelPage() {
  // Halaman 1 selalu ada, jadi hasilnya tidak pernah null. Halaman 2 dst. di artikel/halaman/[halaman].
  const hasil = paginateArticles(await getArticles(), 1)!;

  return (
    <PageTransition>
      <PageHero eyebrow="Blog" title="Artikel" subtitle="Cerita kuliner Timur Tengah, info menu, dan tips seputar pesanan." />
      <div className="container-x pb-20">
        {hasil.featured ? (
          <ArticleList {...hasil} />
        ) : (
          <p data-reveal className="lead py-10 text-center">
            Belum ada artikel. Nantikan cerita dari dapur kami segera.
          </p>
        )}
      </div>
    </PageTransition>
  );
}
