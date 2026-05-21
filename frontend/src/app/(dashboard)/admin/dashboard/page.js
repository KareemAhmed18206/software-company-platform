"use client";

import { useEffect, useState } from "react";

import { ProtectedRoute } from "@/features/auth/components/protected-route";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { StatCard } from "@/features/dashboard/components/stat-card";
import { apiRequest } from "@/lib/api/client";

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      if (!token) {
        return;
      }

      try {
        const response = await apiRequest("/users/admin/dashboard", {
          token
        });

        if (!isMounted) {
          return;
        }

        setData(response);
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

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [token]);

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardLayout
        title="Admin control center"
        description="A responsive admin workspace with reusable navigation, protected access, and live service-aware platform metrics."
      >
        {isLoading ? (
          <p className="text-slate-300">Loading protected dashboard data...</p>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}

        {data ? (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard label="Total Clients" value={data.stats.totalClients} hint="Registered client accounts" />
              <StatCard label="Active Services" value={data.stats.totalActiveServices} hint="Published offers in catalog" />
              <StatCard label="Pending Requests" value={data.stats.pendingRequests} hint="Fresh client intake waiting review" />
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                Current State
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white">
                {data.message}
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
                The admin area now uses a reusable dashboard shell with a sidebar,
                top navigation, direct service management workflow, and project request review pipeline.
              </p>
            </div>
          </div>
        ) : null}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
