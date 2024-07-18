import ActiveMonitoring from "../models/ActiveMonitoring.js";
import AuthData from "../models/Auth.js";

export const getActiveMonitoring = async (req, res) => {
  try {
    const user = new AuthData(req);
    const user_id = user._id;

    const activeMonitoringSessions = await ActiveMonitoring.find({ user_id });

    res.status(200).json(activeMonitoringSessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const createActiveMonitoring = async (req, res) => {
  try {
    const user = new AuthData(req);

    const { startTime, endTime } = req.body;

    const end = new Date(endTime);
    const start = new Date(startTime);
    const duration = (end - start) / 1000;

    const newActiveMonitoring = new ActiveMonitoring({
      user_id: user,
      duration,
    });

    await newActiveMonitoring.save();

    res.status(201).json(newActiveMonitoring);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
