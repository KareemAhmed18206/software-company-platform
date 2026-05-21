import Link from "next/link";

export function AuthShell({
  title,
  description,
  footerPrompt,
  footerLink,
  footerLabel,
  children
}) {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full gap-8 overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur lg:grid-cols-[1.2fr_0.8fr]">
          <section className="bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.35),_transparent_50%),linear-gradient(135deg,_rgba(15,23,42,0.95),_rgba(2,6,23,1))] p-8 sm:p-12">
            <span className="inline-flex rounded-full border border-brand/30 bg-brand/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-brand-light">
              Secure Access
            </span>
            <h1 className="mt-6 max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-xl text-base text-slate-300 sm:text-lg">
              {description}
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {[
                "JWT sessions with protected API routes",
                "Admin and client role separation",
                "bcrypt password hashing",
                "Dashboard redirects after sign-in"
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="flex items-center p-6 sm:p-10">
            <div className="w-full rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/30">
              {children}

              <p className="mt-6 text-sm text-slate-400">
                {footerPrompt}{" "}
                <Link
                  href={footerLink}
                  className="font-medium text-brand-light transition hover:text-white"
                >
                  {footerLabel}
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

