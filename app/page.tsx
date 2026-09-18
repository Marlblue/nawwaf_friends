import Image from "next/image";
import Link from "next/link";
import HeroBanner from "@/components/HeroBanner";
import GallerySlider from "@/components/GallerySlider";
import { ArrowRight, Bag, Check, MapPin, Truck, Utensils, Whatsapp } from "@/components/Icons";
import PageTransition from "@/components/PageTransition";
import { articles, formatDate } from "@/lib/articles";
import { bestSellers, minPrice } from "@/lib/menu";
import { revealDelay } from "@/lib/motion";
import { services } from "@/lib/services";
import { rupiah, site, waLink } from "@/lib/site";
import { rooms } from "@/lib/venue";

// Kartu layanan di beranda; Dine In cukup tampil sebagai tab di halaman menu
const homeServices = services.filter((s) => s.id !== "dine-in");

const steps = [
  { title: "Pilih menu", text: "Tambah menu favorit dari katalog ke keranjang." },
  { title: "Isi alamat", text: "Lengkapi alamat dan waktu pengantaran." },
  { title: "Kirim via WhatsApp", text: "Pesanan otomatis tersusun rapi ke admin kami." },
  { title: "Pesanan diantar", text: "Admin konfirmasi ongkir, makanan siap diantar." },
];

const qualities = [
  { icon: Check, title: "100% Halal & Thayyib", text: "Penyembelihan syar'i dengan seleksi domba & kambing muda berkualitas tinggi." },
  { icon: Utensils, title: "Rempah Otentik Timur Tengah", text: "Racikan kapulaga, saffron, dan kayu manis pilihan tanpa penyedap berlebih." },
  { icon: Truck, title: "Armada Hantar Berpenghangat", text: "Packaging berinsulasi menjaga nasi mandhi dan daging tetap hangat sampai di meja Anda." },
];

const cateringServices = ["Prasmanan & nasi box", "Arabian snack untuk acara", "Aqiqah all in one package", "Menyembelih & memasak daging aqiqah"];

export default function Home() {
  const latest = articles.slice(0, 3);
  const activeRooms = rooms.filter((r) => r.enabled);

  return (
    <PageTransition>
      {/* Hero */}
      <section className="pb-20 pt-4 sm:pt-6">
        <div className="container-x text-center">
          <HeroBanner>
            <p className="eyebrow hero-rise rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-white backdrop-blur-md">
              <span className="truck-wind text-accent">
                <svg className="truck-wind-lines" width="16" height="20" viewBox="0 0 16 20" aria-hidden="true">
                  <path d="M5 6h10" />
                  <path d="M1 10.5h14" />
                  <path d="M6 15h9" />
                </svg>
                <Truck width={20} height={20} className="truck-drive" />
              </span>{" "}
              Gratis Pengantaran • Area Pilihan
            </p>
            <h1 className="display-1 hero-rise mx-auto mt-5 max-w-4xl text-white [--delay:.06s] [text-shadow:0_2px_16px_rgb(0_0_0/0.35)]">
              Pesanan Diantar <span className="text-accent">Gratis</span> ke Lokasi Anda
            </h1>
            <p className="lead hero-rise mx-auto mt-4 max-w-xl text-white/90 [--delay:.12s]">Berlaku untuk pengantaran ke Kota Wisata, dan Cikeas, dengan minimum pemesanan Rp150.000.</p>
            <div className="hero-rise mt-8 flex flex-wrap justify-center gap-3 [--delay:.18s]">
              <Link href="/menu" className="btn btn-primary">
                Pesan Sekarang <ArrowRight width={18} height={18} />
              </Link>
              <a href={waLink("Halo Nawwaf & Friends, saya mau tanya menu & layanan.")} target="_blank" rel="noopener noreferrer" className="btn border border-white/40 bg-white/15 text-white backdrop-blur-md hover:bg-white hover:text-ink">
                <Whatsapp width={18} height={18} /> Chat WhatsApp
              </a>
            </div>
          </HeroBanner>

          <div className="hero-rise mt-14 flex flex-col justify-between gap-2 border-b border-black/10 pb-4 text-left [--delay:.16s] sm:mt-20 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">Layanan Utama</p>
              <h2 className="mt-1 text-2xl font-bold sm:text-3xl">Pilih Santapan Mewah</h2>
            </div>
            <p className="text-[15px] text-muted">Disesuaikan untuk perayaan hangat keluarga dan korporat</p>
          </div>

          <ul className="mt-8 grid grid-cols-2 gap-3 text-left sm:mt-10 sm:gap-6 lg:grid-cols-4 lg:gap-7">
            {homeServices.map(({ id, title, badge, text, note, image }, i) => {
              return (
                <li key={id} className="hero-rise" style={{ "--delay": `${0.18 + i * 0.06}s` } as React.CSSProperties}>
                  <Link
                    href={`/menu?kategori=${id}`}
                    className="group flex h-full flex-col rounded-[20px] border border-black/10 bg-white p-2.5 transition sm:rounded-[28px] sm:p-5 duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_-10px_rgb(42_16_19/0.12)]"
                  >
                    <span className="relative block aspect-square overflow-hidden rounded-[14px] bg-sand sm:aspect-auto sm:h-56 sm:rounded-[20px]">
                      <Image
                        src={image}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 320px, 45vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                        preload
                      />
                      <span className="absolute right-3 top-3 hidden rounded-full border border-black/10 bg-white/90 px-3 py-1 text-[11px] font-semibold tracking-wide text-brand backdrop-blur-sm sm:inline">
                        {badge}
                      </span>
                    </span>
                    <span className="mt-3 block px-1 text-base font-bold leading-tight transition group-hover:text-brand sm:mt-5 sm:px-0 sm:text-xl">{title}</span>
                    <span className="mt-1 line-clamp-3 flex-1 px-1 text-xs leading-relaxed text-ink-soft sm:mt-1.5 sm:line-clamp-none sm:px-0 sm:text-[13px]">{text}</span>
                    <span className="mt-3 flex items-center justify-between gap-2 border-t border-black/8 px-1 pt-2.5 sm:mt-6 sm:px-0 sm:pt-4">
                      <span className="text-[11px] font-semibold leading-tight text-brand sm:text-xs">{note}</span>
                      <span className="flex size-7 shrink-0 items-center sm:size-9 justify-center rounded-full bg-sand transition group-hover:bg-brand group-hover:text-white">
                        <ArrowRight width={18} height={18} />
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Promo */}
          <div data-reveal className="mt-12 grid items-center gap-6 overflow-hidden rounded-[28px] border border-black/8 bg-sand p-4 text-left sm:mt-16 sm:gap-8 sm:rounded-[32px] shadow-[0_16px_40px_-20px_rgb(42_16_19/0.18)] sm:p-10 lg:grid-cols-[1.35fr_1fr] lg:gap-12 lg:p-12">
            <div className="min-w-0 px-1 pb-2 sm:p-0">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/25 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-brand">
                🔥 Penawaran Spesial Bulan Ini
              </span>
              <h2 className="mt-3 text-[26px] font-bold leading-tight sm:mt-4 sm:text-[42px]">
                Paket Promo Berkah <span className="text-brand">Nampan Sultan</span>
              </h2>
              <div className="mt-4 rounded-2xl border border-black/10 bg-white px-4 py-3 sm:mt-5 sm:inline-block">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-soft">Hemat hingga 25% + gratis ongkos kirim</p>
                <p className="mt-1 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                  <span className="text-xs text-muted line-through">Rp 385.000</span>
                  <span className="text-xl font-bold sm:text-2xl">Mulai Rp 299.000</span>
                  <span className="rounded-full bg-sand px-2 py-0.5 text-[11px] font-medium text-brand">Porsi 5-10 Orang</span>
                </p>
              </div>
              <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:items-center sm:gap-6">
                <a
                  href={waLink("Halo Nawwaf & Friends, saya mau klaim Paket Promo Berkah Nampan Sultan.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary w-full whitespace-normal text-center sm:w-auto sm:self-start"
                >
                  Klaim Promo Nampan Sekarang <ArrowRight width={18} height={18} />
                </a>
                <p className="text-center text-sm text-ink-soft sm:max-w-[240px] sm:text-left">
                  ⚡ <strong className="font-semibold text-ink">Berlaku terbatas</strong> untuk 20 pemesan pertama hari ini.
                </p>
              </div>
            </div>

            <div className="relative order-first aspect-[4/3] overflow-hidden rounded-[20px] sm:rounded-[24px] lg:order-none lg:aspect-[4/3.4] shadow-[0_20px_40px_-16px_rgb(42_16_19/0.35)]">
              <Image src="/images/menu/kebuli-full-kambing.webp" alt="Nampan nasi kebuli kambing" fill sizes="(min-width: 1024px) 520px, 90vw" className="object-cover" />
              <span className="absolute right-3 top-3 rounded-full sm:right-4 sm:top-4 border border-black/10 bg-white/90 px-3 py-1 text-[11px] font-semibold text-brand backdrop-blur-sm">
                ★ Porsi Nampan Akbar
              </span>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4 pt-12 text-white sm:p-5 sm:pt-16">
                <p className="text-xs text-white/85">Sajian Mandhi &amp; Kebuli Autentik</p>
                <p className="text-sm font-bold">Cita Rasa Kerajaan Abu Nawwaf</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Galeri perjamuan & catering */}
      <section className="container-x pb-20 lg:pb-28">
        <div data-reveal className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-sand px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-brand">
            ★ Galeri Perjamuan &amp; Catering Akbar
          </span>
          <h2 className="mt-3 text-2xl font-bold sm:text-3xl">Dokumentasi Santapan &amp; Porsi Besar Siap Antar</h2>
          <p className="mt-2 text-[15px] text-muted">Pengalaman melayani perhelatan akbar, hajatan keluarga, hingga acara korporat.</p>
        </div>
        <div data-reveal className="mt-6 lg:-mt-12">
          <GallerySlider />
        </div>

        <ul data-reveal className="mt-12 grid gap-8 rounded-[32px] border border-black/8 bg-sand p-8 md:grid-cols-3 lg:p-12">
          {qualities.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-black/8 bg-white text-brand shadow-sm">
                <Icon width={22} height={22} />
              </span>
              <span>
                <span className="block text-lg font-bold">{title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-ink-soft">{text}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Menu */}
      <section id="menu" className="container-x section border-t border-black/8">
        <div data-reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h2 className="display-2">Paling banyak dipesan</h2>
            <p className="lead mt-3 max-w-lg">Menu favorit pelanggan. Klik untuk lihat pilihan dan pesan.</p>
          </div>
          <Link href="/menu" className="btn btn-secondary self-start sm:self-auto">
            Semua menu <ArrowRight width={18} height={18} />
          </Link>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
          {bestSellers.map((item, i) => (
            <li key={item.id} data-reveal style={revealDelay(i, 0.08)}>
              <Link
                href={`/menu?q=${encodeURIComponent(item.name)}`}
                className="group flex h-full flex-col rounded-[24px] border border-black/10 bg-white p-2.5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_-10px_rgb(42_16_19/0.12)] sm:p-3"
              >
                <span className="relative block aspect-square overflow-hidden rounded-[18px] bg-sand">
                  {item.image && (
                    <Image src={item.image} alt="" fill sizes="(min-width: 1024px) 420px, 45vw" className="object-cover transition duration-500 group-hover:scale-105" />
                  )}
                  {item.badge && (
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-brand backdrop-blur-sm">{item.badge}</span>
                  )}
                </span>
                <span className="block flex-1 px-1.5 pt-3 sm:px-2 sm:pt-4">
                  <span className="block text-[15px] font-semibold leading-snug transition group-hover:text-brand sm:text-lg">{item.name}</span>
                  {item.description && <span className="mt-1 hidden text-sm text-muted sm:block">{item.description}</span>}
                </span>
                <span className="mt-3 flex items-center justify-between gap-2 border-t border-black/8 px-1.5 pb-1 pt-3 sm:px-2">
                  <span className="text-sm font-semibold text-brand sm:text-base">
                    <span className="text-xs font-normal text-muted">Mulai </span>
                    {rupiah(minPrice(item))}
                  </span>
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sand transition group-hover:bg-brand group-hover:text-white">
                    <ArrowRight width={18} height={18} />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Delivery */}
      <section className="container-x">
        <div data-reveal className="card grid gap-12 p-8 sm:p-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16 lg:p-16">
          <div className="flex flex-col">
            <p className="eyebrow">
              <Truck width={18} height={18} className="text-brand" /> Delivery order
            </p>
            <h2 className="display-2 mt-4">Pesan dari mana saja, tanpa ribet</h2>
            <p className="lead mt-4">
              Semua menu tersedia untuk diantar, dari porsian untuk makan siang sampai nampan untuk acara keluarga.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 lg:mt-auto lg:pt-8">
              <Link href="/menu" className="btn btn-primary">
                Pesan antar sekarang
              </Link>
              {site.gofoodUrl && (
                <a href={site.gofoodUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                  <Bag width={18} height={18} /> Pesan lewat GoFood
                </a>
              )}
              <a href={`tel:${site.phone.replace(/\D/g, "")}`} className="btn btn-secondary">
                {site.phone}
              </a>
            </div>
          </div>
          <ol className="grid gap-px overflow-hidden rounded-[24px] bg-black/10 sm:grid-cols-2">
            {steps.map((s, i) => (
              <li key={s.title} data-reveal style={revealDelay(i, 0.08, 0.2)} className="bg-cream p-6 sm:p-8">
                <span className="text-sm tabular-nums text-muted">0{i + 1}</span>
                <p className="mt-6 text-lg font-medium">{s.title}</p>
                <p className="mt-1 text-[15px] text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Venue */}
      {activeRooms.length > 0 && (
        <section className="container-x section">
          <div data-reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <h2 className="display-2">Venue & ruang acara</h2>
              <p className="lead mt-3 max-w-lg">Butuh tempat untuk meeting atau makan bersama keluarga? Sewa ruang sekaligus pesan menu.</p>
            </div>
            <Link href="/venue" className="btn btn-secondary self-start sm:self-auto">
              Lihat venue <ArrowRight width={18} height={18} />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-6">
            {activeRooms.map((room, i) => (
              <Link key={room.id} href={`/venue#${room.id}`} data-reveal style={revealDelay(i, 0.12)} className="group block">
                <div className="media aspect-[4/3] max-sm:!rounded-[18px] sm:aspect-[16/10]">
                  <Image src={room.image} alt="" fill sizes="50vw" className="object-cover transition duration-700 group-hover:scale-[1.04]" />
                  <span className="absolute left-2 top-2 rounded-full bg-cream px-2.5 py-1 text-[11px] font-medium sm:left-4 sm:top-4 sm:px-3 sm:text-xs">{room.tag}</span>
                </div>
                <h3 className="mt-3 text-base font-medium leading-snug group-hover:underline sm:mt-4 sm:text-2xl">{room.name}</h3>
                <p className="mt-1 line-clamp-3 max-w-lg text-xs text-muted sm:line-clamp-none sm:text-[15px]">{room.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Artikel */}
      <section className={`container-x section ${activeRooms.length > 0 ? "border-t border-black/8" : ""}`}>
        <div data-reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <h2 className="display-2">Artikel terbaru</h2>
          <Link href="/artikel" className="btn btn-secondary self-start sm:self-auto">
            Semua artikel <ArrowRight width={18} height={18} />
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-6 lg:grid-cols-3">
          {latest.map((a, i) => (
            <Link key={a.slug} href={`/artikel/${a.slug}`} data-reveal style={revealDelay(i, 0.1)} className={`group block ${i === 2 ? "hidden lg:block" : ""}`}>
              <div className="media aspect-[4/3] max-sm:!rounded-[18px]">
                <Image src={a.image} alt="" fill sizes="(min-width: 1024px) 33vw, 50vw" className="object-cover transition duration-700 group-hover:scale-[1.04]" />
              </div>
              <p className="mt-3 text-xs text-muted sm:mt-4 sm:text-sm">{formatDate(a.date)}</p>
              <h3 className="mt-1 line-clamp-3 text-sm font-medium leading-snug group-hover:underline sm:line-clamp-none sm:text-lg">{a.title}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Tentang kami + catering & aqiqah */}
      <section className="container-x pb-20">
        <div data-reveal className="card grid items-center gap-10 overflow-hidden p-6 sm:p-10 lg:grid-cols-2 lg:gap-16 lg:p-12">
          <div className="grid grid-cols-2 gap-4 lg:order-2">
            <div className="media aspect-[3/4] !rounded-[24px]">
              <Image src="/images/menu/kebuli-full-kambing.webp" alt="Nampan nasi kebuli kambing" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
            </div>
            <div className="media mt-12 aspect-[3/4] !rounded-[24px]">
              <Image src="/images/menu/sambosa.webp" alt="Sambosa, arabian snack" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
            </div>
          </div>
          <div className="lg:py-4">
            <Image src="/images/logo.webp" alt="" width={56} height={56} className="h-14 w-14 rounded-full object-cover" />
            <h2 className="display-2 mt-6">Tentang kami</h2>
            <p className="lead mt-4">
              {site.name} menghadirkan hidangan {site.tagline.toLowerCase()}: nasi mandhi dan nasi kebuli yang dimasak dengan rempah pilihan, ayam dan kambing yang empuk, serta minuman khas seperti arabian tea dan teh adeni.
            </p>
            <p className="mt-6 text-sm text-muted">Catering & aqiqah:</p>
            <ul className="mt-2 grid gap-2 sm:grid-cols-2">
              {cateringServices.map((t) => (
                <li key={t} className="flex items-start gap-2 text-[15px]">
                  <Check width={18} height={18} className="mt-0.5 shrink-0 text-brand" /> {t}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={waLink("Halo Nawwaf & Friends, saya mau tanya paket catering / aqiqah.")} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                <Whatsapp width={18} height={18} /> Tanya catering
              </a>
              <Link href="/kontak" className="btn btn-secondary">
                Hubungi kami
              </Link>
              {site.mapsUrl && (
                <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                  <MapPin width={18} height={18} /> Lihat lokasi
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
