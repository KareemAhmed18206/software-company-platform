"use client";

export function ProjectRequestForm({
  formData,
  services,
  onChange,
  onSubmit,
  isSubmitting,
  error
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[2rem] border border-white/10 bg-white/5 p-6"
    >
      <p className="text-sm uppercase tracking-[0.2em] text-brand-light">
        New Request
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-white">
        Submit a project brief
      </h2>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">
            Project name
          </span>
          <input
            required
            name="projectName"
            value={formData.projectName}
            onChange={onChange}
            className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-brand"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">
            Company name
          </span>
          <input
            required
            name="companyName"
            value={formData.companyName}
            onChange={onChange}
            className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-brand"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">
            Service
          </span>
          <select
            required
            name="serviceId"
            value={formData.serviceId}
            onChange={onChange}
            className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-brand"
          >
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.title}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">
            Budget
          </span>
          <input
            required
            min="0"
            type="number"
            name="budget"
            value={formData.budget}
            onChange={onChange}
            className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-brand"
          />
        </label>

        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-medium text-slate-200">
            Timeline
          </span>
          <input
            required
            name="timeline"
            value={formData.timeline}
            onChange={onChange}
            className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-brand"
            placeholder="e.g. MVP in 6 weeks"
          />
        </label>

        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-medium text-slate-200">
            Goals
          </span>
          <textarea
            required
            rows="4"
            name="goals"
            value={formData.goals}
            onChange={onChange}
            className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-brand"
          />
        </label>

        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-medium text-slate-200">
            Extra notes
          </span>
          <textarea
            rows="3"
            name="notes"
            value={formData.notes}
            onChange={onChange}
            className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-brand"
          />
        </label>
      </div>

      {error ? (
        <div className="mt-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Submitting..." : "Submit Request"}
      </button>
    </form>
  );
}

