import Link from "next/link";
import ArticleCover from "@/components/ArticleCover";
import { ArrowLeft, ArrowRight } from "@/components/Icons";
import { articlePageHref, formatDate, type paginateArticles } from "@/lib/articles";
import { revealDelay } from "@/lib/motion";
import type { ArticleCard } from "@/lib/sanity/types";

type Props = NonNullable<ReturnType<typeof paginateArticles<ArticleCard>>>;

/** Daftar artikel satu halaman /artikel: featured (halaman 1 saja), grid kartu, lalu navigasi halaman. */
export default function ArticleList({ featured, items, page, totalPages }: Props) {
  return (
    <>
      {featured && (
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
      )}

      {items.length > 0 && (
        <div className={`grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 ${featured ? "section !pb-0" : ""}`}>
          {items.map((a, i) => (
            <Link key={a._id} href={`/artikel/${a.slug}`} data-reveal style={revealDelay(i, 0.1)} className="group block">
              <div className="media aspect-[4/3]">
                <ArticleCover
                  cover={a.coverImage}
                  width={800}
                  height={600}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                  priority={!featured && i < 3}
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

      {totalPages > 1 && <Pagination page={page} totalPages={totalPages} />}
    </>
  );
}

function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <nav aria-label="Halaman artikel" className="mt-16 flex flex-wrap items-center justify-center gap-2">
      {page > 1 && (
        <Link href={articlePageHref(page - 1)} rel="prev" aria-label="Halaman sebelumnya" className="btn btn-secondary btn-sm">
          <ArrowLeft width={16} height={16} /> <span className="hidden sm:inline">Sebelumnya</span>
        </Link>
      )}
      {pages.map((p) => (
        <Link
          key={p}
          href={articlePageHref(p)}
          aria-current={p === page ? "page" : undefined}
          aria-label={`Halaman ${p}`}
          className={`btn btn-sm !min-w-10 !px-0 ${p === page ? "btn-dark" : "btn-secondary"}`}
        >
          {p}
        </Link>
      ))}
      {page < totalPages && (
        <Link href={articlePageHref(page + 1)} rel="next" aria-label="Halaman berikutnya" className="btn btn-secondary btn-sm">
          <span className="hidden sm:inline">Berikutnya</span> <ArrowRight width={16} height={16} />
        </Link>
      )}
    </nav>
  );
}
