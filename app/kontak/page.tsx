import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Facebook, Instagram, MapPin, Phone, Tiktok, Truck, Whatsapp } from "@/components/Icons";
import PageHero from "@/components/PageHero";
import PageTransition from "@/components/PageTransition";
import WhatsAppForm from "@/components/WhatsAppForm";
import { site, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kontak",
  description: "Hubungi Nawwaf & Friends untuk pesan antar, catering, aqiqah, dan booking venue.",
};

export default function KontakPage() {
  const cards = [
    { Icon: Phone, title: "Telepon", value: site.phone, href: `tel:${site.phone.replace(/\D/g, "")}` },
    { Icon: Whatsapp, title: "WhatsApp", value: site.whatsappDisplay, href: waLink("Halo Nawwaf & Friends!") },
    site.address ? { Icon: MapPin, title: "Alamat", value: site.address, href: site.mapsUrl || undefined } : null,
    site.openingHours ? { Icon: Clock, title: "Jam buka", value: site.openingHours } : null,
  ].filter((c) => c !== null);

  const socials = [
    { Icon: Instagram, label: "Instagram", href: site.social.instagram },
    { Icon: Tiktok, label: "TikTok", href: site.social.tiktok },
    { Icon: Facebook, label: "Facebook", href: site.social.facebook },
  ].filter((s) => s.href);

  return (
    <PageTransition>
      <PageHero eyebrow="Kontak" title="Hubungi kami" subtitle="Pertanyaan seputar pesanan, catering, aqiqah, atau venue? Tim kami siap membantu." />

      <div className="container-x pb-20">
        <Link href="/menu" data-reveal className="group mb-6 flex flex-col justify-between gap-5 rounded-[32px] bg-ink p-6 text-cream sm:flex-row sm:items-center sm:p-8">
          <span className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand text-white">
              <Truck width={22} height={22} />
            </span>
            <span>
              <span className="block text-lg font-medium">Mau pesan antar?</span>
              <span className="text-[15px] text-cream/70">Paling cepat lewat halaman menu, pesanan langsung tersusun rapi.</span>
            </span>
          </span>
          <span className="btn btn-primary shrink-0">
            Pesan sekarang <ArrowRight width={18} height={18} className="transition group-hover:translate-x-0.5" />
          </span>
        </Link>

        <div className="grid items-start gap-6 lg:grid-cols-[1fr_1.6fr]">
          <div data-reveal className="card p-6 sm:p-10">
            <dl className="divide-y divide-black/10">
              {cards.map(({ Icon, title, value, href }) => (
                <div key={title} className="flex items-center gap-4 py-5 first:pt-0">
                  <span className="icon-btn pointer-events-none">
                    <Icon width={18} height={18} />
                  </span>
                  <span className="min-w-0">
                    <dt className="text-sm text-muted">{title}:</dt>
                    <dd className="text-lg font-medium">
                      {href ? (
                        <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="hover:underline">
                          {value}
                        </a>
                      ) : (
                        value
                      )}
                    </dd>
                  </span>
                </div>
              ))}
            </dl>

            <div className="border-t border-black/10 pt-5">
              <p className="text-sm text-muted">Sosial media:</p>
              <div className="mt-2 flex items-center gap-2">
                {socials.map(({ Icon, label, href }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="icon-btn">
                    <Icon width={18} height={18} />
                  </a>
                ))}
                <span className="text-lg font-medium">{site.socialName}</span>
              </div>
            </div>

            {site.mapsUrl && (
              <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary mt-6">
                <MapPin width={18} height={18} /> Buka di Google Maps
              </a>
            )}
          </div>

          <div data-reveal className="card p-6 [--reveal-delay:.1s] sm:p-10">
            <h2 className="display-2">Kirim pesan</h2>
            <p className="lead mb-8 mt-3">Pesan akan diteruskan ke WhatsApp admin kami.</p>
            <WhatsAppForm
              title="PESAN DARI WEBSITE - Nawwaf & Friends"
              submitLabel="Kirim via WhatsApp"
              fields={[
                { name: "name", label: "Nama", required: true },
                { name: "phone", label: "No. WhatsApp", type: "tel", required: true, placeholder: "08xxxxxxxxxx" },
                {
                  name: "topic",
                  label: "Keperluan",
                  type: "select",
                  required: true,
                  wide: true,
                  options: ["Delivery order", "Catering", "Aqiqah", "Booking venue", "Kerja sama", "Lainnya"],
                },
                { name: "message", label: "Pesan", type: "textarea", required: true },
              ]}
            />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
