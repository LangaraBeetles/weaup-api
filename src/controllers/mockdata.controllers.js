import dayjs from "dayjs";
import User from "../models/User.js";
import Challenge from "../models/Challenge.js";
import PostureRecord from "../models/PostureRecord.js";
import { signObject } from "../shared/auth.js";

const knownUsers = [
  {
    provider_id: "116444898795453345594",
    name: "Reinhardt Botha",
    email: "botha.wr@gmail.com",
    avatar_bg: "blue2",
    daily_goal: 90,
    level: 1,
  },
  {
    provider_id: "115514306099391085602",
    name: "Wonnyo",
    email: "hamesterwonnyo@gmail.com",
    avatar_bg: "yellow2",
    daily_goal: 50,
    level: 2,
  },
  {
    provider_id: "118220025205148090669",
    name: "Adrian Li",
    email: "liadrian2006@gmail.com",
    avatar_bg: "yellow1",
    daily_goal: 80,
    level: 3,
  },
  {
    provider_id: "103932600454537999157",
    name: "Victor Portus",
    email: "vic.portus@gmail.com",
    avatar_bg: "blue1",
    daily_goal: 95,
    level: 4,
  },
];

const createUsers = async (req, res) => {
  try {
    const startDate = dayjs().startOf("day").subtract(7, "days");
    const endDate = dayjs();
    const daysDiff = endDate.diff(startDate, "days");

    const bulkUserOps = knownUsers.map((data) => ({
      updateOne: {
        filter: { email: data.email },
        update: {
          $set: {
            name: data.name,
            avatar_bg: data.avatar_bg,
            daily_goal: data.daily_goal ?? 80,
            hp: data.hp ?? Math.floor(Math.random() * 100),
            xp: data.xp ?? Math.floor(Math.random() * 950),
            level: data.level ?? Math.floor(Math.random() * 5) + 1,
            preferred_mode: "phone",
            is_setup_complete: true,
            badges: [],
          },
        },
        upsert: true,
      },
    }));

    await User.bulkWrite(bulkUserOps);

    const users = await User.find().exec();

    const postureRecords = users.map((user) => {
      const userRecords = new Array(daysDiff).fill({}).map((_, dayIndex) => {
        const dailyRecords = [];

        for (let i = 0; i < 50; i++) {
          const randomHour = Math.floor(Math.random() * 22);

          const createdAt = dayjs()
            .subtract(daysDiff - (dayIndex + 1), "days")
            .set("hour", randomHour)
            .set("minute", i)
            .toDate();

          dailyRecords.push({
            createdAt: createdAt,
            good_posture: Math.random() < dayIndex / daysDiff,
            score: Math.floor(Math.random() * 100) + 1,
            recorded_at: createdAt,
            updatedAt: createdAt,
            user_id: user.id,
          });
        }

        return dailyRecords;
      });

      return userRecords;
    });
    const records = postureRecords.flat().flat();
    console.log(`Posture records created: ${records.length}`);
    const result = await PostureRecord.insertMany(records);

    res.status(201).json({ error: null, data: result });
  } catch (error) {
    res.status(500).json({ error: error.message, data: null });
  }
};

const impersonate = async (req, res) => {
  try {
    const email = req?.query?.email;

    console.log({ email });
    const user = await User.findOne({
      email,
    });

    if (!user) {
      res.status(400).json({ error: "Bad credentials", data: null });
      return;
    }

    const token = signObject(user.toObject());

    console.log({ token });
    res.status(200).json({ error: null, data: { ...user.toObject(), token } });
  } catch (error) {
    res.status(500).json({ error: error.message, data: null });
  }
};

const joinChallenge = async (req, res) => {
  try {
    const challengeId = req.params.challenge_id;

    const challenge = await Challenge.findById(challengeId);

    if (!challenge) {
      res.status(400).json({ error: "Challenge not found", data: null });
      return;
    }

    if (!challenge.members) {
      challenge.members = [];
    }

    const users = await User.find().exec();

    let usersAdded = 0;

    for (const user of users) {
      if (
        user.email &&
        user.name &&
        !challenge.members.some(
          (member) => member.user_id === user._id.toString(),
        )
      ) {
        challenge.members.push({
          user: user._id,
          user_id: user._id.toString(),
          joined_at: new Date(),
          points: 0,
          left_at: null,
        });
        usersAdded++;
      }
    }

    if (usersAdded > 0) {
      await challenge.save();
      res.status(200).json({
        error: null,
        data: `Added ${usersAdded} users to the challenge`,
      });
    } else {
      res
        .status(200)
        .json({ error: null, data: "All users are already in the challenge" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message, data: null });
  }
};

export default {
  impersonate,
  createUsers,
  joinChallenge,
};
