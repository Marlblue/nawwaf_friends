// Project ID Sanity (sanity.io/manage -> project -> Project ID). Bukan rahasia, tapi harus
// ada saat `next build` karena berawalan NEXT_PUBLIC_ (di-inline ke bundle).
//
// Sengaja tidak melempar error kalau kosong: selama project Sanity belum dibuat, situs tetap
// bisa di-build dan /artikel cukup tampil "belum ada artikel" (lihat lib/sanity/queries.ts).
export const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";

export const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const SANITY_API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-07-24";

export const sanityConfigured = SANITY_PROJECT_ID !== "";
