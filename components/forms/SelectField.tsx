"use client";

import { useState } from "react";

/** Opsi yang membuka isian bebas di bawah pilihan. */
export const OTHER_OPTION = "Lainnya";

type Props = {
  id: string;
  name: string;
  label: string;
  options: readonly string[];
  placeholder: string;
  required?: boolean;
  /** Placeholder isian bebas saat "Lainnya" dipilih. */
  otherPlaceholder?: string;
  otherMinLength?: number;
  otherMaxLength?: number;
};

// Saat "Lainnya" dipilih, isian bebasnya yang memakai `name` field ini dan
// select-nya dilepas namanya, jadi server menerima satu nilai saja tanpa perlu
// tahu soal opsi "Lainnya".
export default function SelectField({ id, name, label, options, placeholder, required, otherPlaceholder, otherMinLength = 3, otherMaxLength = 60 }: Props) {
  const [value, setValue] = useState("");
  const isOther = value === OTHER_OPTION && Boolean(otherPlaceholder);

  return (
    <div>
      <label className="label" htmlFor={id}>
        {label}
      </label>
      <select id={id} name={isOther ? undefined : name} required={required} value={value} onChange={(e) => setValue(e.target.value)} className="field">
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      {isOther && (
        <input
          name={name}
          type="text"
          required={required}
          minLength={otherMinLength}
          maxLength={otherMaxLength}
          placeholder={otherPlaceholder}
          aria-label={`${label} (lainnya)`}
          autoFocus
          className="field mt-2"
        />
      )}
    </div>
  );
}
