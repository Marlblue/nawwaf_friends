import type { ImageLoaderProps } from "next/image";
import { VARIANT_LADDER, localImageVariants, localImageVersions } from "./localImageVariants";

/**
 * images.loaderFile (next.config.ts): gambar public/ disajikan dari varian buatan
 * scripts/generate-image-variants.mjs, bukan dari optimizer Next, supaya sharp tidak jalan di
 * hosting. Gambar yang `unoptimized` (foto menu, Sanity; lihat components/SiteImage.tsx)
 * tidak lewat sini. `quality` diabaikan: variannya dibuat dengan satu kualitas.
 */
export default function imageLoader({ src, width }: ImageLoaderProps) {
  const version = localImageVersions[src];
  const v = version ? `v=${version}` : "";
  const widest = localImageVariants[src];
  const step = widest ? VARIANT_LADDER.find((s) => s >= width && s <= widest) : undefined;
  // encodeURI: nama berkas berspasi (mis. unggahan baru yang belum diganti namanya) merusak srcset.
  if (step) return encodeURI(`/_img/w${step}${src.replace(/\.(webp|png|jpe?g)$/i, ".webp")}`) + (v && `?${v}`);
  // Tidak ada varian selebar ini (slot lebih lebar dari varian terbesar, atau berkasnya kecil):
  // berkas asli. `w` membuat URL ikut berubah dengan width, yang diperiksa Next.
  return `${encodeURI(src)}?w=${width}${v && `&${v}`}`;
}
