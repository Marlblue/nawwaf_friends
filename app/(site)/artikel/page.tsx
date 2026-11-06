import type { Metadata } from "next";
import Link from "next/link";
import ArticleList from "@/components/ArticleList";
import ArticleSearch from "@/components/ArticleSearch";
import { ArrowLeft } from "@/components/Icons";
import PageHero from "@/components/PageHero";
import PageTransition from "@/components/PageTransition";
import { paginateArticles } from "@/lib/articles";
import { cariArtikel, clampQuery } from "@/lib/pencarian-artikel";
import { getArticles } from "@/lib/sanity/queries";

/*
 * Sengaja tanpa `export const revalidate`: halaman ini membaca `searchParams` (?q= pencarian),
 * jadi Next me-render-nya per request. Datanya tetap tidak menembak Sanity tiap kali: getArticles
 * tersimpan di data cache bertag "article" yang diperbarui webhook (lib/sanity/queries.ts), dan
 * pencariannya cuma menyaring daftar itu di memori. Halaman 2 dst. tetap statis.
 */

const DESCRIPTION = "Cerita kuliner Timur Tengah, tips pesan antar, catering, dan aqiqah dari Nawwaf & Friends.";

export async function generateMetadata({ searchParams }: PageProps<"/artikel">): Promise<Metadata> {
  const query = clampQuery((await searchParams).q);
  // Hasil pencarian cuma potongan dari /artikel; kalau diindeks, mesin pencari bisa merayapi
  // kata kunci tak terbatas. Canonical tetap /artikel.
  if (query) {
    return {
      title: `Cari “${query}” – Artikel`,
      description: DESCRIPTION,
      alternates: { canonical: "/artikel" },
      robots: { index: false, follow: true },
    };
  }
  // Selama belum ada artikel, halaman kosong ini tidak perlu masuk indeks Google.
  const kosong = (await getArticles()).length === 0;
  return {
    title: "Artikel",
    description: DESCRIPTION,
    alternates: { canonical: "/artikel" },
    ...(kosong && { robots: { index: false } }),
  };
}

export default async function ArtikelPage({ searchParams }: PageProps<"/artikel">) {
  const query = clampQuery((await searchParams).q);
  const articles = await getArticles();

  return (
    <PageTransition>
      <PageHero eyebrow="Blog" title="Artikel" subtitle="Cerita kuliner Timur Tengah, info menu, dan tips seputar pesanan." />
      <div className="container-x pb-20">
        {articles.length === 0 ? (
          <p data-reveal className="lead py-10 text-center">
            Belum ada artikel. Nantikan cerita dari dapur kami segera.
          </p>
        ) : (
          <>
            <div className="mb-12 sm:mb-16">
              <ArticleSearch initialQuery={query} />
            </div>
            {query ? <HasilPencarian query={query} hasil={cariArtikel(articles, query)} /> : <ArticleList {...paginateArticles(articles, 1)!} />}
          </>
        )}
      </div>
    </PageTransition>
  );
}

function HasilPencarian({ query, hasil }: { query: string; hasil: Awaited<ReturnType<typeof getArticles>> }) {
  return (
    <>
      <p aria-live="polite" className="mb-10 text-center text-muted">
        {hasil.length === 0 ? (
          <>
            Tidak ada artikel untuk <span className="font-medium text-ink">“{query}”</span>.
          </>
        ) : (
          <>
            <span className="font-medium text-ink">{hasil.length} artikel</span> untuk{" "}
            <span className="font-medium text-ink">“{query}”</span>
          </>
        )}
      </p>
      {hasil.length === 0 ? (
        <div className="py-6 text-center">
          <p className="mb-6 text-muted">Coba kata kunci lain, atau lihat semua artikel yang ada.</p>
          <Link href="/artikel" className="btn btn-secondary btn-sm">
            <ArrowLeft width={16} height={16} /> Lihat semua artikel
          </Link>
        </div>
      ) : (
        // Semua hasil dalam satu halaman tanpa featured: yang tampil hanya artikel yang cocok.
        <ArticleList items={hasil} page={1} totalPages={1} featured={undefined} />
      )}
    </>
  );
}
