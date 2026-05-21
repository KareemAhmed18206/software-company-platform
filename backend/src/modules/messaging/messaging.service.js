import { getIo } from "../../socket/io.js";
import { createHttpError } from "../../utils/create-http-error.js";
import { sendNotification } from "../notifications/notifications.service.js";
import { User } from "../../models/User.js";
import {
  createConversationRecord,
  createMessageRecord,
  findConversationBetweenUsers,
  findConversationById,
  listConversationsForUser,
  listMessagesForConversation,
  markMessagesReadByConversation
} from "./messaging.repository.js";

const sanitizeConversation = (conversation) => ({
  id: conversation._id?.toString() || conversation.id,
  title: conversation.title,
  lastMessageAt: conversation.lastMessageAt,
  participants: (conversation.participantIds || []).map((participant) => ({
    id: participant._id?.toString() || participant.id,
    name: participant.name,
    email: participant.email,
    role: participant.role
  })),
  createdAt: conversation.createdAt,
  updatedAt: conversation.updatedAt
});

const sanitizeMessage = (message) => ({
  id: message._id?.toString() || message.id,
  conversationId:
    message.conversationId?._id?.toString() ||
    message.conversationId?.toString() ||
    message.conversationId,
  content: message.content,
  sender: message.senderId
    ? {
        id: message.senderId._id?.toString() || message.senderId.id,
        name: message.senderId.name,
        email: message.senderId.email,
        role: message.senderId.role
      }
    : null,
  readBy: (message.readBy || []).map((entry) => entry.toString()),
  createdAt: message.createdAt,
  updatedAt: message.updatedAt
});

const ensureConversationMember = (conversation, user) => {
  const isMember = (conversation.participantIds || []).some(
    (participant) => (participant._id?.toString() || participant.id) === user.id
  );

  if (!isMember) {
    throw createHttpError(403, "You do not have access to this conversation.");
  }
};

export const listMyConversations = async (user) => {
  const conversations = await listConversationsForUser(user.id);
  return conversations.map(sanitizeConversation);
};

export const ensureDirectConversation = async (user, payload) => {
  if (!payload.otherUserId?.trim()) {
    throw createHttpError(400, "Recipient is required.");
  }

  if (payload.otherUserId === user.id) {
    throw createHttpError(400, "You cannot start a conversation with yourself.");
  }

  const otherUser = await User.findById(payload.otherUserId).lean();

  if (!otherUser) {
    throw createHttpError(404, "Recipient not found.");
  }

  const participantIds = [user.id, payload.otherUserId].sort();
  const existingConversation = await findConversationBetweenUsers(participantIds);

  if (existingConversation) {
    return sanitizeConversation(existingConversation);
  }

  const conversation = await createConversationRecord({
    title: payload.title?.trim() || "",
    participantIds
  });

  return sanitizeConversation(conversation);
};

export const getConversationMessages = async (conversationId, user) => {
  const conversation = await findConversationById(conversationId);

  if (!conversation) {
    throw createHttpError(404, "Conversation not found.");
  }

  ensureConversationMember(conversation, user);
  await markMessagesReadByConversation(conversationId, user.id);
  const messages = await listMessagesForConversation(conversationId);

  return {
    conversation: sanitizeConversation(conversation),
    messages: messages.map(sanitizeMessage)
  };
};

export const sendConversationMessage = async (conversationId, user, payload) => {
  if (!payload.content?.trim()) {
    throw createHttpError(400, "Message content is required.");
  }

  const conversation = await findConversationById(conversationId);

  if (!conversation) {
    throw createHttpError(404, "Conversation not found.");
  }

  ensureConversationMember(conversation, user);

  const message = await createMessageRecord({
    conversationId,
    senderId: user.id,
    content: payload.content.trim(),
    readBy: [user.id]
  });

  const sanitizedMessage = sanitizeMessage(message);
  const io = getIo();

  if (io) {
    io.to(`conversation:${conversationId}`).emit(
      "message:new",
      sanitizedMessage
    );
  }

  const recipients = (conversation.participantIds || []).filter(
    (participant) => (participant._id?.toString() || participant.id) !== user.id
  );

  await Promise.all(
    recipients.map((participant) =>
      sendNotification({
        userId: participant._id?.toString() || participant.id,
        type: "message",
        title: `New message from ${user.name}`,
        message: payload.content.trim(),
        data: {
          conversationId
        }
      })
    )
  );

  return sanitizedMessage;
};

