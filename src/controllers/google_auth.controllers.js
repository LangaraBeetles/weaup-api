import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
import User from "../models/User.js";
import { getGoogleUser, userAvatar } from "../shared/user.js";
import { signObject } from "../shared/auth.js";

dotenv.config();

const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI,
});

// Function to handle Google OAuth2 redirect
const googleAuthRedirect = (req, res) => {
  try {
    const authorizeUrl = client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ],
      prompt: "consent",
    });

    res.status(200).json({
      error: null,
      data: {
        redirect: authorizeUrl,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message, data: null });
  }
};

// Function to handle Google OAuth2 callback
const googleAuthCallback = async (req, res) => {
  const { code, user } = req.query;
  try {
    const googleUser = await getGoogleUser(code);

    let response = await User.findOne({
      $or: [
        {
          provider_id: googleUser.id,
        },
        {
          email: googleUser?.email,
        },
      ],
    });

    if (!response) {
      if (user?.id) {
        //if email or providerId not found, look for guest user to assign the email to the existing guest account
        response = await User.findOne({
          _id: user?.id,
        }).exec();
      }

      if (!response) {
        //if guest id was not found, create new user
        let avatar_bg = userAvatar[0];
        try {
          const randIndex = Math.floor(Math.random() * 7);
          avatar_bg = userAvatar[randIndex];
        } catch (error) {
          console.log("Error assigning the user avatar", error.message);
        }
        response = new User({
          preferred_mode: user?.preferredMode,
          daily_goal: user?.dailyGoal,
          is_setup_complete: user?.isSetupComplete,
          avatar_bg,
        });
      }
      response.provider_id = googleUser.id;
      response.name = googleUser.name;
      response.email = googleUser.email;
      await response.save();
    }

    const result = response.toObject();
    const token = signObject(result);

    res.status(200).json({ error: null, data: { ...result, token } });
  } catch (error) {
    res.status(500).json({ error: error.message, data: null });
  }
};

export default { googleAuthRedirect, googleAuthCallback };
