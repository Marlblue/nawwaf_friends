import { FORMS_SHARED_SECRET } from "./env";

// Diteruskan dari server, bukan langsung dari browser: fetch `no-cors` dari
// browser selalu "berhasil" walau Apps Script error, sedangkan dari server status
// dan isi jawabannya bisa diperiksa, jadi pengunjung hanya melihat "terima kasih"
// kalau datanya memang masuk Sheet.

// Apps Script yang cold start + appendRow + MailApp bisa lebih dari 10 detik.
// Abort di sini tidak menghentikan eksekusinya, jadi kiriman ulang ditahan lewat
// submissionId (lihat lib/forms/submission-id.ts).
const TIMEOUT_MS = 25_000;

export type SubmitResult = { ok: true; mailFailed?: true; duplicate?: true } | { ok: false; reason: string };

export async function postToAppsScript(scriptUrl: string, fields: Record<string, string>): Promise<SubmitResult> {
  const body = new URLSearchParams(fields);
  if (FORMS_SHARED_SECRET) body.set("token", FORMS_SHARED_SECRET);

  let response: Response;
  try {
    response = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      // /exec selalu redirect ke script.googleusercontent.com
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.message : "network error" };
  }

  if (!response.ok) return { ok: false, reason: `HTTP ${response.status}` };

  // Script yang error membalas halaman HTML, jadi yang bukan JSON dihitung gagal.
  const text = await response.text();
  try {
    const payload = JSON.parse(text) as { status?: string; error?: string; mail?: string; duplicate?: boolean };
    if (payload.status === "ok") {
      return {
        ok: true,
        ...(payload.mail === "failed" && { mailFailed: true }),
        ...(payload.duplicate === true && { duplicate: true }),
      };
    }
    return { ok: false, reason: payload.error ?? `respons tidak terduga: ${text.slice(0, 200)}` };
  } catch {
    return { ok: false, reason: `respons bukan JSON: ${text.slice(0, 200)}` };
  }
}
