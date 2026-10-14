import { createImageUrlBuilder } from "@sanity/image-url";
import type { Image } from "sanity";
import { SANITY_DATASET, SANITY_PROJECT_ID } from "./env";
import type { SanityArticleCover } from "./types";

const builder = createImageUrlBuilder({ projectId: SANITY_PROJECT_ID, dataset: SANITY_DATASET });

export function urlFor(source: Image) {
  return builder.image(source).auto("format").quality(75);
}

/**
 * Sumber <Image> untuk sampul artikel, atau null kalau tidak ada sampul.
 *
 * Ukurannya dipotong langsung di CDN Sanity, dan gambar ini sengaja tidak lewat optimizer
 * Next (lihat components/SiteImage.tsx), jadi minta lebar yang memang dibutuhkan tiap tempat.
 */
export function coverSource(cover: SanityArticleCover | undefined, width: number, height: number) {
  if (!cover?.asset) return null;
  return {
    src: urlFor(cover).width(width).height(height).fit("crop").url(),
    alt: cover.alt ?? "",
  };
}
