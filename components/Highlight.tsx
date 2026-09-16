import { Fragment, type ReactNode } from "react";

// Menyoroti potongan teks yang cocok dengan kata yang sedang dicari.
// Pencocokan memakai indexOf, bukan RegExp, supaya karakter seperti "+", "(" atau "½"
// yang ada di nama menu tidak terbaca sebagai pola dan bikin error.
export default function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim().toLowerCase();
  if (!q) return <>{text}</>;

  const lower = text.toLowerCase();
  const parts: ReactNode[] = [];
  let from = 0;

  // Setiap potongan diberi key berdasarkan posisinya di teks. Ini bukan formalitas:
  // saat mengetik huruf berikutnya, sorotan yang posisinya tidak berubah tetap
  // memakai elemen DOM yang sama, jadi animasi sapuannya tidak mengulang dari nol
  // setiap ketikan. Yang tersapu hanya sorotan yang memang baru muncul.
  for (;;) {
    const hit = lower.indexOf(q, from);
    if (hit === -1) {
      if (from < text.length) parts.push(<Fragment key={`t${from}`}>{text.slice(from)}</Fragment>);
      break;
    }
    if (hit > from) parts.push(<Fragment key={`t${from}`}>{text.slice(from, hit)}</Fragment>);
    parts.push(
      <mark key={`m${hit}`} className="hl">
        {text.slice(hit, hit + q.length)}
      </mark>,
    );
    from = hit + q.length;
  }

  return <>{parts}</>;
}
