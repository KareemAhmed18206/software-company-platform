import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware.js";
import {
  confirmCheckoutCancel,
  confirmCheckoutSuccess,
  createCheckout,
  listMyPaymentHistory,
  listPlans
} from "./payments.controller.js";

const router = Router();

router.get("/plans", listPlans);
router.get("/", authenticate, listMyPaymentHistory);
router.post("/checkout", authenticate, createCheckout);
router.post("/checkout/success", authenticate, confirmCheckoutSuccess);
router.post("/checkout/cancel", authenticate, confirmCheckoutCancel);

export default router;

