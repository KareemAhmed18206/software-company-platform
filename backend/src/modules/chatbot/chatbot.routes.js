import { Router } from "express";

import { sendChatbotMessage } from "./chatbot.controller.js";

const router = Router();

router.post("/message", sendChatbotMessage);

export default router;

