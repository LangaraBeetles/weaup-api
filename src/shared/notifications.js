/**
 * In-App Notifications
 *
 * - Someone has join a challenge I created
 * - Challenge completed (creator and members)
 * - Daily Summary
 */

import dayjs from "dayjs";
import Notification from "../models/Notification.js";
import { sendMessage } from "../controllers/pusher.controller.js";

// TODO: Update detail paths
const messages = {
  joinedChallenge: {
    title: (memberName) => `${memberName} is In! 💪 `,
    message: (memberName, challengeName) =>
      `${memberName} has joined your challenge “${challengeName}”! Let’s win together!`,
    detailPath: (challengeId) => `/challenges/${challengeId}`,
    type: "joined_challenge",
  },

  challengeAchieved: {
    title: "Challenge Completed 🎉",
    message: (challengeName) =>
      `Congratulations! Your team won the challenge “${challengeName}”!`,
    detailPath: (challengeId) => `/challenges/${challengeId}`,
    type: "challenge_finished",
  },

  challengeNotAchieved: {
    title: "Challenge Ended", // TODO: change copy
    message: (challengeName) => `The challenge “${challengeName}” has eneded`,
    detailPath: (challengeId) => `/challenges/${challengeId}`,
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
  challengeId,
  challengeName,
  memberName,
}) => {
  try {
    const config = messages.joinedChallenge;

    const notification = new Notification({
      title: config.title(memberName),
      message: config.message(memberName, challengeName),
      detail_path: config.detailPath(challengeId),
      notification_type: config.type,
      user_id: userId,
    });

    await notification.save();

    sendMessage(userId, {
      data: {
        memberName,
        challengeName,
        challengeId,
        notificationId: notification._id,
        detailPath: config.detailPath(challengeId),
      },
      category: config.type,
    });
  } catch (error) {
    console.error(error);
  }
};

export const saveChallengeFinishedNotification = async ({
  challengeId,
  achieved,
  userIds,
  challengeName,
}) => {
  try {
    const config = achieved
      ? messages.challengeAchieved
      : messages.challengeNotAchieved;

    const results = await Notification.insertMany(
      userIds?.map((user_id) => {
        return {
          title: config.title,
          message: config.message(challengeName),
          detail_path: config.detailPath(challengeId),
          notification_type: config.type,
          user_id,
        };
      }),
    );

    if (results.length) {
      console.log("challenge notification saved");
    }
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
