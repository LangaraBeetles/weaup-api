import AuthData from "../models/Auth.js";
import Challenge from "../models/Challenge.js";
import PostureRecord from "../models/PostureRecord.js";
import PostureSession from "../models/PostureSession.js";
import User from "../models/User.js";
import dayjs from "../shared/dayjs.js";

const createRecordObject = ({
  user_id,
  good_posture,
  session_id,
  recorded_at,
  score,
}) => {
  return new PostureRecord({
    user_id,
    good_posture: good_posture ?? false,
    session_id: session_id ?? undefined,
    recorded_at: new Date(recorded_at),
    score: score ?? 80,
  });
};

// RECORDS
export const createPostureRecord = async (req, res) => {
  try {
    const user = new AuthData(req);

    // UPDATE USER CHALLENGE POINTS
    const challenges = await Challenge.find({
      "members.user_id": user._id,
      "members.left_at": null,
    }).exec();

    const ongoingChallenges = challenges.filter(
      (c) => new Date(c.end_at) > new Date(),
    );

    const newPoints = Array.isArray(req?.body)
      ? req.body.filter((p) => p.good_posture).length
      : req.body.good_posture
        ? 1
        : 0;

    ongoingChallenges.forEach((challenge) => {
      const member = challenge.members.find((m) => m.user_id === user._id);
      const currentPoints = member?.points || 0;

      const points = currentPoints + newPoints;

      member.points = points;
      challenge.save();
    });

    // INSERT MANY
    if (Array.isArray(req?.body)) {
      const records = req.body.map((data) => {
        return createRecordObject({ user_id: user._id, ...data });
      });

      const data = await PostureRecord.insertMany(records);
      res.status(201).json({
        data,
        error: null,
      });
      return;
    }

    // INSERT ONE
    const data = await createRecordObject({
      user_id: user._id,
      ...req?.body,
    }).save();

    res.status(201).json({
      data,
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

export const getAllRecords = async (req, res) => {
  try {
    const user = new AuthData(req);

    // Optional filters
    const user_id = req?.query?.user_id ?? user._id;
    // prefer the user_id coming from the query params over the token (useful for testing), leave this value undefined to get the id from the token (recommended)

    const good_posture = req?.query?.good_posture;
    const session_id = req?.query?.session_id;
    const start_date = dayjs(req?.query?.start_date).startOf("day");
    const end_date = dayjs(req?.query?.end_date).endOf("day");

    const data = await PostureRecord.find({
      ...(user_id !== undefined ? { user_id } : {}),
      ...(good_posture !== undefined ? { good_posture } : {}),
      ...(session_id !== undefined ? { session_id } : {}),
      ...(start_date !== undefined && end_date !== undefined
        ? {
            recorded_at: {
              $gte: start_date.toDate(),
              $lte: end_date.toDate(),
            },
          }
        : {}),
    }).exec();

    res.status(200).json({
      data,
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

export const getRecordById = async (req, res) => {
  try {
    const user = new AuthData(req);

    const data = await PostureRecord.findOne({
      user_id: user._id,
      _id: req?.params?.id,
    }).exec();

    res.status(200).json({
      data,
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

// SESSIONS
export const createPostureSession = async (req, res) => {
  try {
    const user = new AuthData(req);

    const records = Array.isArray(req?.body?.records) ? req?.body?.records : [];

    const xp = req?.body?.xp ?? { initial: user.xp, final: user.xp };
    const total = records.length;
    const totalGood = records.filter((record) => !!record.good_posture).length;
    const totalBad = total - totalGood;

    const session = new PostureSession({
      user_id: user._id,
      started_at: new Date(req?.body?.started_at),
      ended_at: new Date(req?.body?.ended_at),
      total_bad: totalBad,
      total_good: totalGood,
      total_records: total,
      score: Number(req?.body?.score ?? 80),
      xp: {
        initial: xp?.initial,
        final: xp?.final,
      },
    });

    const sessionResponse = await session.save();

    const sessionRecords = records.map((data) => {
      return createRecordObject({
        ...data,
        session_id: sessionResponse._id,
        user_id: sessionResponse.user_id,
      });
    });

    const data = await PostureRecord.insertMany(sessionRecords);

    //UPDATE USER DETAILS
    const userData = await User.findById(user._id);
    userData.xp = xp?.final ?? userData.xp;
    userData.hp = req?.body?.score ? Number(req?.body?.score) : userData.hp;
    userData.daily_streak_counter =
      req?.body?.dailyStreakCounter ?? userData.daily_streak_counter;
    await userData.save();

    // UPDATE USER CHALLENGE POINTS
    const challenges = await Challenge.find({
      "members.user_id": user._id,
      "members.left_at": null,
    }).exec();

    const ongoingChallenges = challenges.filter(
      (c) => new Date(c.end_at) > new Date(),
    );

    ongoingChallenges.forEach((challenge) => {
      const member = challenge.members.find((m) => m.user_id === user._id);
      const currentPoints = member?.points || 0;

      const points = currentPoints + totalGood;

      member.points = points;
      challenge.save();
    });

    res.status(201).json({
      data: {
        ...sessionResponse.toObject(),
        records: data,
      },
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

export const getAllSessions = async (req, res) => {
  try {
    const user = new AuthData(req);

    // Optional filters
    const user_id = req?.query?.user_id ?? user._id;
    // prefer the user_id coming from the query params over the token (useful for testing), leave this value undefined to get the id from the token (recommended)
    const start_date = dayjs(req?.query?.start_date).startOf("day");
    const end_date = dayjs(req?.query?.end_date).endOf("day");

    const data = await PostureSession.find({
      ...(user_id !== undefined ? { user_id } : {}),
      ...(start_date !== undefined && end_date !== undefined
        ? {
            started_at: {
              $gte: start_date.toDate(),
              $lte: end_date.toDate(),
            },
          }
        : {}),
    }).exec();

    res.status(200).json({
      data,
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

export const getSessionById = async (req, res) => {
  try {
    const user = new AuthData(req);

    const data = await PostureSession.findOne({
      _id: req?.params?.id,
      user_id: user._id,
    }).exec();

    res.status(200).json({
      data,
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

export default {
  createPostureRecord,
  getAllRecords,
  getRecordById,
  createPostureSession,
  getAllSessions,
  getSessionById,
};
