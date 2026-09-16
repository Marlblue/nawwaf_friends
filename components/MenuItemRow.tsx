"use client";

import Image from "next/image";
import { useState } from "react";
import { thumb, type MenuItem } from "@/lib/menu";
import { rupiah } from "@/lib/site";
import { useCart } from "./CartProvider";
import { Check, Plus } from "./Icons";

// Baris menu bergaya daftar (nama - harga, deskripsi di bawahnya) seperti menu Latte.
export default function MenuItemRow({ item }: { item: MenuItem }) {
  const { add } = useCart();
  const [optionId, setOptionId] = useState(item.options[0].id);
  const [added, setAdded] = useState(false);
  const option = item.options.find((o) => o.id === optionId)!;

  const handleAdd = () => {
    add(option.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <article className="flex gap-4 py-5">
      {item.image && (
        <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-2xl bg-sand sm:h-20 sm:w-20">
          <Image src={thumb(item.image)} alt="" fill sizes="80px" className="object-cover" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-[17px] font-medium leading-snug sm:text-lg">
            {item.name}
            {item.badge && (
              <span className="ml-2 inline-block translate-y-[-2px] rounded-full bg-accent/25 px-2 py-0.5 align-middle text-[11px] font-medium text-ink">
                {item.badge}
              </span>
            )}
          </h3>
          <span className="shrink-0 text-[17px] font-medium tabular-nums sm:text-lg">{rupiah(option.price)}</span>
        </div>
        {item.description && <p className="mt-1 text-[15px] text-muted">{item.description}</p>}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {item.options.length > 1 && (
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={`Pilihan ${item.name}`}>
              {item.options.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  role="radio"
                  aria-checked={o.id === optionId}
                  onClick={() => setOptionId(o.id)}
                  className="chip min-h-10 !px-3.5 !py-2 !text-sm"
                >
                  {o.label}
                </button>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={handleAdd}
            className={`ml-auto inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-medium transition ${
              added ? "bg-brand text-white" : "border border-black/15 hover:border-brand hover:bg-brand hover:text-white"
            }`}
            aria-label={`Tambah ${item.name}${item.options.length > 1 ? ` ${option.label}` : ""} ke keranjang`}
          >
            {added ? <Check width={16} height={16} /> : <Plus width={16} height={16} />}
            {added ? "Ditambahkan" : "Tambah"}
          </button>
        </div>
      </div>
    </article>
  );
}
