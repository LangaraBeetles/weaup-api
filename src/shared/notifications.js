/**
 * In-App Notifications
 *
 * - Someone has join a challenge I created
 * - Challenge completed (creator and members)
 * - Daily Summary
 */

import dayjs from "dayjs";
import Notification from "../models/Notification.js";

const messages = {
  joinedChallenge: {
    title: (memberName) => `${memberName} is In! 💪 `,
    message: (memberName, challengeName) =>
      `${memberName} has joined your challenge “${challengeName}”! Let’s win together!`,
    detailPath: ``,
    type: "joined_challenge",
  },

  challengeAchieved: {
    title: "Challenge Completed 🎉",
    message: (challengeName) =>
      `Congratulations! Your team won the challenge “${challengeName}”!`,
    detailPath: ``,
    type: "challenge_finished",
  },

  challengeNotAchieved: {
    title: "Challenge Ended", // TODO: change copy
    message: (challengeName) => `The challenge “${challengeName}” has eneded`,
    detailPath: ``,
    type: "challenge_finished",
  },

  dailySummary: {
    title: (day) => `${day} Daily Summary 🌟 `,
    message: `You did fantastic yesterday! Click to check out your posture insights.`,
    detailPath: (summaryId) => `/daily-summary/${summaryId}`,
    type: "daily_summary",
  },
};

export const saveJoinedChallengeNotification = async ({
  userId,
  challengeName,
  memberName,
}) => {
  try {
    const config = messages.joinedChallenge;

    const notification = new Notification({
      title: config.title(memberName),
      message: config.message(memberName, challengeName),
      detail_path: config.detailPath,
      notification_type: config.type,
      user_id: userId,
    });

    await notification.save();
  } catch (error) {
    console.error(error);
  }
};

export const saveChallengeFinishedNotification = async ({
  achieved,
  userId,
  challengeName,
}) => {
  try {
    const config = achieved
      ? messages.challengeAchieved
      : messages.challengeNotAchieved;

    const notification = new Notification({
      title: config.title,
      message: config.message(challengeName),
      detail_path: config.detailPath,
      notification_type: config.type,
      user_id: userId,
    });

    await notification.save();
  } catch (error) {
    console.error(error);
  }
};

export const saveDailySummaryNotification = async ({ id, userId, day }) => {
  try {
    const date = dayjs(day).format("MM/DD");
    const config = messages.dailySummary;

    const start_of_day = dayjs(day)
      .subtract(1, "day")
      .startOf("day")
      .set("hour", 17);

    const end_of_day = dayjs(day).startOf("day").set("hour", 17);

    const data = await Notification.findOneAndUpdate(
      {
        user_id: userId,
        createdAt: {
          $gte: start_of_day.toDate(),
          $lte: end_of_day.toDate(),
        },
      },
      {
        title: config.title(date),
        message: config.message,
        detail_path: config.detailPath(id),
        notification_type: config.type,
        user_id: userId,
      },
      { upsert: true, new: true },
    );

    if (data) {
      console.log("daily summary notification saved");
    }
  } catch (error) {
    console.error(error);
  }
};
