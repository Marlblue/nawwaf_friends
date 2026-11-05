import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { afterEach, before, describe, it } from "node:test";

// Webhook ini satu-satunya pintu dari luar yang bisa membuang cache artikel. Yang diuji:
// tanpa secret, tanpa tanda tangan, atau tanda tangan salah, permintaan ditolak sebelum
// apa pun dijalankan. Jalur sukses (revalidateTag) butuh runtime Next, jadi tidak di sini.
let POST: typeof import("./route").POST;
before(async () => {
  ({ POST } = await import("./route"));
});

const SECRET = "rahasia-uji";
const URL_WEBHOOK = "https://nawwafresto.com/api/revalidate";

// Sama dengan @sanity/webhook: base64url(HMAC-SHA256(secret, "<timestamp>.<body>")).
function tandaTangan(body: string, secret: string, t = Date.now()) {
  const v1 = createHmac("sha256", secret).update(`${t}.${body}`).digest("base64url");
  return `t=${t},v1=${v1}`;
}

function kirim(body: object, signature?: string) {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (signature) headers["sanity-webhook-signature"] = signature;
  return POST(new Request(URL_WEBHOOK, { method: "POST", headers, body: JSON.stringify(body) }));
}

describe("POST /api/revalidate", () => {
  const asli = process.env.SANITY_REVALIDATE_SECRET;
  afterEach(() => {
    if (asli === undefined) delete process.env.SANITY_REVALIDATE_SECRET;
    else process.env.SANITY_REVALIDATE_SECRET = asli;
  });

  it("503 kalau secret belum di-set (tanpa secret, parseBody tidak memeriksa tanda tangan)", async () => {
    delete process.env.SANITY_REVALIDATE_SECRET;
    const body = { _type: "article" };
    const res = await kirim(body, tandaTangan(JSON.stringify(body), "apa-saja"));
    assert.equal(res.status, 503);
  });

  it("401 tanpa tanda tangan", async () => {
    process.env.SANITY_REVALIDATE_SECRET = SECRET;
    const res = await kirim({ _type: "article" });
    assert.equal(res.status, 401);
  });

  it("401 kalau tanda tangan dibuat dengan secret lain", async () => {
    process.env.SANITY_REVALIDATE_SECRET = SECRET;
    const body = { _type: "article" };
    const res = await kirim(body, tandaTangan(JSON.stringify(body), "secret-penyerang"));
    assert.equal(res.status, 401);
  });

  it("401 kalau isi diubah sesudah ditandatangani", async () => {
    process.env.SANITY_REVALIDATE_SECRET = SECRET;
    const sig = tandaTangan(JSON.stringify({ _type: "article" }), SECRET);
    const res = await kirim({ _type: "article", tambahan: 1 }, sig);
    assert.equal(res.status, 401);
  });

  it("tanda tangan benar diterima: body tanpa _type lalu ditolak 400, bukan 401", async () => {
    process.env.SANITY_REVALIDATE_SECRET = SECRET;
    const body = { judul: "tanpa tipe" };
    const res = await kirim(body, tandaTangan(JSON.stringify(body), SECRET));
    assert.equal(res.status, 400);
  });
});
