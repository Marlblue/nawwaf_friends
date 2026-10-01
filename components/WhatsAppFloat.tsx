"use client";

import { usePathname } from "next/navigation";
import { waLink } from "@/lib/site";
import { useCart } from "./CartProvider";
import { Whatsapp } from "./Icons";

// Tombol WhatsApp melayang di pojok kanan bawah. Saat tombol keranjang melayang
// muncul (posisinya sama), tombol ini naik supaya tidak tertutup.
export default function WhatsAppFloat() {
  const pathname = usePathname();
  const { count, drawerOpen } = useCart();
  const cartVisible = count > 0 && pathname !== "/order" && !drawerOpen;

  return (
    <a
      href={waLink("Halo Nawwaf & Friends, saya mau tanya.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat via WhatsApp"
      className={`fixed bottom-4 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_40px_rgba(0,0,0,0.25)] transition-[translate,scale] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105 sm:bottom-6 sm:right-6 ${
        cartVisible ? "-translate-y-[72px]" : "translate-y-0"
      } ${drawerOpen ? "pointer-events-none opacity-0" : ""}`}
    >
      <Whatsapp width={28} height={28} />
    </a>
  );
}
