import Notification from "../models/Notification.js";
import AuthData from "../models/Auth.js";

export const getNotifications = async (req, res) => {
  try {
    const user = new AuthData(req);
    const user_id = req?.query?.user_id ?? user._id;
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
