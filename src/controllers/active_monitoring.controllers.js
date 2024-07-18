import ActiveMonitoring from "../models/ActiveMonitoring.js";
import AuthData from "../models/Auth.js";

export const getActiveMonitoring = async (req, res) => {
  try {
    const user = new AuthData(req);

    const { user_id } = req.query;
    console.log("Query params:", req.query);

    let query = {};
    if (user_id) {
      query.user_id = user._id;
    }

    const activeMonitoringSessions = await ActiveMonitoring.find(query);
    console.log(
      "Active monitoring sessions retrieved:",
      activeMonitoringSessions,
    );

    res.status(200).json(activeMonitoringSessions);
  } catch (error) {
    console.error("Error retrieving active monitoring sessions:", error);
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
