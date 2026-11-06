"use client";

import { useEffect, useEffectEvent, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Close, Search } from "@/components/Icons";
import { JEDA_KETIK_MS, MAX_QUERY_LENGTH, catatKiriman, searchHref, terimaUrl } from "@/lib/pencarian-artikel";

type Props = {
  /** Kata kunci dari URL, supaya hasil pencarian tetap utuh saat tautannya dibagikan atau di-refresh. */
  initialQuery?: string;
  /**
   * Cari sambil mengetik. Hanya di /artikel sendiri: di /artikel/halaman/N, pencarian pindah ke
   * halaman lain dan kolomnya dipasang ulang, jadi huruf yang diketik selama perpindahan hilang.
   * Di sana pencarian baru dikirim saat Enter.
   */
  live?: boolean;
};

/**
 * Kolom pencarian artikel. Kata kuncinya hidup di URL (/artikel?q=…) dan disaring di server.
 * Dibungkus <form> GET supaya tetap jalan tanpa JavaScript.
 */
export default function ArticleSearch({ initialQuery = "", live = true }: Props) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);
  const [tertunda, setTertunda] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  // Kolom mengikuti URL hanya untuk navigasi dari luar (Back, tautan "Lihat semua artikel"),
  // bukan untuk hasil pencarian kolom ini sendiri. Lihat lib/pencarian-artikel.ts.
  const [queryTerpasang, setQueryTerpasang] = useState(initialQuery);
  if (initialQuery !== queryTerpasang) {
    setQueryTerpasang(initialQuery);
    const hasil = terimaUrl(tertunda, initialQuery);
    setTertunda(hasil.tertunda);
    if (hasil.ikuti) setValue(initialQuery);
  }

  function pushQuery(query: string) {
    const trimmed = query.trim();
    if (trimmed === initialQuery.trim()) return;
    setTertunda((t) => catatKiriman(t, trimmed));
    startTransition(() => {
      // Dari /artikel/halaman/N pencariannya halaman baru, jadi push supaya Back kembali ke sana.
      // Di /artikel sendiri replace: tiap jeda ketik tidak boleh menambah entri riwayat.
      if (live) router.replace(searchHref(trimmed), { scroll: false });
      else router.push(searchHref(trimmed));
    });
  }

  function clear() {
    setValue("");
    if (live) pushQuery("");
    inputRef.current?.focus();
  }

  // Effect Event membaca nilai terbaru tanpa menjadikannya pemicu, supaya perpindahan URL tidak
  // memasang ulang timer; timernya cuma diulang oleh ketikan.
  const pushSetelahJeda = useEffectEvent((query: string) => {
    if (live) pushQuery(query);
  });

  useEffect(() => {
    const timer = setTimeout(() => pushSetelahJeda(value), JEDA_KETIK_MS);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <form
      action="/artikel"
      method="get"
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        pushQuery(value);
      }}
      className="relative mx-auto max-w-xl"
    >
      <label htmlFor="artikel-search" className="sr-only">
        Cari artikel
      </label>
      {/* Ikon kiri berganti jadi indikator memuat selama hasil pencarian diambil. */}
      {isPending ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 animate-spin rounded-full border-2 border-black/15 border-t-ink"
        />
      ) : (
        <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink" width={18} height={18} />
      )}
      <input
        id="artikel-search"
        ref={inputRef}
        type="search"
        name="q"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape" && value) {
            event.preventDefault();
            clear();
          }
        }}
        maxLength={MAX_QUERY_LENGTH}
        placeholder="Cari artikel, mis. aqiqah"
        enterKeyHint="search"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck={false}
        // Tombol silang bawaan WebKit disembunyikan supaya tidak dobel dengan tombol hapus di kanan.
        className="field field-search !pr-12 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={clear}
          aria-label="Hapus pencarian"
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted transition-colors hover:bg-black/5 hover:text-ink"
        >
          <Close aria-hidden="true" width={16} height={16} />
        </button>
      )}
    </form>
  );
}
