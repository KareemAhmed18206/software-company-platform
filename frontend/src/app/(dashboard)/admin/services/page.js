"use client";

import { useEffect, useState } from "react";

import { ProtectedRoute } from "@/features/auth/components/protected-route";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { StatCard } from "@/features/dashboard/components/stat-card";
import { ServiceForm } from "@/features/services/components/service-form";
import { ServicesTable } from "@/features/services/components/services-table";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { apiRequest } from "@/lib/api/client";

const initialForm = {
  title: "",
  category: "web",
  shortDescription: "",
  fullDescription: "",
  priceFrom: "1500",
  deliveryEstimate: "",
  featured: false,
  isActive: true
};

export default function AdminServicesPage() {
  const { token } = useAuth();
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [error, setError] = useState("");
  const [pageError, setPageError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState("");

  const loadServices = async () => {
    const response = await apiRequest("/services/admin/all", { token });
    setServices(response.services);
  };

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      if (!token) {
        return;
      }

      try {
        const response = await apiRequest("/services/admin/all", { token });

        if (!isMounted) {
          return;
        }

        setServices(response.services);
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
    const { name, value, type, checked } = event.target;

    setFormData((currentValue) => ({
      ...currentValue,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (editingServiceId) {
        await apiRequest(`/services/${editingServiceId}`, {
          method: "PATCH",
          body: formData,
          token
        });
      } else {
        await apiRequest("/services", {
          method: "POST",
          body: formData,
          token
        });
      }

      await loadServices();
      setFormData(initialForm);
      setEditingServiceId(null);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (service) => {
    setEditingServiceId(service.id);
    setFormData({
      title: service.title,
      category: service.category,
      shortDescription: service.shortDescription,
      fullDescription: service.fullDescription,
      priceFrom: String(service.priceFrom),
      deliveryEstimate: service.deliveryEstimate,
      featured: service.featured,
      isActive: service.isActive
    });
    setError("");
  };

  const handleCancelEdit = () => {
    setEditingServiceId(null);
    setFormData(initialForm);
    setError("");
  };

  const handleDelete = async (service) => {
    setIsDeletingId(service.id);
    setPageError("");

    try {
      await apiRequest(`/services/${service.id}`, {
        method: "DELETE",
        token
      });

      await loadServices();

      if (editingServiceId === service.id) {
        handleCancelEdit();
      }
    } catch (deleteError) {
      setPageError(deleteError.message);
    } finally {
      setIsDeletingId("");
    }
  };

  const activeCount = services.filter((service) => service.isActive).length;
  const featuredCount = services.filter((service) => service.featured).length;

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardLayout
        title="Services Management"
        description="Create, update, hide, and feature the services that power both the marketing site and client-facing catalog."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Total Services" value={services.length} hint="All records in the catalog" />
          <StatCard label="Active Services" value={activeCount} hint="Visible to clients and landing pages" />
          <StatCard label="Featured Services" value={featuredCount} hint="Highlighted across the website" />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.25fr]">
          <ServiceForm
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={handleCancelEdit}
            submitLabel={editingServiceId ? "Update Service" : "Create Service"}
            isSubmitting={isSubmitting}
            error={error}
            isEditing={Boolean(editingServiceId)}
          />

          <div className="space-y-4">
            {pageError ? (
              <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {pageError}
              </div>
            ) : null}

            {isLoading ? (
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
                Loading services catalog...
              </div>
            ) : (
              <ServicesTable
                services={services}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isDeletingId={isDeletingId}
              />
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

