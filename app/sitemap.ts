import type { MetadataRoute } from "next";
import { getArticleSitemapEntries } from "@/lib/sanity/queries";
import { site } from "@/lib/site";

export const revalidate = 3600;

// Disetor ke Google Search Console sebagai https://nawwafresto.com/sitemap.xml.
// /order (checkout keranjang), /terima-kasih, dan /studio sengaja tidak dimasukkan.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getArticleSitemapEntries();
  // /artikel baru didaftarkan setelah ada isinya; selama kosong halamannya juga noindex.
  const pages = ["", "/menu", "/venue", ...(articles.length ? ["/artikel"] : []), "/hubungi", "/hubungi/kolaborasi", "/hubungi/komunitas", "/kontak"];
  return [
    ...pages.map((path) => ({ url: `${site.url}${path}` })),
    ...articles.map((a) => ({ url: `${site.url}/artikel/${a.slug}`, lastModified: a.updatedAt })),
  ];
}
