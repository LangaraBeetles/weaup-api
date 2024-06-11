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

export default { createChallenge };
