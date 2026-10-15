import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ringkasErrorServer } from "./server-error-alert";

const request = { path: "/tiket/ABC123?token=RAHASIA", method: "GET", headers: {} };
const context = {
  routerKind: "App Router",
  routePath: "/tiket/[kode]",
  routeType: "render",
  renderSource: "server-rendering",
  revalidateReason: undefined,
  renderType: "dynamic",
} as const;

describe("ringkasErrorServer", () => {
  it("memakai pola rute sebagai kunci, bukan URL yang diminta", () => {
    const hasil = ringkasErrorServer(new Error("x"), request, context);
    assert.equal(hasil?.key, "server-error:/tiket/[kode]");
  });

  it("tidak memuat URL asli, query, email, maupun nomor HP", () => {
    const err = new Error("gagal kirim ke budi@contoh.com, nomor 081234567890 dan +6281234567890");
    const pesan = ringkasErrorServer(err, request, context)?.pesan ?? "";
    for (const bocor of ["ABC123", "RAHASIA", "budi@contoh.com", "081234567890", "6281234567890"]) {
      assert.ok(!pesan.includes(bocor), `pesan memuat ${bocor}`);
    }
    assert.match(pesan, /<email>/);
    assert.match(pesan, /<nomor>/);
  });

  it("melewatkan notFound() dan redirect(), yang bukan kerusakan", () => {
    for (const digest of ["NEXT_HTTP_ERROR_FALLBACK;404", "NEXT_REDIRECT;replace;/;307;", "DYNAMIC_SERVER_USAGE"]) {
      assert.equal(ringkasErrorServer(Object.assign(new Error("x"), { digest }), request, context), null);
    }
  });

  it("menyebut kode digest supaya bisa dicocokkan dengan log server", () => {
    const pesan = ringkasErrorServer(Object.assign(new Error("x"), { digest: "123456" }), request, context)?.pesan;
    assert.match(pesan ?? "", /kode 123456/);
  });

  it("memotong pesan yang sangat panjang", () => {
    const pesan = ringkasErrorServer(new Error("a".repeat(5000)), request, context)?.pesan ?? "";
    assert.ok(pesan.length < 500);
  });

  it("tetap menghasilkan pesan untuk nilai lempar yang bukan Error", () => {
    assert.match(ringkasErrorServer("putus", request, context)?.pesan ?? "", /putus/);
  });
});
