import { Suspense } from "react";

import { LoginForm } from "@/features/auth/components/login-form";

const LoginFallback = () => (
  <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
    <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-5 text-sm text-slate-300">
      Loading login form...
    </div>
  </main>
);

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}

