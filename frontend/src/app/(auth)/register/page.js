"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AuthShell } from "@/features/auth/components/auth-shell";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { getDefaultDashboardRoute } from "@/features/auth/utils/auth-routes";

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, register, user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "client"
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      router.replace(getDefaultDashboardRoute(user.role));
    }
  }, [isAuthenticated, isLoading, router, user]);

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
      const response = await register(formData);

      router.replace(getDefaultDashboardRoute(response.user.role));
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Create a secure account."
      description="Register as an admin or client account, receive a JWT session, and land directly in the correct protected dashboard."
      footerPrompt="Already registered?"
      footerLink="/login"
      footerLabel="Login instead"
    >
      <div>
        <h2 className="text-2xl font-semibold text-white">Register</h2>
        <p className="mt-2 text-sm text-slate-400">
          Passwords are hashed with bcrypt before they are stored.
        </p>
      </div>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">
            Full name
          </span>
          <input
            required
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-brand"
            placeholder="Your name"
          />
        </label>

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
            placeholder="Choose a strong password"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">
            Account role
          </span>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-brand"
          >
            <option value="client">Client</option>
            <option value="admin">Admin</option>
          </select>
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
          {isSubmitting ? "Creating account..." : "Register"}
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

