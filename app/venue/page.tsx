import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check, Users } from "@/components/Icons";
import PageHero from "@/components/PageHero";
import PageTransition from "@/components/PageTransition";
import WhatsAppForm from "@/components/WhatsAppForm";
import { revealDelay } from "@/lib/motion";
import { rooms, venuePackages } from "@/lib/venue";

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

      <div className="container-x">
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
                <a href="#booking" className="btn btn-primary mt-8">
                  Booking {room.name}
                </a>
              </div>
            </article>
          ))}
        </div>

        <section className="section">
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

        <section id="booking" className="scroll-mt-28 pb-20">
          <div data-reveal className="card grid gap-10 p-6 sm:p-10 lg:grid-cols-[1fr_2fr] lg:gap-16 lg:p-16">
            <div>
              <h2 className="display-2">Booking venue</h2>
              <p className="lead mt-4">Isi form, admin kami akan mengonfirmasi ketersediaan ruang dan harga lewat WhatsApp.</p>
            </div>
            <WhatsAppForm
              title="BOOKING VENUE - Nawwaf & Friends"
              submitLabel="Kirim booking via WhatsApp"
              fields={[
                { name: "name", label: "Nama", required: true },
                { name: "phone", label: "No. WhatsApp", type: "tel", required: true, placeholder: "08xxxxxxxxxx" },
                { name: "room", label: "Ruang", type: "select", required: true, options: activeRooms.map((r) => r.name) },
                { name: "package", label: "Paket", type: "select", required: true, options: venuePackages.map((p) => p.name) },
                { name: "date", label: "Tanggal", type: "date", required: true },
                { name: "time", label: "Jam mulai", type: "time", required: true },
                { name: "duration", label: "Durasi", type: "select", options: ["1-2 jam", "2-4 jam", "Setengah hari", "Seharian"] },
                { name: "guests", label: "Jumlah tamu", type: "number", required: true },
                { name: "notes", label: "Kebutuhan / catatan", type: "textarea", placeholder: "mis. butuh proyektor, menu nampan kambing 2 porsi" },
              ]}
            />
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
