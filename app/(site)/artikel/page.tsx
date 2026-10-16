import type { Metadata } from "next";
import Link from "next/link";
import ArticleCover from "@/components/ArticleCover";
import { ArrowRight } from "@/components/Icons";
import PageHero from "@/components/PageHero";
import PageTransition from "@/components/PageTransition";
import { formatDate } from "@/lib/articles";
import { revealDelay } from "@/lib/motion";
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
  const articles = await getArticles();
  // Yang ditandai featured di Studio tampil besar; kalau tidak ada, artikel terbaru.
  const featured = articles.find((a) => a.featured) ?? articles[0];
  const rest = articles.filter((a) => a !== featured);

  return (
    <PageTransition>
      <PageHero eyebrow="Blog" title="Artikel" subtitle="Cerita kuliner Timur Tengah, info menu, dan tips seputar pesanan." />
      <div className="container-x pb-20">
        {!featured ? (
          <p data-reveal className="lead py-10 text-center">
            Belum ada artikel. Nantikan cerita dari dapur kami segera.
          </p>
        ) : (
          <>
            <Link href={`/artikel/${featured.slug}`} data-reveal className="group card grid items-center gap-8 p-4 sm:p-6 md:grid-cols-2 lg:gap-16">
              <div className="media aspect-[4/3] !rounded-[24px]">
                <ArticleCover
                  cover={featured.coverImage}
                  width={1200}
                  height={900}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                  priority
                  decorative
                />
              </div>
              <div className="px-2 pb-4 md:pb-0 md:pr-6">
                <p className="text-sm text-muted">
                  {featured.category} · {formatDate(featured.publishedAt)}
                </p>
                <h2 className="display-2 mt-3">{featured.title}</h2>
                <p className="lead mt-4">{featured.excerpt}</p>
                <span className="btn btn-dark mt-8">
                  Baca artikel <ArrowRight width={18} height={18} />
                </span>
              </div>
            </Link>

            {rest.length > 0 && (
              <div className="section grid gap-x-6 gap-y-12 !pb-0 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((a, i) => (
                  <Link key={a._id} href={`/artikel/${a.slug}`} data-reveal style={revealDelay(i, 0.1)} className="group block">
                    <div className="media aspect-[4/3]">
                      <ArticleCover
                        cover={a.coverImage}
                        width={800}
                        height={600}
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition duration-700 group-hover:scale-[1.04]"
                        decorative
                      />
                    </div>
                    <p className="mt-4 text-sm text-muted">
                      {a.category} · {formatDate(a.publishedAt)}
                    </p>
                    <h3 className="mt-1 text-lg font-medium leading-snug group-hover:underline">{a.title}</h3>
                    <p className="mt-2 line-clamp-2 text-[15px] text-muted">{a.excerpt}</p>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </PageTransition>
  );
}
