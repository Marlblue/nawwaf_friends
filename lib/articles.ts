// Artikel dikelola di Sanity Studio (/studio); query-nya ada di lib/sanity/queries.ts.

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  });
}

/** Jumlah kartu di grid tiap halaman /artikel (kelipatan 3 supaya baris grid penuh). */
export const ARTICLES_PER_PAGE = 9;

/**
 * Potong daftar artikel untuk halaman ke-`page`. Artikel featured (atau yang terbaru) hanya tampil
 * besar di halaman 1 dan tidak ikut dihitung di grid. Hasilnya null kalau halaman di luar jangkauan.
 */
export function paginateArticles<T extends { featured: boolean }>(articles: T[], page: number) {
  const featured = articles.find((a) => a.featured) ?? articles[0];
  const rest = articles.filter((a) => a !== featured);
  const totalPages = Math.max(1, Math.ceil(rest.length / ARTICLES_PER_PAGE));
  if (!Number.isInteger(page) || page < 1 || page > totalPages) return null;
  const start = (page - 1) * ARTICLES_PER_PAGE;
  return {
    featured: page === 1 ? featured : undefined,
    items: rest.slice(start, start + ARTICLES_PER_PAGE),
    page,
    totalPages,
  };
}

/** URL halaman daftar artikel; halaman 1 tetap /artikel. */
export function articlePageHref(page: number) {
  return page <= 1 ? "/artikel" : `/artikel/halaman/${page}`;
}
