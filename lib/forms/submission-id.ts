// Penanda satu pengiriman form. Kalau route handler sudah menyerah menunggu
// tapi Apps Script tetap menulis barisnya, pengunjung yang menekan kirim lagi
// membawa penanda yang sama dan Apps Script tidak menulisnya dua kali.

export const SUBMISSION_ID_FIELD = "submissionId";

/** UUID versi 4. */
export const SUBMISSION_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

export function newSubmissionId(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();

  // crypto.randomUUID belum ada di Safari < 15.4
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
