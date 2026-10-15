import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { COUNT_PATTERN, NAME_PATTERN, PHONE_PATTERN, isBotSubmission, normalizeIdPhone, validateFields } from "./validate";

const form = (isian: Record<string, string>) => {
  const f = new FormData();
  for (const [k, v] of Object.entries(isian)) f.set(k, v);
  return f;
};

describe("validateFields", () => {
  it("lolos dan merapikan spasi di tepi", () => {
    assert.deepEqual(validateFields(form({ name: "  Budi  " }), { name: { required: true } }), { ok: true, values: { name: "Budi" } });
  });

  it("menyebut field pertama yang gagal", () => {
    const rules = { name: { required: true }, phone: { required: true } };
    assert.deepEqual(validateFields(form({ name: "Budi" }), rules), { ok: false, field: "phone" });
  });

  it("menegakkan panjang dan pola", () => {
    assert.equal(validateFields(form({ x: "ab" }), { x: { minLength: 3 } }).ok, false);
    assert.equal(validateFields(form({ x: "abcd" }), { x: { maxLength: 3 } }).ok, false);
    assert.equal(validateFields(form({ x: "abc" }), { x: { pattern: /^\d+$/ } }).ok, false);
  });

  it("field opsional yang kosong jadi string kosong, tidak dicek polanya", () => {
    assert.deepEqual(validateFields(form({}), { x: { pattern: /^\d+$/ } }), { ok: true, values: { x: "" } });
  });

  it("menjalankan normalize setelah lolos pemeriksaan", () => {
    assert.deepEqual(validateFields(form({ phone: "0812 3456 7890" }), { phone: { pattern: PHONE_PATTERN, normalize: normalizeIdPhone } }), {
      ok: true,
      values: { phone: "+6281234567890" },
    });
  });

  it("hanya meneruskan field yang ada di aturan", () => {
    const hasil = validateFields(form({ name: "Budi", token: "palsu" }), { name: {} });
    assert.deepEqual(hasil, { ok: true, values: { name: "Budi" } });
  });

  it("isian berupa berkas dianggap kosong", () => {
    const f = new FormData();
    f.set("name", new Blob(["x"]), "x.txt");
    assert.deepEqual(validateFields(f, { name: { required: true } }), { ok: false, field: "name" });
  });
});

describe("pola isian", () => {
  it("NAME_PATTERN menerima nama beraksen dan apostrof, menolak angka dan simbol", () => {
    for (const ok of ["Budi Santoso", "Siti Nur'aini", "José Müller", "A. Rahman"]) assert.ok(NAME_PATTERN.test(ok), ok);
    for (const salah of ["Bu", "Budi123", "<script>", "1Budi"]) assert.ok(!NAME_PATTERN.test(salah), salah);
  });

  it("PHONE_PATTERN menerima format umum dan menolak yang terlalu pendek", () => {
    for (const ok of ["081234567890", "+62 812-3456-7890", "6281234567"]) assert.ok(PHONE_PATTERN.test(ok), ok);
    for (const salah of ["0812", "abc12345678", "-81234567"]) assert.ok(!PHONE_PATTERN.test(salah), salah);
  });

  it("COUNT_PATTERN cuma angka mulai dari 1", () => {
    assert.ok(COUNT_PATTERN.test("25"));
    for (const salah of ["0", "01", "-5", "1.5", "1234567"]) assert.ok(!COUNT_PATTERN.test(salah), salah);
  });
});

describe("normalizeIdPhone", () => {
  it("menyeragamkan ke +62 supaya nol di depan tidak hilang di Sheets", () => {
    assert.equal(normalizeIdPhone("081234567890"), "+6281234567890");
    assert.equal(normalizeIdPhone("6281234567890"), "+6281234567890");
    assert.equal(normalizeIdPhone("81234567890"), "+6281234567890");
    assert.equal(normalizeIdPhone("+62 812-3456-7890"), "+6281234567890");
  });

  it("membiarkan nomor luar negeri dan bentuk yang tidak dikenal", () => {
    assert.equal(normalizeIdPhone("+60123456789"), "+60123456789");
    assert.equal(normalizeIdPhone("12-34"), "12-34");
  });
});

describe("isBotSubmission", () => {
  it("terjaring kalau field jebakan diisi", () => {
    assert.equal(isBotSubmission(form({ website: "http://spam" })), true);
  });
  it("lolos kalau kosong atau cuma spasi", () => {
    assert.equal(isBotSubmission(form({ website: "  " })), false);
    assert.equal(isBotSubmission(form({})), false);
  });
});
