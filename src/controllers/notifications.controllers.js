import Notifications from "../models/Notifications.js";

// Get notifications by user
export const getNotificationsByUserId = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const response = await Notifications.find({ user_id: userId });

    if (!response || response.length === 0) {
      return res
        .status(404)
        .json({ message: "No notifications found for this user" });
    }

    res.status(200).json({ data: response, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error });
  }
};

// Get notification by user ID and notification ID
export const getNotificationByUserAndId = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const notificationId = req.params.notification_id;
    const response = await Notifications.findOne({
      user_id: userId,
      notification_id: notificationId,
    });

    if (!response) {
      return res.status(404).json({
        message: "Notification not found for this user and notification ID",
      });
    }

    res.status(200).json({ data: response, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error });
  }
};

export default {
  getNotificationsByUserId,
  getNotificationByUserAndId,
};
