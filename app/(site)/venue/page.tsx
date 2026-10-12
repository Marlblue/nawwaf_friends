import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check, Users } from "@/components/Icons";
import PageHero from "@/components/PageHero";
import PageTransition from "@/components/PageTransition";
import { revealDelay } from "@/lib/motion";
import { waLink } from "@/lib/site";
import { rooms, venueGallery, venuePackages } from "@/lib/venue";

export const metadata: Metadata = {
  title: "Venue - Ruang Meeting & Private Room",
  description: "Sewa ruang meeting dan private room di Nawwaf & Friends, lengkap dengan hidangan Arabian food.",
};

export default function VenuePage() {
  const activeRooms = rooms.filter((r) => r.enabled);

  return (
    <PageTransition>
      <PageHero
        eyebrow="Katalog venue"
        title="Venue & ruang acara"
        subtitle="Ruang meeting dan private room untuk rapat, keluarga, maupun acara spesial, lengkap dengan menu khas Timur Tengah."
      />

      <div className="container-x overflow-x-clip">
        <div className="space-y-20 lg:space-y-28">
          {activeRooms.map((room, i) => (
            <article key={room.id} id={room.id} data-reveal className="grid scroll-mt-28 items-center gap-8 md:grid-cols-2 lg:gap-16">
              <div className={`media aspect-[4/3] ${i % 2 ? "md:order-2" : ""}`}>
                <Image src={room.image} alt={room.name} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                <span className="absolute left-4 top-4 rounded-full bg-cream px-3 py-1 text-xs font-medium">{room.tag}</span>
              </div>
              <div>
                <h2 className="display-2">{room.name}</h2>
                <p className="lead mt-4">{room.summary}</p>
                <p className="mt-5 inline-flex items-center gap-2 text-[15px]">
                  <Users width={18} height={18} className="text-brand" /> Kapasitas: <span className="font-medium">{room.capacity}</span>
                </p>
                <div className="mt-6 grid gap-6 border-t border-black/10 pt-6 sm:grid-cols-2">
                  <div>
                    <h3 className="text-sm text-muted">Fasilitas:</h3>
                    <ul className="mt-2 space-y-2 text-[15px]">
                      {room.facilities.map((f) => (
                        <li key={f} className="flex items-start gap-2">
                          <Check width={18} height={18} className="mt-0.5 shrink-0 text-brand" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted">Cocok untuk:</h3>
                    <ul className="mt-2 space-y-2 text-[15px]">
                      {room.idealFor.map((f) => (
                        <li key={f} className="flex items-start gap-2">
                          <Check width={18} height={18} className="mt-0.5 shrink-0 text-brand" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <a href={waLink(`Halo Nawwaf & Friends, saya mau booking ${room.name}.`)} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-8">
                  Booking {room.name}
                </a>
              </div>
            </article>
          ))}
        </div>

        <section className="section">
          <h2 data-reveal className="display-2 text-center">Galeri</h2>
          <p data-reveal className="lead mx-auto mt-3 max-w-lg text-center">Suasana outlet dan fasilitas pendukung untuk tamu dan keluarga.</p>
          {/* Kartu foto tinggi berselang naik-turun: kartu genap turun sedikit.
              HP & tablet: digeser ke samping; desktop: lima kolom sejajar. */}
          <div
            data-reveal
            className="no-scrollbar -mx-5 mt-10 flex snap-x snap-mandatory items-start gap-4 overflow-x-auto overscroll-x-contain scroll-px-5 px-5 pb-2 md:-mx-10 md:scroll-px-10 md:gap-6 md:px-10 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0 lg:pb-0"
          >
            {venueGallery.map((g, i) => (
              <figure key={g.image} className={`w-[62%] shrink-0 snap-start sm:w-[40%] md:w-[30%] lg:w-auto ${i % 2 === 1 ? "mt-12" : ""}`}>
                <div className="media aspect-[4/5] !rounded-2xl">
                  <Image src={g.image} alt={g.caption} fill sizes="(min-width: 1024px) 20vw, (min-width: 640px) 40vw, 62vw" className="object-cover" />
                </div>
                <figcaption className="mt-4 text-base font-semibold text-brand sm:text-lg">{g.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="section !pt-0">
          <h2 data-reveal className="display-2 text-center">Pilihan paket</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3 md:gap-6">
            {venuePackages.map((p, i) => (
              <div key={p.name} data-reveal style={revealDelay(i, 0.1)} className="card p-8">
                <span className="text-sm tabular-nums text-muted">0{i + 1}</span>
                <h3 className="display-3 mt-8">{p.name}</h3>
                <p className="mt-2 text-[15px] text-muted">{p.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-[15px] text-muted">
            Harga sewa menyesuaikan durasi dan jumlah tamu. Lihat pilihan menu di{" "}
            <Link href="/menu" className="font-medium text-ink underline underline-offset-4">
              katalog produk
            </Link>
            .
          </p>
        </section>
      </div>
    </PageTransition>
  );
}
