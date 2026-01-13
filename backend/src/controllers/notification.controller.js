import Notification from "../models/Notification.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getMyNotifications = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const notifications = await Notification.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .limit(limit);

  res.json(notifications);
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const updated = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { read: true },
    { new: true }
  );

  if (!updated) {
    const err = new Error("Notification not found");
    err.statusCode = 404;
    throw err;
  }

  res.json(updated);
});
