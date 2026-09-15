// Data kontak & identitas brand. Lengkapi field yang masih kosong
// (alamat, link sosial media, jam operasional) sebelum go-live.
export const site = {
  name: "Nawwaf & Friends",
  tagline: "Abu Nawwaf Arabian Food",
  description:
    "Nasi Mandhi, Nasi Kebuli, nampan kambing & ayam khas Timur Tengah. Pesan antar online, catering, aqiqah, dan venue ruang meeting.",
  phone: "021-22962656",
  whatsappDisplay: "0818 0744 7714",
  // Format internasional tanpa "+" untuk link wa.me
  whatsapp: "6281807447714",
  email: "",
  address: "",
  mapsUrl: "",
  openingHours: "",
  socialName: "abunawwaf resto",
  social: {
    instagram: "",
    tiktok: "",
    facebook: "",
  },
};

export const nav = [
  { href: "/", label: "Beranda" },
  { href: "/menu", label: "Menu" },
  { href: "/venue", label: "Venue" },
  { href: "/artikel", label: "Artikel" },
  { href: "/kontak", label: "Kontak" },
];

export function waLink(text: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function rupiah(value: number) {
  return "Rp" + value.toLocaleString("id-ID");
}
