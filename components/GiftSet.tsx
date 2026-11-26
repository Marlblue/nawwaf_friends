import Image from "@/components/SiteImage";
import { ArrowDown } from "@/components/Icons";

// Kartu ucapan asli yang ikut di dalam box: sisi depan (maroon, bingkai kubah emas) di belakang,
// sisi dalam berisi contoh pesan di depannya, ditumpuk miring seperti diletakkan di meja.
export function GreetingCardPair({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`relative block aspect-[20/19] ${className}`}>
      <span className="absolute left-0 top-[4%] block w-[54%] -rotate-6 overflow-hidden rounded-[4px] shadow-[0_14px_26px_-14px_rgb(42_16_19/0.6)]">
        <Image src="/images/gift-set/kartu-depan.webp" alt="" width={800} height={1126} sizes="160px" className="block h-auto w-full" />
      </span>
      <span className="absolute right-0 top-0 block w-[56%] rotate-3 overflow-hidden rounded-[4px] shadow-[0_18px_30px_-14px_rgb(42_16_19/0.55)]">
        <Image src="/images/gift-set/kartu-dalam.webp" alt="" width={800} height={1126} sizes="170px" className="block h-auto w-full" />
      </span>
    </span>
  );
}

// Highlight Gift Set di hero beranda: gift tag asli Nawwaf & Friends (dari file desainnya),
// menggantung dari tepi atas hero dengan tali emas. Foto box tampil di dalam jendela kubah tag
// lewat mask berbentuk jendela itu sendiri, jadi lengkungnya persis sama dengan cetakannya.
// Batas 1340px: di bawah itu tag mulai menabrak judul hero; layar kecil memakai GiftSetHeroChip.
// Gambar tag & mask berlatar transparan, jadi tidak lewat optimizer (lihat SiteImage.tsx).
const tagWindow = {
  maskImage: "url(/images/gift-set/hang-tag-window.png)",
  WebkitMaskImage: "url(/images/gift-set/hang-tag-window.png)",
  maskSize: "100% 100%",
  WebkitMaskSize: "100% 100%",
} as const;

export function GiftSetHeroTag({ minPrice }: { minPrice: string }) {
  return (
    <a
      href="#gift-set"
      className="gift-tag group absolute right-10 top-0 z-10 hidden w-[196px] text-center min-[1340px]:block"
      aria-label={`Baru: Nawwaf Signature Gift Set, mulai ${minPrice}`}
    >
      {/* Tali: lewat di belakang tag dan terlihat di lubangnya */}
      <span aria-hidden="true" className="absolute left-1/2 top-0 block h-[68px] w-[1.5px] -translate-x-1/2 bg-accent" />
      <span className="relative mt-10 block aspect-[440/854] drop-shadow-[0_20px_24px_rgb(0_0_0/0.5)]">
        <Image src="/images/gift-set/hang-tag.webp" alt="" fill sizes="196px" unoptimized />
        <span aria-hidden="true" className="absolute inset-0 block" style={tagWindow}>
          <span className="absolute inset-x-0 top-[21%] block h-[33%] overflow-hidden">
            <Image src="/images/gift-set/gift-box.webp" alt="" fill sizes="196px" className="object-cover object-[28%_40%] transition-transform duration-700 group-hover:scale-110" />
          </span>
        </span>
        <span className="absolute inset-x-[10%] top-[56.5%] block">
          <span className="inline-block rounded-full bg-brand px-2 py-px text-[10px] font-semibold uppercase tracking-wider text-accent">Baru</span>
          <span className="mt-1 block text-[15px] font-bold leading-[1.15] text-brand-700">Signature Gift Set</span>
          <span className="mt-1 block text-[12px] text-ink-soft">
            Mulai <span className="font-semibold tabular-nums text-brand">{minPrice}</span>
          </span>
        </span>
      </span>
    </a>
  );
}

// Versi layar kecil (di bawah 1340px): potongan box kraft mini. Latar kraft dengan line art
// nampan dari cetakan box, pita maroon vertikal, dan gift tag asli yang menggantung dari pita
// lalu berayun sekali, jadi tetap terasa seperti box kadonya, bukan label biasa.
export function GiftSetHeroChip({ minPrice }: { minPrice: string }) {
  return (
    <a
      href="#gift-set"
      className="gift-chip hero-rise group relative mx-auto mt-5 flex w-full max-w-[330px] items-center rounded-2xl text-left shadow-[0_14px_30px_-12px_rgb(0_0_0/0.7)] sm:mt-6 min-[1340px]:hidden [--delay:.24s]"
    >
      <span aria-hidden="true" className="absolute inset-0 overflow-hidden rounded-2xl bg-[#d9aa78]">
        <Image src="/images/gift-set/kraft-lineart.webp" alt="" fill sizes="330px" className="object-cover opacity-50 mix-blend-multiply" />
      </span>
      <span aria-hidden="true" className="absolute inset-y-0 left-9 w-3.5 bg-brand shadow-[inset_2px_0_0_rgb(255_255_255/0.18),inset_-2px_0_0_rgb(0_0_0/0.18)]" />
      <span aria-hidden="true" className="gift-tag-mini absolute left-[23px] top-0 block w-10">
        <span className="mx-auto block h-3.5 w-px bg-accent" />
        <span className="relative -mt-1.5 block aspect-[440/854] drop-shadow-[0_6px_6px_rgb(0_0_0/0.35)]">
          <Image src="/images/gift-set/hang-tag.webp" alt="" fill sizes="40px" unoptimized />
          <span className="absolute inset-0 block" style={tagWindow}>
            <Image src="/images/gift-set/gift-box.webp" alt="" fill sizes="40px" className="object-cover object-[28%_40%]" />
          </span>
        </span>
      </span>
      <span className="relative min-w-0 flex-1 py-3 pl-[76px] pr-2">
        <span className="flex items-center gap-1.5 text-[12px] font-semibold text-brand-700">
          <span className="rounded-full bg-brand px-1.5 py-px text-[10px] uppercase tracking-wider text-accent">Baru</span>
          Mulai {minPrice}
        </span>
        <span className="mt-0.5 block truncate text-[15px] font-bold text-brand-700">Signature Gift Set</span>
      </span>
      <span aria-hidden="true" className="relative mr-3 grid size-8 shrink-0 place-items-center rounded-full bg-brand text-white transition-transform group-hover:translate-y-0.5">
        <ArrowDown width={15} height={15} />
      </span>
    </a>
  );
}
