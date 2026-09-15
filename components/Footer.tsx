import Image from "next/image";
import Link from "next/link";
import { nav, site, waLink } from "@/lib/site";
import { Facebook, Instagram, Tiktok, Whatsapp } from "./Icons";

export default function Footer() {
  const socials = [
    { key: "instagram", href: site.social.instagram, Icon: Instagram, label: "Instagram" },
    { key: "tiktok", href: site.social.tiktok, Icon: Tiktok, label: "TikTok" },
    { key: "facebook", href: site.social.facebook, Icon: Facebook, label: "Facebook" },
  ].filter((s) => s.href);

  const info = [
    site.openingHours ? { title: "Jam buka", lines: [site.openingHours] } : null,
    { title: "Telepon", lines: [site.phone], href: `tel:${site.phone.replace(/\D/g, "")}` },
    { title: "WhatsApp", lines: [site.whatsappDisplay], href: waLink("Halo Nawwaf & Friends, saya mau tanya.") },
    site.address ? { title: "Lokasi", lines: [site.address], href: site.mapsUrl || undefined } : null,
  ].filter((i) => i !== null);

  return (
    <footer className="container-x pb-6 pt-10">
      <div data-reveal className="rounded-[32px] bg-brand-700 px-6 py-12 text-white sm:px-10 lg:px-16 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <Image src="/images/logo.jpg" alt={site.name} width={64} height={64} className="h-16 w-16 rounded-full bg-white object-cover" />
            <p className="display-2 mt-6 max-w-md">
              Cita rasa Arabia, dimasak dengan <span className="text-accent">rempah pilihan.</span>
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <a
                href={waLink("Halo Nawwaf & Friends, saya mau pesan.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm bg-accent text-ink hover:bg-accent-600"
              >
                <Whatsapp width={18} height={18} /> Chat WhatsApp
              </a>
              {socials.map(({ key, href, Icon, label }) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="icon-btn !border-white/25 !bg-transparent !text-white hover:!bg-white hover:!text-brand"
                >
                  <Icon width={18} height={18} />
                </a>
              ))}
            </div>
            {site.socialName && <p className="mt-4 text-sm text-white/65">Sosial media: {site.socialName}</p>}
          </div>

          <div className="grid gap-10 sm:grid-cols-2">
            <dl className="space-y-6">
              {info.map((i) => (
                <div key={i.title}>
                  <dt className="text-sm text-white/65">{i.title}:</dt>
                  {i.lines.map((line) => (
                    <dd key={line} className="mt-1 text-[15px]">
                      {i.href ? (
                        <a href={i.href} target={i.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="hover:text-accent">
                          {line}
                        </a>
                      ) : (
                        line
                      )}
                    </dd>
                  ))}
                </div>
              ))}
            </dl>
            <div>
              <p className="text-sm text-white/65">Halaman:</p>
              <ul className="mt-1 space-y-2">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-[15px] hover:text-accent">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/15 pt-6 text-sm text-white/65 sm:flex-row sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {site.name} · {site.tagline}
          </p>
          <p>Halal · Delivery · Nasi Box · Aqiqah · Service Group</p>
        </div>
      </div>
    </footer>
  );
}
