import Challenge from "../models/challenge.js";

// Create challenge
async function createChallenge(req, res) {
  try {
    const challenge = new Challenge(req.body);
    await challenge.save();
    res.status(201).json(challenge);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const challengeController = {
  createChallenge,
};

export default challengeController;
