import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MAX_QUERY_LENGTH, cariArtikel, catatKiriman, clampQuery, searchHref, terimaUrl } from "./pencarian-artikel";

const artikel = [
  { id: 1, title: "Resep Nasi Kebuli Kambing", excerpt: "Rempah khas Timur Tengah.", category: "Resep" },
  { id: 2, title: "Tips Aqiqah di Tegal", excerpt: "Paket kambing guling untuk aqiqah.", category: "Aqiqah" },
  { id: 3, title: "Catering Kantor", excerpt: null, category: null },
];

describe("cariArtikel", () => {
  it("kata kunci kosong mengembalikan semua artikel", () => {
    assert.equal(cariArtikel(artikel, "  ").length, 3);
  });

  it("mencari di judul, ringkasan, dan kategori tanpa peduli huruf besar", () => {
    assert.deepEqual(cariArtikel(artikel, "KAMBING").map((a) => a.id), [1, 2]);
    assert.deepEqual(cariArtikel(artikel, "timur tengah").map((a) => a.id), [1]);
    assert.deepEqual(cariArtikel(artikel, "aqiqah").map((a) => a.id), [2]);
  });

  it("semua kata harus ada, urutannya bebas", () => {
    assert.deepEqual(cariArtikel(artikel, "kambing aqiqah").map((a) => a.id), [2]);
    assert.deepEqual(cariArtikel(artikel, "guling resep").map((a) => a.id), []);
  });

  it("tanda diakritik diabaikan dan field kosong tidak bikin error", () => {
    assert.deepEqual(cariArtikel(artikel, "kebulí").map((a) => a.id), [1]);
    assert.deepEqual(cariArtikel(artikel, "catering").map((a) => a.id), [3]);
  });
});

describe("clampQuery dan searchHref", () => {
  it("merapikan, memotong, dan mengambil nilai pertama dari array", () => {
    assert.equal(clampQuery("  kebuli  "), "kebuli");
    assert.equal(clampQuery(undefined), "");
    assert.equal(clampQuery(["a", "b"]), "a");
    assert.equal(clampQuery("x".repeat(200)).length, MAX_QUERY_LENGTH);
  });

  it("kata kunci di-encode, yang kosong kembali ke /artikel", () => {
    assert.equal(searchHref("nasi & kebuli"), "/artikel?q=nasi%20%26%20kebuli");
    assert.equal(searchHref("  "), "/artikel");
  });
});

describe("kolom pencarian tahan balapan", () => {
  it("hasil pencarian sendiri yang datang belakangan tidak menimpa ketikan", () => {
    let tertunda = catatKiriman([], "ke");
    tertunda = catatKiriman(tertunda, "kebuli");
    const a = terimaUrl(tertunda, "ke");
    assert.equal(a.ikuti, false);
    assert.deepEqual(terimaUrl(a.tertunda, "kebuli"), { ikuti: false, tertunda: [] });
  });

  it("navigasi dari luar diikuti", () => {
    let t = terimaUrl(catatKiriman([], "kebuli"), "kebuli").tertunda;
    assert.deepEqual(terimaUrl(t, ""), { ikuti: true, tertunda: [] });
    t = [];
    assert.equal(terimaUrl(t, "aqiqah").ikuti, true);
  });
});
