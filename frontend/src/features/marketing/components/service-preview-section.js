"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { apiRequest } from "@/lib/api/client";

const fallbackServices = [
  {
    slug: "web-development",
    title: "Web Development",
    categoryLabel: "Web Development",
    shortDescription:
      "High-performance websites, dashboards, and custom platforms built for conversion and scale.",
    priceFrom: 1500,
    deliveryEstimate: "4-8 weeks"
  },
  {
    slug: "mobile-apps",
    title: "Mobile Apps",
    categoryLabel: "Mobile Apps",
    shortDescription:
      "Cross-platform mobile products with polished UX, API integration, and maintainable architecture.",
    priceFrom: 2500,
    deliveryEstimate: "6-10 weeks"
  },
  {
    slug: "ai-solutions",
    title: "AI Solutions",
    categoryLabel: "AI Solutions",
    shortDescription:
      "Internal copilots, customer support assistants, and workflow automation tailored to your operations.",
    priceFrom: 2000,
    deliveryEstimate: "3-6 weeks"
  }
];

export function ServicePreviewSection() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadServices = async () => {
      try {
        const response = await apiRequest("/services");

        if (!isMounted) {
          return;
        }

        setServices(response.services.slice(0, 3));
      } catch (_error) {
        if (!isMounted) {
          return;
        }

        setServices([]);
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

  const displayServices = services.length > 0 ? services : fallbackServices;

  return (
    <section className="mt-10 rounded-[2.5rem] border border-white/10 bg-white/5 p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-brand-light">
            Services Preview
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            Offerings designed for digital growth.
          </h2>
          <p className="mt-3 max-w-2xl text-slate-300">
            A reusable service catalog is now part of the platform, with admin CRUD and client-facing detail pages.
          </p>
        </div>

        <Link
          href="/services"
          className="inline-flex rounded-full border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:border-brand hover:text-white"
        >
          View All Services
        </Link>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {displayServices.map((service) => (
          <article
            key={service.slug}
            className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-5"
          >
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
              {service.categoryLabel}
            </p>
            <h3 className="mt-4 text-2xl font-semibold text-white">{service.title}</h3>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              {service.shortDescription}
            </p>

            <div className="mt-6 flex items-center justify-between text-sm">
              <span className="rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-brand-light">
                From ${service.priceFrom}
              </span>
              <span className="text-slate-400">{service.deliveryEstimate}</span>
            </div>

            <Link
              href={`/services/${service.slug}`}
              className="mt-6 inline-flex text-sm font-medium text-brand-light transition hover:text-white"
            >
              View details →
            </Link>
          </article>
        ))}
      </div>

      {isLoading ? (
        <p className="mt-5 text-sm text-slate-400">Loading services preview...</p>
      ) : null}
    </section>
  );
}

