import Link from "next/link";

export function ServicesGrid({ services, emptyMessage }) {
  if (services.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/5 p-6 text-sm text-slate-300">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {services.map((service) => (
        <article
          key={service.id || service.slug}
          className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-xl shadow-slate-950/10"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-brand-light">
                {service.categoryLabel}
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white">
                {service.title}
              </h2>
            </div>

            {service.featured ? (
              <span className="rounded-full bg-brand/15 px-3 py-1 text-xs text-brand-light">
                Featured
              </span>
            ) : null}
          </div>

          <p className="mt-4 text-sm leading-7 text-slate-300">
            {service.shortDescription}
          </p>

          <div className="mt-6 flex items-center justify-between text-sm text-slate-300">
            <span>From ${service.priceFrom}</span>
            <span>{service.deliveryEstimate}</span>
          </div>

          <Link
            href={`/services/${service.slug}`}
            className="mt-6 inline-flex rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-brand hover:text-white"
          >
            View details
          </Link>
        </article>
      ))}
    </div>
  );
}

