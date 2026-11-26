import { rupiah, waLink } from "@/lib/site";

// Nawwaf Signature Gift Set: paket nampan dalam box kado berpita, plus kartu ucapan personal.
// Harga & isi mengikuti flyer resmi. Ubah di sini, beranda dan /hubungi ikut berubah.
export type GiftSetItem = { name: string; contents: string; price: number };

export const giftSetGroups: { size: string; items: GiftSetItem[] }[] = [
  {
    size: "1 Nampan",
    items: [
      { name: "Nasi Kebuli Ayam", contents: "Nasi kebuli + 10 potong ayam", price: 600_000 },
      { name: "Nasi Kebuli Kambing", contents: "Nasi kebuli + 10 potong kambing", price: 950_000 },
      { name: "Nasi Mandhi Kambing", contents: "Nasi mandhi + 10 potong kambing", price: 900_000 },
      { name: "Nasi Mandhi Ayam", contents: "Nasi mandhi + 10 potong ayam", price: 550_000 },
      { name: "Nasi Mix Mandhi & Kebuli", contents: "Mandhi + kebuli, 5 potong ayam + 5 potong kambing", price: 775_000 },
    ],
  },
  {
    size: "½ Nampan",
    items: [
      { name: "Nasi Mandhi Kambing", contents: "Nasi mandhi + 5 potong kambing", price: 450_000 },
      { name: "Nasi Mandhi Ayam", contents: "Nasi mandhi + 5 potong ayam", price: 275_000 },
      // Flyer menulis "Mabuli"; isinya nasi kebuli, jadi dianggap salah ketik.
      { name: "Nasi Kebuli Kambing", contents: "Nasi kebuli + 5 potong kambing", price: 475_000 },
      { name: "Nasi Kebuli Ayam", contents: "Nasi kebuli + 5 potong ayam", price: 300_000 },
      { name: "Nasi Mix Mandhi & Kebuli", contents: "Mandhi + kebuli, 3 potong ayam + 2 potong kambing", price: 365_000 },
    ],
  },
];

export const giftSetMinPrice = Math.min(...giftSetGroups.flatMap((g) => g.items.map((i) => i.price)));

export const giftSetWa = waLink("Halo Nawwaf & Friends, saya mau pesan Nawwaf Signature Gift Set.");

export function giftSetItemWa(item: GiftSetItem, size: string) {
  return waLink(
    `Halo Nawwaf & Friends, saya mau pesan Signature Gift Set: ${item.name} ${size} (${rupiah(item.price)}). Pesan untuk kartu ucapan: `,
  );
}
