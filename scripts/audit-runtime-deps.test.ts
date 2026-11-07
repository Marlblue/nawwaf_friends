import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { OFF_REQUEST_PATH, RUNTIME_PACKAGES, touchesRequestPath } from "./audit-runtime-deps.mjs";

/**
 * Gerbang ini punya mode gagal yang tidak kelihatan: kalau logikanya salah, ia
 * mencetak OK dan tidak ada apa pun yang memberi tahu. Pohon repo ini sedang
 * nol advisory, jadi menjalankannya saja tidak membuktikan apa-apa. Yang diuji
 * di sini bentuk jalur dari `pnpm audit`, bukan isi pohonnya, supaya test ini
 * tidak ikut merah tiap kali ada advisory baru di luar sana. Sama dengan
 * test di sdbi dan kalih-signature kecuali daftar paketnya.
 */
describe("touchesRequestPath", () => {
  it("menangkap advisory yang dalam, bukan cuma paket yang dipasang langsung", () => {
    // Regresi yang pernah terjadi di repo kalih-signature: mencocokkan
    // module_name saja meloloskan nanoid, karena yang ada di daftar `next`,
    // bukan `nanoid`.
    assert.equal(
      touchesRequestPath({
        module_name: "nanoid",
        findings: [{ paths: [".>next>postcss>nanoid"] }],
      }),
      true
    );
  });

  it("melewatkan yang digantung di pohon Studio walau akarnya paket runtime", () => {
    assert.equal(
      touchesRequestPath({
        module_name: "brace-expansion",
        findings: [{ paths: [".>next-sanity>sanity>@sanity/cli>minimatch>brace-expansion"] }],
      }),
      false
    );
  });

  it("melewatkan yang akarnya memang bukan paket runtime", () => {
    assert.equal(
      touchesRequestPath({
        module_name: "js-yaml",
        findings: [{ paths: [".>@sanity/vision>sanity>@sanity/cli>js-yaml"] }],
      }),
      false
    );
  });

  it("menangkap kalau satu jalur bersih walau jalur lain lewat Studio", () => {
    // Paket yang sama bisa ditarik dari dua arah. Yang menentukan jalur
    // terburuk, bukan jalur pertama.
    assert.equal(
      touchesRequestPath({
        module_name: "nanoid",
        findings: [{ paths: [".>sanity>@sanity/cli>nanoid", ".>next>postcss>nanoid"] }],
      }),
      true
    );
  });

  it("tetap menangkap lewat module_name kalau findings kosong", () => {
    // Jalur kedua, untuk berjaga kalau bentuk `findings` dari registry berubah.
    assert.equal(touchesRequestPath({ module_name: "sharp", findings: [] }), true);
    assert.equal(touchesRequestPath({ module_name: "sharp" }), true);
  });

  it("tidak meledak pada advisory yang bentuknya tidak lengkap", () => {
    assert.equal(touchesRequestPath({}), false);
    assert.equal(touchesRequestPath({ findings: [{}] }), false);
    assert.equal(touchesRequestPath({ findings: [{ paths: [] }] }), false);
  });
});

/**
 * Daftarnya sengaja ditulis tangan, jadi yang bisa salah adalah isinya. Dua
 * kesalahan yang paling mungkin: paket Studio ikut masuk (gerbangnya jadi
 * selalu merah), atau paket yang melayani pengunjung terlewat (gerbangnya
 * diam saat seharusnya bunyi).
 */
describe("daftar paket", () => {
  it("tidak memasukkan paket yang cuma dimuat di /studio", () => {
    for (const nama of ["sanity", "@sanity/vision", "styled-components"]) {
      assert.equal(RUNTIME_PACKAGES.has(nama), false, `${nama} seharusnya tidak dihitung runtime`);
    }
  });

  it("memuat paket yang dipanggil saat melayani permintaan", () => {
    for (const nama of [
      "next",
      "react",
      "react-dom",
      "sharp",
      "next-sanity",
      "@portabletext/react",
      "@sanity/image-url",
      "@next/third-parties",
    ]) {
      assert.equal(RUNTIME_PACKAGES.has(nama), true, `${nama} seharusnya dihitung runtime`);
    }
  });

  it("tidak menyebut paket yang sama di dua daftar sekaligus", () => {
    // Kalau ada yang muncul di keduanya, jalurnya akan selalu dibuang dan
    // paket itu tidak pernah benar-benar dijaga.
    for (const nama of OFF_REQUEST_PATH) {
      assert.equal(RUNTIME_PACKAGES.has(nama), false, `${nama} ada di dua daftar`);
    }
  });
});
