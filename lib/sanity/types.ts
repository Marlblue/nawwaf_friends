import type { Image, PortableTextBlock } from "sanity";

// Opsional walaupun wajib di Studio: dokumen bisa ditulis lewat API tanpa validasi Studio.
export type SanityArticleCover = Image & { alt?: string };

/** Data kartu artikel, tanpa isi tulisan. */
export type ArticleCard = {
  _id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  coverImage?: SanityArticleCover;
  /** Timestamp ISO: publishedAt, atau _createdAt kalau publishedAt kosong. */
  publishedAt: string;
  featured: boolean;
};

export type ArticleFaq = { _key: string; question?: string; answer?: string };

/** Field SEO opsional; yang kosong jatuh ke title/excerpt. */
export type ArticleSeo = {
  seoTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  secondaryKeywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  faq?: ArticleFaq[];
};

/** Artikel lengkap untuk halaman /artikel/[slug]. */
export type Article = ArticleCard & {
  content: PortableTextBlock[];
  seo?: ArticleSeo;
  /** `_updatedAt` dokumen Sanity, untuk dateModified di JSON-LD. */
  updatedAt: string;
};
