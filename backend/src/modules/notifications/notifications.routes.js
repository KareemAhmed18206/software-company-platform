import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware.js";
import {
  listMyNotifications,
  readAllNotifications,
  readNotification
} from "./notifications.controller.js";

const router = Router();

router.use(authenticate);
router.get("/", listMyNotifications);
router.patch("/:id/read", readNotification);
router.patch("/read-all", readAllNotifications);

export default router;

