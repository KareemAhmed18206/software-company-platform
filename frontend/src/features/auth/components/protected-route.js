"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "../hooks/use-auth";
import { getDefaultDashboardRoute } from "../utils/auth-routes";

export function ProtectedRoute({ allowedRoles = [], children }) {
  const allowedRolesKey = allowedRoles.join(",");
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (user && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      router.replace(getDefaultDashboardRoute(user.role));
    }
  }, [
    allowedRoles,
    allowedRolesKey,
    isAuthenticated,
    isLoading,
    pathname,
    router,
    user
  ]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-5 text-sm text-slate-300">
          Validating your session...
        </div>
      </div>
    );
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-5 text-sm text-slate-300">
          Redirecting to the correct dashboard...
        </div>
      </div>
    );
  }

  return children;
}

