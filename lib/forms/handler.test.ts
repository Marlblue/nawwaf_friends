import assert from "node:assert/strict";
import { afterEach, before, beforeEach, describe, it } from "node:test";

process.env.FORMS_SHARED_SECRET = "rahasia-uji";
process.env.OPS_ALERT_WEBHOOK_URL = "https://webhook.uji/kirim";
let handleFormSubmission: typeof import("./handler").handleFormSubmission;
let clientIp: typeof import("./handler").clientIp;
before(async () => {
  ({ handleFormSubmission, clientIp } = await import("./handler"));
});

const SCRIPT = "https://script.google.com/macros/s/uji/exec";
const RULES = { name: { required: true, minLength: 3 } };

// Semua fetch keluar dicegat: ke Apps Script dijawab `jawabanScript`, ke webhook dicatat.
let jawabanScript: () => Response;
let keScript: URLSearchParams[];
let keWebhook: string[];
const fetchAsli = globalThis.fetch;
beforeEach(() => {
  jawabanScript = () => Response.json({ status: "ok" });
  keScript = [];
  keWebhook = [];
  globalThis.fetch = async (url, init) => {
    if (String(url) === SCRIPT) {
      keScript.push(init?.body as URLSearchParams);
      return jawabanScript();
    }
    keWebhook.push(JSON.parse(String(init?.body)).text);
    return new Response("ok");
  };
});
afterEach(() => {
  globalThis.fetch = fetchAsli;
});

// Tiap test memakai IP sendiri supaya hitungan rate limit tidak saling bocor.
let nomorIp = 0;
function kirim(isian: Record<string, string>, { headers = {}, label = "uji" }: { headers?: Record<string, string>; label?: string } = {}) {
  const body = new FormData();
  for (const [k, v] of Object.entries(isian)) body.set(k, v);
  const request = new Request("https://nawwafresto.com/api/uji", {
    method: "POST",
    body,
    headers: { host: "nawwafresto.com", "x-real-ip": `10.9.0.${++nomorIp}`, ...headers },
  });
  return handleFormSubmission(request, { label, scriptUrl: SCRIPT, rules: RULES, thankYou: "komunitas" });
}

describe("handleFormSubmission", () => {
  it("menyimpan, memasang cookie halaman terima kasih, dan mengabari lead baru", async () => {
    const res = await kirim({ name: "Budi" });
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { ok: true });
    assert.match(res.headers.get("set-cookie") ?? "", /^form-submitted=1; Path=\/terima-kasih\/komunitas;/);
    assert.equal(keScript[0].get("name"), "Budi");
    assert.equal(keWebhook.length, 1);
    assert.match(keWebhook[0], /Lead baru/);
  });

  it("kabar lead tidak memuat isian pengunjung", async () => {
    await kirim({ name: "Budi Rahasia" });
    assert.ok(!keWebhook.join(" ").includes("Budi Rahasia"));
  });

  it("menolak body yang mengaku lebih dari 64 KB tanpa membacanya", async () => {
    const res = await kirim({ name: "Budi" }, { headers: { "content-length": String(65 * 1024) } });
    assert.equal(res.status, 413);
    assert.equal(keScript.length, 0);
  });

  it("menolak kiriman dari situs lain, tapi membiarkan yang tanpa Origin", async () => {
    assert.equal((await kirim({ name: "Budi" }, { headers: { origin: "https://situs-asing.com" } })).status, 403);
    assert.equal((await kirim({ name: "Budi" }, { headers: { origin: "https://nawwafresto.com" } })).status, 200);
    assert.equal((await kirim({ name: "Budi" })).status, 200);
  });

  it("honeypot dibalas sukses tanpa diteruskan ke Sheet", async () => {
    const res = await kirim({ name: "Budi", website: "http://spam" });
    assert.deepEqual([res.status, keScript.length], [200, 0]);
  });

  it("isian tidak valid ditolak 400 tanpa menyebut nama field internal", async () => {
    const res = await kirim({ name: "Bu" });
    assert.equal(res.status, 400);
    assert.ok(!JSON.stringify(await res.json()).includes("name"));
    assert.equal(keScript.length, 0);
  });

  it("meneruskan submissionId yang sah dan membuang yang palsu", async () => {
    await kirim({ name: "Budi", submissionId: "3f2b8c1e-7a4d-4e5f-9b6a-1c2d3e4f5a6b" });
    await kirim({ name: "Budi", submissionId: "bukan-uuid" });
    assert.equal(keScript[0].get("submissionId"), "3f2b8c1e-7a4d-4e5f-9b6a-1c2d3e4f5a6b");
    assert.equal(keScript[1].get("submissionId"), null);
  });

  it("kiriman ulang tidak dikabarkan sebagai lead baru", async () => {
    jawabanScript = () => Response.json({ status: "ok", duplicate: true });
    assert.equal((await kirim({ name: "Budi" })).status, 200);
    assert.equal(keWebhook.length, 0);
  });

  it("gagal menyimpan dijawab 502 dan grup dikabari", async () => {
    jawabanScript = () => Response.json({ status: "error", error: "unauthorized" });
    const res = await kirim({ name: "Budi" }, { label: "uji-gagal" });
    assert.equal(res.status, 502);
    assert.equal(res.headers.get("set-cookie"), null);
    assert.ok(keWebhook.some((t) => /GAGAL menyimpan/.test(t) && /SHARED_SECRET/.test(t)));
  });

  it("email gagal tetap dijawab sukses dan grup dikabari", async () => {
    jawabanScript = () => Response.json({ status: "ok", mail: "failed" });
    const res = await kirim({ name: "Budi" }, { label: "uji-email" });
    assert.equal(res.status, 200);
    assert.ok(keWebhook.some((t) => /email notifikasinya GAGAL/.test(t)));
  });

  it("URL Apps Script kosong dijawab 500", async () => {
    const body = new FormData();
    body.set("name", "Budi");
    const res = await handleFormSubmission(new Request("https://nawwafresto.com/api/uji", { method: "POST", body }), {
      label: "uji-kosong",
      scriptUrl: "",
      rules: RULES,
      thankYou: "komunitas",
    });
    assert.equal(res.status, 500);
  });
});

describe("rate limit", () => {
  it("menahan kiriman ke-6 dari IP yang sama dalam 10 menit", async () => {
    const headers = { "x-real-ip": "10.20.30.40" };
    const status: number[] = [];
    for (let i = 0; i < 6; i++) status.push((await kirim({ name: "Budi" }, { headers, label: "uji-rate" })).status);
    assert.deepEqual(status, [200, 200, 200, 200, 200, 429]);
  });

  it("mengganti X-Forwarded-For tidak melewati rate limit selama proxy menulis X-Real-IP", async () => {
    const status: number[] = [];
    for (let i = 0; i < 6; i++) {
      const headers = { "x-real-ip": "10.20.30.41", "x-forwarded-for": `198.51.100.${i + 1}` };
      status.push((await kirim({ name: "Budi" }, { headers, label: "uji-palsu" })).status);
    }
    assert.equal(status.at(-1), 429);
  });

  it("jatahnya terpisah per form", async () => {
    const headers = { "x-real-ip": "10.20.30.42" };
    for (let i = 0; i < 5; i++) await kirim({ name: "Budi" }, { headers, label: "form-a" });
    assert.equal((await kirim({ name: "Budi" }, { headers, label: "form-b" })).status, 200);
  });
});

describe("clientIp", () => {
  const req = (headers: Record<string, string>) => new Request("https://x/", { headers });
  it("mendahulukan X-Real-IP yang ditulis proxy", () => {
    assert.equal(clientIp(req({ "x-real-ip": "1.2.3.4", "x-forwarded-for": "9.9.9.9" })), "1.2.3.4");
  });
  it("jatuh ke X-Forwarded-For hanya kalau X-Real-IP tidak ada", () => {
    assert.equal(clientIp(req({ "x-forwarded-for": "9.9.9.9, 10.0.0.1" })), "9.9.9.9");
    assert.equal(clientIp(req({})), null);
  });
});
