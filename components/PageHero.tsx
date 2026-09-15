export default function PageHero({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <section className="container-x pb-8 pt-8 text-center sm:pb-14 sm:pt-20">
      <div className="mx-auto max-w-3xl">
        {eyebrow && <p className="eyebrow hero-rise mb-2 sm:mb-4">{eyebrow}</p>}
        <h1 className="display-1 hero-rise [--delay:.06s]">{title}</h1>
        {subtitle && <p className="lead hero-rise mx-auto mt-3 max-w-xl [--delay:.12s] sm:mt-4">{subtitle}</p>}
      </div>
    </section>
  );
}
