// Data kontak & identitas brand. Field yang masih kosong (email, TikTok, Facebook)
// otomatis disembunyikan di footer & halaman kontak; isi kalau sudah ada.
export const site = {
  name: "Nawwaf & Friends",
  tagline: "Abu Nawwaf Arabian Food",
  description:
    "Nasi Mandhi, Nasi Kebuli, nampan kambing & ayam khas Timur Tengah. Pesan antar online, catering, aqiqah, dan venue ruang meeting.",
  // Domain final situs, tanpa garis miring di akhir. Google butuh URL absolut,
  // jadi selama ini kosong, field url/image/menu tidak ikut di data terstruktur.
  url: "",
  phone: "021-22962656",
  whatsappDisplay: "0818 0744 7714",
  // Format internasional tanpa "+" untuk link wa.me
  whatsapp: "6281807447714",
  email: "",
  // Dipecah per bagian supaya satu data ini bisa jadi alamat teks biasa
  // sekaligus PostalAddress di data terstruktur schema.org.
  address: {
    street: "Jl. Pesona Paris No.12 Blok C1",
    locality: "Ciangsana, Kec. Gn. Putri",
    city: "Kabupaten Bogor",
    region: "Jawa Barat",
    postalCode: "16968",
    country: "ID",
  },
  mapsUrl: "https://maps.app.goo.gl/jGMnrsjd1UunykKN6",
  // Link resto di GoFood (pesan antar lewat aplikasi Gojek)
  gofoodUrl: "https://gofood.co.id/jakarta/restaurant/nawwaf-and-friends-5c01c098-8b15-4c80-a04c-544e3da711fd",
  // Jam buka. Nama hari mengikuti schema.org dan jam pakai format 24 jam, supaya
  // satu data ini dipakai untuk tampilan sekaligus data terstruktur.
  openingHours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "10:00", closes: "21:00" },
    { days: ["Saturday", "Sunday"], opens: "10:00", closes: "22:00" },
  ],
  socialName: "@nawwaf_friends",
  social: {
    instagram: "https://www.instagram.com/nawwaf_friends",
    threads: "https://www.threads.com/@nawwaf_friends",
    tiktok: "",
    facebook: "",
  },
};

const dayNames: Record<string, string> = {
  Monday: "Senin",
  Tuesday: "Selasa",
  Wednesday: "Rabu",
  Thursday: "Kamis",
  Friday: "Jumat",
  Saturday: "Sabtu",
  Sunday: "Minggu",
};

// Jam buka versi tampilan, satu baris per rentang hari: "Senin - Jumat: 10.00 - 21.00"
export const openingHoursLines = site.openingHours.map(({ days, opens, closes }) => {
  const jam = (t: string) => t.replace(":", ".");
  const range = days.length > 1 ? `${dayNames[days[0]]} - ${dayNames[days[days.length - 1]]}` : dayNames[days[0]];
  return `${range}: ${jam(opens)} - ${jam(closes)}`;
});

// Alamat versi satu baris untuk ditampilkan ke pengunjung.
export const addressText = [
  site.address.street,
  site.address.locality,
  site.address.city,
  `${site.address.region} ${site.address.postalCode}`.trim(),
]
  .filter(Boolean)
  .join(", ");

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
