import AuthData from "../models/Auth.js";
import Challenge from "../models/Challenge.js";
import User from "../models/User.js";
import { saveJoinedChallengeNotification } from "../shared/notifications.js";

// Create challenge
export const createChallenge = async (req, res) => {
  try {
    const user = new AuthData(req);

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
          user_id: user._id,
        },
      ],
    });

    await data.save();
    const response = {
      _id: data._id,
      url: `${req.protocol}://${req.get("host")}${req.originalUrl}/challenge/invite/${data._id}`,
    };
    res.status(201).json({ data: response, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error.message });
  }
};

// Get all challenges
export const getChallenges = async (req, res) => {
  try {
    const user = new AuthData(req);
    const filterStatus = req?.query?.filterStatus;
    const filterUser = req?.query?.filterUser;

    let data = await Challenge.find();

    //filter only if filterUser is specified. To get all, do not add "filterUser" param with GET request
    if (filterUser) {
      //Filter out ongoing challenges where user is a member
      data = data.filter(
        (challenge) =>
          (challenge.status == "in_progress" ||
            new Date(challenge.end_at) > new Date()) &&
          challenge.members.find(
            (member) => member.user_id === user._id && member.left_at === null,
          ),
      );

      if (filterUser == "true") {
        // Filter out challenges that are not created by user
        data = data.filter((challenge) => challenge.creator_id === user._id);
      }
    }

    //filter only if filterStatus is specified. To get all, do not add "filterStatus" param with GET request
    if (filterStatus) {
      //Filter out past challenges where user is a member
      data = data.filter(
        (challenge) =>
          new Date(challenge.end_at) < new Date() &&
          challenge.members.find(
            (member) => member.user_id === user._id && member.left_at === null,
          ),
      );

      if (filterStatus != "all") {
        data = data.filter((challenge) => challenge.status === filterStatus);
      }
    }

    res.status(200).json({ data, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: error.message });
  }
};

// Get challenge by id
export const getChallengeById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Challenge.findById(id);
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
    const { id } = req.params;
    const { user_id, response } = req.body;
    const challenge = await Challenge.findById(id);
    const member = challenge.members.find(
      (member) => member.user_id === user_id,
    );

    if (!challenge) {
      return res.status(404).json({ data: null, error: "Challenge not found" });
    }

    if (member && member.left_at === null) {
      return res
        .status(400)
        .json({ data: null, error: "User already in challenge" });
    }

    if (member && member.left_at !== null) {
      member.left_at = null;
      await challenge.save();
      return res.status(201).json({ data: challenge, error: null });
    }

    if (!challenge.status === "in_progress") {
      return res.status(400).json({
        data: null,
        error: "Can't join challenge that has finished or has been deleted",
      });
    }

    if (response === "accept") {
      // TODO: send notification to the creator
      challenge.members.push({ user_id });
      await challenge.save();

      const member = await User.findById(user_id).exec();

      if (member) {
        // Save In-App Notification
        saveJoinedChallengeNotification({
          userId: user_id,
          challengeId: challenge._id,
          challengeName: challenge.name,
          memberName: member.name,
        });
      }

      res.status(201).json({ data: challenge, error: null });
    } else {
      res.status(204).json({ data: null, error: null });
    }
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
};
