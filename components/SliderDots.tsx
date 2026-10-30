type Props = {
  count: number;
  index: number;
  onSelect: (i: number) => void;
  label: (i: number) => string;
  /** "light" untuk di atas foto (HeroBanner), "brand" untuk latar terang. */
  tone?: "brand" | "light";
  /** "sm" untuk slider geser (titik 6px), "md" untuk carousel (titik 8px). */
  size?: "sm" | "md";
  className?: string;
};

const DOT = {
  md: { base: "h-2", active: "w-8", idle: "w-2", pad: "p-2" },
  // 9px kiri-kanan-atas-bawah + titik 6px = 24px.
  sm: { base: "h-1.5", active: "w-4", idle: "w-1.5", pad: "p-[9px]" },
};
const TONE = {
  brand: { active: "bg-brand", idle: "bg-black/20 group-hover:bg-black/40" },
  light: { active: "bg-white", idle: "bg-white/45 group-hover:bg-white/75" },
};

/**
 * Titik navigasi slider. Titiknya kecil, tapi tombolnya diberi padding supaya area sentuhnya
 * minimal 24×24px (WCAG 2.2 target size); tanpa itu titik 6–8px sulit ditekan di ponsel. Jarak
 * antartitik datang dari padding itu, jadi wadahnya tanpa gap.
 */
export default function SliderDots({ count, index, onSelect, label, tone = "brand", size = "md", className = "" }: Props) {
  const dot = DOT[size];
  const color = TONE[tone];
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={label(i)}
          aria-current={i === index}
          className={`group rounded-full ${dot.pad}`}
        >
          <span
            className={`block rounded-full transition-all duration-300 ${dot.base} ${i === index ? `${dot.active} ${color.active}` : `${dot.idle} ${color.idle}`}`}
          />
        </button>
      ))}
    </div>
  );
}
