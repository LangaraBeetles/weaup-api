import dayjs from "dayjs";
import DailySummary from "../models/DailySummary.js";
import PostureRecord from "../models/PostureRecord.js";
import PostureSession from "../models/PostureSession.js";

export const createDailySummary = async (req, res) => {
  try {
    const date = dayjs(req.params.date).format("YYYYMMDD");

    const hp = req.body.hp ?? 0;

    const start_of_day = dayjs(req.params.date)
      .subtract(1, "day")
      .startOf("day")
      .set("hour", 17);

    const end_of_day = dayjs(req.params.date).startOf("day").set("hour", 17);

    const user_id = req?.body?.user_id;

    const postureRecords = await PostureRecord.find({
      user_id,
      recorded_at: {
        $gte: start_of_day.toDate(),
        $lte: end_of_day.toDate(),
      },
    }).exec();

    let totalGood = 0;
    let totalBad = 0;

    postureRecords.forEach((record) => {
      if (record.good_posture) {
        totalGood++;
      } else {
        totalBad++;
      }
    });

    const sessionRecords = await PostureSession.find({
      user_id,
      started_at: {
        $gte: start_of_day.toDate(),
        $lte: end_of_day.toDate(),
      },
    }).exec();

    const duration = sessionRecords.reduce((accum, curr) => {
      return accum + Number(curr.duration);
    }, 0);

    const data = await DailySummary.findOneAndUpdate(
      {
        user_id,
        date,
      },
      {
        user_id,
        date,
        duration,
        total_good: totalGood,
        total_bad: totalBad,
        total_records: totalGood + totalBad,
        hp,
      },
      { upsert: true, new: true },
    );

    res.status(201).json({
      data,
      error: null,
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({
      data: null,
      error: JSON.stringify(error),
    });
  }
};

export const getAll = async (req, res) => {
  try {
    // filters
    const user_id = req?.query?.user_id;
    const date = dayjs(req.params.date).format("YYYYMMDD");

    const data = await DailySummary.find({
      ...(user_id !== undefined ? { user_id } : {}),
      ...(date !== undefined ? { date } : {}),
    }).exec();

    res.status(200).json({
      data,
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      data: null,
      error,
    });
  }
};

export default {
  createDailySummary,
  getAll,
};
