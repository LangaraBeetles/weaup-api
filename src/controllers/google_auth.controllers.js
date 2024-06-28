import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
import User from "../models/User.js";
import queryString from "query-string";
import { getGoogleUser } from "../shared/user.js";
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
  const code = req.query.code;
  try {
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    const googleUser = await getGoogleUser(tokens.access_token);

    let response = await User.findOne({
      provider_id: googleUser.id,
    });

    // Check if user already exists
    if (!response) {
      response = new User({
        provider_id: googleUser.id, // Use the ID from the Google token
        name: googleUser.name,
        email: googleUser.email,
        preferred_mode: "phone", // TODO: update with the actual user preferences if available
        daily_goal: 50,
        is_setup_complete: false,
        xp: 0,
        hp: 100,
        device_id: null,
      });
      await response.save();
    }

    const user = response.toObject();
    const token = signObject(user);

    //TODO: Create a nicer template here
    res.send(`
    <h1>Hello Express!</h1>
      <a href="exp+alignmend:/auth?${queryString.stringify({ ...user, token })}">Go to Weaup </a>
      ${process.env.DEV_MODE === "true" ? ` <p> ${token} </p> ` : ""}
    `);
  } catch (error) {
    res.status(500).json({ error: error.message, data: null });
  }
};

export default { googleAuthRedirect, googleAuthCallback };
