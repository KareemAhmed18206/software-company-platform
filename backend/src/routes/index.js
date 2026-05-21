import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import chatbotRoutes from "../modules/chatbot/chatbot.routes.js";
import messagingRoutes from "../modules/messaging/messaging.routes.js";
import notificationsRoutes from "../modules/notifications/notifications.routes.js";
import paymentsRoutes from "../modules/payments/payments.routes.js";
import projectRequestsRoutes from "../modules/project-requests/project-requests.routes.js";
import servicesRoutes from "../modules/services/services.routes.js";
import userRoutes from "../modules/users/users.routes.js";
import healthRoutes from "./health.routes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/chatbot", chatbotRoutes);
router.use("/messaging", messagingRoutes);
router.use("/notifications", notificationsRoutes);
router.use("/payments", paymentsRoutes);
router.use("/project-requests", projectRequestsRoutes);
router.use("/services", servicesRoutes);
router.use("/users", userRoutes);

export default router;
