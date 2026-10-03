"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import HoneypotField from "@/components/forms/HoneypotField";
import SelectField, { OTHER_OPTION } from "@/components/forms/SelectField";
import TextField from "@/components/forms/TextField";
import { thankYouPath } from "@/lib/forms/thank-you";
import { useApiForm } from "@/lib/forms/useApiForm";
import { ArrowRight } from "./Icons";

const PLATFORMS = ["Instagram", "TikTok", "YouTube", "X / Twitter", OTHER_OPTION];

// Atribut di sini harus tetap sinkron dengan RULES di app/api/kolaborasi/route.ts.
export default function CollaborationForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");

  const { status, errorMessage, isBusy, handleSubmit } = useApiForm("/api/kolaborasi", {
    onSuccess: () => router.push(thankYouPath("kolaborasi-kol")),
    prepare: (formData) => formData.set("username", `@${username}`),
  });

  return (
    <form onSubmit={handleSubmit} className="relative grid gap-5 sm:grid-cols-2">
      <HoneypotField />
      <TextField id="kol-name" name="name" label="Nama lengkap" minLength={3} maxLength={60} autoComplete="name" placeholder="Nama Anda" />
      <TextField id="kol-phone" name="phone" label="No. WhatsApp" type="tel" inputMode="tel" pattern="[0-9+][0-9+\-\s]{7,19}" autoComplete="tel" placeholder="0812 3456 7890" />

      <SelectField
        required
        id="kol-platform"
        name="platform"
        label="Platform utama"
        options={PLATFORMS}
        placeholder="Pilih platform"
        otherPlaceholder="Sebutkan platform lainnya"
        otherMinLength={2}
        otherMaxLength={40}
      />
      <div>
        <label className="label" htmlFor="kol-username">
          Username
        </label>
        <div className="field flex items-center gap-1 focus-within:border-ink focus-within:shadow-[0_0_0_3px_rgb(0_0_0/0.06)]">
          <span className="text-muted">@</span>
          {/* Tanpa `name`: prepare di atas yang mengirimnya lengkap dengan "@". */}
          <input
            required
            id="kol-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value.replace(/^@+/, ""))}
            pattern="[A-Za-z0-9._]{2,30}"
            title="Username tanpa spasi, contoh: nawwaf_friends"
            placeholder="username"
            className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-[#a3a3a3]"
          />
        </div>
      </div>

      {/* Pola versi HTML ditulis dua bentuk huruf karena atribut pattern tidak mengenal flag /i. */}
      <TextField
        id="kol-followers"
        name="followers"
        label="Jumlah follower"
        maxLength={20}
        pattern="[0-9]+([.,][0-9]+)?\s?([kK]|[rR][bB]|[jJ][tT]|[mM])?"
        title="Contoh: 5000, 50k, atau 1.2jt"
        placeholder="contoh: 50k"
      />
      <TextField id="kol-domicile" name="domicile" label="Domisili" minLength={3} maxLength={60} placeholder="Bogor" />

      <TextField
        textarea
        id="kol-message"
        name="message"
        label="Pesan / proposal"
        className="sm:col-span-2"
        minLength={10}
        maxLength={1000}
        placeholder="Ceritakan singkat ide kolaborasi Anda, misalnya review menu, konten reels, atau live..."
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
      </div>
    </form>
  );
}
