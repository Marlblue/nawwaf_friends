// URL Apps Script sengaja server-only (tanpa prefix NEXT_PUBLIC_): hanya dipakai
// route handler di app/api, jadi tidak ikut ter-inline ke bundle browser.
// Langkah deploy tiap script ada di scripts/apps-script/*.gs.

/** Form kolaborasi KOL / influencer di /hubungi/kolaborasi. */
export const COLLAB_SCRIPT_URL = process.env.COLLAB_SCRIPT_URL ?? "";

/** Form kolaborasi komunitas di /hubungi/komunitas. Sheet-nya terpisah dari KOL. */
export const COMMUNITY_SCRIPT_URL = process.env.COMMUNITY_SCRIPT_URL ?? "";

// Kata sandi bersama antara route handler dan Apps Script. Wajib sama persis
// dengan Script Property SHARED_SECRET di tiap project Apps Script; kalau kosong
// atau beda, Apps Script menolak semua kiriman dengan "unauthorized".
export const FORMS_SHARED_SECRET = process.env.FORMS_SHARED_SECRET ?? "";

if (!FORMS_SHARED_SECRET && process.env.NODE_ENV === "production" && process.env.NEXT_PHASE !== "phase-production-build") {
  console.error(
    "[forms] FORMS_SHARED_SECRET kosong: Apps Script akan menolak semua submit dengan \"unauthorized\". " +
      "Isi nilainya sama persis dengan Script Property SHARED_SECRET di project Apps Script."
  );
}
