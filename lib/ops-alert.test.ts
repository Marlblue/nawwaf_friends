import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import { ALERT_INTERVAL_MS, LEAD_NOTIFY_CAP, alertOps, notifyLead } from "./ops-alert";

let terkirim: string[];
const fetchAsli = globalThis.fetch;
const envAsli = { ...process.env };
beforeEach(() => {
  terkirim = [];
  process.env.OPS_ALERT_WEBHOOK_URL = "https://webhook.uji/kirim";
  globalThis.fetch = async (_url, init) => {
    terkirim.push(JSON.parse(String(init?.body)).text);
    return new Response("ok");
  };
});
afterEach(() => {
  globalThis.fetch = fetchAsli;
  process.env = { ...envAsli };
});

// Setiap test memakai rentang waktu dan kunci sendiri, karena riwayat kirim disimpan di modul.
describe("alertOps", () => {
  it("memberi awalan domain dan mengirim sekali per jam untuk kunci yang sama", () => {
    const t = 1_000_000;
    assert.equal(alertOps("uji-jeda", "Form gagal", t), true);
    assert.equal(alertOps("uji-jeda", "Form gagal", t + ALERT_INTERVAL_MS - 1), false);
    assert.equal(alertOps("uji-jeda", "Form gagal", t + ALERT_INTERVAL_MS), true);
    assert.deepEqual(terkirim, ["[nawwafresto.com] Form gagal", "[nawwafresto.com] Form gagal"]);
  });

  it("kunci berbeda tidak saling menahan", () => {
    assert.equal(alertOps("uji-a", "a", 5_000_000), true);
    assert.equal(alertOps("uji-b", "b", 5_000_000), true);
  });

  it("tidak mengirim apa pun saat webhook kosong atau di next dev", () => {
    delete process.env.OPS_ALERT_WEBHOOK_URL;
    assert.equal(alertOps("uji-kosong", "x", 9_000_000), false);
    process.env.OPS_ALERT_WEBHOOK_URL = "https://webhook.uji/kirim";
    (process.env as Record<string, string>).NODE_ENV = "development";
    assert.equal(alertOps("uji-dev", "x", 9_000_000), false);
    assert.equal(terkirim.length, 0);
  });
});

describe("notifyLead", () => {
  it("menyebut nama form yang terbaca manusia", () => {
    notifyLead("kolaborasi", 50_000_000);
    assert.match(terkirim[0], /Lead baru: Kolaborasi KOL \(\/hubungi\/kolaborasi\)/);
  });

  it("menjeda setelah pagu per jam dan mengabarkan jedanya sekali", () => {
    const t = 100_000_000;
    let lolos = 0;
    for (let i = 0; i < LEAD_NOTIFY_CAP.max + 5; i++) if (notifyLead("komunitas", t + i)) lolos++;
    assert.equal(lolos, LEAD_NOTIFY_CAP.max);
    assert.equal(terkirim.filter((m) => /dijeda sementara/.test(m)).length, 1);
    // Setelah jendelanya lewat, lead dikabarkan lagi.
    assert.equal(notifyLead("komunitas", t + LEAD_NOTIFY_CAP.windowMs + 10), true);
  });
});
