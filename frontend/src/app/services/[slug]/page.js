"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { apiRequest } from "@/lib/api/client";

export default function ServiceDetailsPage() {
  const params = useParams();
  const [service, setService] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadService = async () => {
      try {
        const response = await apiRequest(`/services/${params.slug}`);

        if (!isMounted) {
          return;
        }

        setService(response.service);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setError(loadError.message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadService();

    return () => {
      isMounted = false;
    };
  }, [params.slug]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(15,118,110,0.15),transparent_25%),linear-gradient(180deg,#020617,#0f172a)] px-6 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/services"
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-brand hover:text-white"
          >
            ← Back to services
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-brand-light"
          >
            Request this service
          </Link>
        </div>

        {error ? (
          <div className="mt-8 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}

        {isLoading ? (
          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
            Loading service details...
          </div>
        ) : null}

        {service ? (
          <article className="mt-8 rounded-[2.5rem] border border-white/10 bg-white/5 p-8 sm:p-10">
            <p className="text-sm uppercase tracking-[0.25em] text-brand-light">
              {service.categoryLabel}
            </p>
            <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
              {service.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
              {service.shortDescription}
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                  Starting Price
                </p>
                <p className="mt-3 text-3xl font-semibold text-white">
                  ${service.priceFrom}
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                  Delivery
                </p>
                <p className="mt-3 text-3xl font-semibold text-white">
                  {service.deliveryEstimate}
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                  Availability
                </p>
                <p className="mt-3 text-3xl font-semibold text-white">
                  {service.isActive ? "Open" : "Closed"}
                </p>
              </div>
            </div>

            <div className="mt-10 rounded-[2rem] border border-white/10 bg-slate-950/65 p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                Full Scope
              </p>
              <p className="mt-4 whitespace-pre-line text-base leading-8 text-slate-200">
                {service.fullDescription}
              </p>
            </div>
          </article>
        ) : null}
      </div>
    </main>
  );
}
