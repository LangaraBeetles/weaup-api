import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const checkGoogleAccessToken = async (req, res, next) => {
  if (process.env.DEV_MODE === "true") {
    next();
    return;
  }

  const authorizationHeader = req.headers["authorization"];

  if (!authorizationHeader) {
    return res.status(401).json({ data: null, error: "Unauthorized" });
  }

  const token = authorizationHeader.split(" ")[1];

  try {
    const uri = process.env.TOKEN_URI;

    const response = await axios.get(uri, {
      params: {
        access_token: token,
      },
    });

    const payload = response.data;

    if (payload.aud !== process.env.GOOGLE_CLIENT_ID) {
      throw new Error("Token audience does not match client ID");
    }

    req.auth = payload;

    next();
  } catch (error) {
    res.status(401).json({ data: null, error: error });
  }
};

export default checkGoogleAccessToken;
