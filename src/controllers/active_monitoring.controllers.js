import ActiveMonitoring from "../models/ActiveMonitoring.js";
import AuthData from "../models/Auth.js";
import dayjs from "../shared/dayjs.js";

export const getActiveMonitoring = async (req, res) => {
  try {
    const start_date = dayjs(req?.query?.start_date).startOf("day");
    const end_date = dayjs(req?.query?.end_date).endOf("day");

    const user = new AuthData(req);
    const user_id = user._id;

    const activeMonitoringSessions = await ActiveMonitoring.find({
      user_id,
      ...(start_date !== undefined && end_date !== undefined
        ? {
            recorded_at: {
              $gte: start_date.toDate(),
              $lte: end_date.toDate(),
            },
          }
        : {}),
    });

    res.status(200).json({
      data: activeMonitoringSessions,
      error: null,
    });
  } catch (error) {
    console.error({ error });

    res.status(500).json({
      data: null,
      error: error.messate,
    });
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
      recorded_at: dayjs().toDate(),
    });

    await newActiveMonitoring.save();

    // TODO: fix this response, is not following the convention
    res.status(201).json(newActiveMonitoring);
  } catch (error) {
    console.error({ error });

    res.status(500).json({
      data: null,
      error: error.messate,
    });
  }
};
