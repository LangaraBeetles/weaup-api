import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
import User from "../models/User.js";
import { getGoogleUser, userAvatar, userBg } from "../shared/user.js";
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

    console.log({ response });
    console.log({ googleUser });
    if (!response) {
      if (user?.id) {
        //if email or providerId not found, look for guest user
        response = await User.findOne({
          _id: user?.id,
        }).exec();
      }

      if (!response) {
        //if guest id was not found, create new guest user
        let avatar_bg = userBg[0];
        try {
          const randIndex = Math.floor(Math.random() * 7);
          avatar_bg = userBg[randIndex];
        } catch (error) {
          console.log("Error assigning the user avatar", error.message);
        }

        let avatar_img = userBg[0];
        try {
          const randIndex = Math.floor(Math.random() * 10);
          avatar_img = userAvatar[randIndex];
        } catch (error) {
          console.log("Error assigning the user avatar", error.message);
        }

        response = new User({
          avatar_bg,
          avatar_img,
        });
      }

      if (googleUser?.email === "hamesterwonnyo@gmail.com") {
        response.avatar_bg = userBg[5];
        response.avatar_img = userAvatar[7];
      }

      //assign the email to the guest user
      response.provider_id = googleUser.id;
      response.name = googleUser.name;
      response.email = googleUser.email;

      //update user details
      response.preferred_mode = user?.preferredMode;
      response.daily_goal = user?.dailyGoal;
      response.is_setup_complete = user?.isSetupComplete;
      response.level = user?.level;
      response.xp = user?.xp;
      response.hp = user?.hp;
      response.daily_streak_counter = user?.dailyStreakCounter;
      await response.save();
    }

    const result = response.toObject();
    console.log({ result });
    const token = signObject(result);

    res.status(200).json({ error: null, data: { ...result, token } });
  } catch (error) {
    res.status(500).json({ error: error.message, data: null });
  }
};

export default { googleAuthRedirect, googleAuthCallback };
