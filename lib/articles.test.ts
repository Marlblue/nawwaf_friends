import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ARTICLES_PER_PAGE, articlePageHref, paginateArticles } from "./articles";

const buat = (n: number, featuredIndex = -1) =>
  Array.from({ length: n }, (_, i) => ({ id: i, featured: i === featuredIndex }));

describe("paginateArticles", () => {
  it("halaman 1 berisi featured + satu halaman grid", () => {
    const hasil = paginateArticles(buat(25, 3), 1)!;
    assert.equal(hasil.featured?.id, 3);
    assert.equal(hasil.items.length, ARTICLES_PER_PAGE);
    assert.ok(!hasil.items.some((a) => a.id === 3));
    assert.equal(hasil.totalPages, 3);
  });

  it("featured tidak tampil di halaman berikutnya dan sisa artikel ada di halaman terakhir", () => {
    const hasil = paginateArticles(buat(25), 3)!;
    assert.equal(hasil.featured, undefined);
    assert.deepEqual(hasil.items.map((a) => a.id), [19, 20, 21, 22, 23, 24]);
  });

  it("tanpa artikel tetap punya halaman 1 yang kosong", () => {
    const hasil = paginateArticles(buat(0), 1)!;
    assert.equal(hasil.featured, undefined);
    assert.deepEqual(hasil.items, []);
    assert.equal(hasil.totalPages, 1);
  });

  it("halaman di luar jangkauan menghasilkan null", () => {
    assert.equal(paginateArticles(buat(5), 2), null);
    assert.equal(paginateArticles(buat(5), 0), null);
    assert.equal(paginateArticles(buat(5), 1.5), null);
    assert.equal(paginateArticles(buat(5), NaN), null);
  });
});

describe("articlePageHref", () => {
  it("halaman 1 ke /artikel, sisanya ke /artikel/halaman/N", () => {
    assert.equal(articlePageHref(1), "/artikel");
    assert.equal(articlePageHref(2), "/artikel/halaman/2");
  });
});
