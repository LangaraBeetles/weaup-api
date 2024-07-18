import dayjs from "dayjs";
import AuthData from "../models/Auth.js";
import PostureRecord from "../models/PostureRecord.js";
import PostureSession from "../models/PostureSession.js";
import groupBy from "lodash/groupBy.js";
import duration from "dayjs/plugin/duration.js";
import relativeTime from "dayjs/plugin/relativeTime.js";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

const DATE_FORMAT = "YYYY-M-D";

const getAnalytics = async (req, res) => {
  try {
    const user = new AuthData(req);

    const start_date = dayjs(req?.query?.start_date).startOf("day");
    const end_date = dayjs(req?.query?.end_date).endOf("day");
    const isSame = start_date.isSame(end_date, "date");

    const term = isSame
      ? "day"
      : Math.abs(end_date.diff(start_date, "days")) === 6
        ? "week"
        : "month";

    const records = await PostureRecord.find({
      user_id: user._id,
      recorded_at: {
        $gte: start_date.toDate(),
        $lte: end_date.toDate(),
      },
    }).sort({
      recorded_at: "asc",
    });

    let overview = { good: 0, bad: 0 };

    try {
      overview = records.reduce(
        (accum, curr) => {
          if (curr.good_posture) {
            return {
              good: accum.good + 1,
              bad: accum.bad,
            };
          }

          return {
            good: accum.good,
            bad: accum.bad + 1,
          };
        },
        { good: 0, bad: 0 },
      );
    } catch (error) {
      console.error(error);
    }

    let records_by_term = [];
    let posture_records = [];
    try {
      posture_records = records.map((record) => {
        const data = record.toObject();

        if (term === "day") {
          return {
            ...data,
            recorded_at: dayjs
              .utc(data.recorded_at)
              .tz("America/Vancouver")
              .format("HH:mm"),
          };
        }

        return {
          ...data,
          recorded_at: dayjs
            .utc(data.recorded_at)
            .tz("America/Vancouver")
            .format(DATE_FORMAT),
        };
      });
      const grouped = groupBy(posture_records, "recorded_at");
      records_by_term =
        term === "day"
          ? fillHourlyData(grouped)
          : fillDailyData(grouped, start_date, end_date);
    } catch (error) {
      console.error(error);
    }

    let sessions = [];

    try {
      sessions = await PostureSession.find({
        user_id: user._id,
        started_at: {
          $gte: start_date.toDate(),
          $lte: end_date.toDate(),
        },
      });
    } catch (error) {
      console.error(error);
    }

    res.status(200).json({
      data: {
        term,
        start_date,
        end_date,
        overview: {
          good_posture_count: overview?.good ?? 0,
          bad_posture_count: overview?.bad ?? 0,
        },
        records_by_term: records_by_term,
        total_corrections: posture_records.filter((data) => !data.good_posture)
          .length,
        sessions: sessions.map((data) => {
          const durationObj = dayjs.duration(data.duration, "seconds");

          const days = Math.floor(durationObj.asDays());
          const hours = durationObj.hours();
          const mins = durationObj.minutes();
          const secs = durationObj.seconds();

          // Build the formatted duration string
          let formattedDuration = "";

          if (days > 1) formattedDuration += `${days} days `;
          if (days == 1) formattedDuration += `${days} day `;
          if (hours > 1) formattedDuration += `${hours} hours `;
          if (hours == 1) formattedDuration += `${hours} hour `;
          if (mins > 1) formattedDuration += `${mins} mins `;
          if (mins == 1) formattedDuration += `${mins} min `;
          if (secs > 1) formattedDuration += `${secs} seconds`;
          if (secs == 1) formattedDuration += `${secs} second`;
          if (formattedDuration == "")
            formattedDuration += `less than 1 second`;

          // Trim any trailing spaces
          formattedDuration = formattedDuration.trim();

          return {
            ...data.toObject(),
            duration: formattedDuration,
          };
        }),
      },
      error: null,
    });
  } catch (error) {
    console.error({ error });

    res.status(500).json({
      data: null,
      error: error.message,
    });
  }
};

function fillHourlyData(data) {
  const hours = Array.from(
    { length: 24 },
    (_, i) => `${String(i).padStart(2, "0")}:00`,
  );

  const hourlyData = hours.map((hour) => ({
    key: hour,
    records: [],
  }));

  for (const [time, records] of Object.entries(data)) {
    const hour = time.slice(0, 2) + ":00";
    const hourEntry = hourlyData.find((h) => h.key === hour);
    if (hourEntry) {
      hourEntry.records.push(...records);
    }
  }

  return hourlyData.map((values) => ({
    ...values,
    count: values.records.length,
    score:
      Number(
        values.records?.reduce((accum, curr) => {
          return accum + curr.score;
        }, 0) / values.records.length,
      ) || 0,
  }));
}

function fillDailyData(data, start, end) {
  const days = [];

  const diff = Math.abs(end.diff(start, "days"));

  for (let d = 0; d <= diff; d++) {
    days.push(dayjs(start).add(d, "days").format(DATE_FORMAT));
  }

  const dailyData = days.map((day) => ({
    key: day,
    records: [],
  }));

  for (const [date, records] of Object.entries(data)) {
    const dayEntry = dailyData.find((d) => d.key === date);
    if (dayEntry) {
      dayEntry.records.push(...records);
    }
  }

  return dailyData.map((values) => ({
    ...values,
    count: values.records.length,
    score: values.records.length
      ? values.records.reduce((accum, curr) => accum + (curr.score ?? 80), 0) /
        values.records.length
      : 0,
  }));
}

export default {
  getAnalytics,
};
