import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bag, Clock, Facebook, Instagram, MapPin, Megaphone, Phone, Threads, Tiktok, Truck, Users, Whatsapp } from "@/components/Icons";
import PageTransition from "@/components/PageTransition";
import { revealDelay } from "@/lib/motion";
import { addressText, openingHoursLines, site, waLink } from "@/lib/site";

// Halaman "link in bio": semua tautan penting dalam satu halaman ringkas,
// untuk dipasang di bio Instagram/Threads. Sengaja tidak masuk nav utama.
export const metadata: Metadata = {
  title: "Hubungi Kami",
  description: "Semua tautan penting Nawwaf & Friends dalam satu halaman: pesan via WhatsApp, menu, GoFood, catering, aqiqah, venue, sosial media, dan lokasi.",
};

type QuickLink = { href: string; label: string; note?: string; Icon: typeof Whatsapp; external?: boolean };

const quickLinks: QuickLink[] = [
  { href: "/menu", label: "Pesan antar dari menu", note: "Pilih menu, pesanan langsung tersusun ke WhatsApp admin.", Icon: Truck },
  site.gofoodUrl ? { href: site.gofoodUrl, label: "Pesan lewat GoFood", Icon: Bag, external: true } : null,
  { href: "/venue", label: "Booking ruang meeting & venue", Icon: Users },
  { href: "/hubungi/kolaborasi", label: "Kolaborasi KOL & influencer", note: "Untuk content creator & food vlogger.", Icon: Megaphone },
  { href: "/hubungi/komunitas", label: "Kolaborasi komunitas", note: "Gathering, kajian, workshop & makan bersama.", Icon: Users },
].filter((l) => l !== null);

const intents = [
  { href: "/menu", title: "Menu", text: "Nasi mandhi, kebuli & nampan favorit.", cta: "Lihat Menu", image: "/images/menu/nasi-mandhi-kambing.webp" },
  { href: "/menu?kategori=nasi-box", title: "Nasi Box", text: "Untuk rapat kantor & syukuran.", cta: "Lihat Paket", image: "/images/menu/nasi-kebuli-ayam.webp" },
  { href: "/menu?kategori=aqiqah", title: "Aqiqah", text: "Syar'i, lengkap siap saji.", cta: "Lihat Paket", image: "/images/menu/mandhi-full-kambing.webp" },
  { href: "/venue", title: "Venue", text: "Ruang meeting & private room.", cta: "Reservasi", image: "/images/menu/mix-full.webp" },
];

const socials = [
  { Icon: Instagram, label: "Instagram", href: site.social.instagram },
  { Icon: Threads, label: "Threads", href: site.social.threads },
  { Icon: Tiktok, label: "TikTok", href: site.social.tiktok },
  { Icon: Facebook, label: "Facebook", href: site.social.facebook },
  { Icon: Whatsapp, label: "WhatsApp", href: waLink("Halo Nawwaf & Friends!") },
  { Icon: Bag, label: "GoFood", href: site.gofoodUrl },
].filter((s) => s.href);

export default function HubungiPage() {
  return (
    <PageTransition>
      <div className="container-x pb-20 pt-10 sm:pt-14">
        {/* Profil */}
        <header className="mx-auto flex max-w-xl flex-col items-center text-center">
          <Image
            src="/images/logo.webp"
            alt={site.name}
            width={112}
            height={112}
            preload
            className="hero-rise h-24 w-24 rounded-full bg-white object-cover shadow-[0_12px_32px_-12px_rgb(42_16_19/0.35)] sm:h-28 sm:w-28"
          />
          <h1 className="display-2 hero-rise mt-5 [--delay:.06s]">{site.name}</h1>
          <p className="lead hero-rise mt-2 max-w-sm [--delay:.12s]">{site.tagline}: nasi mandhi, kebuli & nampan kambing khas Timur Tengah.</p>
          {openingHoursLines.length > 0 && (
            <div className="hero-rise mt-4 flex flex-wrap justify-center gap-2 [--delay:.18s]">
              {openingHoursLines.map((line) => (
                <span key={line} className="eyebrow rounded-full border border-black/10 bg-sand px-3 py-1 text-xs sm:text-sm">
                  <Clock width={14} height={14} className="text-brand" /> {line}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Tautan utama */}
        <section className="mx-auto mt-8 max-w-xl space-y-3">
          <a
            href={waLink("Halo Nawwaf & Friends, saya mau pesan.")}
            target="_blank"
            rel="noopener noreferrer"
            data-reveal
            className="group flex items-center justify-between gap-4 rounded-3xl bg-brand p-5 text-white transition hover:bg-brand-700"
          >
            <span className="flex items-center gap-4">
              <Whatsapp width={22} height={22} />
              <span className="font-medium">Pesan via WhatsApp</span>
            </span>
            <ArrowRight width={18} height={18} className="transition group-hover:translate-x-0.5" />
          </a>
          {quickLinks.map(({ href, label, note, Icon, external }, i) => {
            const className =
              "group flex items-center justify-between gap-4 rounded-3xl border border-black/10 bg-sand p-5 transition hover:border-ink";
            const content = (
              <>
                <span className="flex min-w-0 items-center gap-4">
                  <Icon width={22} height={22} className="shrink-0 text-brand" />
                  <span className="min-w-0">
                    <span className="block font-medium">{label}</span>
                    {note && <span className="mt-0.5 block text-sm text-muted">{note}</span>}
                  </span>
                </span>
                <ArrowRight width={18} height={18} className="shrink-0 transition group-hover:translate-x-0.5" />
              </>
            );
            return external ? (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" data-reveal style={revealDelay(i + 1)} className={className}>
                {content}
              </a>
            ) : (
              <Link key={label} href={href} data-reveal style={revealDelay(i + 1)} className={className}>
                {content}
              </Link>
            );
          })}
        </section>

        {/* Layanan */}
        <section className="mx-auto mt-12 max-w-5xl">
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
            {intents.map(({ href, title, text, cta, image }, i) => (
              <Link key={title} href={href} data-reveal style={revealDelay(i)} className="group flex h-full flex-col">
                <span className="media block aspect-square">
                  <Image
                    src={image}
                    alt={`${title} ${site.name}`}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </span>
                <span className="mt-4 text-lg font-medium">{title}</span>
                <span className="mb-4 mt-1 flex-1 text-sm text-muted">{text}</span>
                <span className="btn btn-secondary btn-sm self-start group-hover:border-ink group-hover:bg-sand">{cta}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Sosial media */}
        <section className="mx-auto mt-14 max-w-xl">
          <h2 className="text-center text-sm font-medium text-muted">Ikuti & hubungi kami {site.socialName && `di ${site.socialName}`}</h2>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {socials.map(({ Icon, label, href }, i) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                data-reveal
                style={revealDelay(i, 0.05)}
                className="group flex flex-col items-center justify-center gap-2 rounded-3xl border border-black/10 bg-sand p-5 transition hover:border-ink"
              >
                <Icon width={26} height={26} className="text-brand transition group-hover:scale-110" />
                <span className="text-xs font-medium sm:text-sm">{label}</span>
              </a>
            ))}
          </div>
        </section>

        {/* Lokasi */}
        <section data-reveal className="card mx-auto mt-14 max-w-5xl p-6 sm:p-10">
          <h2 className="display-3">Kunjungi kami</h2>
          <dl className="mt-5 grid gap-5 sm:grid-cols-3">
            {addressText && (
              <div>
                <dt className="text-sm text-muted">Alamat:</dt>
                <dd className="mt-1 text-[15px] font-medium">{addressText}</dd>
              </div>
            )}
            {openingHoursLines.length > 0 && (
              <div>
                <dt className="text-sm text-muted">Jam buka:</dt>
                {openingHoursLines.map((line) => (
                  <dd key={line} className="mt-1 text-[15px] font-medium">
                    {line}
                  </dd>
                ))}
              </div>
            )}
            <div>
              <dt className="text-sm text-muted">Telepon:</dt>
              <dd className="mt-1 text-[15px] font-medium">
                <a href={`tel:${site.phone.replace(/\D/g, "")}`} className="hover:underline">
                  {site.phone}
                </a>
              </dd>
            </div>
          </dl>
          <div className="mt-6 flex flex-wrap gap-3">
            {site.mapsUrl && (
              <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                <MapPin width={18} height={18} /> Petunjuk arah
              </a>
            )}
            <a href={`tel:${site.phone.replace(/\D/g, "")}`} className="btn btn-secondary">
              <Phone width={18} height={18} /> Telepon
            </a>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
