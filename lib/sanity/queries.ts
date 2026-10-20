import type { QueryParams } from "next-sanity";
import { cache } from "react";
import { sanityClient } from "./client";
import { sanityConfigured } from "./env";
import type { Article, ArticleCard } from "./types";

/**
 * Tag cache semua data artikel. app/api/revalidate memanggil revalidateTag dengan tag ini saat
 * Sanity mengirim webhook publish, jadi artikel baru langsung tampil. `revalidate` 60 detik di
 * tiap halaman tetap jadi cadangan kalau webhook gagal.
 */
export const ARTICLE_TAG = "article";

async function fetchArticles<T>(query: string, params: QueryParams, fallback: T): Promise<T> {
  if (!sanityConfigured) return fallback;
  return sanityClient.fetch<T>(query, params, { next: { tags: [ARTICLE_TAG] } });
}

// Tanggal terbit: publishedAt kalau diisi editor, kalau tidak tanggal dokumen dibuat.
const PUBLISHED_AT = `coalesce(publishedAt, _createdAt)`;
const ORDER = `| order(${PUBLISHED_AT} desc)`;
const FILTER = `_type == "article" && defined(slug.current)`;

const CARD_FIELDS = `
  _id,
  "slug": slug.current,
  title,
  category,
  excerpt,
  coverImage,
  "publishedAt": ${PUBLISHED_AT},
  "featured": featured == true
`;

// Dibungkus cache() karena generateMetadata dan halaman memanggil query yang sama dalam satu
// render, dan client Sanity tidak men-dedupe permintaan sendiri.
export const getArticles = cache(async (): Promise<ArticleCard[]> =>
  fetchArticles(`*[${FILTER}] ${ORDER} {${CARD_FIELDS}}`, {}, []),
);

export const getLatestArticles = cache(async (limit: number): Promise<ArticleCard[]> =>
  fetchArticles(`*[${FILTER}] ${ORDER} [0...$limit] {${CARD_FIELDS}}`, { limit }, []),
);

export const getArticleBySlug = cache(async (slug: string): Promise<Article | null> =>
  fetchArticles(`*[${FILTER} && slug.current == $slug][0] {${CARD_FIELDS}, content, seo}`, { slug }, null),
);

export const getOtherArticles = cache(async (excludeSlug: string, limit: number): Promise<ArticleCard[]> =>
  fetchArticles(`*[${FILTER} && slug.current != $excludeSlug] ${ORDER} [0...$limit] {${CARD_FIELDS}}`, { excludeSlug, limit }, []),
);

export const getAllArticleSlugs = cache(async (): Promise<string[]> =>
  fetchArticles(`*[${FILTER}].slug.current`, {}, []),
);

/** Slug + tanggal revisi terakhir untuk app/sitemap.ts. */
export const getArticleSitemapEntries = cache(async (): Promise<{ slug: string; updatedAt: string }[]> =>
  fetchArticles(`*[${FILTER}]{ "slug": slug.current, "updatedAt": _updatedAt }`, {}, []),
);
