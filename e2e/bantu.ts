import { test as base, expect, type Page } from "@playwright/test";

// Dasar semua tes browser. Berkas ini sama persis di ketiga repo; ubah ketiganya bersamaan.
//
// Dua hal berlaku untuk setiap tes tanpa perlu ditulis ulang:
// - Permintaan ke domain lain diblokir, kecuali gambar Sanity. Tes tidak boleh mengirim
//   kunjungan palsu ke GA, Meta, atau GTM, dan hasilnya tidak boleh bergantung pada skrip
//   pihak ketiga.
// - Error JavaScript dari situs ini sendiri menggagalkan tes. Itu kelas kerusakan yang lolos
//   lint, typecheck, dan build (react dan react-dom beda versi, 19 Okt 2026).
export const test = base.extend<{ galatHalaman: string[] }>({
  galatHalaman: [
    async ({ page, baseURL }, use) => {
      const asal = new URL(baseURL!).origin;
      await page.route(
        (url) => url.origin !== asal && url.hostname !== "cdn.sanity.io",
        (route) => route.abort(),
      );
      const galat: string[] = [];
      // Semua pageerror dihitung: skrip pihak ketiga sudah diblokir di atas, jadi yang
      // tersisa pasti kode situs ini.
      page.on("pageerror", (err) => galat.push(err.message));
      // Console dibatasi ke asal situs ini, supaya permintaan pihak ketiga yang diblokir
      // ("Failed to load resource") tidak ikut terhitung.
      page.on("console", (msg) => {
        if (msg.type() !== "error" || !msg.location().url.startsWith(asal)) return;
        // Respons gagal yang disengaja tes (mis. /api/pesan 503) diperiksa lewat tampilannya.
        if (msg.text().startsWith("Failed to load resource")) return;
        galat.push(msg.text());
      });
      await use(galat);
      expect(galat, "error JavaScript di halaman").toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };

/**
 * Ganti window.open dengan pencatat, supaya tautan WhatsApp yang dibuka form bisa diperiksa
 * tanpa membuka tab. Panggil sebelum page.goto.
 */
export async function catatJendelaBaru(page: Page) {
  await page.addInitScript(() => {
    const w = window as unknown as { __dibuka: string[] };
    w.__dibuka = [];
    window.open = ((url?: string | URL) => {
      w.__dibuka.push(String(url));
      return { opener: null, closed: false, close() {} } as unknown as Window;
    }) as typeof window.open;
  });
}

export async function jendelaDibuka(page: Page): Promise<string[]> {
  return page.evaluate(() => (window as unknown as { __dibuka: string[] }).__dibuka);
}
