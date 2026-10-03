import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Check, Whatsapp } from "@/components/Icons";
import PageTransition from "@/components/PageTransition";
import { waLink } from "@/lib/site";
import { THANK_YOU_CONTENT, THANK_YOU_COOKIE, isThankYouForm } from "@/lib/forms/thank-you";

export const metadata: Metadata = {
  title: "Terima Kasih",
  description: "Isian Anda sudah kami terima.",
  // Hanya berarti setelah submit, jadi jangan muncul di hasil pencarian.
  robots: { index: false, follow: false },
};

// Hanya bisa dilihat setelah form-nya benar-benar tersimpan: cookie penandanya
// dipasang lib/forms/handler.ts, dan yang datang tanpa cookie dilempar balik ke
// form-nya. Karena itu halaman ini dirender per permintaan.
export default async function TerimaKasihPage({ params }: PageProps<"/terima-kasih/[form]">) {
  const { form } = await params;
  if (!isThankYouForm(form)) notFound();

  const { formHref, message } = THANK_YOU_CONTENT[form];
  const cookieStore = await cookies();
  if (cookieStore.get(THANK_YOU_COOKIE)?.value !== "1") redirect(formHref);

  return (
    <PageTransition>
      <section className="container-x pb-20 pt-16 text-center sm:pb-28 sm:pt-24">
        <div className="mx-auto max-w-xl">
          <span className="hero-rise mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand/10 text-brand">
            <Check width={36} height={36} />
          </span>
          <h1 className="display-1 hero-rise mt-6 [--delay:.06s]">Terima kasih!</h1>
          <p className="lead hero-rise mx-auto mt-4 [--delay:.12s]">{message}</p>
          <div className="hero-rise mt-8 flex flex-wrap justify-center gap-3 [--delay:.18s]">
            <Link href="/" className="btn btn-primary">
              Kembali ke beranda
            </Link>
            <a href={waLink("Halo Nawwaf & Friends, saya baru mengirim form kolaborasi.")} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              <Whatsapp width={18} height={18} /> Hubungi via WhatsApp
            </a>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
