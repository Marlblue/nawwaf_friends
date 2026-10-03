// Validasi ulang di server. Atribut required/pattern di HTML hanya menahan
// pengunjung biasa; siapa pun bisa POST langsung ke endpoint dengan curl.

export type Rule = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  /** Merapikan nilai yang sudah lolos pemeriksaan sebelum diteruskan ke Apps Script. */
  normalize?: (value: string) => string;
};

export type FieldRules = Record<string, Rule>;

export type ValidationResult = { ok: true; values: Record<string, string> } | { ok: false; field: string };

export function validateFields(form: FormData, rules: FieldRules): ValidationResult {
  const values: Record<string, string> = {};

  for (const [field, rule] of Object.entries(rules)) {
    const raw = form.get(field);
    const value = typeof raw === "string" ? raw.trim() : "";

    if (!value) {
      if (rule.required) return { ok: false, field };
      values[field] = "";
      continue;
    }
    if (rule.minLength !== undefined && value.length < rule.minLength) return { ok: false, field };
    if (rule.maxLength !== undefined && value.length > rule.maxLength) return { ok: false, field };
    if (rule.pattern && !rule.pattern.test(value)) return { ok: false, field };

    values[field] = rule.normalize ? rule.normalize(value) : value;
  }

  return { ok: true, values };
}

/** Nama orang: huruf (termasuk beraksen), spasi, titik, koma, apostrof, tanda hubung. */
export const NAME_PATTERN = /^\p{L}[\p{L}\p{M}.,'’‘\-\s]{2,59}$/u;

/** Nomor telepon yang diketik bebas: "0812...", "+62812...", "62812...", boleh bespasi. */
export const PHONE_PATTERN = /^[0-9+][0-9+\-\s]{7,19}$/;

// Diseragamkan ke "+62..." supaya nol di depan tidak hilang di Google Sheets:
// appendRow mengubah "081234..." jadi angka 81234..., sedangkan awalan "+" membuat
// safeCell di .gs memberi apostrof sehingga selnya tetap teks.
export function normalizeIdPhone(raw: string): string {
  const compact = raw.replace(/[\s-]/g, "");
  if (/^0\d{6,}$/.test(compact)) return `+62${compact.slice(1)}`;
  if (/^62\d{6,}$/.test(compact)) return `+${compact}`;
  if (/^8\d{7,12}$/.test(compact)) return `+62${compact}`;
  if (/^\+\d+$/.test(compact)) return compact;
  return raw;
}

/** Angka polos mulai dari 1 (jumlah anggota/peserta). */
export const COUNT_PATTERN = /^[1-9]\d{0,5}$/;

/**
 * Field jebakan (honeypot): tersembunyi dari pengunjung, tapi diisi bot yang
 * mengisi semua input begitu saja.
 */
export const HONEYPOT_FIELD = "website";

export function isBotSubmission(form: FormData): boolean {
  const value = form.get(HONEYPOT_FIELD);
  return typeof value === "string" && value.trim() !== "";
}
