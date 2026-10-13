/**
 * Apps Script untuk form Kolaborasi Komunitas di /hubungi/komunitas.
 * Dipanggil oleh app/api/komunitas/route.ts (bukan langsung dari browser).
 *
 * Cara pasang (Sheet terpisah dari form KOL):
 * 1. Buat Google Sheet baru, lalu Extensions > Apps Script. Hapus isi Code.gs
 *    dan tempel seluruh berkas ini.
 * 2. Project Settings (ikon gerigi) > Script properties > Add script property:
 *      SHARED_SECRET = sama persis dengan FORMS_SHARED_SECRET di .env server.
 *      NOTIFY_EMAIL  = (opsional) alamat tujuan email notifikasi. Kalau kosong,
 *                      dikirim ke pemilik Sheet.
 * 3. Deploy > New deployment > Select type: Web app.
 *      Execute as: Me
 *      Who has access: Anyone
 *    Authorize saat diminta, lalu salin URL yang berakhiran /exec ke
 *    COMMUNITY_SCRIPT_URL di .env server.
 * 4. Setiap kali berkas ini diubah: tempel ulang, lalu Deploy > Manage
 *    deployments > Edit > Version: New version.
 * 5. Rekap harian ke Telegram (opsional): tambah Script Property
 *      OPS_ALERT_WEBHOOK_URL = sama persis dengan OPS_ALERT_WEBHOOK_URL di env cPanel.
 *    Lalu pilih fungsi pasangRekapHarian di dropdown dan Run (setujui izin baru).
 *    Untuk mencoba tanpa menunggu besok jam 08.00, Run kirimRekapHarian.
 *
 * Tab "Komunitas" dan baris judulnya dibuat otomatis saat kiriman pertama.
 */

var SHEET_NAME = "Komunitas";
var RECAP_TITLE = "Kolaborasi komunitas";

function doPost(e) {
  if (isUnauthorized(e)) return json({ status: "error", error: "unauthorized" });

  var p = (e && e.parameter) || {};
  var row = {
    communityName: p.communityName || "",
    social: p.social || "",
    domicile: p.domicile || "",
    members: p.members || "",
    category: p.category || "",
    picName: p.picName || "",
    phone: p.phone || "",
    activity: p.activity || "",
    participants: p.participants || "",
    eventDate: p.eventDate || "",
    collabType: p.collabType || "",
    concept: p.concept || "",
  };

  var saved = saveOnce(p, function () {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Nama Komunitas",
        "Instagram/Media Sosial",
        "Domisili",
        "Jumlah Anggota",
        "Kategori",
        "Nama PIC",
        "No. WhatsApp PIC",
        "Rencana Kegiatan",
        "Perkiraan Jumlah Peserta",
        "Rencana Tanggal Kegiatan",
        "Bentuk Kolaborasi",
        "Konsep Kolaborasi",
        "Status",
      ]);
      sheet.setFrozenRows(1);
    }
    sheet.appendRow([
      new Date(),
      safeCell(row.communityName),
      safeCell(row.social),
      safeCell(row.domicile),
      safeCell(row.members),
      safeCell(row.category),
      safeCell(row.picName),
      safeCell(row.phone),
      safeCell(row.activity),
      safeCell(row.participants),
      safeCell(row.eventDate),
      safeCell(row.collabType),
      safeCell(row.concept),
      "Baru",
    ]);
  });

  if (saved === "busy") return json({ status: "error", error: "busy" });
  if (saved === "duplicate") return json({ status: "ok", duplicate: true });

  var mail = sendNotification(
    "[Nawwaf & Friends] Pengajuan kolaborasi komunitas dari " + (row.communityName || "(tanpa nama)"),
    "Ada pengajuan kolaborasi komunitas baru:\n\n" +
      "Nama Komunitas: " + row.communityName + "\n" +
      "Instagram/Media Sosial: " + row.social + "\n" +
      "Domisili: " + row.domicile + "\n" +
      "Jumlah Anggota: " + row.members + "\n" +
      "Kategori: " + row.category + "\n" +
      "Nama PIC: " + row.picName + "\n" +
      "No. WhatsApp PIC: " + row.phone + "\n" +
      "Rencana Kegiatan: " + row.activity + "\n" +
      "Perkiraan Jumlah Peserta: " + row.participants + "\n" +
      "Rencana Tanggal Kegiatan: " + (row.eventDate || "-") + "\n" +
      "Bentuk Kolaborasi: " + row.collabType + "\n" +
      "Konsep Kolaborasi: " + row.concept + "\n\n" +
      "Balas via WhatsApp: https://wa.me/" + row.phone.replace(/\D/g, "") + "\n" +
      "Sheet: " + SpreadsheetApp.getActiveSpreadsheet().getUrl()
  );

  return json({ status: "ok", mail: mail });
}

/* ---------- Blok bersama: samakan dengan collaboration-form.gs ---------- */

function json(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}

function notifyEmail() {
  var configured = PropertiesService.getScriptProperties().getProperty("NOTIFY_EMAIL") || "";
  return configured || Session.getEffectiveUser().getEmail();
}

/**
 * Secret disimpan di Script Properties, bukan di berkas ini, karena berkas .gs
 * ikut ter-commit ke repo. Properti yang kosong menolak semua kiriman: lebih
 * baik form gagal dan ketahuan daripada URL /exec menerima tulisan siapa saja.
 */
function isUnauthorized(e) {
  var secret = PropertiesService.getScriptProperties().getProperty("SHARED_SECRET") || "";
  if (!secret) return true;
  return !e || !e.parameter || !tokenMatches(e.parameter.token, secret);
}

/** Perbandingan yang lamanya tidak bergantung pada isi secret. */
function tokenMatches(candidate, secret) {
  if (typeof candidate !== "string" || secret.length === 0) return false;
  var diff = candidate.length ^ secret.length;
  for (var i = 0; i < candidate.length; i++) {
    diff |= candidate.charCodeAt(i) ^ secret.charCodeAt(i % secret.length);
  }
  return diff === 0;
}

/**
 * Isian yang diawali =, +, -, @ akan dibaca Sheets sebagai formula (formula
 * injection). Apostrof di depan membuatnya tersimpan sebagai teks biasa.
 */
var RISKY_FIRST_CHARS = ["=", "+", "-", "@", "\t", "\r"];

function safeCell(value) {
  var text = value === null || value === undefined ? "" : String(value);
  return RISKY_FIRST_CHARS.indexOf(text.charAt(0)) >= 0 ? "'" + text : text;
}

/**
 * Menjalankan `save` paling banyak sekali per submissionId. Route handler bisa
 * menyerah menunggu sementara script ini tetap menulis barisnya; kiriman ulang
 * dengan penanda yang sama tidak ditulis dua kali. Kuncinya juga mencegah dua
 * kiriman pertama sama-sama menulis baris judul.
 */
function saveOnce(params, save) {
  var candidate = typeof params.submissionId === "string" ? params.submissionId : "";
  var id = /^[0-9a-f-]{36}$/.test(candidate) ? candidate : "";
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) return "busy";
  try {
    var cache = CacheService.getScriptCache();
    if (id && cache.get("submission:" + id)) return "duplicate";
    save();
    if (id) cache.put("submission:" + id, "1", 21600);
    return "saved";
  } finally {
    lock.releaseLock();
  }
}

function sendNotification(subject, body) {
  try {
    MailApp.sendEmail({ to: notifyEmail(), subject: subject, body: body });
    return "sent";
  } catch (err) {
    Logger.log("Gagal kirim email: " + err);
    return "failed";
  }
}

/**
 * Mengirim satu pesan ke grup Telegram lewat webhook yang sama dengan alert website
 * (lib/ops-alert.ts). Alamatnya di Script Property "OPS_ALERT_WEBHOOK_URL", isinya sama
 * persis dengan OPS_ALERT_WEBHOOK_URL di env cPanel. Tidak ditulis di berkas ini karena
 * URL itu memuat token bot. Tidak pernah melempar.
 */
function postToWebhook(text) {
  var url = PropertiesService.getScriptProperties().getProperty("OPS_ALERT_WEBHOOK_URL") || "";
  if (!url) return "not-configured";
  var body = "[nawwafresto.com] " + text;
  try {
    var response = UrlFetchApp.fetch(url, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify({ text: body, content: body }),
      muteHttpExceptions: true,
    });
    return response.getResponseCode() < 300 ? "sent" : "failed";
  } catch (err) {
    Logger.log("Gagal kirim ke webhook: " + err);
    return "failed";
  }
}

/** Tanggal kemarin menurut jam Jakarta ("yyyy-MM-dd"), apa pun zona waktu project-nya. */
function yesterdayInJakarta(now) {
  return Utilities.formatDate(new Date(now.getTime() - 24 * 60 * 60 * 1000), "Asia/Jakarta", "yyyy-MM-dd");
}

/** Jumlah baris yang kolom Timestamp-nya (kolom A) jatuh di `day`. */
function countRowsOn(sheet, day) {
  if (!sheet || sheet.getLastRow() < 2) return 0;
  var stamps = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
  var count = 0;
  for (var i = 0; i < stamps.length; i++) {
    var value = stamps[i][0];
    if (value instanceof Date && Utilities.formatDate(value, "Asia/Jakarta", "yyyy-MM-dd") === day) count++;
  }
  return count;
}

/**
 * Dipanggil trigger harian dari pasangRekapHarian. Tetap dikirim walaupun nol, supaya
 * "tidak ada pesan" tidak tertukar dengan trigger yang mati. Isinya cuma jumlah, tanpa
 * isian pengunjung.
 */
function kirimRekapHarian() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var day = yesterdayInJakarta(new Date());
  var count = countRowsOn(ss.getSheetByName(SHEET_NAME), day);
  return postToWebhook("Rekap lead " + day + ", " + RECAP_TITLE + ": " + count + "\n" + ss.getUrl());
}

/**
 * Jalankan SEKALI dari editor untuk memasang rekap harian jam 08.00 WIB. Trigger lama
 * dihapus dulu, jadi aman dijalankan ulang tanpa membuat rekap terkirim dobel.
 */
function pasangRekapHarian() {
  ScriptApp.getProjectTriggers().forEach(function (trigger) {
    if (trigger.getHandlerFunction() === "kirimRekapHarian") ScriptApp.deleteTrigger(trigger);
  });
  ScriptApp.newTrigger("kirimRekapHarian").timeBased().atHour(8).everyDays(1).inTimezone("Asia/Jakarta").create();
}
