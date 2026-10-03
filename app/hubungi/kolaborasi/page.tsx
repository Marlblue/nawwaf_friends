import type { Metadata } from "next";
import CollaborationForm from "@/components/CollaborationForm";
import PageHero from "@/components/PageHero";
import PageTransition from "@/components/PageTransition";

export const metadata: Metadata = {
  title: "Kolaborasi KOL & Influencer",
  description:
    "Ajukan kolaborasi KOL, influencer, atau content creator bersama Nawwaf & Friends. Isi form proposal dan tim kami akan meninjau pengajuan Anda.",
};

export default function KolaborasiPage() {
  return (
    <PageTransition>
      <PageHero
        eyebrow="Partnership"
        title="Kolaborasi KOL & Influencer"
        subtitle="Untuk content creator, food vlogger, dan influencer yang ingin berkolaborasi bersama Nawwaf & Friends."
      />
      <div className="container-x pb-20">
        <section data-reveal className="card mx-auto max-w-2xl p-6 sm:p-10">
          <h2 className="display-3">Form pengajuan</h2>
          <p className="mb-6 mt-2 text-[15px] text-muted">Lengkapi data di bawah ini, tim kami akan meninjau dan menghubungi Anda lewat WhatsApp.</p>
          <CollaborationForm />
        </section>
      </div>
    </PageTransition>
  );
}
