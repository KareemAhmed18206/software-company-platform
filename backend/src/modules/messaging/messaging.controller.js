import { asyncHandler } from "../../utils/async-handler.js";
import {
  ensureDirectConversation,
  getConversationMessages,
  listMyConversations,
  sendConversationMessage
} from "./messaging.service.js";

export const listMyMessagingConversations = asyncHandler(async (req, res) => {
  const conversations = await listMyConversations(req.user);
  res.status(200).json({ conversations });
});

export const createDirectConversation = asyncHandler(async (req, res) => {
  const conversation = await ensureDirectConversation(req.user, req.body);
  res.status(201).json({ conversation });
});

export const getConversationHistory = asyncHandler(async (req, res) => {
  const result = await getConversationMessages(req.params.id, req.user);
  res.status(200).json(result);
});

export const postConversationMessage = asyncHandler(async (req, res) => {
  const message = await sendConversationMessage(
    req.params.id,
    req.user,
    req.body
  );
  res.status(201).json({ message });
});

