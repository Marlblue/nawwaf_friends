import Image from "next/image";
import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import { ArrowRight, Bag, Check, MapPin, Truck, Whatsapp } from "@/components/Icons";
import MenuItemRow from "@/components/MenuItemRow";
import PageTransition from "@/components/PageTransition";
import { articles, formatDate } from "@/lib/articles";
import { bestSellers, mediumImage } from "@/lib/menu";
import { revealDelay } from "@/lib/motion";
import { site, waLink } from "@/lib/site";
import { rooms } from "@/lib/venue";

const favorites = [
  { title: "Porsian", note: "Satu piring untuk sendiri", href: "/menu?kategori=porsian", image: "/images/menu/nasi-kebuli-ayam.webp" },
  { title: "Nampan", note: "Makan bersama ala Timur Tengah", href: "/menu?kategori=nampan-kambing", image: "/images/menu/mandhi-half-kambing.webp" },
  { title: "Mix Best Seller", note: "Mandhi + kebuli dalam satu nampan", href: "/menu?kategori=mix", image: "/images/menu/mix-half.webp" },
];

// Layanan utama, tampil di hero supaya pengunjung langsung tahu apa yang bisa dipesan
// Foto sementara diambil dari menu; ganti dengan foto asli nasi box / aqiqah / prasmanan kalau sudah ada
const services = [
  { title: "Delivery", text: "Pesan antar menu favorit ke rumah", href: "/menu", image: "/images/menu/nasi-mandhi-ayam.webp" },
  { title: "Nasi Box", text: "Untuk kantor, pengajian & acara", href: waLink("Halo Nawwaf & Friends, saya mau pesan nasi box."), image: "/images/menu/nasi-kebuli-ayam.webp" },
  { title: "Aqiqah", text: "Paket lengkap, sembelih sampai masak", href: waLink("Halo Nawwaf & Friends, saya mau tanya paket aqiqah."), image: "/images/menu/mandhi-full-kambing.webp" },
  { title: "Service Group", text: "Prasmanan & nampan untuk rombongan", href: waLink("Halo Nawwaf & Friends, saya mau tanya paket rombongan / prasmanan."), image: "/images/menu/mix-full.webp" },
];

const steps = [
  { title: "Pilih menu", text: "Tambah menu favorit dari katalog ke keranjang." },
  { title: "Isi alamat", text: "Lengkapi alamat dan waktu pengantaran." },
  { title: "Kirim via WhatsApp", text: "Pesanan otomatis tersusun rapi ke admin kami." },
  { title: "Pesanan diantar", text: "Admin konfirmasi ongkir, makanan siap diantar." },
];

const cateringServices = ["Prasmanan & nasi box", "Arabian snack untuk acara", "Aqiqah all in one package", "Menyembelih & memasak daging aqiqah"];

export default function Home() {
  const latest = articles.slice(0, 3);
  const activeRooms = rooms.filter((r) => r.enabled);
  const half = Math.ceil(bestSellers.length / 2);

  return (
    <PageTransition>
      {/* Hero */}
      <section className="pb-20 pt-10 sm:pt-16">
        <div className="container-x text-center">
          <p className="eyebrow hero-rise">
            <span className="truck-wind text-brand">
              <svg className="truck-wind-lines" width="16" height="20" viewBox="0 0 16 20" aria-hidden="true">
                <path d="M5 6h10" />
                <path d="M1 10.5h14" />
                <path d="M6 15h9" />
              </svg>
              <Truck width={20} height={20} className="truck-drive" />
            </span>{" "}
            {site.tagline} · 100% halal
          </p>
          <h1 className="display-1 hero-rise mx-auto mt-4 max-w-4xl [--delay:.06s]">
            Aqiqah, nasi box &amp; <span className="text-brand">delivery</span> masakan Arab
          </h1>
          <p className="lead hero-rise mx-auto mt-4 max-w-xl [--delay:.12s]">Nasi mandhi, kebuli &amp; nampan kambing. Pilih layanan yang kamu butuhkan:</p>

          <ul className="mx-auto mt-8 grid max-w-5xl grid-cols-2 gap-3 text-left sm:gap-4 lg:grid-cols-4">
            {services.map(({ title, text, href, image }, i) => {
              const external = href.startsWith("http");
              return (
                <li key={title} className="hero-rise" style={{ "--delay": `${0.18 + i * 0.06}s` } as React.CSSProperties}>
                  <a
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="group flex h-full flex-col rounded-[24px] border border-black/10 bg-white p-2 transition hover:-translate-y-0.5 hover:border-brand hover:shadow-[0_12px_32px_rgb(123_17_27/0.12)]"
                  >
                    <span className="relative block aspect-[4/3] overflow-hidden rounded-[18px] bg-sand">
                      <Image
                        src={mediumImage(image)}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 240px, 45vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                        priority
                      />
                    </span>
                    <span className="block px-2 pb-2 pt-3 sm:px-3">
                      <span className="block text-[17px] font-semibold leading-tight transition group-hover:text-brand sm:text-lg">{title}</span>
                      <span className="mt-1 block text-sm leading-snug text-muted">{text}</span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="mx-auto mt-12 w-full sm:mt-16 min-[810px]:w-[min(90vw,1400px)]">
          <HeroSlider />
        </div>
      </section>

      {/* Menu */}
      <section id="menu" className="container-x section border-t border-black/8">
        <div data-reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h2 className="display-2">Paling banyak dipesan</h2>
            <p className="lead mt-3 max-w-lg">Tambah langsung ke keranjang, lalu checkout untuk pesan antar.</p>
          </div>
          <Link href="/menu" className="btn btn-secondary self-start sm:self-auto">
            Semua menu <ArrowRight width={18} height={18} />
          </Link>
        </div>

        <div className="mt-10 grid gap-x-16 lg:grid-cols-2">
          {[bestSellers.slice(0, half), bestSellers.slice(half)].map((col, i) => (
            <div key={i} data-reveal style={revealDelay(i, 0.12)} className={`divide-y divide-black/10 border-b border-black/10 ${i === 0 ? "border-t" : "lg:border-t"}`}>
              {col.map((item) => (
                <MenuItemRow key={item.id} item={item} />
              ))}
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-3 sm:gap-6">
          {favorites.map((f, i) => (
            <Link key={f.title} href={f.href} data-reveal style={revealDelay(i, 0.1)} className="group block">
              <div className="media aspect-[4/3] sm:aspect-[4/5]">
                <Image src={f.image} alt="" fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover transition duration-700 group-hover:scale-[1.04]" />
              </div>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="display-3">{f.title}</h3>
                  <p className="text-[15px] text-muted">{f.note}</p>
                </div>
                <span className="icon-btn group-hover:border-ink group-hover:bg-ink group-hover:text-cream">
                  <ArrowRight width={18} height={18} />
                </span>
              </div>
            </Link>
          ))}
        </div>
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
          <div className="mt-10 grid gap-8 md:grid-cols-2 md:gap-6">
            {activeRooms.map((room, i) => (
              <Link key={room.id} href={`/venue#${room.id}`} data-reveal style={revealDelay(i, 0.12)} className="group block">
                <div className="media aspect-[16/10]">
                  <Image src={room.image} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-[1.04]" />
                  <span className="absolute left-4 top-4 rounded-full bg-cream px-3 py-1 text-xs font-medium">{room.tag}</span>
                </div>
                <h3 className="display-3 mt-4 group-hover:underline">{room.name}</h3>
                <p className="mt-1 max-w-lg text-[15px] text-muted">{room.summary}</p>
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
        <div className="mt-10 grid gap-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {latest.map((a, i) => (
            <Link key={a.slug} href={`/artikel/${a.slug}`} data-reveal style={revealDelay(i, 0.1)} className={`group block ${i === 2 ? "sm:hidden lg:block" : ""}`}>
              <div className="media aspect-[4/3]">
                <Image src={a.image} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-[1.04]" />
              </div>
              <p className="mt-4 text-sm text-muted">{formatDate(a.date)}</p>
              <h3 className="mt-1 text-lg font-medium leading-snug group-hover:underline">{a.title}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Tentang kami + catering & aqiqah */}
      <section className="container-x pb-20">
        <div data-reveal className="card grid items-center gap-10 overflow-hidden p-6 sm:p-10 lg:grid-cols-2 lg:gap-16 lg:p-12">
          <div className="grid grid-cols-2 gap-4 lg:order-2">
            <div className="media aspect-[3/4] !rounded-[24px]">
              <Image src="/images/menu/mandhi-full-kambing.webp" alt="Nampan nasi mandhi kambing" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
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
