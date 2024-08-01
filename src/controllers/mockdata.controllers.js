import dayjs from "../shared/dayjs.js";
import User from "../models/User.js";
import Challenge from "../models/Challenge.js";
import PostureRecord from "../models/PostureRecord.js";
import { signObject } from "../shared/auth.js";
import { saveJoinedChallengeNotification } from "../shared/notifications.js";

import ActiveMonitoring from "../models/ActiveMonitoring.js";

const knownUsers = [
  {
    provider_id: "116444898795453345594",
    name: "Reinhardt Botha",
    email: "botha.wr@gmail.com",
    avatar_bg: "blue2",
    avatar_img: "Image09",
    daily_goal: 90,
    level: 4,
    xp: 10,
    daily_streak_counter: 3,
    badges: [
      {
        id: 1,
        date: dayjs().format(),
      },
      {
        id: 2,
        date: dayjs().format(),
      },
      {
        id: 3,
        date: dayjs().format(),
      },
    ],
  },
  // {
  //   provider_id: "115514306099391085602",
  //   name: "Wonnyo",
  //   email: "hamesterwonnyo@gmail.com",
  //   avatar_bg: "yellow2",
  //   daily_goal: 50,
  //   avatar_img: "Image08",
  //   level: 2,
  // },
  {
    provider_id: "118220025205148090669",
    name: "Adrian Li",
    email: "liadrian2006@gmail.com",
    avatar_bg: "yellow1",
    daily_goal: 80,
    avatar_img: "Image04",
    level: 3,
    badges: [],
    daily_streak_counter: 0,
  },
  {
    provider_id: "103932600454537999157",
    name: "Victor Portus",
    email: "vic.portus@gmail.com",
    avatar_bg: "blue1",
    daily_goal: 95,
    avatar_img: "Image01",
    level: 4,
    badges: [],
    daily_streak_counter: 0,
  },
  {
    provider_id: "116103692621192846355",
    name: "Beck",
    email: "developer.beck@gmail.com",
    avatar_bg: "red2",
    daily_goal: 95,
    avatar_img: "Image06",
    level: 1,
    badges: [],
    daily_streak_counter: 0,
  },
  {
    provider_id: "102267297840992590717",
    name: "Pooja Chauhan",
    email: "poojachauhan8346@gmail.com",
    avatar_bg: "red1",
    daily_goal: 95,
    avatar_img: "Image05",
    level: 1,
    badges: [],
    daily_streak_counter: 0,
  },
  {
    provider_id: "66a2d546acef36160ce357af",
    name: "Jiali Cai",
    email: "lizcffk0901@gmail.com",
    avatar_bg: "blue2",
    daily_goal: 95,
    avatar_img: "Image02",
    level: 1,
    badges: [],
    daily_streak_counter: 0,
  },
];

const createUsers = async (req, res) => {
  try {
    const days = req?.query?.days ?? 7;
    const startDate = dayjs().startOf("day").subtract(days, "days");
    const endDate = dayjs();
    const daysDiff = endDate.diff(startDate, "days");

    //Delete the new user if exists
    await User.deleteOne({
      email: "hamesterwonnyo@gmail.com",
    }).exec();

    const bulkUserOps = knownUsers.map((data) => ({
      updateOne: {
        filter: { email: data.email },
        update: {
          $set: {
            name: data.name,
            avatar_bg: data.avatar_bg,
            avatar_img: data.avatar_img,
            daily_goal: data.daily_goal ?? 80,
            hp: data.hp ?? Math.floor(Math.random() * 100),
            xp: data.xp ?? Math.floor(Math.random() * 950),
            level: data.level ?? Math.floor(Math.random() * 5) + 1,
            preferred_mode: "phone",
            is_setup_complete: true,
            badges: data?.badges ?? [],
            daily_streak_counter: data?.daily_streak_counter ?? 0,
          },
        },
        upsert: true,
      },
    }));

    await User.bulkWrite(bulkUserOps);

    /// Create challenge

    await Challenge.deleteMany({}).exec();

    const existingUser = await User.findOne({
      email: "botha.wr@gmail.com",
    }).exec();

    if (existingUser) {
      const challengeUrl = `${process.env.CHALLENGE_URL}id=[challenge_id]&user=[user_id]`;

      const data = new Challenge({
        creator_id: existingUser._id,
        name: "Reins Challenge",
        description: "",
        start_at: dayjs().format(),
        end_at: dayjs().add(5, "days").format(),
        duration: 5,
        goal: 85,
        color: "#D3E7FF",
        members: [
          {
            user: existingUser._id, //added to link to users table
            user_id: existingUser._id, //workaround to filter by members
          },
        ],
      });

      let url = challengeUrl.replace("[challenge_id]", data._id);

      data.url = url;

      url = url.replace("[user_id]", existingUser._id);

      await data.save();
    }

    ///
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

          // Calculate the exponential probability based on dayIndex
          const adjustedIndex = dayIndex / daysDiff;
          const probability = Math.pow(adjustedIndex, 2) * 0.3 + 0.7; // Exponential increase to ensure 80%+ towards the end

          const good_posture = Math.random() < probability;

          dailyRecords.push({
            createdAt: createdAt,
            good_posture,
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
    const good_percentage =
      (records.filter(({ good_posture }) => !!good_posture).length /
        records.length) *
      100;
    console.log(`Posture good percentage: ${good_percentage?.toFixed(0)}%`);
    console.log(`Posture records created: ${records.length}`);
    const result = await PostureRecord.insertMany(records);

    try {
      const activeMonitoring = users
        .map((user) => {
          const userRecords = new Array(daysDiff)
            .fill({})
            .map((_, dayIndex) => {
              const createdAt = dayjs()
                .subtract(daysDiff - (dayIndex + 1), "days")
                .toDate();

              return {
                duration: Math.floor(Math.random() * 30 * 60) + 60,
                user_id: user.id,
                recorded_at: createdAt,
              };
            });

          return userRecords;
        })
        .flat();

      console.log(
        `Active monitoring records created: ${activeMonitoring.length}`,
      );
      await ActiveMonitoring.insertMany(activeMonitoring);
    } catch (error) {
      console.error({ error });
    }

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

        setTimeout(async () => {
          await saveJoinedChallengeNotification({
            userId: challenge.creator_id,
            challengeId,
            challengeName: challenge.name,
            memberName: user.name,
          });
        }, 500);

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
