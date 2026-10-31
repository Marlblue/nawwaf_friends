// DIBUAT OTOMATIS oleh scripts/generate-image-variants.mjs. Jangan diedit tangan.

export const VARIANT_LADDER = [256, 384, 480, 640, 828, 1080, 1280, 1600] as const;

/** Lebar varian terbesar tiap gambar public/ yang punya varian di /_img. */
export const localImageVariants: Record<string, number> = {
  "/aqiqah.webp": 1280,
  "/delivery.webp": 1280,
  "/kambing-guling.webp": 1080,
  "/lantai-2.webp": 1080,
  "/meeting-room.webp": 1280,
  "/mushola.webp": 1280,
  "/nasi-box.webp": 1280,
  "/outdoor-belakang.webp": 1080,
  "/outdoor.webp": 1280,
  "/playground.webp": 1280,
  "/private-room.webp": 1280,
};

/** Hash pendek tiap berkas sumber, dipasang loader sebagai ?v=. */
export const localImageVersions: Record<string, string> = {
  "/aqiqah.webp": "d3b51577",
  "/delivery.webp": "0f99b776",
  "/images/logo.webp": "c0c25fee",
  "/kambing-guling.webp": "bd137866",
  "/lantai-2.webp": "849996f8",
  "/meeting-room.webp": "98318524",
  "/mushola.webp": "357fc63e",
  "/nasi-box.webp": "feb812b2",
  "/outdoor-belakang.webp": "5ffbcaf9",
  "/outdoor.webp": "c516e4e0",
  "/playground.webp": "060aa89e",
  "/private-room.webp": "c4c1e8b2",
};
