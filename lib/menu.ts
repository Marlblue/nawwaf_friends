// Katalog produk — disalin dari "Menu N&F_final_path_OKE.pdf".
// Harga kedua di menu (mis. 55k/60k) adalah harga paket + es teh.

export type MenuOption = { id: string; label: string; price: number };

export type MenuItem = {
  id: string;
  name: string;
  description?: string;
  category: CategoryId;
  image?: string;
  badge?: string;
  options: MenuOption[];
};

export type CategoryId =
  | "porsian"
  | "nampan-ayam"
  | "nampan-kambing"
  | "mix"
  | "snack"
  | "dessert"
  | "satuan"
  | "teh-kopi"
  | "dingin";

export const categories: { id: CategoryId; name: string; blurb: string; image: string }[] = [
  { id: "porsian", name: "Porsian", blurb: "Satu piring pas untuk sendiri", image: "/images/menu/nasi-mandhi-ayam.webp" },
  { id: "mix", name: "Mix Mandhi + Kebuli", blurb: "Best seller untuk rame-rame", image: "/images/menu/mix-half.webp" },
  { id: "nampan-ayam", name: "Nampan Ayam", blurb: "Makan bersama ala Timur Tengah", image: "/images/menu/mandhi-full-ayam.webp" },
  { id: "nampan-kambing", name: "Nampan Kambing", blurb: "Kambing empuk, porsi berbagi", image: "/images/menu/kebuli-full-kambing.webp" },
  { id: "snack", name: "Snack & Pendamping", blurb: "Maraq, canai, kebab, sambosa", image: "/images/menu/sambosa.webp" },
  { id: "dessert", name: "Dessert", blurb: "Manis penutup hidangan", image: "/images/menu/ummu-ali.webp" },
  { id: "satuan", name: "Menu Satuan", blurb: "Tambah lauk, nasi, sambal", image: "/images/menu/ayam-satuan.webp" },
  { id: "teh-kopi", name: "Teh & Kopi", blurb: "Arabian tea, teh adeni, kopi", image: "/images/menu/teh.webp" },
  { id: "dingin", name: "Minuman Dingin & Juice", blurb: "Segar untuk menemani makan", image: "/images/menu/juice.webp" },
];

const withTea = (id: string, base: number, bundle: number, drink: string): MenuOption[] => [
  { id: `${id}-plain`, label: "Tanpa minum", price: base },
  { id: `${id}-tea`, label: `+ Es teh ${drink}`, price: bundle },
];

const single = (id: string, price: number, label = "1 porsi"): MenuOption[] => [{ id, label, price }];

export const menu: MenuItem[] = [
  // Porsian
  { id: "nasi-mandhi-omelet", name: "Nasi Mandhi Omelet", description: "1 piring nasi mandhi + omelet", category: "porsian", image: "/images/menu/nasi-mandhi-omelet.webp", options: single("nasi-mandhi-omelet", 38000) },
  { id: "nasi-mandhi-ayam", name: "Nasi Mandhi Ayam", description: "1 piring nasi mandhi + 1 potong ayam", category: "porsian", image: "/images/menu/nasi-mandhi-ayam.webp", options: withTea("nasi-mandhi-ayam", 55000, 60000, "1 gelas") },
  { id: "nasi-mandhi-kambing", name: "Nasi Mandhi Kambing", description: "1 piring nasi mandhi + 1 potong kambing", category: "porsian", image: "/images/menu/nasi-mandhi-kambing.webp", options: withTea("nasi-mandhi-kambing", 95000, 100000, "1 gelas") },
  { id: "nasi-kebuli-omelet", name: "Nasi Kebuli Omelet", description: "1 piring nasi kebuli + omelet", category: "porsian", image: "/images/menu/nasi-kebuli-omelet.webp", options: single("nasi-kebuli-omelet", 38000) },
  { id: "nasi-kebuli-ayam", name: "Nasi Kebuli Ayam", description: "1 piring nasi kebuli + 1 potong ayam", category: "porsian", image: "/images/menu/nasi-kebuli-ayam.webp", options: withTea("nasi-kebuli-ayam", 60000, 65000, "1 gelas") },
  { id: "nasi-kebuli-kambing", name: "Nasi Kebuli Kambing", description: "1 piring nasi kebuli + 1 potong kambing", category: "porsian", image: "/images/menu/nasi-kebuli-kambing.webp", options: withTea("nasi-kebuli-kambing", 100000, 105000, "1 gelas") },

  // Mix
  { id: "mix-half", name: "Nasi Mix Mandhi & Kebuli ½ Nampan", description: "½ nampan nasi mandhi + nasi kebuli, 2 potong kambing + 3 potong ayam", category: "mix", image: "/images/menu/mix-half.webp", badge: "Best Seller", options: withTea("mix-half", 365000, 395000, "1 pitcher") },
  { id: "mix-full", name: "Nasi Mix Mandhi & Kebuli 1 Nampan", description: "1 nampan nasi mandhi + nasi kebuli, 5 potong kambing + 5 potong ayam", category: "mix", image: "/images/menu/mix-full.webp", badge: "Best Seller", options: withTea("mix-full", 775000, 835000, "2 pitcher") },

  // Nampan ayam
  { id: "mandhi-half-ayam", name: "Nasi Mandhi ½ Nampan Ayam", description: "½ nampan nasi mandhi + 5 potong ayam", category: "nampan-ayam", image: "/images/menu/mandhi-half-ayam.webp", options: withTea("mandhi-half-ayam", 275000, 305000, "1 pitcher") },
  { id: "kebuli-half-ayam", name: "Nasi Kebuli ½ Nampan Ayam", description: "½ nampan nasi kebuli + 5 potong ayam", category: "nampan-ayam", image: "/images/menu/kebuli-half-ayam.webp", options: withTea("kebuli-half-ayam", 300000, 330000, "1 pitcher") },
  { id: "mandhi-full-ayam", name: "Nasi Mandhi 1 Nampan Ayam", description: "1 nampan nasi mandhi + 10 potong ayam", category: "nampan-ayam", image: "/images/menu/mandhi-full-ayam.webp", options: withTea("mandhi-full-ayam", 550000, 610000, "2 pitcher") },
  { id: "kebuli-full-ayam", name: "Nasi Kebuli 1 Nampan Ayam", description: "1 nampan nasi kebuli + 10 potong ayam", category: "nampan-ayam", image: "/images/menu/kebuli-full-ayam.webp", options: withTea("kebuli-full-ayam", 600000, 660000, "2 pitcher") },

  // Nampan kambing
  { id: "mandhi-half-kambing", name: "Nasi Mandhi ½ Nampan Kambing", description: "½ nampan nasi mandhi + 5 potong kambing", category: "nampan-kambing", image: "/images/menu/mandhi-half-kambing.webp", options: withTea("mandhi-half-kambing", 450000, 480000, "1 pitcher") },
  { id: "kebuli-half-kambing", name: "Nasi Kebuli ½ Nampan Kambing", description: "½ nampan nasi kebuli + 5 potong kambing", category: "nampan-kambing", image: "/images/menu/kebuli-half-kambing.webp", options: withTea("kebuli-half-kambing", 475000, 505000, "1 pitcher") },
  // Di PDF tertulis "+ 10 potong Ayam" untuk dua item ini — diasumsikan typo (kambing).
  { id: "mandhi-full-kambing", name: "Nasi Mandhi 1 Nampan Kambing", description: "1 nampan nasi mandhi + 10 potong kambing", category: "nampan-kambing", image: "/images/menu/mandhi-full-kambing.webp", options: withTea("mandhi-full-kambing", 900000, 960000, "2 pitcher") },
  { id: "kebuli-full-kambing", name: "Nasi Kebuli 1 Nampan Kambing", description: "1 nampan nasi kebuli + 10 potong kambing", category: "nampan-kambing", image: "/images/menu/kebuli-full-kambing.webp", options: withTea("kebuli-full-kambing", 950000, 1010000, "2 pitcher") },

  // Snack & pendamping
  { id: "maraq", name: "Maraq", description: "Sup kambing khas Arab, 1 porsi kambing potong", category: "snack", image: "/images/menu/maraq.webp", options: single("maraq", 60000) },
  { id: "canai", name: "Roti Canai", description: "Roti canai hangat", category: "snack", image: "/images/menu/canai.webp", options: [
    { id: "canai-original", label: "Original", price: 15000 },
    { id: "canai-susu", label: "Susu", price: 20000 },
    { id: "canai-madu", label: "Madu", price: 20000 },
  ] },
  { id: "kebab", name: "Kebab", description: "Kebab gulung isi daging", category: "snack", image: "/images/menu/kebab.webp", options: [
    { id: "kebab-3", label: "Isi 3", price: 27000 },
    { id: "kebab-5", label: "Isi 5", price: 45000 },
  ] },
  { id: "sambosa", name: "Sambosa", description: "Pastry segitiga renyah", category: "snack", image: "/images/menu/sambosa.webp", options: [
    { id: "sambosa-ayam", label: "Isi ayam", price: 30000 },
    { id: "sambosa-kambing", label: "Isi kambing", price: 35000 },
  ] },
  { id: "french-fries", name: "French Fries", description: "Kentang goreng, 1 porsi", category: "snack", image: "/images/menu/french-fries.webp", options: single("french-fries", 25000) },

  // Dessert
  { id: "ummu-ali", name: "Ummu Ali", description: "Puding roti susu khas Mesir dengan kacang & kismis", category: "dessert", image: "/images/menu/ummu-ali.webp", options: single("ummu-ali", 35000) },

  // Menu satuan
  { id: "ayam-potong", name: "Ayam Perpotong", category: "satuan", image: "/images/menu/ayam-satuan.webp", options: single("ayam-potong", 35000, "1 potong") },
  { id: "ayam-ekor", name: "Ayam Satu Ekor", description: "4 potong", category: "satuan", image: "/images/menu/ayam-satuan.webp", options: single("ayam-ekor", 110000, "1 ekor") },
  { id: "kambing-potong", name: "Kambing Perpotong", category: "satuan", options: single("kambing-potong", 65000, "1 potong") },
  { id: "nasi-mandhi", name: "Nasi Mandhi", category: "satuan", options: single("nasi-mandhi", 35000) },
  { id: "nasi-kebuli", name: "Nasi Kebuli", category: "satuan", options: single("nasi-kebuli", 35000) },
  { id: "sambal-besar", name: "Sambal Besar", category: "satuan", options: single("sambal-besar", 15000) },
  { id: "acar-besar", name: "Acar Besar", category: "satuan", options: single("acar-besar", 15000) },

  // Teh & kopi
  { id: "teh", name: "Teh", description: "Manis atau tawar", category: "teh-kopi", image: "/images/menu/teh.webp", options: [
    { id: "teh-gelas-manis", label: "Gelas · manis", price: 10000 },
    { id: "teh-gelas-tawar", label: "Gelas · tawar", price: 10000 },
    { id: "teh-pot-manis", label: "Pot · manis", price: 50000 },
    { id: "teh-pot-tawar", label: "Pot · tawar", price: 50000 },
  ] },
  { id: "arabian-tea", name: "Arabian Tea", category: "teh-kopi", image: "/images/menu/teh.webp", options: [
    { id: "arabian-tea-gelas", label: "Gelas", price: 15000 },
    { id: "arabian-tea-pot", label: "Pot", price: 60000 },
  ] },
  { id: "teh-adeni", name: "Teh Adeni", description: "Teh susu rempah khas Yaman", category: "teh-kopi", image: "/images/menu/teh.webp", options: [
    { id: "teh-adeni-gelas", label: "Gelas", price: 25000 },
    { id: "teh-adeni-pot", label: "Pot", price: 60000 },
  ] },
  { id: "lemon-tea", name: "Lemon Tea", category: "teh-kopi", options: [
    { id: "lemon-tea-es", label: "Es", price: 17000 },
    { id: "lemon-tea-hangat", label: "Hangat", price: 17000 },
  ] },
  { id: "black-coffee", name: "Black Coffee", category: "teh-kopi", image: "/images/menu/kopi.webp", options: single("black-coffee", 15000, "1 gelas") },
  { id: "coffee-latte", name: "Coffee Latte", category: "teh-kopi", image: "/images/menu/kopi.webp", options: single("coffee-latte", 18000, "1 gelas") },
  { id: "susu-kambing", name: "Susu Kambing", category: "teh-kopi", options: single("susu-kambing", 25000, "1 gelas") },

  // Minuman dingin & juice
  { id: "es-jeruk", name: "Es Jeruk", category: "dingin", options: single("es-jeruk", 18000, "1 gelas") },
  { id: "es-capuccino", name: "Es Cappuccino", category: "dingin", image: "/images/menu/minuman-dingin.webp", options: single("es-capuccino", 25000, "1 gelas") },
  { id: "susu-kurma", name: "Susu Kurma", category: "dingin", options: single("susu-kurma", 17000, "1 gelas") },
  { id: "es-coklat", name: "Es Coklat", category: "dingin", options: single("es-coklat", 20000, "1 gelas") },
  { id: "es-matcha", name: "Es Matcha", category: "dingin", options: single("es-matcha", 20000, "1 gelas") },
  { id: "mineral-water", name: "Mineral Water", category: "dingin", options: single("mineral-water", 8000, "1 botol") },
  { id: "jus-strawberry", name: "Jus Strawberry", category: "dingin", image: "/images/menu/juice.webp", options: single("jus-strawberry", 20000, "1 gelas") },
  { id: "jus-jambu", name: "Jus Jambu", category: "dingin", image: "/images/menu/juice.webp", options: single("jus-jambu", 17000, "1 gelas") },
  { id: "jus-melon", name: "Jus Melon", category: "dingin", image: "/images/menu/juice.webp", options: single("jus-melon", 20000, "1 gelas") },
  { id: "jus-jeruk", name: "Jus Jeruk", category: "dingin", image: "/images/menu/juice.webp", options: single("jus-jeruk", 22000, "1 gelas") },
];

export const bestSellers = ["mix-half", "nasi-mandhi-ayam", "nasi-kebuli-kambing", "mandhi-half-ayam", "maraq", "ummu-ali"]
  .map((id) => menu.find((m) => m.id === id)!)
  .filter(Boolean);

export function findOption(optionId: string) {
  for (const item of menu) {
    const option = item.options.find((o) => o.id === optionId);
    if (option) return { item, option };
  }
  return null;
}

export function minPrice(item: MenuItem) {
  return Math.min(...item.options.map((o) => o.price));
}

// Versi kecil (320px) untuk thumbnail di daftar menu, keranjang, dan checkout
export function thumb(src: string) {
  return src.replace("/images/menu/", "/images/menu/thumb/");
}

// Versi sedang (640px) untuk kartu kecil, mis. kartu layanan di beranda
export function mediumImage(src: string) {
  return src.replace("/images/menu/", "/images/menu/md/");
}
