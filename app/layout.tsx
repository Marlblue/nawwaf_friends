import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site } from "@/lib/site";
import "./globals.css";

// Poppins disimpan di repo (subset latin dari Google Fonts, lisensi OFL), bukan next/font/google:
// varian google mengunduh font saat `next build`, dan deploy pernah gagal karena runner tidak
// bisa menjangkau Google Fonts. Karakter di luar latin jatuh ke font cadangan.
const poppins = localFont({
  variable: "--font-poppins",
  src: [
    { path: "./fonts/poppins-400-latin.woff2", weight: "400", style: "normal" },
    { path: "./fonts/poppins-500-latin.woff2", weight: "500", style: "normal" },
    { path: "./fonts/poppins-600-latin.woff2", weight: "600", style: "normal" },
  ],
});

// Layout akar cuma kerangka <html>/<body>. Navbar, footer, GTM, dsb. ada di
// components/SiteShell.tsx (dipakai app/(site)/layout.tsx) supaya /studio tidak ikut memakainya.
export const metadata: Metadata = {
  // Basis URL absolut untuk og:image, canonical, dll.
  metadataBase: new URL(site.url),
  // Pratinjau saat link dibagikan (WhatsApp, Facebook, X). Judul & deskripsi sengaja tidak diisi:
  // tanpa og:title/og:description, aplikasi memakai <title> dan meta description tiap halaman.
  // Halaman yang menulis openGraph sendiri (artikel) menggantikan seluruh blok ini.
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "id_ID",
    images: [{ url: site.shareImage, width: 1200, height: 630, alt: "Nampan nasi kebuli kambing Nawwaf & Friends" }],
  },
  twitter: {
    card: "summary_large_image",
    images: [site.shareImage],
  },
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
