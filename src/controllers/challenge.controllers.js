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

export default { createChallenge, getChallenges, getChallengeById };
