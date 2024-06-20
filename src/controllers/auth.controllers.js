import { JWT } from "google-auth-library";
import dotenv from "dotenv";
import serviceAccount from "../constants/serviceAccount.js";

dotenv.config();

// Create a client with the service account
const client = new JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/cloud-platform"], //If we want to restrict the scope of the token, for example read&write only. This one is unrestricted.
});

// Function to get or renew a token
const getAuthToken = async (req, res) => {
  try {
    await renewTokenIfNeeded();
    const token = client.credentials.access_token;

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ data: null, error: error });
  }
};

// Function to renew token if needed
const renewTokenIfNeeded = async () => {
  if (
    !client.credentials.access_token ||
    tokenNeedsRenewal(client.credentials)
  ) {
    await client.authorize();
  }
};

// Function to check if token needs renewal, if it expires in less than 5 min, it will be renewed
const tokenNeedsRenewal = (credentials) => {
  const now = Math.floor(Date.now() / 1000);
  const expiry = credentials.expiry_date ? credentials.expiry_date / 1000 : 0;
  return now + 300 > expiry;
};

export default { getAuthToken };
