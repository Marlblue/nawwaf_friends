import assert from "node:assert/strict";
import { afterEach, before, describe, it } from "node:test";

// env.ts membaca process.env saat diimpor, jadi secret dipasang sebelum modulnya dimuat.
process.env.FORMS_SHARED_SECRET = "rahasia-uji";
let postToAppsScript: typeof import("./apps-script").postToAppsScript;
before(async () => {
  ({ postToAppsScript } = await import("./apps-script"));
});

const fetchAsli = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = fetchAsli;
});
const balas = (body: string, status = 200) => {
  globalThis.fetch = async () => new Response(body, { status });
};

describe("postToAppsScript", () => {
  it("mengirim isian sebagai form-urlencoded beserta token shared secret", async () => {
    let dikirim: URLSearchParams | undefined;
    globalThis.fetch = async (_url, init) => {
      dikirim = init?.body as URLSearchParams;
      return Response.json({ status: "ok" });
    };
    assert.deepEqual(await postToAppsScript("https://script/exec", { name: "Budi" }), { ok: true });
    assert.equal(dikirim?.get("name"), "Budi");
    assert.equal(dikirim?.get("token"), "rahasia-uji");
  });

  it("membedakan email yang gagal dan kiriman ulang", async () => {
    balas(JSON.stringify({ status: "ok", mail: "failed" }));
    assert.deepEqual(await postToAppsScript("u", {}), { ok: true, mailFailed: true });
    balas(JSON.stringify({ status: "ok", duplicate: true }));
    assert.deepEqual(await postToAppsScript("u", {}), { ok: true, duplicate: true });
  });

  it("gagal dengan alasan dari Apps Script", async () => {
    balas(JSON.stringify({ status: "error", error: "unauthorized" }));
    assert.deepEqual(await postToAppsScript("u", {}), { ok: false, reason: "unauthorized" });
  });

  it("halaman HTML (script error) dan status bukan 2xx dihitung gagal", async () => {
    balas("<html>Error</html>");
    assert.match((await postToAppsScript("u", {}) as { reason: string }).reason, /bukan JSON/);
    balas("x", 500);
    assert.deepEqual(await postToAppsScript("u", {}), { ok: false, reason: "HTTP 500" });
  });

  it("menandai timeout supaya pesannya bilang baris mungkin tetap tersimpan", async () => {
    globalThis.fetch = async () => {
      throw Object.assign(new Error("timeout"), { name: "TimeoutError" });
    };
    assert.deepEqual(await postToAppsScript("u", {}), { ok: false, reason: "timeout", timedOut: true });
  });

  it("gangguan jaringan biasa tidak ditandai timeout", async () => {
    globalThis.fetch = async () => {
      throw new Error("ECONNRESET");
    };
    assert.deepEqual(await postToAppsScript("u", {}), { ok: false, reason: "ECONNRESET" });
  });
});
