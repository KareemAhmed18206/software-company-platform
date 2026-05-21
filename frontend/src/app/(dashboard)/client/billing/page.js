"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { ProtectedRoute } from "@/features/auth/components/protected-route";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { PricingGrid } from "@/features/payments/components/pricing-grid";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { apiRequest } from "@/lib/api/client";

function ClientBillingContent() {
  const searchParams = useSearchParams();
  const { token } = useAuth();
  const [plans, setPlans] = useState([]);
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");
  const [isSubmittingKey, setIsSubmittingKey] = useState("");

  const paymentStatus = searchParams.get("payment");
  const sessionId = searchParams.get("session_id");

  const loadPayments = async () => {
    const [plansResponse, paymentsResponse] = await Promise.all([
      apiRequest("/payments/plans"),
      apiRequest("/payments", { token })
    ]);

    setPlans(plansResponse.plans);
    setPayments(paymentsResponse.payments);
  };

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      if (!token) {
        return;
      }

      try {
        if (paymentStatus === "success" && sessionId) {
          await apiRequest("/payments/checkout/success", {
            method: "POST",
            token,
            body: { sessionId }
          });
        }

        if (paymentStatus === "cancel" && sessionId) {
          await apiRequest("/payments/checkout/cancel", {
            method: "POST",
            token,
            body: { sessionId }
          });
        }

        const [plansResponse, paymentsResponse] = await Promise.all([
          apiRequest("/payments/plans"),
          apiRequest("/payments", { token })
        ]);

        if (!isMounted) {
          return;
        }

        setPlans(plansResponse.plans);
        setPayments(paymentsResponse.payments);
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message);
        }
      }
    };

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, [token, paymentStatus, sessionId]);

  const handleCheckout = async (planKey) => {
    setError("");
    setIsSubmittingKey(planKey);

    try {
      const response = await apiRequest("/payments/checkout", {
        method: "POST",
        token,
        body: { planKey }
      });

      if (response.checkoutUrl) {
        window.location.href = response.checkoutUrl;
      }
    } catch (checkoutError) {
      setError(checkoutError.message);
    } finally {
      setIsSubmittingKey("");
      await loadPayments();
    }
  };

  return (
    <ProtectedRoute allowedRoles={["client"]}>
      <DashboardLayout
        title="Billing & Plans"
        description="Subscription plans, checkout handling, and payment history are wired into the dashboard foundation."
      >
        <PricingGrid
          plans={plans}
          onCheckout={handleCheckout}
          isSubmittingKey={isSubmittingKey}
          error={error}
        />

        <section className="mt-6 rounded-[2rem] border border-white/10 bg-white/5 p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-brand-light">
            Payment Records
          </p>
          <div className="mt-4 space-y-3">
            {payments.length === 0 ? (
              <p className="text-sm text-slate-400">No payment records yet.</p>
            ) : null}

            {payments.map((payment) => (
              <article
                key={payment.id}
                className="rounded-2xl border border-white/10 bg-slate-950/70 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {payment.planName}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      ${payment.amount / 100} • {payment.status}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

export default function ClientBillingPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
            Loading billing...
          </div>
        </main>
      }
    >
      <ClientBillingContent />
    </Suspense>
  );
}
