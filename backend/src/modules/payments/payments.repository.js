import { isDatabaseConnected } from "../../config/db.js";
import { Payment } from "../../models/Payment.js";

const ensureDatabase = () => {
  if (!isDatabaseConnected()) {
    throw new Error("Database connection is required for payments.");
  }
};

export const createPaymentRecord = async (payload) => {
  ensureDatabase();
  const payment = await Payment.create(payload);
  return payment.toObject();
};

export const listPaymentsForUser = async (userId) => {
  ensureDatabase();
  return Payment.find({ userId }).sort({ createdAt: -1 }).lean();
};

export const updatePaymentByStripeSessionId = async (stripeSessionId, payload) => {
  ensureDatabase();
  return Payment.findOneAndUpdate({ stripeSessionId }, payload, {
    new: true
  }).lean();
};

