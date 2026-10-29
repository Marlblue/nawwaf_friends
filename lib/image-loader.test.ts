import assert from "node:assert/strict";
import { describe, it } from "node:test";
import imageLoader from "./image-loader";
import { localImageVersions } from "./localImageVariants";

describe("imageLoader", () => {
  it("memilih varian terkecil yang menutupi lebar yang diminta", () => {
    const v = localImageVersions["/outdoor.webp"];
    assert.equal(imageLoader({ src: "/outdoor.webp", width: 384 }), `/_img/w384/outdoor.webp?v=${v}`);
    assert.equal(imageLoader({ src: "/outdoor.webp", width: 750 }), `/_img/w828/outdoor.webp?v=${v}`);
  });

  it("meng-encode spasi di nama berkas", () => {
    assert.match(imageLoader({ src: "/Meting room.webp", width: 640 }), /^\/_img\/w640\/Meting%20room\.webp\?v=/);
  });

  it("memakai berkas asli kalau lebih lebar dari varian terbesar atau tanpa varian", () => {
    assert.match(imageLoader({ src: "/outdoor.webp", width: 1920 }), /^\/outdoor\.webp\?w=1920&v=/);
    assert.match(imageLoader({ src: "/images/logo.webp", width: 96 }), /^\/images\/logo\.webp\?w=96&v=/);
    assert.equal(imageLoader({ src: "/tidak-dikenal.webp", width: 640 }), "/tidak-dikenal.webp?w=640");
  });
});
