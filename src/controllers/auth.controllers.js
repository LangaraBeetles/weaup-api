import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

//Get a TOKEN
export const getAuthToken = async (req, res) => {
  try {
    const response = await axios.post(
      "https://dev-gcim3ai20yw28qus.us.auth0.com/oauth/token",
      {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        audience: process.env.AUDIENCE,
        grant_type: "client_credentials",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const token = response.data.access_token;

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ data: null, error: error });
  }
};

export default {
  getAuthToken,
};
