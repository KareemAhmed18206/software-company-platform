"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ServicesGrid } from "@/features/services/components/services-grid";
import { apiRequest } from "@/lib/api/client";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadServices = async () => {
      try {
        const response = await apiRequest("/services");

        if (!isMounted) {
          return;
        }

        setServices(response.services);
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

    loadServices();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(15,118,110,0.15),transparent_25%),linear-gradient(180deg,#020617,#0f172a)] px-6 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8 sm:p-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-brand-light">
                Service Catalog
              </p>
              <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">
                Solutions built for modern digital companies.
              </h1>
              <p className="mt-4 max-w-2xl text-slate-300">
                Explore the current service catalog managed by the admin dashboard, with detailed pages for each offering.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="rounded-full border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:border-brand hover:text-white"
              >
                Back to Home
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-brand-light"
              >
                Start a Project
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8">
          {error ? (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </div>
          ) : null}

          {isLoading ? (
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
              Loading services...
            </div>
          ) : (
            <ServicesGrid
              services={services}
              emptyMessage="No active services are published yet. Admins can add them from the dashboard."
            />
          )}
        </div>
      </div>
    </main>
  );
}

