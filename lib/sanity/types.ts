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

/** Artikel lengkap untuk halaman /artikel/[slug]. */
export type Article = ArticleCard & {
  content: PortableTextBlock[];
};
