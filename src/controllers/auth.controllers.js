import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

//Get a TOKEN
export const getAuthToken = async (req, res) => {
  try {
    const response = await axios.post(
      process.env.TOKEN_URI,
      {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        audience: process.env.AUTH0_AUDIENCE,
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
