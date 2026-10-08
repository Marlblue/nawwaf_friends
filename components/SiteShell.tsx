import { GoogleTagManager } from "@next/third-parties/google";
import { CartProvider } from "@/components/CartProvider";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollReset from "@/components/ScrollReset";
import ScrollReveal from "@/components/ScrollReveal";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { restaurantJsonLd } from "@/lib/jsonld";
import { site } from "@/lib/site";

// Kerangka situs publik (navbar, footer, keranjang, GTM). Dipakai app/(site)/layout.tsx
// dan app/not-found.tsx; /studio sengaja tidak memakainya supaya Sanity Studio tampil penuh.
export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GoogleTagManager gtmId={site.gtmId} />
      {/* JSON.stringify tidak membersihkan tag HTML, jadi "<" diganti escape unicode */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd).replace(/</g, "\\u003c") }}
      />
      <CartProvider>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloat />
        <CartDrawer />
        <ScrollReveal />
        <ScrollReset />
      </CartProvider>
    </>
  );
}
