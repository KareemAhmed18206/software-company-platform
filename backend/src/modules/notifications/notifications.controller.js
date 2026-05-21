import { asyncHandler } from "../../utils/async-handler.js";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead
} from "./notifications.service.js";

export const listMyNotifications = asyncHandler(async (req, res) => {
  const result = await getNotifications(req.user);
  res.status(200).json(result);
});

export const readNotification = asyncHandler(async (req, res) => {
  const notification = await markNotificationRead(req.params.id, req.user);
  res.status(200).json({ notification });
});

export const readAllNotifications = asyncHandler(async (req, res) => {
  await markAllNotificationsRead(req.user);
  res.status(200).json({ message: "All notifications marked as read." });
});

