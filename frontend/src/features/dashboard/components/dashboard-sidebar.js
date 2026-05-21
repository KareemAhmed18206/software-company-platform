"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function DashboardSidebar({
  navigation,
  user,
  isOpen,
  onNavigate,
  isMobile
}) {
  const pathname = usePathname();

  return (
    <aside
      className={`${
        isMobile
          ? isOpen
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0"
          : "translate-x-0 opacity-100"
      } fixed inset-y-0 left-0 z-40 flex w-80 flex-col border-r border-white/10 bg-slate-950/95 p-6 backdrop-blur transition duration-300 lg:static lg:w-full lg:translate-x-0 lg:opacity-100`}
    >
      <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
        <p className="text-xs uppercase tracking-[0.25em] text-brand-light">
          Control Panel
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-white">
          Software Company
        </h2>
        <p className="mt-2 text-sm text-slate-300">
          Structured workspace for marketing, service management, and client delivery.
        </p>
      </div>

      <div className="mt-6 rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
          Signed In
        </p>
        <h3 className="mt-3 text-lg font-semibold text-white">{user.name}</h3>
        <p className="mt-1 text-sm text-slate-300">{user.email}</p>
        <div className="mt-4 inline-flex rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-brand-light">
          {user.role}
        </div>
      </div>

      <nav className="mt-6 space-y-3">
        {navigation.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`block rounded-[1.5rem] border px-4 py-4 transition ${
                isActive
                  ? "border-brand/60 bg-brand/15 text-white"
                  : "border-white/10 bg-white/5 text-slate-200 hover:border-white/20 hover:bg-white/10"
              }`}
            >
              <div className="text-sm font-semibold">{item.label}</div>
              <div className="mt-1 text-sm text-slate-400">{item.description}</div>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,118,110,0.18),rgba(15,23,42,0.45))] p-5">
        <p className="text-sm uppercase tracking-[0.2em] text-brand-light">
          Workspace
        </p>
        <p className="mt-3 text-sm text-slate-200">
          Reusable layout, protected routes, and modular dashboard sections are now ready for the next product modules.
        </p>
      </div>
    </aside>
  );
}

