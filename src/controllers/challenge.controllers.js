import AuthData from "../models/Auth.js";
import Challenge from "../models/Challenge.js";
import User from "../models/User.js";
import { saveJoinedChallengeNotification } from "../shared/notifications.js";

// Create challenge
export const createChallenge = async (req, res) => {
  try {
    const user = new AuthData(req);

    const challengeUrl = `${process.env.CHALLENGE_URL}id=[challenge_id]&user=[user_id]`;

    const data = new Challenge({
      creator_id: user._id,
      name: req.body?.name,
      description: req.body?.description,
      start_at: req.body?.start_at,
      end_at: req.body?.end_at,
      duration: req.body?.duration,
      goal: req.body?.goal,
      icon: req.body?.icon,
      color: req.body?.color,
      members: [
        {
          user: user._id, //added to link to users table
          user_id: user._id, //workaround to filter by members
        },
      ],
    });

    let url = challengeUrl.replace("[challenge_id]", data._id);

    data.url = url;

    url = url.replace("[user_id]", user._id);

    await data.save();
    const response = {
      _id: data._id,
      url: url,
    };
    res.status(201).json({ data: response, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error.message });
  }
};

// Get all challenges
export const getChallenges = async (req, res) => {
  const user = new AuthData(req);
  const filterStatus = req?.query?.filterStatus;
  const filterUser = req?.query?.filterUser;
  const showOngoing = req?.query?.showOngoing;
  const sortDesc = req?.query?.sortDesc ?? -1;

  const onGoingFilter = (data, filter) => {
    if (filter == "true") {
      // returns challenges that has end_at set to later or equal to current date
      data = data.filter(
        (challenge) => new Date(challenge.end_at) >= new Date(),
      );
    } else {
      // returns challenges that has end_at set to past date
      data = data.filter(
        (challenge) => new Date(challenge.end_at) < new Date(),
      );

      if (filterUser == "true") {
        // Filter out challenges that are not created by user
        data = data.filter((challenge) => challenge.creator_id === user._id);
      }
    }
    return data;
  };

  const userFilter = (data, filter, user_id) => {
    if (filter == "true") {
      // returns challenges that are created by user only
      data = data.filter((challenge) => challenge.creator_id === user_id);
    } else {
      //all challenges where the user is a member of and left_at is null
      data = data.filter((challenge) =>
        challenge.members.find(
          (member) => member.left_at === null && member.user_id === user_id,
        ),
      );
    }
    return data;
  };

  const statusFilter = (data, status, user_id) => {
    if (status == "quitted") {
      data = data.filter((challenge) =>
        challenge.members.find(
          (member) => member.left_at != null && member.user_id === user_id,
        ),
      );
    } else if (status != "all") {
      data = data.filter((challenge) => challenge.status === status);
    }
    return data;
  };

  try {
    let data = await Challenge.find()
      .sort({ start_at: Number(sortDesc) })
      .populate([
        {
          path: "members",
          populate: {
            path: "user",
            model: "User",
          },
        },
      ])
      .then((res) => {
        if (showOngoing) {
          res = onGoingFilter(res, showOngoing);
        }

        if (filterUser) {
          res = userFilter(res, filterUser, user._id);
        }

        if (filterStatus) {
          res = statusFilter(res, filterStatus, user._id);
        }

        return res;
      });

    res.status(200).json({ data, error: null });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ data: null, error: error.message });
  }
};

// Get challenge by id
export const getChallengeById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Challenge.findById(id)
      .populate([
        {
          path: "members",
          populate: {
            path: "user",
            model: "User",
          },
        },
      ])
      .then((res) => {
        //TODO: add logic to return points by current user
        // const current_user = res.members.filter(
        //     (member) =>member.user_id === user._id
        //   )
        return res;
      });

    res.status(200).json({ data, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error.message });
  }
};

// Remove member from challenge
export const removeMember = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const challenge = await Challenge.findById(id);
    if (!challenge) {
      return res.status(404).json({ data: null, error: "Challenge not found" });
    }
    const member = challenge.members.find(
      (member) => member.user_id === userId,
    );
    if (!member) {
      return res.status(404).json({ data: null, error: "Member not found" });
    }
    member.left_at = new Date();
    await challenge.save();
    res.status(200).json({ data: challenge, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error.message });
  }
};

// Join challenge
export const joinChallenge = async (req, res) => {
  try {
    const user = new AuthData(req);
    const { id } = req.params;

    if (!user._id) {
      return res.status(404).json({ data: null, error: "User not found" });
    }

    const challenge = await Challenge.findById(id);
    const member = challenge.members.find(
      (member) => member.user_id === user._id,
    );
    if (!challenge) {
      return res.status(404).json({ data: null, error: "Challenge not found" });
    }

    if (member && member.left_at !== null) {
      member.left_at = null;
      await challenge.save();
      return res.status(201).json({ data: challenge, error: null });
    }

    if (challenge.status !== "in_progress") {
      return res.status(400).json({
        data: null,
        error: "Can't join challenge that has finished or has been deleted",
      });
    }

    if (member && member.left_at === null) {
      // return res
      //   .status(400)
      //   .json({ data: null, error: "User already in challenge" });
    } else {
      challenge.members.push({
        user: user._id, //added to link to users table
        user_id: user._id, //workaround to filter by members
      });

      await challenge.save();

      const newMember = await User.findById(user._id).exec();

      if (newMember) {
        // Save In-App Notification
        saveJoinedChallengeNotification({
          userId: challenge.creator_id,
          challengeId: challenge._id,
          challengeName: challenge.name,
          memberName: user.name,
        });
      }
    }

    res.status(201).json({ data: challenge, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error.message });
  }
};

export const updateChallengeMemberPoints = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const { points } = req.body;
    const challenge = await Challenge.findById(id);
    if (!challenge) {
      return res.status(404).json({ data: null, error: "Challenge not found" });
    }
    const member = challenge.members.find(
      (member) => member.user_id === userId,
    );
    if (!member) {
      return res.status(404).json({ data: null, error: "Member not found" });
    }
    member.points = points;
    await challenge.save();

    res.status(200).json({ data: challenge, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error.message });
  }
};

export default {
  createChallenge,
  getChallenges,
  getChallengeById,
  removeMember,
  joinChallenge,
  updateChallengeMemberPoints,
};
