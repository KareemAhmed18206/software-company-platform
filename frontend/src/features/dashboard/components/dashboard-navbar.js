"use client";

import Link from "next/link";

import { NotificationPanel } from "@/features/notifications/components/notification-panel";

export function DashboardNavbar({
  title,
  description,
  user,
  onMenuToggle,
  onLogout
}) {
  return (
    <header className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-xl shadow-slate-950/20 backdrop-blur">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <button
            type="button"
            onClick={onMenuToggle}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/70 text-white transition hover:border-brand lg:hidden"
          >
            <span className="text-lg">≡</span>
          </button>

          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-brand-light">
              {user.role} workspace
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-white">{title}</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
              {description}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <NotificationPanel />
          <Link
            href="/"
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-brand hover:text-white"
          >
            Website
          </Link>
          <Link
            href="/support"
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-brand hover:text-white"
          >
            AI Support
          </Link>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-brand-light"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
