import type { Metadata } from "next";
import Image from "@/components/SiteImage";
import Link from "next/link";
import { Check, ChevronRight, Clock, Facebook, Instagram, MapPin, Megaphone, Moped, Phone, Threads, Tiktok, Users, Whatsapp } from "@/components/Icons";
import PageTransition from "@/components/PageTransition";
import SuasanaSlider from "@/components/SuasanaSlider";
import { revealDelay } from "@/lib/motion";
import { addressText, site, waLink } from "@/lib/site";
import { rooms, venueGallery } from "@/lib/venue";

// Halaman "link in bio": semua tautan penting dalam satu halaman ringkas,
// untuk dipasang di bio Instagram/Threads. Sengaja tidak masuk nav utama.
export const metadata: Metadata = {
  alternates: { canonical: "/hubungi" },
  title: "Hubungi Kami",
  description: "Semua tautan penting Nawwaf & Friends dalam satu halaman: pesan via WhatsApp, menu, catering, aqiqah, venue, sosial media, dan lokasi.",
};

type QuickLink = { href: string; label: string; note?: string; Icon: typeof Whatsapp; external?: boolean };

const quickLinks: QuickLink[] = [
  { href: "/venue", label: "Reservasi R. Meeting & Kajian", note: "Untuk rapat, kajian, dan kumpul komunitas.", Icon: Users },
  { href: "/hubungi/kolaborasi", label: "Kolaborasi KOL & Influencer", note: "Food review & konten kuliner.", Icon: Megaphone },
  { href: "/hubungi/komunitas", label: "Kolaborasi Komunitas", note: "Gathering & acara komunitas.", Icon: Users },
];

// Kartu menu favorit langsung membuka chat WhatsApp dengan pesan sesuai produk.
const favorites = [
  { waText: "Halo Nawwaf & Friends, saya mau tanya Paket Nampan.", title: "Paket Nampan", text: "Makan bersama keluarga dan teman lebih puas.", cta: "Pesan Paket Nampan", image: "/delivery.webp" },
  { waText: "Halo Nawwaf & Friends, saya mau order Nasi Box Premium.", title: "Nasi Box Premium", text: "Praktis untuk acara kantor, pengajian, dan syukuran.", cta: "Pesan Nasi Box", image: "/Nasi box .webp" },
  { waText: "Halo Nawwaf & Friends, saya mau konsultasi Paket Aqiqah.", title: "Paket Aqiqah", text: "All-in: biaya masak, sertifikat, dan kartu ucapan.", cta: "Tanya Paket Aqiqah", image: "/aqiqah.webp" },
  { waText: "Halo Nawwaf & Friends, saya mau info Kambing Guling.", title: "Kambing Guling", text: "Sajian kambing guling untuk menjamu tamu di acara spesial.", cta: "Pesan Kambing Guling", image: "/kambing-guling.webp" },
];

// Ruang venue + foto suasana outlet, ditampilkan berselang naik-turun.
const venuePhotos = [
  ...rooms.filter((r) => r.enabled).map((r) => ({ image: r.image, caption: r.name })),
  ...venueGallery,
];

// Jam buka versi kartu: label hari & jam dipisah supaya bisa ditata dua baris.
const hours = site.openingHours.map(({ days, opens, closes }) => {
  const id: Record<string, string> = { Monday: "Senin", Tuesday: "Selasa", Wednesday: "Rabu", Thursday: "Kamis", Friday: "Jumat", Saturday: "Sabtu", Sunday: "Minggu" };
  const jam = (t: string) => t.replace(":", ".");
  return {
    days: days.length > 1 ? `${id[days[0]]} – ${id[days[days.length - 1]]}` : id[days[0]],
    time: `${jam(opens)} – ${jam(closes)} WIB`,
  };
});

const tel = `tel:${site.phone.replace(/\D/g, "")}`;

const socials = [
  { Icon: Instagram, label: "Instagram", href: site.social.instagram },
  { Icon: Threads, label: "Threads", href: site.social.threads },
  { Icon: Tiktok, label: "TikTok", href: site.social.tiktok },
  { Icon: Facebook, label: "Facebook", href: site.social.facebook },
  { Icon: Whatsapp, label: "WhatsApp", href: waLink("Halo Nawwaf & Friends!") },
  { Icon: MapPin, label: "Google Maps", href: site.mapsUrl },
  { Icon: Phone, label: "Telepon", href: tel },
].filter((s) => s.href);

export default function HubungiPage() {
  return (
    <PageTransition>
      <div className="container-x overflow-x-clip pb-20 pt-10 sm:pt-14">
        {/* Profil */}
        <header className="mx-auto flex max-w-xl flex-col items-center text-center">
          <Image
            src="/images/logo.webp"
            alt={site.name}
            width={112}
            height={112}
            preload
            className="hero-rise h-20 w-20 rounded-full bg-white object-cover shadow-[0_12px_32px_-12px_rgb(42_16_19/0.35)] ring-4 ring-accent/30 sm:h-24 sm:w-24"
          />
          <h1 className="display-3 hero-rise mt-4 flex items-center gap-1.5 font-semibold [--delay:.06s]">
            {site.name}
            <span title="Terverifikasi" className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand text-white">
              <Check width={13} height={13} strokeWidth={3} />
              <span className="sr-only">Terverifikasi</span>
            </span>
          </h1>
          <p className="hero-rise mt-1 text-sm text-muted [--delay:.12s]">Nasi Mandhi, Kebuli & Sajian Timur Tengah</p>
        </header>

        <div className="mx-auto mt-6 max-w-xl space-y-3">
          {/* Banner pesan antar */}
          <Link href="/menu" data-reveal className="group block rounded-3xl border border-black/10 bg-sand px-5 py-4 transition hover:border-ink">
            <span className="flex flex-wrap items-center gap-1.5">
              <span className="rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-ink">Gratis Ongkir Kota Wisata</span>
              <span className="inline-flex items-center gap-1 rounded-full border border-black/10 bg-white px-2.5 py-0.5 text-[11px] font-medium">
                <Clock width={12} height={12} className="text-brand" /> Sampai dlm 1 Jam
              </span>
            </span>
            <span className="mt-2 block font-semibold">Pesan dari Rumah, Kami Antar.</span>
            <span className="mt-0.5 block text-sm text-muted">Nasi mandhi & kebuli favorit untuk keluarga.</span>
            <span aria-hidden="true" className="mt-3 block border-t border-black/10 pt-2.5">
              <span className="mb-1.5 flex items-center justify-between gap-2 px-1 text-[11px] font-semibold">
                <span className="flex min-w-0 items-center gap-1 text-brand">
                  <Moped width={14} height={14} className="shrink-0" />
                  <span className="truncate">Kurir Siap Antar Cepat & Hangat</span>
                </span>
                <span className="shrink-0 text-brand-700/70">Kota Wisata Cibubur</span>
              </span>
              <span className="relative block h-8 overflow-hidden rounded-xl border border-black/5 bg-white/70">
                <span className="road-dash absolute inset-x-0 bottom-[3px] h-0.5 opacity-75" />
                <span className="motor-ride absolute bottom-0.5 left-0 flex items-center">
                  <span className="motor-bob flex items-center">
                    <span className="mr-0.5 flex items-center">
                      <span className="motor-smoke -mr-0.5 block h-1.5 w-1.5 rounded-full bg-accent/70" />
                      <span className="motor-smoke block h-1 w-1 rounded-full bg-sand-200 [animation-delay:.4s]" />
                    </span>
                    <svg className="h-6 w-7 text-brand-700" viewBox="0 0 32 24" fill="currentColor">
                      <circle cx="7" cy="18" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
                      <circle cx="25" cy="18" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
                      <circle cx="7" cy="18" r="1.2" />
                      <circle cx="25" cy="18" r="1.2" />
                      <path d="M7 18 L10 14 L18 14 L20 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                      <path d="M20 17 L23 11 L26 11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      <rect x="2" y="8.5" width="6" height="6.5" rx="1.2" fill="var(--color-accent)" stroke="currentColor" strokeWidth="1.2" />
                      <path d="M3 11.5 h4" stroke="currentColor" strokeWidth="0.8" />
                      <path d="M11 14 L12 9.5 L17 10 L19 12" fill="var(--color-brand)" stroke="currentColor" strokeWidth="1" />
                      <path d="M17 10 L22 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <ellipse cx="15" cy="5.5" rx="2.5" ry="2.8" stroke="var(--color-brand)" strokeWidth="0.8" />
                      <path d="M15.5 5 Q17.5 5 17 6.5" stroke="var(--color-accent)" strokeWidth="1" strokeLinecap="round" fill="none" />
                      <circle cx="26" cy="10.5" r="0.9" fill="var(--color-accent)" />
                    </svg>
                  </span>
                </span>
              </span>
            </span>
          </Link>

          {/* Tautan utama */}
          <a
            href={waLink("Halo Nawwaf & Friends, saya mau pesan.")}
            target="_blank"
            rel="noopener noreferrer"
            data-reveal
            style={revealDelay(1)}
            className="group flex items-center gap-4 rounded-3xl bg-brand p-5 text-white transition hover:bg-brand-700"
          >
            <span className="flex items-center gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/20">
                <Whatsapp width={22} height={22} />
              </span>
              <span>
                <span className="block font-semibold">Order via WhatsApp</span>
                <span className="mt-0.5 block text-sm text-white/80">Pesan menu favorit, kami antar ke rumah.</span>
              </span>
            </span>
          </a>
          {quickLinks.map(({ href, label, note, Icon, external }, i) => {
            const className =
              "group flex items-center gap-4 rounded-3xl border border-black/10 bg-white p-5 transition hover:border-ink hover:bg-sand";
            const content = (
              <>
                <span className="flex min-w-0 items-center gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sand text-brand transition group-hover:bg-brand group-hover:text-white">
                    <Icon width={20} height={20} />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold">{label}</span>
                    {note && <span className="mt-0.5 block text-sm text-muted">{note}</span>}
                  </span>
                </span>
              </>
            );
            return external ? (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" data-reveal style={revealDelay(i + 2)} className={className}>
                {content}
              </a>
            ) : (
              <Link key={label} href={href} data-reveal style={revealDelay(i + 2)} className={className}>
                {content}
              </Link>
            );
          })}
        </div>

        {/* Menu favorit */}
        <section className="mx-auto mt-12 max-w-5xl">
          <h2 className="display-3 font-semibold">Pilihan Menu Favorit</h2>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {favorites.map(({ waText, title, text, cta, image }, i) => (
              <a
                key={title}
                href={waLink(waText)}
                target="_blank"
                rel="noopener noreferrer"
                data-reveal
                style={revealDelay(i)}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-black/10 bg-white transition hover:border-ink"
              >
                <span className="relative block aspect-[4/3] overflow-hidden bg-sand">
                  <Image
                    src={image}
                    alt={`${title} ${site.name}`}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </span>
                <span className="flex flex-1 flex-col p-4">
                  <span className="font-semibold transition group-hover:text-brand">{title}</span>
                  <span className="mt-1 text-sm text-muted">{text}</span>
                </span>
                <span className="flex items-center justify-between gap-2 border-t border-black/5 px-4 py-3 text-sm font-semibold text-brand">
                  {cta}
                  <ChevronRight width={16} height={16} className="shrink-0 transition group-hover:translate-x-0.5" />
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Suasana resto: slider geser ke samping */}
        <section className="mx-auto mt-14 max-w-5xl">
          <h2 className="display-3 font-semibold">Suasana & Fasilitas Resto</h2>
          <p className="mt-1 text-sm text-muted">Ruang meeting, tempat kajian, outdoor area & ramah anak.</p>
          <SuasanaSlider photos={venuePhotos} alt={site.name} />
        </section>

        {/* Jam buka & lokasi */}
        <section data-reveal className="mx-auto mt-14 max-w-xl rounded-3xl border border-black/10 bg-sand p-5">
          <h2 className="flex items-center gap-2 border-b border-black/10 pb-3 font-semibold">
            <Clock width={18} height={18} className="text-brand" /> Buka Setiap Hari
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {hours.map(({ days, time }) => (
              <div key={days} className="rounded-2xl border border-black/10 bg-white p-3">
                <span className="block text-xs text-muted">{days}</span>
                <span className="mt-0.5 block text-sm font-semibold">{time}</span>
              </div>
            ))}
          </div>
          <div className="relative mt-3 h-40 overflow-hidden rounded-2xl border border-black/10 bg-white">
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(`${site.name}, ${addressText}`)}&output=embed`}
              title={`Peta lokasi ${site.name}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full border-0"
            />
            {site.mapsUrl && (
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full border border-black/10 bg-white/90 px-3 py-1 text-xs font-semibold text-brand shadow-sm backdrop-blur-sm"
              >
                <MapPin width={14} height={14} /> Buka Maps
              </a>
            )}
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white p-3">
            <p className="flex min-w-0 items-start gap-2 text-sm text-muted">
              <MapPin width={16} height={16} className="mt-0.5 shrink-0 text-brand" /> {addressText}
            </p>
            {site.mapsUrl && (
              <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm shrink-0">
                Rute
              </a>
            )}
          </div>
        </section>

        {/* Sosial media */}
        <section className="mx-auto mt-12 max-w-xl text-center">
          <h2 className="text-xs font-medium uppercase tracking-wide text-muted">Ikuti & hubungi kami</h2>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {socials.map(({ Icon, label, href }, i) => (
              <a
                key={label}
                href={href}
                {...(href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
                aria-label={label}
                title={label}
                data-reveal
                style={revealDelay(i, 0.05)}
                className="grid h-12 w-12 place-items-center rounded-full border border-black/10 bg-white text-brand transition hover:border-brand hover:bg-brand hover:text-white"
              >
                <Icon width={22} height={22} />
              </a>
            ))}
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
