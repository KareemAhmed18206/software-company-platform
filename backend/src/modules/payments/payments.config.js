import { env } from "../../config/env.js";

export const subscriptionPlans = [
  {
    key: "starter",
    name: "Starter",
    description: "Best for small teams validating a product idea.",
    amount: 2900,
    currency: "usd",
    stripePriceId: env.STRIPE_PRICE_STARTER
  },
  {
    key: "growth",
    name: "Growth",
    description: "For teams scaling service delivery and client workflows.",
    amount: 5900,
    currency: "usd",
    stripePriceId: env.STRIPE_PRICE_GROWTH
  },
  {
    key: "scale",
    name: "Scale",
    description: "For advanced organizations with heavier integration needs.",
    amount: 9900,
    currency: "usd",
    stripePriceId: env.STRIPE_PRICE_SCALE
  }
];

