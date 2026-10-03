"use client";

import { useRef, useState, type FormEvent } from "react";
import { SUBMISSION_ID_FIELD, newSubmissionId } from "./submission-id";

type Status = "idle" | "loading" | "submitted" | "error";

type Options = {
  /** Merapikan FormData sebelum dikirim, mis. menukar pilihan "Lainnya" dengan isian bebasnya. */
  prepare?: (formData: FormData) => void;
  /** Dijalankan hanya setelah server mengonfirmasi datanya tersimpan. */
  onSuccess?: () => void;
};

const FALLBACK_ERROR = "Gagal mengirim form. Silakan coba lagi.";

/**
 * Alur submit ke route handler di app/api: tombol nonaktif selama mengirim dan
 * setelah berhasil (form masih terlihat sesaat sebelum pindah ke halaman terima
 * kasih), pesan dari server menang atas kalimat cadangan.
 */
export function useApiForm(endpoint: string, { prepare, onSuccess }: Options = {}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState(FALLBACK_ERROR);
  // Penanda yang sama dipakai ulang di tiap percobaan sampai ada yang berhasil.
  const submissionId = useRef<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");

    const formData = new FormData(event.currentTarget);
    prepare?.(formData);
    submissionId.current ??= newSubmissionId();
    formData.set(SUBMISSION_ID_FIELD, submissionId.current);

    try {
      const response = await fetch(endpoint, { method: "POST", body: formData });
      const result = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!response.ok || !result?.ok) {
        setErrorMessage(result?.error ?? FALLBACK_ERROR);
        setStatus("error");
        return;
      }
    } catch {
      setErrorMessage(FALLBACK_ERROR);
      setStatus("error");
      return;
    }

    submissionId.current = null;
    setStatus("submitted");
    onSuccess?.();
  };

  return { status, errorMessage, isBusy: status === "loading" || status === "submitted", handleSubmit };
}
