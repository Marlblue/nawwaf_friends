/**
 * Pencarian artikel di /artikel?q=…, terpisah dari komponen supaya bisa dites tanpa React.
 *
 * Berbeda dengan Kalih dan SDBI yang menyaring di GROQ, di sini daftar lengkapnya sudah ada
 * (getArticles, tersimpan di data cache dengan tag "article"), jadi penyaringan cukup di memori:
 * tiap pencarian tidak menambah satu permintaan pun ke Sanity, dan kata kunci tidak pernah ikut
 * menyusun query.
 */

/** Batas panjang kata kunci. Dipakai juga sebagai maxLength kolomnya, jadi kedua sisi sama. */
export const MAX_QUERY_LENGTH = 80;

/** Jeda setelah ketikan terakhir sebelum pencarian dikirim. */
export const JEDA_KETIK_MS = 300;

/** Kata kunci yang sudah dirapikan dan dipotong. String kosong berarti tidak sedang mencari. */
export function clampQuery(raw: string | string[] | undefined): string {
  // "?q=a&q=b" datang sebagai array; ambil yang pertama saja.
  const nilai = Array.isArray(raw) ? raw[0] : raw;
  return nilai?.trim().slice(0, MAX_QUERY_LENGTH) ?? "";
}

/** Huruf kecil dan tanpa tanda diakritik, supaya "Kebulí" ketemu dengan "kebuli". */
function normalisasi(teks: string) {
  return teks.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

type Dicari = { title: string; excerpt?: string | null; category?: string | null };

/**
 * Artikel yang memuat SEMUA kata dari kata kunci, di judul, ringkasan, atau kategori, dengan
 * urutan aslinya (terbaru dulu). Kata kunci kosong mengembalikan daftar apa adanya.
 */
export function cariArtikel<T extends Dicari>(articles: T[], query: string): T[] {
  const kata = normalisasi(query).split(/\s+/).filter(Boolean);
  if (kata.length === 0) return articles;
  return articles.filter((a) => {
    const teks = normalisasi(`${a.title} ${a.excerpt ?? ""} ${a.category ?? ""}`);
    return kata.every((k) => teks.includes(k));
  });
}

/** URL hasil pencarian; kata kunci kosong kembali ke /artikel. */
export function searchHref(query: string) {
  const q = query.trim();
  return q ? `/artikel?q=${encodeURIComponent(q)}` : "/artikel";
}

/*
 * Logika kolom pencarian yang tahan balapan (sama dengan Kalih dan SDBI).
 *
 * Kata kunci hidup di URL (?q=), tapi kolomnya dikendalikan lokal supaya mengetik tidak
 * menunggu server. URL juga berubah karena pencarian kolom ini sendiri, dan hasilnya tiba saat
 * pengunjung sudah mengetik lebih jauh. Kalau setiap perubahan URL disalin ke kolom, huruf yang
 * baru diketik tertimpa: "kebul" mundur jadi "ke".
 *
 * Jadi kolom mencatat kiriman yang belum terbalas. URL yang cocok dengan salah satunya adalah
 * hasil kiriman sendiri dan tidak menyentuh kolom; begitu URL menyusul kiriman terakhir,
 * catatannya dikosongkan. URL lain berarti navigasi dari luar (Back, tautan "Lihat semua
 * artikel") dan kolom mengikutinya.
 */

/** Batas catatan, untuk jaga-jaga kalau balasan navigasi tidak pernah tiba. */
const BATAS_CATATAN = 10;

/** Catat satu kata kunci yang baru saja dikirim kolom ini. */
export function catatKiriman(tertunda: readonly string[], kataKunci: string): string[] {
  const k = kataKunci.trim();
  return [...tertunda.filter((x) => x !== k), k].slice(-BATAS_CATATAN);
}

/**
 * Putuskan apa yang dilakukan kolom saat kata kunci di URL berubah: `ikuti` kalau perubahannya
 * dari luar, dan catatan kiriman tertunda yang baru.
 */
export function terimaUrl(
  tertunda: readonly string[],
  kataKunciUrl: string,
): { ikuti: boolean; tertunda: string[] } {
  const k = kataKunciUrl.trim();
  if (tertunda.length > 0 && k === tertunda[tertunda.length - 1]) return { ikuti: false, tertunda: [] };
  if (tertunda.includes(k)) return { ikuti: false, tertunda: [...tertunda] };
  return { ikuti: true, tertunda: [] };
}
