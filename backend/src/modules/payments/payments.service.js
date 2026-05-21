import Stripe from "stripe";

import { env } from "../../config/env.js";
import { createHttpError } from "../../utils/create-http-error.js";
import { sendNotification } from "../notifications/notifications.service.js";
import { subscriptionPlans } from "./payments.config.js";
import {
  createPaymentRecord,
  listPaymentsForUser,
  updatePaymentByStripeSessionId
} from "./payments.repository.js";

const stripe = env.STRIPE_SECRET_KEY
  ? new Stripe(env.STRIPE_SECRET_KEY)
  : null;

const sanitizePayment = (payment) => ({
  id: payment._id?.toString() || payment.id,
  planKey: payment.planKey,
  planName: payment.planName,
  amount: payment.amount,
  currency: payment.currency,
  status: payment.status,
  provider: payment.provider,
  stripeSessionId: payment.stripeSessionId,
  createdAt: payment.createdAt,
  updatedAt: payment.updatedAt
});

export const getSubscriptionPlans = async () => subscriptionPlans;

export const getMyPayments = async (user) => {
  const payments = await listPaymentsForUser(user.id);
  return payments.map(sanitizePayment);
};

export const createCheckoutSession = async (user, payload) => {
  const plan = subscriptionPlans.find((entry) => entry.key === payload.planKey);

  if (!plan) {
    throw createHttpError(404, "Subscription plan not found.");
  }

  if (!stripe || !plan.stripePriceId) {
    throw createHttpError(
      503,
      "Stripe is not fully configured yet. Add Stripe environment values to enable checkout."
    );
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    success_url: `${env.CLIENT_URL}/client/billing?payment=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.CLIENT_URL}/client/billing?payment=cancel`,
    line_items: [
      {
        price: plan.stripePriceId,
        quantity: 1
      }
    ],
    customer_email: user.email,
    metadata: {
      userId: user.id,
      planKey: plan.key
    }
  });

  const payment = await createPaymentRecord({
    userId: user.id,
    planKey: plan.key,
    planName: plan.name,
    amount: plan.amount,
    currency: plan.currency,
    status: "pending",
    stripeSessionId: session.id
  });

  return {
    checkoutUrl: session.url,
    payment: sanitizePayment(payment)
  };
};

export const handleCheckoutSuccess = async (sessionId) => {
  const payment = await updatePaymentByStripeSessionId(sessionId, {
    status: "paid"
  });

  if (!payment) {
    throw createHttpError(404, "Payment record not found.");
  }

  await sendNotification({
    userId: payment.userId.toString(),
    type: "payment",
    title: "Payment completed",
    message: `${payment.planName} subscription payment succeeded.`,
    data: {
      paymentId: payment._id?.toString() || payment.id
    }
  });

  return sanitizePayment(payment);
};

export const handleCheckoutCancel = async (sessionId) => {
  const payment = await updatePaymentByStripeSessionId(sessionId, {
    status: "canceled"
  });

  if (!payment) {
    throw createHttpError(404, "Payment record not found.");
  }

  return sanitizePayment(payment);
};

