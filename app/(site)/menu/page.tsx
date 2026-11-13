import type { Metadata } from "next";
import { Suspense } from "react";
import MenuCatalog, { MenuCatalogDariUrl } from "@/components/MenuCatalog";
import PageHero from "@/components/PageHero";
import PageTransition from "@/components/PageTransition";

export const metadata: Metadata = {
  alternates: { canonical: "/menu" },
  // /menu halaman dengan tayangan terbanyak (posisi 4); orang yang membukanya mencari
  // nama hidangan dan harganya, jadi keduanya disebut di judul.
  title: { absolute: "Menu & Harga Nawwaf & Friends: Nasi Mandhi, Kebuli, Nampan Kambing" },
  description:
    "Daftar menu dan harga Abu Nawwaf Arabian Food: nasi mandhi, kebuli, porsian, nampan ayam & kambing, snack, dessert, dan minuman. Pesan antar online via WhatsApp.",
};

// Halaman statis: ?q= dan ?kategori= dibaca di browser, bukan lewat searchParams, supaya
// setiap kunjungan tidak dirender ulang di server (kuota proses akun cPanel kecil). HTML-nya
// tetap memuat seluruh menu karena fallback-nya katalog dalam keadaan awal.
export default function MenuPage() {
  return (
    <PageTransition>
      <PageHero
        eyebrow="Katalog produk"
        title="Menu kami"
        subtitle="Tap Tambah, lalu buka keranjang untuk checkout."
      />
      <div className="container-x pb-20">
        <Suspense fallback={<MenuCatalog />}>
          <MenuCatalogDariUrl />
        </Suspense>
      </div>
    </PageTransition>
  );
}
