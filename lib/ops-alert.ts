// Kabar operasional ke grup Telegram lewat satu webhook (OPS_ALERT_WEBHOOK_URL), pola
// yang sama dengan sdbi dan kalih-signature. Tanpa ini kegagalan form cuma tertulis di
// log Passenger, yang baru terbaca kalau seseorang sengaja membukanya di cPanel.
//
// Body-nya berisi `text` (Telegram & Slack) dan `content` (Discord), jadi webhook mana
// pun dari ketiganya bisa dipakai tanpa ubah kode. Kosong = fitur ini mati.
//
// Webhook yang sama dipakai deploy.yml dan uptime.yml (diambil dari secret GitHub
// dengan nama yang sama), jadi satu grup menerima semua kabar situs.

// Kegagalan seperti secret yang tidak cocok berulang di tiap submit sampai diperbaiki;
// satu pesan per jam per jenis masalah cukup tanpa membuat grupnya dibisukan.
export const ALERT_INTERVAL_MS = 60 * 60 * 1000;

// Lead memang layak satu pesan masing-masing, tapi banjir submit palsu tidak boleh ikut
// membanjiri grup (Telegram juga membatasi ~20 pesan/menit per grup).
export const LEAD_NOTIFY_CAP = { windowMs: 60 * 60 * 1000, max: 30 };

const WEBHOOK_TIMEOUT_MS = 5_000;

// Dikunci dengan `label` di handleFormSubmission. Label yang belum terdaftar tetap
// dikirim apa adanya supaya form baru yang lupa didaftarkan masih kelihatan.
const FORM_NAMES: Record<string, string> = {
  kolaborasi: "Kolaborasi KOL (/hubungi/kolaborasi)",
  komunitas: "Kolaborasi komunitas (/hubungi/komunitas)",
};

const lastSent = new Map<string, number>();
let leadTimes: number[] = [];

// Tanpa menunggu dan tanpa pernah melempar: pengunjung yang menunggu jawaban form tidak
// boleh ikut lambat atau gagal karena Telegram. Proses Node di cPanel persisten, jadi
// fetch yang jalan setelah respons terkirim tetap selesai.
//
// `next dev` sengaja tidak mengirim apa pun supaya submit uji coba di laptop tidak
// masuk ke grup sebagai lead baru.
function postToWebhook(text: string): boolean {
  const url = process.env.OPS_ALERT_WEBHOOK_URL;
  if (!url || process.env.NODE_ENV === "development") return false;

  const body = `[nawwafresto.com] ${text}`;
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: body, content: body }),
    signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
  })
    .then((response) => {
      if (!response.ok) console.error(`[ops-alert] webhook membalas HTTP ${response.status}, pemberitahuan tidak terkirim`);
    })
    .catch((error: unknown) => {
      console.error(`[ops-alert] webhook tidak bisa dihubungi: ${error instanceof Error ? error.message : "network error"}`);
    });

  return true;
}

/** Peringatan masalah, paling sering sekali per ALERT_INTERVAL_MS untuk `key` yang sama. */
export function alertOps(key: string, message: string, now: number = Date.now()): boolean {
  const previous = lastSent.get(key);
  if (previous !== undefined && now - previous < ALERT_INTERVAL_MS) return false;
  if (!postToWebhook(message)) return false;

  lastSent.set(key, now);
  return true;
}

/**
 * Kabar lead baru yang benar-benar tersimpan di Sheet. Sengaja hanya nama form:
 * isian pengunjung (nama, nomor WhatsApp) tidak boleh keluar ke Telegram; detailnya
 * dibuka di Sheet.
 */
export function notifyLead(label: string, now: number = Date.now()): boolean {
  leadTimes = leadTimes.filter((time) => now - time < LEAD_NOTIFY_CAP.windowMs);
  if (leadTimes.length >= LEAD_NOTIFY_CAP.max) {
    alertOps(
      "notifikasi-lead-dijeda",
      `Lebih dari ${LEAD_NOTIFY_CAP.max} lead dalam satu jam, notifikasi lead dijeda sementara. ` +
        "Kalau tidak sedang ada kampanye, periksa Sheet: bisa jadi banjir submit palsu.",
      now
    );
    return false;
  }

  if (!postToWebhook(`Lead baru: ${FORM_NAMES[label] ?? label}. Detailnya di Sheet.`)) return false;

  leadTimes.push(now);
  return true;
}
