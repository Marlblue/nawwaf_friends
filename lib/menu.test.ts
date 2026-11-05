import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { bestSellers, categories, findOption, menu, minPrice, thumb } from "./menu";

// Menu sering diubah tangan dari PDF. Test ini menangkap salah ketik yang tidak kelihatan
// di typecheck: id kembar, kategori kosong, foto yang belum diupload, best seller yang hilang.
const publicFile = (src: string) => path.join(process.cwd(), "public", src);

describe("katalog menu", () => {
  it("id item unik", () => {
    const ids = menu.map((m) => m.id);
    assert.deepEqual(ids.filter((id, i) => ids.indexOf(id) !== i), []);
  });

  it("id pilihan unik di seluruh menu (keranjang menyimpan optionId, findOption ambil yang pertama)", () => {
    const ids = menu.flatMap((m) => m.options.map((o) => o.id));
    assert.deepEqual(ids.filter((id, i) => ids.indexOf(id) !== i), []);
  });

  it("tiap item punya minimal satu pilihan dengan harga rupiah bulat positif", () => {
    for (const item of menu) {
      assert.ok(item.options.length > 0, `${item.id} tanpa pilihan`);
      for (const o of item.options) {
        assert.ok(Number.isInteger(o.price) && o.price >= 1000, `${o.id}: harga ${o.price}`);
      }
    }
  });

  it("paket + es teh lebih mahal dari harga tanpa minum", () => {
    for (const item of menu) {
      const plain = item.options.find((o) => o.id === `${item.id}-plain`);
      const tea = item.options.find((o) => o.id === `${item.id}-tea`);
      if (plain && tea) assert.ok(tea.price > plain.price, `${item.id}: ${tea.price} <= ${plain.price}`);
    }
  });

  it("tiap item masuk kategori yang ada, dan tiap kategori punya item", () => {
    const ids = new Set(categories.map((c) => c.id));
    for (const item of menu) assert.ok(ids.has(item.category), `${item.id}: kategori ${item.category}`);
    for (const c of categories) assert.ok(menu.some((m) => m.category === c.id), `kategori ${c.id} kosong`);
  });

  it("semua best seller ada di menu (filter(Boolean) di menu.ts menyembunyikan id yang salah)", () => {
    assert.equal(bestSellers.length, 6);
  });

  it("foto item, thumbnail-nya, dan foto kategori ada di public/", () => {
    const hilang: string[] = [];
    for (const item of menu) {
      if (!item.image) continue;
      if (!existsSync(publicFile(item.image))) hilang.push(item.image);
      if (!existsSync(publicFile(thumb(item.image)))) hilang.push(thumb(item.image));
    }
    for (const c of categories) if (!existsSync(publicFile(c.image))) hilang.push(c.image);
    assert.deepEqual([...new Set(hilang)], []);
  });
});

describe("helper menu", () => {
  it("findOption menemukan item induknya, null untuk id yang tidak ada", () => {
    const hasil = findOption("kebab-5");
    assert.equal(hasil?.item.id, "kebab");
    assert.equal(hasil?.option.price, 45000);
    assert.equal(findOption("tidak-ada"), null);
  });

  it("minPrice mengambil pilihan termurah", () => {
    const canai = menu.find((m) => m.id === "canai")!;
    assert.equal(minPrice(canai), 15000);
  });

  it("thumb menunjuk ke folder thumb", () => {
    assert.equal(thumb("/images/menu/maraq.webp"), "/images/menu/thumb/maraq.webp");
  });
});
