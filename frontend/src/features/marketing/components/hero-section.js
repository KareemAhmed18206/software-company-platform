"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { getDefaultDashboardRoute } from "@/features/auth/utils/auth-routes";

export function HeroSection() {
  const router = useRouter();
  const { isAuthenticated, isLoading, logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.refresh();
  };

  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(15,118,110,0.28),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.16),transparent_30%),linear-gradient(135deg,rgba(2,6,23,0.96),rgba(15,23,42,0.88))] px-6 py-10 sm:px-10 sm:py-14">
      <div className="absolute -right-16 top-8 h-44 w-44 rounded-full bg-brand/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />

      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="inline-flex rounded-full border border-brand/30 bg-brand/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-brand-light">
            SaaS + Software Agency Platform
          </span>

          <div className="flex flex-wrap gap-3">
            {!isLoading && !isAuthenticated ? (
              <>
                <Link
                  href="/login"
                  className="rounded-full border border-white/15 px-5 py-2 text-sm text-slate-200 transition hover:border-brand hover:text-white"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-brand-light"
                >
                  Get Started
                </Link>
              </>
            ) : null}

            {!isLoading && isAuthenticated ? (
              <>
                <Link
                  href={getDefaultDashboardRoute(user.role)}
                  className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-brand-light"
                >
                  Open Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full border border-white/15 px-5 py-2 text-sm text-slate-200 transition hover:border-rose-400 hover:text-white"
                >
                  Logout
                </button>
              </>
            ) : null}
          </div>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <div>
            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Build and manage digital products from one clean operating system.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              We design company websites, secure client portals, admin workspaces,
              and scalable delivery pipelines for web, mobile, AI, and cybersecurity services.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/services"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-brand-light"
              >
                Explore Services
              </Link>
              <Link
                href={isAuthenticated ? getDefaultDashboardRoute(user.role) : "/register"}
                className="rounded-full border border-white/15 px-6 py-3 text-sm text-slate-200 transition hover:border-brand hover:text-white"
              >
                {isAuthenticated ? "Go To Workspace" : "Create Account"}
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { label: "Delivery Model", value: "Agency + SaaS" },
                { label: "Core Stack", value: "Next.js / Node / MongoDB" },
                { label: "Focus", value: "Reliable modular growth" }
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur"
                >
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                    {item.label}
                  </p>
                  <p className="mt-3 text-lg font-medium text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {[
              "Structured dashboards for admins and clients",
              "Service catalog ready for growth and automation",
              "Secure authentication with role-based access",
              "Production-minded architecture from day one"
            ].map((item, index) => (
              <div
                key={item}
                className="rounded-[1.75rem] border border-white/10 bg-slate-950/60 p-5"
              >
                <p className="text-xs uppercase tracking-[0.25em] text-brand-light">
                  0{index + 1}
                </p>
                <p className="mt-3 text-base leading-7 text-slate-200">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

