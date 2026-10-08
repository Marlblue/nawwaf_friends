// Artikel dikelola di Sanity Studio (/studio); query-nya ada di lib/sanity/queries.ts.

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  });
}
