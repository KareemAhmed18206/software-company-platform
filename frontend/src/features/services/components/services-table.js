"use client";

export function ServicesTable({ services, onEdit, onDelete, isDeletingId }) {
  if (services.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/5 p-6 text-sm text-slate-300">
        No services yet. Create your first offering to populate the landing page and client catalog.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-slate-200">
          <thead className="bg-white/5 text-xs uppercase tracking-[0.18em] text-slate-400">
            <tr>
              <th className="px-5 py-4">Service</th>
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4">Price</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id} className="border-t border-white/10">
                <td className="px-5 py-4">
                  <div className="font-semibold text-white">{service.title}</div>
                  <div className="mt-1 text-slate-400">{service.shortDescription}</div>
                </td>
                <td className="px-5 py-4 text-slate-300">{service.categoryLabel}</td>
                <td className="px-5 py-4 text-slate-300">${service.priceFrom}</td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        service.isActive
                          ? "bg-emerald-500/15 text-emerald-200"
                          : "bg-slate-500/15 text-slate-300"
                      }`}
                    >
                      {service.isActive ? "Active" : "Hidden"}
                    </span>
                    {service.featured ? (
                      <span className="rounded-full bg-brand/15 px-3 py-1 text-xs text-brand-light">
                        Featured
                      </span>
                    ) : null}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(service)}
                      className="rounded-full border border-white/10 px-3 py-2 text-xs text-slate-200 transition hover:border-brand hover:text-white"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={isDeletingId === service.id}
                      onClick={() => onDelete(service)}
                      className="rounded-full border border-rose-500/20 px-3 py-2 text-xs text-rose-200 transition hover:border-rose-400 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isDeletingId === service.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

