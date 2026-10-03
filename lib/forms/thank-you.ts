// Halaman /terima-kasih/[form] hanya bisa dibuka setelah kiriman form-nya
// benar-benar tersimpan: route handler memasang cookie penanda, dan yang datang
// tanpa cookie itu dilempar balik ke form-nya.

export type ThankYouForm = "kolaborasi-kol" | "komunitas";

type ThankYouContent = {
  /** Halaman tempat form-nya berada, tujuan pengalihan kalau cookie tidak ada. */
  formHref: string;
  message: string;
};

export const THANK_YOU_CONTENT: Record<ThankYouForm, ThankYouContent> = {
  "kolaborasi-kol": {
    formHref: "/hubungi/kolaborasi",
    message: "Pengajuan kolaborasi Anda sudah kami catat. Tim Nawwaf & Friends akan meninjaunya dan menghubungi Anda lewat WhatsApp.",
  },
  komunitas: {
    formHref: "/hubungi/komunitas",
    message: "Pengajuan komunitas Anda sudah kami catat. Tim Nawwaf & Friends akan meninjaunya dan menghubungi Anda lewat WhatsApp.",
  },
};

export function thankYouPath(form: ThankYouForm): string {
  return `/terima-kasih/${form}`;
}

export function isThankYouForm(value: string): value is ThankYouForm {
  return Object.hasOwn(THANK_YOU_CONTENT, value);
}

export const THANK_YOU_COOKIE = "form-submitted";

// Satu nama cookie untuk semua form, dibedakan lewat Path: browser hanya
// mengirimnya ke halaman terima kasih form yang sama. Sepuluh menit cukup untuk
// navigasi di sinyal jelek tanpa membuat halamannya bisa dibuka ulang besok.
export function thankYouCookie(form: ThankYouForm): string {
  return `${THANK_YOU_COOKIE}=1; Path=${thankYouPath(form)}; Max-Age=600; HttpOnly; SameSite=Lax${
    process.env.NODE_ENV === "production" ? "; Secure" : ""
  }`;
}
