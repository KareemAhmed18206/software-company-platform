"use client";

import { useEffect, useState } from "react";

import { ProtectedRoute } from "@/features/auth/components/protected-route";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { StatCard } from "@/features/dashboard/components/stat-card";
import { apiRequest } from "@/lib/api/client";

export default function ClientDashboardPage() {
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
        const response = await apiRequest("/users/client/dashboard", {
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
    <ProtectedRoute allowedRoles={["client"]}>
      <DashboardLayout
        title="Client workspace"
        description="A protected client workspace with reusable navigation, service discovery, and room for project requests and messaging."
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
              <StatCard label="Available Services" value={data.overview.availableServices} hint="Currently published offerings" />
              <StatCard label="Pending Requests" value={data.overview.pendingRequests} hint="Submitted and waiting for review" />
              <StatCard label="Accepted Requests" value={data.overview.acceptedRequests} hint="Approved briefs ready for execution" />
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                Current State
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white">
                {data.message}
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
                Clients can now browse a service catalog with detail pages while
                staying inside a protected dashboard experience.
              </p>
            </div>
          </div>
        ) : null}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
