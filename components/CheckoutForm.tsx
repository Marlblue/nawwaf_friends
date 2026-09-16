"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { thumb } from "@/lib/menu";
import { rupiah, site, waLink } from "@/lib/site";
import { QtyControl } from "./CartDrawer";
import { useCart } from "./CartProvider";
import { CartIcon, Check, Clock, MapPin, Truck, Whatsapp } from "./Icons";

type Method = "delivery" | "pickup";

const payments = ["Transfer Bank", "QRIS", "Tunai (COD)"];

function makeOrderId() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `NF${String(d.getFullYear()).slice(2)}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export default function CheckoutForm() {
  const { lines, subtotal, count, ready, setQty, clear } = useCart();
  const [method, setMethod] = useState<Method>("delivery");
  const [timing, setTiming] = useState<"asap" | "scheduled">("asap");
  const [sent, setSent] = useState<{ id: string; url: string } | null>(null);

  if (sent) {
    return (
      <div className="mx-auto max-w-lg card p-10 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand text-white">
          <Check width={32} height={32} />
        </span>
        <h2 className="display-3 mt-6">Pesanan {sent.id} siap dikirim</h2>
        <p className="mt-2 text-muted">
          WhatsApp sudah dibuka di tab baru. Pastikan pesan terkirim ke admin, lalu tunggu konfirmasi ongkir &amp; total pembayaran.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <a href={sent.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            <Whatsapp width={18} height={18} /> Buka WhatsApp lagi
          </a>
          <Link href="/menu" className="btn btn-secondary">
            Kembali ke menu
          </Link>
        </div>
      </div>
    );
  }

  if (ready && lines.length === 0) {
    return (
      <div className="mx-auto max-w-lg card p-10 text-center">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-cream">
          <CartIcon width={32} height={32} />
        </span>
        <h2 className="display-3 mt-6">Keranjang masih kosong</h2>
        <p className="mt-2 text-muted">Pilih menu dulu dari katalog, lalu kembali ke halaman ini untuk checkout.</p>
        <Link href="/menu" className="btn btn-primary mt-6">
          Lihat Menu
        </Link>
      </div>
    );
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    const id = makeOrderId();

    const when =
      timing === "asap"
        ? "Secepatnya"
        : `${get("date")} ${get("time")}`.trim();

    const text = [
      `*PESANAN BARU - ${site.name}*`,
      `No. Order: ${id}`,
      "",
      `*Metode:* ${method === "delivery" ? "Delivery (diantar)" : "Ambil di resto"}`,
      `*Nama:* ${get("name")}`,
      `*No. HP:* ${get("phone")}`,
      method === "delivery" ? `*Alamat:* ${get("address")}` : null,
      method === "delivery" && get("landmark") ? `*Patokan:* ${get("landmark")}` : null,
      `*Waktu:* ${when}`,
      `*Pembayaran:* ${get("payment")}`,
      "",
      "*Detail pesanan:*",
      ...lines.map(
        (l, i) =>
          `${i + 1}. ${l.itemName}${l.showOption ? ` (${l.optionLabel})` : ""} x${l.qty} = ${rupiah(l.price * l.qty)}`,
      ),
      "",
      `*Subtotal:* ${rupiah(subtotal)}`,
      method === "delivery" ? "_Ongkir menunggu konfirmasi admin_" : null,
      get("notes") ? `\n*Catatan:* ${get("notes")}` : null,
    ]
      .filter((l) => l !== null)
      .join("\n");

    const url = waLink(text);
    window.open(url, "_blank", "noopener,noreferrer");
    setSent({ id, url });
    clear();
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form onSubmit={onSubmit} className="grid items-start gap-8 lg:grid-cols-[1.3fr_1fr]">
      <div className="space-y-6">
        <a href="#ringkasan" className="flex items-center justify-between gap-4 rounded-[20px] border border-black/10 bg-white px-5 py-4 lg:hidden">
          <span>
            <span className="block text-sm text-muted">Pesanan kamu</span>
            <span className="block font-medium">
              {count} item · <span className="tabular-nums">{rupiah(subtotal)}</span>
            </span>
          </span>
          <span className="text-sm font-medium text-brand">Lihat ringkasan ↓</span>
        </a>
        <fieldset className="card p-6 sm:p-8">
          <legend className="sr-only">Metode pesanan</legend>
          <h2 className="display-3 mb-5">1. Metode pesanan</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {([
              { id: "delivery", title: "Delivery", desc: "Diantar ke alamatmu", Icon: Truck },
              { id: "pickup", title: "Ambil di resto", desc: "Pesan dulu, ambil sendiri", Icon: MapPin },
            ] as const).map(({ id, title, desc, Icon }) => (
              <label
                key={id}
                className={`flex cursor-pointer items-center gap-3 rounded-[20px] border bg-cream p-4 transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand ${
                  method === id ? "border-ink" : "border-black/10 hover:border-black/40"
                }`}
              >
                <input type="radio" name="method" value={id} checked={method === id} onChange={() => setMethod(id)} className="sr-only" />
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${method === id ? "bg-ink text-cream" : "bg-sand text-ink"}`}>
                  <Icon />
                </span>
                <span>
                  <span className="block font-medium">{title}</span>
                  <span className="text-sm text-muted">{desc}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="card p-6 sm:p-8">
          <h2 className="display-3 mb-5">2. Data {method === "delivery" ? "pengiriman" : "pemesan"}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="name">Nama lengkap</label>
              <input id="name" name="name" required className="field" autoComplete="name" />
            </div>
            <div>
              <label className="label" htmlFor="phone">No. WhatsApp</label>
              <input id="phone" name="phone" required type="tel" inputMode="tel" pattern="[0-9+\-\s]{9,16}" placeholder="08xxxxxxxxxx" className="field" autoComplete="tel" />
            </div>
            {method === "delivery" && (
              <>
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="address">Alamat lengkap</label>
                  <textarea id="address" name="address" required rows={3} placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan" className="field" autoComplete="street-address" />
                </div>
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="landmark">Patokan (opsional)</label>
                  <input id="landmark" name="landmark" placeholder="mis. pagar hitam sebelah masjid" className="field" />
                </div>
              </>
            )}
          </div>
        </fieldset>

        <fieldset className="card p-6 sm:p-8">
          <h2 className="display-3 mb-5">3. Waktu &amp; pembayaran</h2>
          <div className="flex flex-wrap gap-2">
            {([
              { id: "asap", label: "Secepatnya" },
              { id: "scheduled", label: "Jadwalkan" },
            ] as const).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTiming(t.id)}
                aria-pressed={timing === t.id}
                className={"chip"}
              >
                <Clock width={16} height={16} /> {t.label}
              </button>
            ))}
          </div>
          {timing === "scheduled" && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="date">Tanggal</label>
                <input id="date" name="date" type="date" min={today} required className="field" />
              </div>
              <div>
                <label className="label" htmlFor="time">Jam</label>
                <input id="time" name="time" type="time" required className="field" />
              </div>
            </div>
          )}

          <p className="label mt-6">Metode pembayaran</p>
          <div className="flex flex-wrap gap-2">
            {payments.map((p, i) => (
              <label key={p} className="cursor-pointer">
                <input type="radio" name="payment" value={p} defaultChecked={i === 0} className="peer sr-only" />
                <span className="chip">
                  {p}
                </span>
              </label>
            ))}
          </div>

          <div className="mt-6">
            <label className="label" htmlFor="notes">Catatan (opsional)</label>
            <textarea id="notes" name="notes" rows={2} placeholder="mis. sambal dipisah, tidak pedas" className="field" />
          </div>
        </fieldset>
      </div>

      <aside id="ringkasan" className="card scroll-mt-24 p-6 sm:p-8 lg:sticky lg:top-24">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="display-3">Ringkasan ({count})</h2>
          <Link href="/menu" className="text-sm font-medium underline underline-offset-4 hover:text-brand">
            + Tambah menu
          </Link>
        </div>
        <ul className="divide-y divide-black/10">
          {lines.map((l) => (
            <li key={l.optionId} className="flex gap-3 py-3">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-cream">
                <Image src={l.image ? thumb(l.image) : "/images/logo.webp"} alt="" width={56} height={56} className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-medium leading-snug">{l.itemName}</p>
                {l.showOption && <p className="text-xs text-muted">{l.optionLabel}</p>}
                <div className="mt-1.5 flex items-center justify-between gap-2">
                  <QtyControl qty={l.qty} onChange={(q) => setQty(l.optionId, q)} />
                  <span className="text-sm font-medium tabular-nums">{rupiah(l.price * l.qty)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 border-t border-black/10 pt-4 text-[15px]">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd className="font-medium tabular-nums">{rupiah(subtotal)}</dd>
          </div>
          {method === "delivery" && (
            <div className="flex justify-between">
              <dt className="text-muted">Ongkos kirim</dt>
              <dd className="text-muted">Dikonfirmasi admin</dd>
            </div>
          )}
          <div className="flex justify-between border-t border-black/10 pt-3 text-lg">
            <dt className="font-medium">Total sementara</dt>
            <dd className="font-medium tabular-nums">{rupiah(subtotal)}</dd>
          </div>
        </dl>
        <button type="submit" disabled={!ready || lines.length === 0} className="btn btn-primary mt-6 w-full">
          <Whatsapp width={18} height={18} /> Kirim Pesanan via WhatsApp
        </button>
        <p className="mt-3 text-center text-xs text-muted">
          Butuh bantuan? Hubungi {site.phone} / {site.whatsappDisplay}
        </p>
      </aside>
    </form>
  );
}
