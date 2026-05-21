export function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/65 p-5">
      <p className="text-sm uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
      {hint ? <p className="mt-3 text-sm text-slate-300">{hint}</p> : null}
    </div>
  );
}

