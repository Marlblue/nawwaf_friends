import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  name: string;
  label: string;
  /** Tanpa ini isiannya wajib. */
  optional?: boolean;
  textarea?: boolean;
  rows?: number;
};

// Label + input/textarea dengan gaya .label/.field yang sama dengan form lain di situs.
export default function TextField({ id, name, label, optional, textarea, rows = 4, className, ...props }: Props) {
  return (
    <div className={className}>
      <label className="label" htmlFor={id}>
        {label}
        {optional && <span className="font-normal text-muted"> (opsional)</span>}
      </label>
      {textarea ? (
        <textarea
          id={id}
          name={name}
          required={!optional}
          minLength={props.minLength}
          maxLength={props.maxLength}
          placeholder={props.placeholder}
          rows={rows}
          className="field resize-none"
        />
      ) : (
        <input id={id} name={name} required={!optional} {...props} className="field" />
      )}
    </div>
  );
}
