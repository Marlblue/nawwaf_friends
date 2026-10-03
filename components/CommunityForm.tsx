"use client";

import { useRouter } from "next/navigation";
import HoneypotField from "@/components/forms/HoneypotField";
import SelectField, { OTHER_OPTION } from "@/components/forms/SelectField";
import TextField from "@/components/forms/TextField";
import { thankYouPath } from "@/lib/forms/thank-you";
import { useApiForm } from "@/lib/forms/useApiForm";
import { ArrowRight } from "./Icons";

const CATEGORIES = [
  "Olahraga & Kesehatan",
  "Bisnis & Profesional",
  "Kreatif & Hobi",
  "Pendidikan",
  "Sosial",
  "Otomotif",
  "Parenting & Keluarga",
  "Keagamaan / Kajian",
  OTHER_OPTION,
];

const COLLAB_TYPES = [
  "Gathering / Meet Up",
  "Event / Aktivitas Komunitas",
  "Workshop / Sharing Session",
  "Buka Bersama / Makan Bersama",
  "Venue Collaboration",
  "Sponsorship / Partnership",
  OTHER_OPTION,
];

// Atribut di sini harus tetap sinkron dengan RULES di app/api/komunitas/route.ts.
export default function CommunityForm() {
  const router = useRouter();
  const { status, errorMessage, isBusy, handleSubmit } = useApiForm("/api/komunitas", {
    onSuccess: () => router.push(thankYouPath("komunitas")),
  });

  return (
    <form onSubmit={handleSubmit} className="relative grid gap-5 sm:grid-cols-2">
      <HoneypotField />
      <TextField id="kom-name" name="communityName" label="Nama komunitas" className="sm:col-span-2" minLength={3} maxLength={80} placeholder="contoh: Cibubur Running Club" />
      <TextField id="kom-social" name="social" label="Instagram / media sosial" minLength={3} maxLength={100} placeholder="@namakomunitas" />
      <TextField id="kom-domicile" name="domicile" label="Domisili komunitas" minLength={3} maxLength={60} placeholder="Bogor" />
      <TextField id="kom-members" name="members" label="Jumlah anggota" type="number" inputMode="numeric" min={1} max={100000} placeholder="contoh: 120" />
      <SelectField
        required
        id="kom-category"
        name="category"
        label="Bidang / kategori komunitas"
        options={CATEGORIES}
        placeholder="Pilih kategori"
        otherPlaceholder="Sebutkan kategori komunitas Anda"
      />
      <TextField id="kom-pic" name="picName" label="Nama PIC" minLength={3} maxLength={60} autoComplete="name" placeholder="Nama penanggung jawab" />
      <TextField id="kom-phone" name="phone" label="No. WhatsApp PIC" type="tel" inputMode="tel" pattern="[0-9+][0-9+\-\s]{7,19}" autoComplete="tel" placeholder="0812 3456 7890" />

      <TextField
        textarea
        rows={3}
        id="kom-activity"
        name="activity"
        label="Rencana kegiatan"
        className="sm:col-span-2"
        minLength={10}
        maxLength={1000}
        placeholder="Kegiatan apa yang ingin diadakan? Misalnya meet up bulanan, kajian, atau nonton bareng..."
      />
      <TextField id="kom-participants" name="participants" label="Perkiraan jumlah peserta" type="number" inputMode="numeric" min={1} max={100000} placeholder="contoh: 40" />
      <TextField id="kom-date" name="eventDate" label="Rencana tanggal kegiatan" type="date" optional />

      <div className="sm:col-span-2">
        <SelectField
          required
          id="kom-collab-type"
          name="collabType"
          label="Bentuk kolaborasi yang diharapkan"
          options={COLLAB_TYPES}
          placeholder="Pilih bentuk kolaborasi"
          otherPlaceholder="Sebutkan bentuk kolaborasi yang diharapkan"
        />
      </div>

      <TextField
        textarea
        id="kom-concept"
        name="concept"
        label="Ceritakan konsep kolaborasi"
        className="sm:col-span-2"
        minLength={10}
        maxLength={1000}
        placeholder="Jelaskan konsep kolaborasi yang Anda bayangkan bersama Nawwaf & Friends..."
      />

      {status === "error" && (
        <p role="alert" className="rounded-2xl bg-brand/10 px-4 py-3 text-sm font-medium text-brand sm:col-span-2">
          {errorMessage}
        </p>
      )}

      <div className="sm:col-span-2">
        <button type="submit" disabled={isBusy} className="btn btn-primary">
          {isBusy ? "Mengirim..." : "Kirim pengajuan"} {!isBusy && <ArrowRight width={18} height={18} />}
        </button>
        {/* Supaya form ini tidak terbaca sebagai jaminan sponsorship untuk setiap komunitas. */}
        <p className="mt-4 max-w-md text-xs leading-relaxed text-muted">
          Setiap pengajuan ditinjau terlebih dahulu oleh tim Nawwaf & Friends. Pengiriman formulir tidak otomatis berarti persetujuan kolaborasi.
        </p>
      </div>
    </form>
  );
}
