import { asyncHandler } from "../../utils/async-handler.js";
import { getChatbotReply } from "./chatbot.service.js";

export const sendChatbotMessage = asyncHandler(async (req, res) => {
  const result = await getChatbotReply(req.body);
  res.status(200).json(result);
});

