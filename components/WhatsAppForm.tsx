"use client";

import { useState } from "react";
import { waLink } from "@/lib/site";
import { Check, Whatsapp } from "./Icons";

export type Field = {
  name: string;
  label: string;
  type?: "text" | "tel" | "date" | "time" | "number" | "textarea" | "select";
  options?: string[];
  required?: boolean;
  placeholder?: string;
  wide?: boolean;
  defaultValue?: string;
};

// Form generik yang menyusun isian menjadi pesan WhatsApp ke admin.
export default function WhatsAppForm({ title, fields, submitLabel }: { title: string; fields: Field[]; submitLabel: string }) {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const lines = fields
      .map((f) => [f.label, String(data.get(f.name) ?? "").trim()] as const)
      .filter(([, v]) => v)
      .map(([label, v]) => `*${label}:* ${v}`);
    window.open(waLink([`*${title}*`, "", ...lines].join("\n")), "_blank", "noopener,noreferrer");
    setSent(true);
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      {fields.map((f) => (
        <div key={f.name} className={f.wide || f.type === "textarea" ? "sm:col-span-2" : ""}>
          <label className="label" htmlFor={f.name}>
            {f.label}
            {!f.required && <span className="font-normal text-muted"> (opsional)</span>}
          </label>
          {f.type === "textarea" ? (
            <textarea id={f.name} name={f.name} required={f.required} rows={3} placeholder={f.placeholder} className="field" />
          ) : f.type === "select" ? (
            <select id={f.name} name={f.name} required={f.required} defaultValue={f.defaultValue} className="field">
              {f.options?.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          ) : (
            <input
              id={f.name}
              name={f.name}
              type={f.type ?? "text"}
              required={f.required}
              placeholder={f.placeholder}
              min={f.type === "number" ? 1 : undefined}
              className="field"
            />
          )}
        </div>
      ))}
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button type="submit" className="btn btn-primary">
          <Whatsapp width={18} height={18} /> {submitLabel}
        </button>
        {sent && (
          <span className="inline-flex items-center gap-1 text-sm font-medium text-ink-soft" role="status">
            <Check width={16} height={16} /> WhatsApp dibuka — kirim pesannya ke admin.
          </span>
        )}
      </div>
    </form>
  );
}
