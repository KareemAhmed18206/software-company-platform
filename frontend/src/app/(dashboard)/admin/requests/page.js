"use client";

import { useEffect, useState } from "react";

import { ProtectedRoute } from "@/features/auth/components/protected-route";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { StatCard } from "@/features/dashboard/components/stat-card";
import { ProjectRequestsList } from "@/features/project-requests/components/project-requests-list";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { apiRequest } from "@/lib/api/client";

export default function AdminRequestsPage() {
  const { token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [pageError, setPageError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [actingId, setActingId] = useState("");

  const loadRequests = async () => {
    const response = await apiRequest("/project-requests/admin/all", { token });
    setRequests(response.projectRequests);
  };

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      if (!token) {
        return;
      }

      try {
        const response = await apiRequest("/project-requests/admin/all", {
          token
        });

        if (!isMounted) {
          return;
        }

        setRequests(response.projectRequests);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setPageError(loadError.message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleDecision = async (request, status) => {
    setActingId(request.id);
    setPageError("");

    try {
      await apiRequest(`/project-requests/${request.id}/status`, {
        method: "PATCH",
        token,
        body: {
          status,
          adminDecisionNote:
            status === "accepted"
              ? "Approved and ready for project planning."
              : "Rejected for now. Review scope, timing, or fit before resubmitting."
        }
      });

      await loadRequests();
    } catch (decisionError) {
      setPageError(decisionError.message);
    } finally {
      setActingId("");
    }
  };

  const pendingCount = requests.filter((request) => request.status === "pending").length;
  const acceptedCount = requests.filter((request) => request.status === "accepted").length;
  const rejectedCount = requests.filter((request) => request.status === "rejected").length;

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardLayout
        title="Project Intake"
        description="Review incoming client requests, update their status, and keep the dashboard aligned with the request pipeline."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Pending" value={pendingCount} hint="Awaiting admin action" />
          <StatCard label="Accepted" value={acceptedCount} hint="Approved briefs" />
          <StatCard label="Rejected" value={rejectedCount} hint="Declined or deferred briefs" />
        </div>

        <div className="mt-6">
          {pageError ? (
            <div className="mb-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {pageError}
            </div>
          ) : null}

          {isLoading ? (
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
              Loading project intake...
            </div>
          ) : (
            <ProjectRequestsList
              requests={requests}
              emptyMessage="No project requests have been submitted yet."
              actions={(request) => (
                <>
                  <button
                    type="button"
                    disabled={actingId === request.id}
                    onClick={() => handleDecision(request, "accepted")}
                    className="rounded-full border border-emerald-500/30 px-3 py-2 text-xs text-emerald-200 transition hover:border-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    disabled={actingId === request.id}
                    onClick={() => handleDecision(request, "rejected")}
                    className="rounded-full border border-rose-500/30 px-3 py-2 text-xs text-rose-200 transition hover:border-rose-400 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    Reject
                  </button>
                </>
              )}
            />
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

