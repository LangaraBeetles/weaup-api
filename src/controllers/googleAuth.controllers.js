import { OAuth2Client } from "google-auth-library";
import axios from "axios";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
});

// Function to handle Google OAuth2 redirect
const googleAuthRedirect = (req, res) => {
  const authorizeUrl = client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
    prompt: "consent",
  });
  res.redirect(authorizeUrl);
};

// Function to handle Google OAuth2 callback
const googleAuthCallback = async (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    // Get user info
    const userInfoResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      },
    );

    const userInfo = userInfoResponse.data;
    const { email, name, id } = userInfo;

    // Check if user already exists
    let user = await User.findOne({ providerId: id });
    if (!user) {
      user = new User({
        providerId: id, // Use the ID from the Google token
        name: name,
        email: email,
        preferred_mode: "phone", // TODO: update with the actual user preferences if available
        daily_goal: 50,
        is_setup_complete: false,
        xp: 0,
        hp: 100,
        device_id: null,
      });
      await user.save();
    }

    res.status(200).json(tokens);
  } catch (error) {
    res.status(500).json({ error: error.message, data: null });
  }
};

export default { googleAuthRedirect, googleAuthCallback };
