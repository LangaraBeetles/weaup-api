import { schedule } from "node-cron";
import dayjs from "dayjs";
import PostureRecord from "../models/PostureRecord.js";
import groupBy from "lodash/groupBy.js";
import PostureSession from "../models/PostureSession.js";
import { saveDailySummaryNotification } from "../shared/notifications.js";
import DailySummary from "../models/DailySummary.js";

const generateDailySummaries = async () => {
  const date = dayjs().subtract(1, "day");

  const start_of_day = dayjs(date)
    .subtract(1, "day")
    .startOf("day")
    .set("hour", 17);

  const end_of_day = dayjs(date).startOf("day").set("hour", 17);

  const dailyRecords = await PostureRecord.find({
    recorded_at: {
      $gte: start_of_day.toDate(),
      $lte: end_of_day.toDate(),
    },
  }).exec();

  const recordsByUser = groupBy(dailyRecords, ({ user_id }) => user_id);

  const sessionRecords = await PostureSession.find({
    started_at: {
      $gte: start_of_day.toDate(),
      $lte: end_of_day.toDate(),
    },
  }).exec();

  const sessionsByUser = groupBy(sessionRecords, ({ user_id }) => user_id);

  let success = 0;
  let error = 0;

  for (const user_id in recordsByUser) {
    try {
      if (Object.hasOwnProperty.call(recordsByUser, user_id)) {
        const postureRecords = recordsByUser[user_id];

        let totalGood = 0;
        let totalBad = 0;

        postureRecords.forEach((record) => {
          if (record.good_posture) {
            totalGood++;
          } else {
            totalBad++;
          }
        });

        const sessionRecords = sessionsByUser[user_id];

        const duration = sessionRecords?.reduce((accum, curr) => {
          return accum + Number(curr.duration);
        }, 0);

        const data = await DailySummary.findOneAndUpdate(
          {
            user_id,
            date: date.format("YYYYMMDD"),
          },
          {
            user_id,
            date: date.format("YYYYMMDD"),
            duration: duration ?? 0,
            total_good: totalGood,
            total_bad: totalBad,
            total_records: totalGood + totalBad,
          },
          { upsert: true, new: true },
        );

        saveDailySummaryNotification({
          id: data._id,
          userId: user_id,
          day: date.toDate(),
        });

        success++;
      }
    } catch {
      error++;
    }
  }

  console.log(`[daily summary job] - ${success} Success | ${error} Error`);
};

// Run every day at 12:01AM
schedule("1 0 * * *", generateDailySummaries, {
  scheduled: true,
}).start();

console.log("---------------------------");
console.log("daily summary job scheduled");
console.log("---------------------------");
