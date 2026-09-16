import { menu } from "./menu";
import { rupiah, site } from "./site";

const prices = menu.flatMap((item) => item.options.map((o) => o.price));

// Data terstruktur schema.org. Dipasang di layout supaya Google bisa menampilkan
// alamat, jam buka, dan akun sosial media resto langsung di hasil pencarian.
export const restaurantJsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: site.name,
  alternateName: site.tagline,
  description: site.description,
  servesCuisine: ["Timur Tengah", "Arab"],
  telephone: site.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: [site.address.street, site.address.locality].filter(Boolean).join(", "),
    addressLocality: site.address.city,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  },
  hasMap: site.mapsUrl,
  priceRange: `${rupiah(Math.min(...prices))} - ${rupiah(Math.max(...prices))}`,
  openingHoursSpecification: site.openingHours.map(({ days, opens, closes }) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: days,
    opens,
    closes,
  })),
  sameAs: [site.social.instagram, site.social.threads, site.social.tiktok, site.social.facebook, site.gofoodUrl].filter(Boolean),
  // Butuh URL absolut, jadi baru ikut terkirim setelah site.url diisi.
  ...(site.url ? { url: site.url, image: `${site.url}/images/logo.webp`, hasMenu: `${site.url}/menu` } : {}),
};
