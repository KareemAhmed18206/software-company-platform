import { getIo } from "../../socket/io.js";
import { createHttpError } from "../../utils/create-http-error.js";
import {
  countUnreadNotificationsByUser,
  createNotificationRecord,
  listNotificationsByUser,
  markAllNotificationsReadRecord,
  markNotificationReadRecord
} from "./notifications.repository.js";

const sanitizeNotification = (notification) => ({
  id: notification._id?.toString() || notification.id,
  type: notification.type,
  title: notification.title,
  message: notification.message,
  data: notification.data || {},
  isRead: notification.isRead,
  createdAt: notification.createdAt,
  updatedAt: notification.updatedAt
});

export const sendNotification = async (payload) => {
  const notification = await createNotificationRecord(payload);
  const sanitized = sanitizeNotification(notification);
  const io = getIo();

  if (io) {
    io.to(`user:${payload.userId.toString()}`).emit(
      "notification:new",
      sanitized
    );
  }

  return sanitized;
};

export const getNotifications = async (user) => {
  const notifications = await listNotificationsByUser(user.id);
  const unreadCount = await countUnreadNotificationsByUser(user.id);

  return {
    notifications: notifications.map(sanitizeNotification),
    unreadCount
  };
};

export const markNotificationRead = async (notificationId, user) => {
  const notification = await markNotificationReadRecord(notificationId, user.id);

  if (!notification) {
    throw createHttpError(404, "Notification not found.");
  }

  return sanitizeNotification(notification);
};

export const markAllNotificationsRead = async (user) => {
  await markAllNotificationsReadRecord(user.id);
};

