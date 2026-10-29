import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import ArticleList from "@/components/ArticleList";
import PageHero from "@/components/PageHero";
import PageTransition from "@/components/PageTransition";
import { articlePageHref, paginateArticles } from "@/lib/articles";
import { getArticles } from "@/lib/sanity/queries";

export const revalidate = 60;

// Hanya angka murni ("2"), supaya "02" atau "2abc" tidak jadi duplikat halaman yang sama.
function nomorHalaman(param: string) {
  return /^[1-9]\d*$/.test(param) ? Number(param) : NaN;
}

export async function generateStaticParams() {
  const { totalPages } = paginateArticles(await getArticles(), 1)!;
  return Array.from({ length: totalPages - 1 }, (_, i) => ({ halaman: String(i + 2) }));
}

export async function generateMetadata({ params }: PageProps<"/artikel/halaman/[halaman]">): Promise<Metadata> {
  const page = nomorHalaman((await params).halaman);
  if (!paginateArticles(await getArticles(), page)) return {};
  return {
    title: `Artikel – Halaman ${page}`,
    description: "Cerita kuliner Timur Tengah, tips pesan antar, catering, dan aqiqah dari Nawwaf & Friends.",
    alternates: { canonical: articlePageHref(page) },
  };
}

export default async function ArtikelHalamanPage({ params }: PageProps<"/artikel/halaman/[halaman]">) {
  const page = nomorHalaman((await params).halaman);
  if (page === 1) permanentRedirect("/artikel");
  const hasil = paginateArticles(await getArticles(), page);
  if (!hasil) notFound();

  return (
    <PageTransition>
      <PageHero eyebrow="Blog" title="Artikel" subtitle={`Halaman ${page} dari ${hasil.totalPages}`} />
      <div className="container-x pb-20">
        <ArticleList {...hasil} />
      </div>
    </PageTransition>
  );
}
