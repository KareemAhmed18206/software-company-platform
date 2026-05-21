import mongoose from "mongoose";

import { isDatabaseConnected } from "../../config/db.js";
import { Notification } from "../../models/Notification.js";

const ensureDatabase = () => {
  if (!isDatabaseConnected()) {
    throw new Error("Database connection is required for notifications.");
  }
};

export const createNotificationRecord = async (payload) => {
  ensureDatabase();
  const notification = await Notification.create(payload);
  return notification.toObject();
};

export const listNotificationsByUser = async (userId) => {
  ensureDatabase();
  return Notification.find({ userId }).sort({ createdAt: -1 }).lean();
};

export const markNotificationReadRecord = async (notificationId, userId) => {
  ensureDatabase();
  if (!mongoose.Types.ObjectId.isValid(notificationId)) {
    return null;
  }

  return Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { isRead: true },
    { new: true }
  ).lean();
};

export const markAllNotificationsReadRecord = async (userId) => {
  ensureDatabase();
  await Notification.updateMany({ userId, isRead: false }, { isRead: true });
};

export const countUnreadNotificationsByUser = async (userId) => {
  ensureDatabase();
  return Notification.countDocuments({ userId, isRead: false });
};

