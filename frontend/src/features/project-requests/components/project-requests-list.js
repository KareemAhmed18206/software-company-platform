const statusClasses = {
  pending: "bg-amber-500/15 text-amber-200",
  accepted: "bg-emerald-500/15 text-emerald-200",
  rejected: "bg-rose-500/15 text-rose-200"
};

export function ProjectRequestsList({ requests, emptyMessage, actions }) {
  if (requests.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/5 p-6 text-sm text-slate-300">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <article
          key={request.id}
          className="rounded-[2rem] border border-white/10 bg-white/5 p-6"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-2xl font-semibold text-white">
                  {request.projectName}
                </h3>
                <span
                  className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.18em] ${statusClasses[request.status]}`}
                >
                  {request.status}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-300">
                {request.companyName} • {request.service?.title} • ${request.budget}
              </p>
            </div>

            {actions ? <div className="flex flex-wrap gap-2">{actions(request)}</div> : null}
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-slate-950/65 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Timeline
              </p>
              <p className="mt-3 text-sm text-slate-200">{request.timeline}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/65 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Client
              </p>
              <p className="mt-3 text-sm text-slate-200">
                {request.client ? `${request.client.name} • ${request.client.email}` : "Current user"}
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/65 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              Goals
            </p>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-200">
              {request.goals}
            </p>
          </div>

          {request.notes ? (
            <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/65 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Notes
              </p>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-200">
                {request.notes}
              </p>
            </div>
          ) : null}

          {request.adminDecisionNote ? (
            <div className="mt-4 rounded-2xl border border-brand/20 bg-brand/10 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-brand-light">
                Decision Note
              </p>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-100">
                {request.adminDecisionNote}
              </p>
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}

