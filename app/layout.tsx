import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { CartProvider } from "@/components/CartProvider";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollReset from "@/components/ScrollReset";
import ScrollReveal from "@/components/ScrollReveal";
import { site } from "@/lib/site";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} - ${site.tagline} | Delivery Order Online`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Saat keyboard HP muncul, ikut kecilkan area halaman. Tanpa ini sebagian browser
  // hanya menyusutkan tampilan tanpa memberitahu halaman, sehingga elemen sticky
  // (bilah filter menu) menempel di titik yang tertutup keyboard alias tak terlihat.
  interactiveWidget: "resizes-content",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // data-scroll-behavior wajib sejak Next 16: tanpa ini, `scroll-behavior: smooth`
    // milik kita ikut dipakai saat Next menggulir halaman sendiri (pindah halaman,
    // pulihkan posisi setelah refresh). Gulirannya jadi beranimasi, bisa terpotong
    // di tengah jalan, dan halaman berhenti di posisi nanggung, bukan di paling atas.
    <html lang="id" data-scroll-behavior="smooth" className={`${poppins.variable} antialiased`}>
      <body className="flex min-h-screen flex-col font-sans">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <ScrollReveal />
          <ScrollReset />
        </CartProvider>
      </body>
    </html>
  );
}
