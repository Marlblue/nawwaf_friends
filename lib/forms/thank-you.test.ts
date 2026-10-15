import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { SUBMISSION_ID_PATTERN, newSubmissionId } from "./submission-id";
import { isThankYouForm, thankYouCookie, thankYouPath } from "./thank-you";

describe("thankYouCookie", () => {
  it("cuma dikirim ke halaman terima kasih form yang sama, sepuluh menit, HttpOnly", () => {
    const c = thankYouCookie("kolaborasi-kol");
    assert.match(c, /^form-submitted=1; Path=\/terima-kasih\/kolaborasi-kol; Max-Age=600; HttpOnly; SameSite=Lax/);
  });

  it("Secure hanya di produksi", () => {
    const env = process.env as Record<string, string | undefined>;
    const asli = env.NODE_ENV;
    env.NODE_ENV = "production";
    assert.match(thankYouCookie("komunitas"), /; Secure$/);
    env.NODE_ENV = "development";
    assert.doesNotMatch(thankYouCookie("komunitas"), /Secure/);
    env.NODE_ENV = asli;
  });
});

describe("thankYouPath dan isThankYouForm", () => {
  it("cuma mengenali form yang terdaftar", () => {
    assert.equal(thankYouPath("komunitas"), "/terima-kasih/komunitas");
    assert.equal(isThankYouForm("komunitas"), true);
    assert.equal(isThankYouForm("toString"), false);
    assert.equal(isThankYouForm("lain"), false);
  });
});

describe("newSubmissionId", () => {
  it("menghasilkan UUID v4 yang lolos pola yang dicek server, dan berbeda tiap kali", () => {
    const a = newSubmissionId();
    const b = newSubmissionId();
    assert.match(a, SUBMISSION_ID_PATTERN);
    assert.notEqual(a, b);
  });
});
