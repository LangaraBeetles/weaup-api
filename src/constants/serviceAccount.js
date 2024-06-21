import dotenv from "dotenv";

dotenv.config();

const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);

export default serviceAccount;
