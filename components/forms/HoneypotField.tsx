"use client";

import { useId } from "react";
import { HONEYPOT_FIELD } from "@/lib/forms/validate";

// Input jebakan bot. Disembunyikan di luar layar (bukan display:none, yang lebih
// sering dikenali bot) dan dijauhkan dari keyboard & screen reader.
export default function HoneypotField() {
  const id = useId();
  return (
    <div aria-hidden className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
      <label htmlFor={id}>Jangan isi kolom ini</label>
      <input id={id} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}
