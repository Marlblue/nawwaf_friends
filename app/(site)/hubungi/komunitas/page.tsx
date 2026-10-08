import type { Metadata } from "next";
import CommunityForm from "@/components/CommunityForm";
import PageHero from "@/components/PageHero";
import PageTransition from "@/components/PageTransition";

export const metadata: Metadata = {
  title: "Kolaborasi Komunitas",
  description:
    "Ajukan kolaborasi komunitas bersama Nawwaf & Friends: gathering, kajian, workshop, hingga makan bersama. Ceritakan profil komunitas dan rencana kegiatan Anda.",
};

export default function KomunitasPage() {
  return (
    <PageTransition>
      <PageHero
        eyebrow="Community Partnership"
        title="Kolaborasi Komunitas"
        subtitle="Gathering, kajian, workshop, hingga makan bersama komunitas di Nawwaf & Friends."
      />
      <div className="container-x pb-20">
        <section data-reveal className="card mx-auto max-w-2xl p-6 sm:p-10">
          <h2 className="display-3">Form pengajuan</h2>
          <p className="mb-6 mt-2 text-[15px] text-muted">Ceritakan profil komunitas dan rencana kegiatan Anda, tim kami akan meninjau setiap pengajuan.</p>
          <CommunityForm />
        </section>
      </div>
    </PageTransition>
  );
}
