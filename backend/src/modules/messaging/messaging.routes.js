import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware.js";
import {
  createDirectConversation,
  getConversationHistory,
  listMyMessagingConversations,
  postConversationMessage
} from "./messaging.controller.js";

const router = Router();

router.use(authenticate);
router.get("/conversations", listMyMessagingConversations);
router.post("/conversations", createDirectConversation);
router.get("/conversations/:id/messages", getConversationHistory);
router.post("/conversations/:id/messages", postConversationMessage);

export default router;

