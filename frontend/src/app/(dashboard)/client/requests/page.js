"use client";

import { useEffect, useState } from "react";

import { ProtectedRoute } from "@/features/auth/components/protected-route";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { StatCard } from "@/features/dashboard/components/stat-card";
import { ProjectRequestForm } from "@/features/project-requests/components/project-request-form";
import { ProjectRequestsList } from "@/features/project-requests/components/project-requests-list";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { apiRequest } from "@/lib/api/client";

const initialForm = {
  projectName: "",
  companyName: "",
  serviceId: "",
  budget: "2500",
  timeline: "",
  goals: "",
  notes: ""
};

export default function ClientRequestsPage() {
  const { token } = useAuth();
  const [services, setServices] = useState([]);
  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");
  const [pageError, setPageError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadPageData = async () => {
    const [servicesResponse, requestsResponse] = await Promise.all([
      apiRequest("/services"),
      apiRequest("/project-requests/my", { token })
    ]);

    setServices(servicesResponse.services);
    setRequests(requestsResponse.projectRequests);
  };

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      if (!token) {
        return;
      }

      try {
        const [servicesResponse, requestsResponse] = await Promise.all([
          apiRequest("/services"),
          apiRequest("/project-requests/my", { token })
        ]);

        if (!isMounted) {
          return;
        }

        setServices(servicesResponse.services);
        setRequests(requestsResponse.projectRequests);
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await apiRequest("/project-requests", {
        method: "POST",
        token,
        body: formData
      });

      await loadPageData();
      setFormData(initialForm);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const pendingCount = requests.filter((request) => request.status === "pending").length;
  const acceptedCount = requests.filter((request) => request.status === "accepted").length;
  const rejectedCount = requests.filter((request) => request.status === "rejected").length;

  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <DashboardLayout
        title="Project Requests"
        description="Submit new requests tied to published services and track whether each brief is pending, accepted, or rejected."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Pending" value={pendingCount} hint="Waiting for admin review" />
          <StatCard label="Accepted" value={acceptedCount} hint="Approved for next phase" />
          <StatCard label="Rejected" value={rejectedCount} hint="Closed or needs revision" />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.25fr]">
          <ProjectRequestForm
            formData={formData}
            services={services}
            onChange={handleChange}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            error={error}
          />

          <div className="space-y-4">
            {pageError ? (
              <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {pageError}
              </div>
            ) : null}

            {isLoading ? (
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
                Loading your project requests...
              </div>
            ) : (
              <ProjectRequestsList
                requests={requests}
                emptyMessage="No project requests yet. Submit your first brief to start the intake process."
              />
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

