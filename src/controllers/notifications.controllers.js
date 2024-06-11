import Notifications from "../models/Notifications.js";

// Get notifications by user
export const getNotificationsByUserId = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const notifications = await Notifications.find({ user_id: userId });

    if (!notifications || notifications.length === 0) {
      return res
        .status(404)
        .json({ message: "No notifications found for this user" });
    }

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get notification by user ID and notification ID
export const getNotificationByUserAndId = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const notificationId = req.params.notification_id;
    const notification = await Notifications.findOne({
      user_id: userId,
      notification_id: notificationId,
    });

    if (!notification) {
      return res
        .status(404)
        .json({
          message: "Notification not found for this user and notification ID",
        });
    }

    res.status(200).json(notification);
  } catch (error) {
    console.error("Error fetching notification:", error);
    res.status(500).json({ message: error.message });
  }
};

export default {
  getNotificationsByUserId,
  getNotificationByUserAndId,
};
