import mongoose from "mongoose";

import { isDatabaseConnected } from "../../config/db.js";
import { Conversation } from "../../models/Conversation.js";
import { Message } from "../../models/Message.js";

const ensureDatabase = () => {
  if (!isDatabaseConnected()) {
    throw new Error("Database connection is required for messaging.");
  }
};

const conversationPopulate = [{ path: "participantIds", select: "name email role" }];
const messagePopulate = [{ path: "senderId", select: "name email role" }];

export const findConversationById = async (conversationId) => {
  ensureDatabase();
  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    return null;
  }

  return Conversation.findById(conversationId)
    .populate(conversationPopulate)
    .lean();
};

export const listConversationsForUser = async (userId) => {
  ensureDatabase();
  return Conversation.find({ participantIds: userId })
    .populate(conversationPopulate)
    .sort({ lastMessageAt: -1, updatedAt: -1 })
    .lean();
};

export const findConversationBetweenUsers = async (participantIds) => {
  ensureDatabase();
  return Conversation.findOne({
    participantIds: { $all: participantIds, $size: participantIds.length }
  })
    .populate(conversationPopulate)
    .lean();
};

export const createConversationRecord = async (payload) => {
  ensureDatabase();
  const conversation = await Conversation.create(payload);
  return Conversation.findById(conversation._id)
    .populate(conversationPopulate)
    .lean();
};

export const listMessagesForConversation = async (conversationId) => {
  ensureDatabase();
  return Message.find({ conversationId })
    .populate(messagePopulate)
    .sort({ createdAt: 1 })
    .lean();
};

export const createMessageRecord = async (payload) => {
  ensureDatabase();
  const message = await Message.create(payload);
  await Conversation.findByIdAndUpdate(payload.conversationId, {
    lastMessageAt: message.createdAt
  });
  return Message.findById(message._id).populate(messagePopulate).lean();
};

export const markMessagesReadByConversation = async (conversationId, userId) => {
  ensureDatabase();
  await Message.updateMany(
    { conversationId, readBy: { $ne: userId } },
    { $addToSet: { readBy: userId } }
  );
};

