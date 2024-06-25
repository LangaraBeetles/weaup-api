import Notification from "../models/Notification.js";

export const getNotifications = async (req, res) => {
  try {
    const user_id = req.query.user_id;
    const id = req.query.id;

    const response = await Notification.find({
      ...(user_id !== undefined ? { user_id } : {}),
      ...(id !== undefined ? { _id: id } : {}),
    });

    res.status(200).json({ data: response ?? [], error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error });
  }
};

export default {
  getNotifications,
};
