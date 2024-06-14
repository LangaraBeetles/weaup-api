import Challenge from "../models/Challenge.js";

// Create challenge
export const createChallenge = async (req, res) => {
  try {
    const data = new Challenge(req.body);
    await data.save();
    const response = {
      _id: data._id,
      url: `${req.protocol}://${req.get("host")}${req.originalUrl}/challenge/invite/${data._id}`,
    };
    res.status(201).json({ data: response, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: JSON.stringify(error) });
  }
};

// Get all challenges
export const getChallenges = async (req, res) => {
  try {
    const data = await Challenge.find();
    // TODO: Filter out challenges that the creater has left
    res.status(200).json({ data, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: JSON.stringify(error) });
  }
};

// Get challenge by id
export const getChallengeById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Challenge.findById(id);
    res.status(200).json({ data, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: JSON.stringify(error) });
  }
};

// Add a member to a challenge
export const addMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;
    const challenge = await Challenge.findById(id);
    if (!challenge) {
      return res.status(404).json({ data: null, error: "Challenge not found" });
    }
    challenge.members.push({ user_id });
    await challenge.save();
    res.status(200).json({ data: challenge, error: null });
  } catch (error) {
    res.status(500).json({ data: null, error: JSON.stringify(error) });
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
    res.status(500).json({ data: null, error: JSON.stringify(error) });
  }
};

export default {
  createChallenge,
  getChallenges,
  getChallengeById,
  addMember,
  removeMember,
};
