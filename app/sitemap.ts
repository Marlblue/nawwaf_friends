import type { MetadataRoute } from "next";
import { articles } from "@/lib/articles";
import { site } from "@/lib/site";

// Disetor ke Google Search Console sebagai https://nawwafresto.com/sitemap.xml.
// /order (checkout keranjang) dan /terima-kasih sengaja tidak dimasukkan.
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/menu", "/venue", "/artikel", "/hubungi", "/hubungi/kolaborasi", "/hubungi/komunitas", "/kontak"];
  return [
    ...pages.map((path) => ({ url: `${site.url}${path}` })),
    ...articles.map((a) => ({ url: `${site.url}/artikel/${a.slug}`, lastModified: a.date })),
  ];
}
