"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { getDefaultDashboardRoute } from "@/features/auth/utils/auth-routes";
import { AuthShell } from "./auth-shell";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading, login, user } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextPath = searchParams.get("next");

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      router.replace(nextPath || getDefaultDashboardRoute(user.role));
    }
  }, [isAuthenticated, isLoading, nextPath, router, user]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentValue) => ({
      ...currentValue,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await login(formData);

      router.replace(nextPath || getDefaultDashboardRoute(response.user.role));
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back."
      description="Log in to access your admin or client workspace. The dashboard you see depends on your authenticated role."
      footerPrompt="Need an account?"
      footerLink="/register"
      footerLabel="Create one"
    >
      <div>
        <h2 className="text-2xl font-semibold text-white">Login</h2>
        <p className="mt-2 text-sm text-slate-400">
          Use your registered email and password to continue.
        </p>
      </div>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">
            Email
          </span>
          <input
            required
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-brand"
            placeholder="you@company.com"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">
            Password
          </span>
          <input
            required
            minLength={8}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-brand"
            placeholder="At least 8 characters"
          />
        </label>

        {error ? (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="mt-6 text-sm text-slate-400">
        <Link href="/" className="text-brand-light transition hover:text-white">
          Back to website
        </Link>
      </div>
    </AuthShell>
  );
}
