import Link from "next/link";

export function CtaSection() {
  return (
    <section className="mt-10 rounded-[2.5rem] border border-brand/20 bg-[linear-gradient(135deg,rgba(15,118,110,0.22),rgba(15,23,42,0.95))] px-6 py-10 sm:px-10 sm:py-12">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.25em] text-brand-light">
            Ready To Build
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            Move from static presence to an operational client platform.
          </h2>
          <p className="mt-4 text-slate-300">
            Start with the marketing site, then grow into services, client requests, project management, payments, and AI workflows.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/register"
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-brand-light"
          >
            Create Workspace
          </Link>
          <Link
            href="/services"
            className="rounded-full border border-white/15 px-6 py-3 text-sm text-slate-100 transition hover:border-white/30"
          >
            Browse Services
          </Link>
        </div>
      </div>
    </section>
  );
}

