// DIBUAT OTOMATIS oleh scripts/generate-image-variants.mjs. Jangan diedit tangan.

export const VARIANT_LADDER = [256, 384, 480, 640, 828, 1080, 1280, 1600] as const;

/** Lebar varian terbesar tiap gambar public/ yang punya varian di /_img. */
export const localImageVariants: Record<string, number> = {
  "/aqiqah.webp": 1280,
  "/delivery.webp": 1280,
  "/images/gift-set/gift-box.webp": 1280,
  "/images/gift-set/hang-tag.webp": 384,
  "/images/gift-set/kartu-ucapan.webp": 640,
  "/kambing-guling.webp": 1080,
  "/lantai-2.webp": 1080,
  "/meeting-room.webp": 1280,
  "/mushola.webp": 1280,
  "/nasi-box.webp": 1280,
  "/outdoor-atas-1.webp": 1280,
  "/outdoor-atas-2.webp": 1280,
  "/outdoor-belakang.webp": 1080,
  "/outdoor.webp": 1280,
  "/playground.webp": 1280,
  "/private-room.webp": 1280,
};

/** Hash pendek tiap berkas sumber, dipasang loader sebagai ?v=. */
export const localImageVersions: Record<string, string> = {
  "/aqiqah.webp": "d3b51577",
  "/delivery.webp": "0f99b776",
  "/images/gift-set/gift-box.webp": "6eb4567e",
  "/images/gift-set/hang-tag-window.png": "4ddde4ee",
  "/images/gift-set/hang-tag.webp": "bf07febe",
  "/images/gift-set/kartu-ucapan.webp": "77c02126",
  "/images/gift-set/kraft-lineart.webp": "e2f1302c",
  "/images/logo.webp": "c0c25fee",
  "/kambing-guling.webp": "bd137866",
  "/lantai-2.webp": "849996f8",
  "/meeting-room.webp": "98318524",
  "/mushola.webp": "357fc63e",
  "/nasi-box.webp": "feb812b2",
  "/outdoor-atas-1.webp": "0d509823",
  "/outdoor-atas-2.webp": "97b75352",
  "/outdoor-belakang.webp": "5ffbcaf9",
  "/outdoor.webp": "c516e4e0",
  "/playground.webp": "060aa89e",
  "/private-room.webp": "b3aa08b1",
};
