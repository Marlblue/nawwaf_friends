import Image from "@/components/SiteImage";
import { ArrowDown } from "@/components/Icons";

// Kartu ucapan Nawwaf & Friends (dari file desain PDF-nya): bingkai kubah maroon dengan
// ornamen emas. Desain cetaknya kosong ("Dear : ____"), jadi contoh pesannya ditulis sebagai
// teks HTML di atas gambar: tetap tajam di ukuran berapa pun dan terbaca screen reader.
// Ukuran & posisi teks memakai satuan cqw (lebar kartu), jadi ikut mengecil di thumbnail.
// Posisi diambil dari koordinat PDF (267 x 396,75 pt).
export function GreetingCardFace({ sizes, className = "", decorative = false }: { sizes: string; className?: string; decorative?: boolean }) {
  return (
    <span className={`relative block aspect-[801/1191] overflow-hidden [container-type:inline-size] ${className}`} aria-hidden={decorative || undefined}>
      <Image
        src="/images/gift-set/kartu-ucapan.webp"
        alt={decorative ? "" : "Kartu ucapan Nawwaf & Friends: bingkai kubah maroon berornamen emas, logo, tulisan Bismillahirrahmanirrahim, dan kolom Dear."}
        fill
        sizes={sizes}
        className="object-cover"
      />
      <span className="absolute inset-0 block font-[Georgia,'Times_New_Roman',serif] text-brand-700">
        <span className="absolute left-[28%] top-[24.2%] block text-[4.2cqw] italic leading-none">Mama &amp; Papa</span>
        <span className="absolute inset-x-[13%] top-[34%] block text-center text-[3.45cqw] leading-[1.6]">
          <span className="block">
            Terima kasih telah membesarkan kami dengan penuh kasih sayang, atas setiap pengorbanan, kesabaran, dan doa yang tak pernah terputus.
          </span>
          <span className="mt-[4cqw] block">
            Semoga Allah senantiasa menjaga Mama dan Papa, melimpahkan kesehatan, kebahagiaan, serta keberkahan dalam setiap langkah.
          </span>
          <span className="mt-[8cqw] block italic">With love,</span>
          <span className="block font-bold">Rizky &amp; Aisyah</span>
        </span>
      </span>
    </span>
  );
}

// Thumbnail di section Gift Set: kartu ucapan miring di depan, gift tag asli terselip di belakangnya.
export function GreetingCardPair({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`relative block aspect-[20/19] ${className}`}>
      <span className="absolute right-[4%] top-[3%] block w-[28%] rotate-[10deg] drop-shadow-[0_12px_14px_rgb(42_16_19/0.35)]">
        <span className="relative block aspect-[440/854]">
          <Image src="/images/gift-set/hang-tag.webp" alt="" fill sizes="80px" unoptimized />
        </span>
      </span>
      <span className="absolute left-[8%] top-[1%] block w-[60%] -rotate-3 rounded-[4px] shadow-[0_18px_30px_-14px_rgb(42_16_19/0.6)]">
        <GreetingCardFace sizes="180px" decorative className="rounded-[4px]" />
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
