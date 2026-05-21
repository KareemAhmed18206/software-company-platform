"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "../hooks/use-auth";
import { getDefaultDashboardRoute } from "../utils/auth-routes";

export function DashboardShell({ title, description, children }) {
  const router = useRouter();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const navigation = [
    {
      href: getDefaultDashboardRoute(user.role),
      label: "Dashboard"
    },
    {
      href: "/",
      label: "Website"
    }
  ];

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-xl shadow-slate-950/20 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-brand-light">
              {user.role} dashboard
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-white">{title}</h1>
            <p className="mt-2 text-slate-300">{description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-brand hover:text-white"
              >
                {item.label}
              </Link>
            ))}

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-brand-light"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            {children}
          </section>

          <aside className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
              Session
            </p>
            <h2 className="mt-4 text-xl font-semibold text-white">{user.name}</h2>
            <p className="mt-2 text-sm text-slate-300">{user.email}</p>
            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-slate-300">
              Your role is <span className="font-medium text-white">{user.role}</span>,
              and backend route authorization is enforced before dashboard data
              is returned.
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

