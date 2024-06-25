import { schedule } from "node-cron";
import dayjs from "dayjs";
import { saveChallengeFinishedNotification } from "../shared/notifications.js";
import Challenge from "../models/Challenge.js";

const updateFinishedChallenges = async () => {
  const date = dayjs().subtract(1, "day");

  const start_of_day = dayjs(date)
    .subtract(1, "day")
    .startOf("day")
    .set("hour", 17);

  const end_of_day = dayjs(date).startOf("day").set("hour", 17);

  let success = 0;
  let error = 0;

  // Find all challenges that ended yesterday
  const challenges = await Challenge.find({
    end_at: {
      $gte: start_of_day.toDate(),
      $lte: end_of_day.toDate(),
    },
  }).exec();

  for (const challenge of challenges) {
    try {
      const totalPoints = challenge.members.reduce(
        (accu, curr) => accu + curr.points,
        0,
      );

      const avPoinst = totalPoints / (challenge.members.length ?? 1);

      const achieved = avPoinst >= challenge.goal;

      challenge.status = achieved ? "achieved" : "not_achieved";
      await challenge.save();

      //TODO: update xp, hp, levels... etc

      await saveChallengeFinishedNotification({
        achieved,
        userIds: challenge.members.map(({ user_id }) => user_id),
        challengeId: challenge._id,
        challengeName: challenge.name,
      });

      success++;
    } catch {
      error++;
    }
  }

  console.log(`[challenge status job] - ${success} Success | ${error} Error`);
};

// Run every day at 12:10AM
schedule("10 0 * * *", updateFinishedChallenges, {
  scheduled: true,
}).start();

console.log("------------------------------");
console.log("challenge status job scheduled");
console.log("------------------------------");
