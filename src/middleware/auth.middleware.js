import axios from "axios";
import dotenv from "dotenv";
import serviceAccount from "../constants/serviceAccount.js";

dotenv.config();

const checkGoogleAccessToken = async (req, res, next) => {
  const authorizationHeader = req.headers["authorization"];

  if (!authorizationHeader) {
    return res.status(401).json({ data: null, error: "Unauthorized" });
  }

  const token = authorizationHeader.split(" ")[1];

  try {
    const response = await axios.get(`${process.env.TOKEN_URI}${token}`);
    const payload = response.data;

    if (payload.aud !== serviceAccount.client_id) {
      throw new Error("Token audience does not match client ID");
    }

    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ data: null, error: error });
  }
};

export default checkGoogleAccessToken;
