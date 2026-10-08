import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

// Layout akar cuma kerangka <html>/<body>. Navbar, footer, GTM, dsb. ada di
// components/SiteShell.tsx (dipakai app/(site)/layout.tsx) supaya /studio tidak ikut memakainya.
export const metadata: Metadata = {
  // Basis URL absolut untuk og:image, canonical, dll.
  metadataBase: new URL(site.url),
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
      <body className="flex min-h-screen flex-col font-sans">{children}</body>
    </html>
  );
}
