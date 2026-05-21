"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { dashboardNavigation } from "../config/navigation";
import { DashboardNavbar } from "./dashboard-navbar";
import { DashboardSidebar } from "./dashboard-sidebar";

export function DashboardLayout({ title, description, children }) {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigation = dashboardNavigation[user.role] || [];

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(15,118,110,0.18),transparent_32%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.14),transparent_22%),linear-gradient(180deg,#020617,#0f172a)] px-4 py-4 text-white sm:px-6 sm:py-6">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[290px_minmax(0,1fr)]">
        <DashboardSidebar
          navigation={navigation}
          user={user}
          isOpen={isSidebarOpen}
          onNavigate={() => setIsSidebarOpen(false)}
          isMobile
        />

        {isSidebarOpen ? (
          <button
            type="button"
            aria-label="Close sidebar overlay"
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-slate-950/60 lg:hidden"
          />
        ) : null}

        <section className="relative z-10">
          <DashboardNavbar
            title={title}
            description={description}
            user={user}
            onMenuToggle={() => setIsSidebarOpen((current) => !current)}
            onLogout={handleLogout}
          />

          <div className="mt-6">{children}</div>
        </section>
      </div>
    </main>
  );
}

