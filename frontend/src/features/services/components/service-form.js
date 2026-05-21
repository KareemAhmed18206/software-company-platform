"use client";

import { serviceCategories } from "../config/service-categories";

export function ServiceForm({
  formData,
  onChange,
  onSubmit,
  onCancel,
  submitLabel,
  isSubmitting,
  error,
  isEditing
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[2rem] border border-white/10 bg-white/5 p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-brand-light">
            {isEditing ? "Edit Service" : "Create Service"}
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-white">
            {isEditing ? "Update offering details" : "Add a new service offering"}
          </h2>
        </div>

        {isEditing ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-white/20"
          >
            Cancel
          </button>
        ) : null}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">
            Title
          </span>
          <input
            required
            name="title"
            value={formData.title}
            onChange={onChange}
            className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-brand"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">
            Category
          </span>
          <select
            required
            name="category"
            value={formData.category}
            onChange={onChange}
            className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-brand"
          >
            {serviceCategories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">
            Price from
          </span>
          <input
            required
            min="0"
            type="number"
            name="priceFrom"
            value={formData.priceFrom}
            onChange={onChange}
            className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-brand"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">
            Delivery estimate
          </span>
          <input
            required
            name="deliveryEstimate"
            value={formData.deliveryEstimate}
            onChange={onChange}
            className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-brand"
            placeholder="e.g. 4-8 weeks"
          />
        </label>

        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-medium text-slate-200">
            Short description
          </span>
          <textarea
            required
            rows="3"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={onChange}
            className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-brand"
          />
        </label>

        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-medium text-slate-200">
            Full description
          </span>
          <textarea
            required
            rows="5"
            name="fullDescription"
            value={formData.fullDescription}
            onChange={onChange}
            className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-brand"
          />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap gap-6">
        <label className="inline-flex items-center gap-3 text-sm text-slate-300">
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={onChange}
            className="h-4 w-4 rounded border-white/10 bg-slate-950 text-brand"
          />
          Featured on marketing pages
        </label>

        <label className="inline-flex items-center gap-3 text-sm text-slate-300">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={onChange}
            className="h-4 w-4 rounded border-white/10 bg-slate-950 text-brand"
          />
          Active and visible to clients
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
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

