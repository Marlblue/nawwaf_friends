import Image, { type ImageProps } from "next/image";

/**
 * next/image dengan satu aturan: gambar yang tidak boleh atau tidak perlu lewat optimizer
 * otomatis diberi `unoptimized`. Pakai ini, bukan next/image langsung.
 *
 * - Foto menu (/images/menu/) semuanya berlatar transparan. Di kalih-signature terbukti
 *   optimizer bisa menyajikan JPEG tanpa alpha ke browser yang tidak menerima WebP, dan
 *   proxy hosting DomaiNesia menyimpan respons /_next/image tanpa header Vary, jadi JPEG
 *   berlatar hitam itu ikut tersaji ke semua pengunjung. Ukurannya sudah dipotong tangan
 *   (thumb 320px, md 640px, lihat lib/menu.ts), jadi tidak ada yang hilang.
 * - Gambar Sanity (URL absolut) sudah dipotong di CDN Sanity sesuai lebar yang diminta.
 *
 * Sisanya (foto venue, banner, logo) dioptimasi: dikecilkan sesuai `sizes` dan layar.
 */
export function skipOptimizer(src: ImageProps["src"]) {
  if (typeof src !== "string") return false;
  return src.startsWith("/images/menu/") || /^https?:\/\//.test(src);
}

export default function SiteImage({ alt, unoptimized, ...props }: ImageProps) {
  return <Image {...props} alt={alt} unoptimized={unoptimized ?? skipOptimizer(props.src)} />;
}
