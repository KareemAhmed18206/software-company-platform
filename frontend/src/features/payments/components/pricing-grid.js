"use client";

export function PricingGrid({ plans, onCheckout, isSubmittingKey, error }) {
  return (
    <div>
      {error ? (
        <div className="mb-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan.key}
            className="rounded-[2rem] border border-white/10 bg-white/5 p-6"
          >
            <p className="text-sm uppercase tracking-[0.2em] text-brand-light">
              {plan.name}
            </p>
            <p className="mt-4 text-4xl font-semibold text-white">
              ${plan.amount / 100}
              <span className="text-base font-normal text-slate-400">/mo</span>
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              {plan.description}
            </p>
            <button
              type="button"
              onClick={() => onCheckout(plan.key)}
              disabled={isSubmittingKey === plan.key}
              className="mt-6 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmittingKey === plan.key ? "Processing..." : "Start checkout"}
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

