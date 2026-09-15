import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Whatsapp } from "@/components/Icons";
import PageTransition from "@/components/PageTransition";
import { articles, formatDate } from "@/lib/articles";
import { revealDelay } from "@/lib/motion";
import { waLink } from "@/lib/site";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/artikel/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  return article ? { title: article.title, description: article.excerpt } : {};
}

export default async function ArticlePage({ params }: PageProps<"/artikel/[slug]">) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  const others = articles.filter((a) => a.slug !== slug).slice(0, 3);

  return (
    <PageTransition>
      <article className="container-x pt-10 sm:pt-14">
        <div className="mx-auto max-w-3xl">
          <Link href="/artikel" className="inline-flex items-center gap-2 text-[15px] text-muted hover:text-ink">
            <ArrowLeft width={18} height={18} /> Semua artikel
          </Link>
          <p className="hero-rise mt-10 text-sm text-muted">
            {article.category} · {formatDate(article.date)}
          </p>
          <h1 className="display-1 hero-rise mt-3 [--delay:.06s]">{article.title}</h1>
          <p className="lead hero-rise mt-5 [--delay:.12s]">{article.excerpt}</p>
        </div>

        <div className="media hero-rise mx-auto mt-10 aspect-[16/9] [--delay:.2s] [--rise:60px] max-w-5xl sm:mt-14">
          <Image src={article.image} alt={article.title} fill sizes="(min-width: 1024px) 1024px, 100vw" className="object-cover" priority />
        </div>

        <div className="prose-article mx-auto mt-12 max-w-2xl sm:mt-16">
          {article.body.map((block, i) => (
            <div key={i}>
              {block.heading && <h2>{block.heading}</h2>}
              {block.paragraphs.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </div>
          ))}
          <div className="mt-10 flex flex-wrap gap-3 border-t border-black/10 pt-8">
            <Link href="/menu" className="btn btn-primary">
              Pesan sekarang
            </Link>
            <a href={waLink(`Halo Nawwaf & Friends, saya baru baca artikel "${article.title}".`)} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              <Whatsapp width={18} height={18} /> Tanya admin
            </a>
          </div>
        </div>
      </article>

      <section className="container-x section">
        <div className="border-t border-black/8 pt-16">
          <h2 data-reveal className="display-2">Baca juga</h2>
          <div className="mt-10 grid gap-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {others.map((a, i) => (
              <Link key={a.slug} href={`/artikel/${a.slug}`} data-reveal style={revealDelay(i, 0.1)} className={`group block ${i === 2 ? "sm:hidden lg:block" : ""}`}>
                <div className="media aspect-[4/3]">
                  <Image src={a.image} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-[1.04]" />
                </div>
                <p className="mt-4 text-sm text-muted">{formatDate(a.date)}</p>
                <h3 className="mt-1 text-lg font-medium leading-snug group-hover:underline">{a.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
