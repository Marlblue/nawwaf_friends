import Image from "next/image";
import { coverSource } from "@/lib/sanity/image";
import type { SanityArticleCover } from "@/lib/sanity/types";

type Props = {
  cover: SanityArticleCover | undefined;
  width: number;
  height: number;
  sizes: string;
  className?: string;
  priority?: boolean;
  /** Alt kosong untuk kartu (judul sudah ada di teks tautan). */
  decorative?: boolean;
};

// Sampul artikel dari Sanity, dipasang di dalam wadah `.media` (fill). Artikel tanpa sampul
// cukup menyisakan latar wadahnya, bukan membuat halaman gagal render.
export default function ArticleCover({ cover, width, height, sizes, className = "object-cover", priority, decorative }: Props) {
  const source = coverSource(cover, width, height);
  if (!source) return null;
  return <Image src={source.src} alt={decorative ? "" : source.alt} fill sizes={sizes} className={className} priority={priority} />;
}
