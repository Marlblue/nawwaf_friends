import { postToAppsScript } from "./apps-script";
import { SUBMISSION_ID_FIELD, SUBMISSION_ID_PATTERN } from "./submission-id";
import { thankYouCookie, type ThankYouForm } from "./thank-you";
import { isBotSubmission, validateFields, type FieldRules } from "./validate";

type HandlerOptions = {
  /** Prefix log server dan kunci rate limit per form. */
  label: string;
  scriptUrl: string;
  rules: FieldRules;
  /** Halaman terima kasih yang boleh dibuka setelah kiriman ini tersimpan. */
  thankYou: ThankYouForm;
};

// Form terpanjang (komunitas) di bawah 8 KB; route handler App Router tidak
// punya batas body bawaan.
const MAX_BODY_BYTES = 64 * 1024;

// Rate limit sederhana di memori proses: cukup untuk menahan bot yang memukul
// endpoint berulang kali. Hilang saat server restart, dan itu tidak apa-apa.
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const hits = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, times] of hits) if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(k);
  }
  return recent.length > RATE_MAX;
}

function clientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || null;
}

// POST berisi FormData tidak butuh preflight CORS, jadi situs lain bisa
// memasang form tersembunyi yang mengirim ke sini. Origin yang tidak ada
// (curl/skrip) dibiarkan: shared secret dan rate limit yang mengurusnya.
function isCrossSiteRequest(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!host) return false;
  try {
    return new URL(origin).host !== host;
  } catch {
    return true;
  }
}

function jsonError(error: string, status: number): Response {
  return Response.json({ ok: false, error }, { status });
}

/**
 * Alur yang sama untuk semua form: tolak kiriman lintas situs, bot, dan yang
 * terlalu sering, validasi ulang di server, lalu teruskan hanya field yang
 * dikenali ke Apps Script dan laporkan hasil sebenarnya ke client.
 */
export async function handleFormSubmission(request: Request, { label, scriptUrl, rules, thankYou }: HandlerOptions): Promise<Response> {
  const declaredBytes = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredBytes) && declaredBytes > MAX_BODY_BYTES) {
    return jsonError("Data yang dikirim terlalu besar.", 413);
  }

  if (isCrossSiteRequest(request)) {
    console.warn(`[${label}] submit dari origin lain, ditolak`);
    return jsonError("Pengiriman ditolak.", 403);
  }

  if (!scriptUrl) {
    console.error(`[${label}] URL Apps Script belum diset di environment`);
    return jsonError("Form belum siap menerima pengiriman.", 500);
  }

  const ip = clientIp(request);
  if (ip && isRateLimited(`${label}:${ip}`)) {
    return jsonError("Terlalu banyak pengiriman. Coba lagi beberapa saat lagi.", 429);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return jsonError("Data yang dikirim tidak valid.", 400);
  }

  // Balas seolah berhasil supaya bot tidak tahu jebakannya ketahuan.
  if (isBotSubmission(form)) {
    console.warn(`[${label}] submit terjaring honeypot, diabaikan`);
    return Response.json({ ok: true });
  }

  const validation = validateFields(form, rules);
  if (!validation.ok) {
    // Nama field internal cuma ke log; aturan yang sama sudah ada di form-nya,
    // jadi penolakan di sini berarti bot atau aturan client & server melenceng.
    console.warn(`[${label}] isian "${validation.field}" tidak lolos aturan server`);
    return jsonError("Ada isian yang belum benar. Periksa kembali formulir Anda.", 400);
  }

  const fields = { ...validation.values };
  const submissionId = form.get(SUBMISSION_ID_FIELD);
  if (typeof submissionId === "string" && SUBMISSION_ID_PATTERN.test(submissionId)) {
    fields[SUBMISSION_ID_FIELD] = submissionId;
  }

  const result = await postToAppsScript(scriptUrl, fields);
  if (!result.ok) {
    console.error(`[${label}] gagal meneruskan ke Apps Script: ${result.reason}`);
    return jsonError("Pengiriman gagal diproses. Silakan coba lagi atau hubungi kami via WhatsApp.", 502);
  }
  if (result.mailFailed) {
    console.error(`[${label}] tersimpan di Sheet, tapi email notifikasinya gagal (kuota MailApp habis?)`);
  }

  const response = Response.json({ ok: true });
  response.headers.append("Set-Cookie", thankYouCookie(thankYou));
  return response;
}
