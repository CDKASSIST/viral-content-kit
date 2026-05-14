type ProductCardProps = {
  title: string;
  description: string;
  features: string[];
  price: string;
  buttonText: string;
  href: string;
  badge?: string;
  highlighted?: boolean;
  onButtonClick?: () => void;
  /** Local dev only: navigates to post-purchase experience with tier query. */
  devSkipHref?: string;
};

export default function ProductCard({
  title,
  description,
  features,
  price,
  buttonText,
  href,
  badge,
  highlighted = false,
  onButtonClick,
  devSkipHref,
}: ProductCardProps) {
  const isExternal = /^https?:\/\//i.test(href);

  return (
    <article
      className={[
        "group relative overflow-hidden rounded-3xl border p-8 shadow-2xl transition-all duration-300",
        "bg-zinc-900/90 backdrop-blur-sm hover:-translate-y-1 hover:shadow-amber-500/10",
        highlighted
          ? "border-amber-400/60 ring-1 ring-amber-400/40 lg:scale-[1.03]"
          : "border-zinc-800",
      ].join(" ")}
    >
      {highlighted ? (
        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-amber-300/15 blur-3xl" />
      ) : null}

      {badge ? (
        <span className="mb-4 inline-flex rounded-full border border-amber-300/50 bg-amber-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-amber-200">
          {badge}
        </span>
      ) : null}

      <h3 className="text-2xl font-semibold text-zinc-100">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-zinc-300">{description}</p>
      <p className="mt-6 text-4xl font-semibold tracking-tight text-zinc-100">
        {price}
        <span className="ml-2 text-sm font-medium text-zinc-400">one-time</span>
      </p>

      <ul className="mt-8 space-y-3 text-sm text-zinc-200">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-3">
            <span
              className={[
                "h-2 w-2 rounded-full",
                highlighted ? "bg-amber-300" : "bg-zinc-400",
              ].join(" ")}
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <a
        href={href}
        rel={isExternal ? "noopener noreferrer" : undefined}
        onClick={onButtonClick}
        className={[
          "mt-10 inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200",
          highlighted
            ? "bg-amber-300 text-zinc-950 hover:bg-amber-200"
            : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
        ].join(" ")}
      >
        {buttonText}
      </a>
      {devSkipHref ? (
        <a
          href={devSkipHref}
          className="mt-3 inline-flex w-full items-center justify-center rounded-xl border-2 border-dashed border-orange-500/90 bg-orange-950/40 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-orange-200 transition-colors hover:border-orange-400 hover:bg-orange-950/60"
        >
          Dev: Skip to Product
        </a>
      ) : null}
    </article>
  );
}
