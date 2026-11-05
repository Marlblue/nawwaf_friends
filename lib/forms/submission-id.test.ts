import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { newSubmissionId, SUBMISSION_ID_PATTERN } from "./submission-id";

describe("newSubmissionId", () => {
  it("menghasilkan UUID v4 yang lolos pola yang dicek Apps Script", () => {
    const id = newSubmissionId();
    assert.match(id, SUBMISSION_ID_PATTERN);
    assert.notEqual(newSubmissionId(), id);
  });

  it("jalur cadangan tanpa crypto.randomUUID (Safari < 15.4) tetap UUID v4", () => {
    const asli = crypto.randomUUID;
    Object.defineProperty(crypto, "randomUUID", { value: undefined, configurable: true });
    try {
      for (let i = 0; i < 50; i++) assert.match(newSubmissionId(), SUBMISSION_ID_PATTERN);
    } finally {
      Object.defineProperty(crypto, "randomUUID", { value: asli, configurable: true });
    }
  });

  it("pola menolak yang bukan UUID v4", () => {
    assert.doesNotMatch("00000000-0000-1000-8000-000000000000", SUBMISSION_ID_PATTERN); // versi 1
    assert.doesNotMatch("bukan-uuid", SUBMISSION_ID_PATTERN);
  });
});
