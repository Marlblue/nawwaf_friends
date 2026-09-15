import type { Metadata } from "next";
import MenuCatalog from "@/components/MenuCatalog";
import PageHero from "@/components/PageHero";
import PageTransition from "@/components/PageTransition";

export const metadata: Metadata = {
  title: "Menu & Katalog Produk",
  description: "Katalog lengkap menu Nawwaf & Friends: porsian, nampan ayam & kambing, snack, dessert, dan minuman. Pesan antar online.",
};

export default async function MenuPage({ searchParams }: PageProps<"/menu">) {
  const { q, kategori } = await searchParams;

  return (
    <PageTransition>
      <PageHero
        eyebrow="Katalog produk"
        title="Menu kami"
        subtitle="Tap Tambah, lalu buka keranjang untuk checkout."
      />
      <div className="container-x pb-20">
        <MenuCatalog
          initialQuery={typeof q === "string" ? q : ""}
          initialCategory={typeof kategori === "string" ? kategori : undefined}
        />
      </div>
    </PageTransition>
  );
}
