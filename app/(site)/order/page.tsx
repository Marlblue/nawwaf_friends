import type { Metadata } from "next";
import CheckoutForm from "@/components/CheckoutForm";
import PageHero from "@/components/PageHero";
import PageTransition from "@/components/PageTransition";

export const metadata: Metadata = {
  title: "Delivery Order Online",
  description: "Checkout pesanan Nawwaf & Friends untuk diantar ke alamatmu.",
};

export default function OrderPage() {
  return (
    <PageTransition>
      <PageHero
        eyebrow="Delivery order online"
        title="Checkout pesanan"
        subtitle="Lengkapi data pengiriman. Pesanan dikirim ke WhatsApp admin untuk konfirmasi ongkir & pembayaran."
      />
      <div className="container-x pb-20">
        <CheckoutForm />
      </div>
    </PageTransition>
  );
}
