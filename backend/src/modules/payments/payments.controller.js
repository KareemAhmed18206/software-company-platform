import { asyncHandler } from "../../utils/async-handler.js";
import {
  createCheckoutSession,
  getMyPayments,
  getSubscriptionPlans,
  handleCheckoutCancel,
  handleCheckoutSuccess
} from "./payments.service.js";

export const listPlans = asyncHandler(async (_req, res) => {
  const plans = await getSubscriptionPlans();
  res.status(200).json({ plans });
});

export const listMyPaymentHistory = asyncHandler(async (req, res) => {
  const payments = await getMyPayments(req.user);
  res.status(200).json({ payments });
});

export const createCheckout = asyncHandler(async (req, res) => {
  const result = await createCheckoutSession(req.user, req.body);
  res.status(201).json(result);
});

export const confirmCheckoutSuccess = asyncHandler(async (req, res) => {
  const payment = await handleCheckoutSuccess(req.body.sessionId);
  res.status(200).json({ payment });
});

export const confirmCheckoutCancel = asyncHandler(async (req, res) => {
  const payment = await handleCheckoutCancel(req.body.sessionId);
  res.status(200).json({ payment });
});

