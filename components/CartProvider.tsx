"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { findOption } from "@/lib/menu";

export type CartLine = { optionId: string; qty: number };

export type ResolvedLine = CartLine & {
  itemName: string;
  optionLabel: string;
  showOption: boolean;
  price: number;
  image?: string;
};

type CartContextValue = {
  lines: ResolvedLine[];
  count: number;
  subtotal: number;
  ready: boolean;
  drawerOpen: boolean;
  /** Naik setiap kali item ditambahkan, dipakai untuk memicu animasi keranjang */
  addedTick: number;
  setDrawerOpen: (open: boolean) => void;
  add: (optionId: string, qty?: number) => void;
  setQty: (optionId: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "nf-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [raw, setRaw] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [addedTick, setAddedTick] = useState(0);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from storage after mount
      if (Array.isArray(saved)) setRaw(saved.filter((l) => findOption(l.optionId) && l.qty > 0));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(raw));
    } catch {}
  }, [raw, ready]);

  const add = useCallback((optionId: string, qty = 1) => {
    setRaw((prev) => {
      const existing = prev.find((l) => l.optionId === optionId);
      if (existing) return prev.map((l) => (l.optionId === optionId ? { ...l, qty: l.qty + qty } : l));
      return [...prev, { optionId, qty }];
    });
    setAddedTick((t) => t + 1);
  }, []);

  const setQty = useCallback((optionId: string, qty: number) => {
    setRaw((prev) =>
      qty <= 0 ? prev.filter((l) => l.optionId !== optionId) : prev.map((l) => (l.optionId === optionId ? { ...l, qty } : l)),
    );
  }, []);

  const clear = useCallback(() => setRaw([]), []);

  const value = useMemo(() => {
    const lines: ResolvedLine[] = raw.flatMap((l) => {
      const found = findOption(l.optionId);
      if (!found) return [];
      return [
        {
          ...l,
          itemName: found.item.name,
          optionLabel: found.option.label,
          showOption: found.item.options.length > 1,
          price: found.option.price,
          image: found.item.image,
        },
      ];
    });
    return {
      lines,
      count: lines.reduce((s, l) => s + l.qty, 0),
      subtotal: lines.reduce((s, l) => s + l.qty * l.price, 0),
      ready,
      drawerOpen,
      addedTick,
      setDrawerOpen,
      add,
      setQty,
      clear,
    };
  }, [raw, ready, drawerOpen, addedTick, add, setQty, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

// Jalankan callback setiap kali item ditambahkan ke keranjang (tidak dipanggil saat komponen baru dipasang)
export function useOnCartAdd(callback: () => void) {
  const { addedTick } = useCart();
  const seen = useRef(addedTick);
  const latest = useRef(callback);

  useEffect(() => {
    latest.current = callback;
  });

  useEffect(() => {
    if (seen.current === addedTick) return;
    seen.current = addedTick;
    latest.current();
  }, [addedTick]);
}
