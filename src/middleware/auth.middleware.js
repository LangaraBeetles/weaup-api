import dotenv from "dotenv";
import { decodeToken } from "../shared/auth.js";

dotenv.config();

const checkGoogleAccessToken = async (req, res, next) => {
  try {
    if (process.env.DEV_MODE === "true") {
      next();
      return;
    }

    const authorizationHeader = req.headers["authorization"];

    if (!authorizationHeader) {
      return res.status(401).json({ data: null, error: "Unauthorized" });
    }

    const token = authorizationHeader.split(" ")[1];

    const decoded = decodeToken(token);

    req.auth = decoded;

    next();
  } catch (error) {
    res.status(401).json({ data: null, error: error.message });
  }
};

export default checkGoogleAccessToken;
