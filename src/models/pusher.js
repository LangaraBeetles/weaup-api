import dotenv from "dotenv";
import Pusher from "pusher";

dotenv.config();

let pusher;

try {
  pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: process.env.PUSHER_APP_CLUSTER,
    useTLS: true,
  });
} catch (error) {
  console.error("Error creating Pusher instance", error);
}

export default pusher;
