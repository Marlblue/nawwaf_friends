import type { Instrumentation } from "next";

// Berkas ini sama di nawwaf_friends, kalih-signature, dan sdbi (beda path import saja);
// ubah ketiganya bersamaan. Dipanggil dari instrumentation.ts.

type Argumen = Parameters<Instrumentation.onRequestError>;

const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const NOMOR_HP = /(\+?62|0)8\d{7,12}/g;

/**
 * Ringkasan error server untuk grup Telegram, atau null kalau bukan error sungguhan.
 *
 * Kuncinya pola rute (`/artikel/[slug]`), bukan URL yang diminta, jadi kabarnya paling
 * banyak satu per rute per jam (jeda alertOps) seberapa pun banyak URL acak yang
 * dikirim orang. Isinya juga tidak memuat URL asli maupun query: sebagian alamat di
 * situs ini berisi kode atau token, dan pesan error bisa membawa email atau nomor HP.
 */
export function ringkasErrorServer(
  err: Argumen[0],
  request: Argumen[1],
  context: Argumen[2]
): { key: string; pesan: string } | null {
  const digest = typeof err === "object" && err !== null && "digest" in err ? String(err.digest) : "";
  // notFound(), redirect(), dan sejenisnya dilempar sebagai error ber-digest NEXT_*.
  // Itu alur normal Next, bukan kerusakan.
  if (digest.startsWith("NEXT_") || digest === "DYNAMIC_SERVER_USAGE") return null;

  const nama = err instanceof Error ? err.name : "Error";
  const isi = (err instanceof Error ? err.message : String(err))
    .replace(EMAIL, "<email>")
    .replace(NOMOR_HP, "<nomor>")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 200);
  const rute = context.routePath || "(rute tidak diketahui)";

  return {
    key: `server-error:${rute}`,
    pesan:
      `Error server di ${rute} (${context.routeType}, ${request.method}): ${nama}: ${isi}` +
      (digest ? ` [kode ${digest}]` : "") +
      ". Detailnya di log aplikasi cPanel. Kabar berikutnya untuk rute ini ditahan satu jam.",
  };
}
