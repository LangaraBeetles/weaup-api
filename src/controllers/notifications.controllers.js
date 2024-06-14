import Notifications from "../models/Notifications.js";

// Get notifications by user
export const getNotificationsByUserId = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const response = await Notifications.find({ user_id: userId });

    res.status(200).json({ data: response ?? [], error: null });
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
      return res
        .status(404)
        .json({ data: response, error: "Notification not found" });
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
