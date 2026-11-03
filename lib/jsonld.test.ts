import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { serializeJsonLd } from "./jsonld";

describe("serializeJsonLd", () => {
  it('tidak menyisakan "<" mentah, jadi "</script>" dari Sanity tidak menutup blok', () => {
    const hasil = serializeJsonLd({ headline: "</script><script>alert(1)</script>" });
    assert.ok(!hasil.includes("<"));
    assert.ok(hasil.includes("\\u003c/script>"));
  });

  it("tetap JSON yang sama setelah diurai", () => {
    const data = { "@type": "FAQPage", name: "a < b", n: 1 };
    assert.deepEqual(JSON.parse(serializeJsonLd(data)), data);
  });
});
