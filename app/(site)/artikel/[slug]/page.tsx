import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleCover from "@/components/ArticleCover";
import { ArrowLeft, Whatsapp } from "@/components/Icons";
import PageTransition from "@/components/PageTransition";
import { formatDate } from "@/lib/articles";
import { revealDelay } from "@/lib/motion";
import { coverSource } from "@/lib/sanity/image";
import { getAllArticleSlugs, getArticleBySlug, getOtherArticles } from "@/lib/sanity/queries";
import { site, waLink } from "@/lib/site";

export const revalidate = 60;

// Style yang bisa dipilih di Studio dibatasi ke yang ada di sini (sanity/schemaTypes/article.ts).
// Gayanya ada di .prose-article (globals.css).
const ptComponents: PortableTextComponents = {
  marks: {
    link: ({ children, value }) => {
      const href: string = value?.href ?? "";
      // href datang dari dataset; selain http(s)/mailto/tel dibuang supaya "javascript:" tidak lolos.
      const safe = /^(https?:|mailto:|tel:|\/)/i.test(href) ? href : undefined;
      const external = /^https?:/i.test(href);
      return (
        <a href={safe} {...(external && { target: "_blank", rel: "noopener noreferrer" })}>
          {children}
        </a>
      );
    },
  },
};

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/artikel/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  const cover = coverSource(article.coverImage, 1200, 630);
  const seo = article.seo ?? {};
  const description = seo.metaDescription || article.excerpt;
  const ogTitle = seo.ogTitle || seo.seoTitle || article.title;
  const ogDescription = seo.ogDescription || description;
  const keywords = [seo.focusKeyword, ...(seo.secondaryKeywords ?? [])].filter((k): k is string => Boolean(k));
  return {
    // SEO Title ditulis lengkap oleh editor, jadi template "| Nawwaf & Friends" tidak ditambahkan.
    title: seo.seoTitle ? { absolute: seo.seoTitle } : article.title,
    description,
    ...(keywords.length > 0 && { keywords }),
    alternates: { canonical: `/artikel/${article.slug}` },
    openGraph: {
      type: "article",
      title: ogTitle,
      description: ogDescription,
      url: `${site.url}/artikel/${article.slug}`,
      publishedTime: article.publishedAt,
      // Tanpa cover, pakai gambar default layout: openGraph di sini menggantikan milik layout seluruhnya.
      images: [cover ? { url: cover.src, width: 1200, height: 630, alt: cover.alt } : { url: site.shareImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.twitterTitle || ogTitle,
      description: seo.twitterDescription || ogDescription,
      images: [cover ? cover.src : site.shareImage],
    },
  };
}

export default async function ArticlePage({ params }: PageProps<"/artikel/[slug]">) {
  const { slug } = await params;
  const [article, others] = await Promise.all([getArticleBySlug(slug), getOtherArticles(slug, 3)]);
  if (!article) notFound();
  const faq = (article.seo?.faq ?? []).filter((item) => item?.question && item?.answer);

  return (
    <PageTransition>
      <article className="container-x pt-10 sm:pt-14">
        <div className="mx-auto max-w-3xl">
          <Link href="/artikel" className="inline-flex items-center gap-2 text-[15px] text-muted hover:text-ink">
            <ArrowLeft width={18} height={18} /> Semua artikel
          </Link>
          <p className="hero-rise mt-10 text-sm text-muted">
            {article.category} · {formatDate(article.publishedAt)}
          </p>
          <h1 className="display-1 hero-rise mt-3 [--delay:.06s]">{article.title}</h1>
          <p className="lead hero-rise mt-5 [--delay:.12s]">{article.excerpt}</p>
        </div>

        {article.coverImage?.asset && (
          <div className="media hero-rise mx-auto mt-10 aspect-[16/9] [--delay:.2s] [--rise:60px] max-w-5xl sm:mt-14">
            <ArticleCover cover={article.coverImage} width={1600} height={900} sizes="(min-width: 1024px) 1024px, 100vw" priority />
          </div>
        )}

        <div className="prose-article mx-auto mt-12 max-w-2xl sm:mt-16">
          <PortableText value={article.content ?? []} components={ptComponents} />
          {/* FAQ tidak ditampilkan ke pembaca (permintaan user), hanya dikirim sebagai FAQ schema untuk Google. */}
          {faq.length > 0 && (
            <script
              type="application/ld+json"
              // JSON.stringify tidak meng-escape "<"; tanpa replace, "</script>" di jawaban FAQ bisa menutup blok ini.
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: faq.map((item) => ({
                    "@type": "Question",
                    name: item.question,
                    acceptedAnswer: { "@type": "Answer", text: item.answer },
                  })),
                }).replace(/</g, "\\u003c"),
              }}
            />
          )}
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

      {others.length > 0 && (
        <section className="container-x section">
          <div className="border-t border-black/8 pt-16">
            <h2 data-reveal className="display-2">Baca juga</h2>
            <div className="mt-10 grid gap-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {others.map((a, i) => (
                <Link key={a._id} href={`/artikel/${a.slug}`} data-reveal style={revealDelay(i, 0.1)} className={`group block ${i === 2 ? "sm:hidden lg:block" : ""}`}>
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
                  <p className="mt-4 text-sm text-muted">{formatDate(a.publishedAt)}</p>
                  <h3 className="mt-1 text-lg font-medium leading-snug group-hover:underline">{a.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </PageTransition>
  );
}
