import { Schema, model } from "mongoose";

const schema = new Schema(
  {
    user_id: { type: String, required: true },
    notification_type: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    detail_path: { type: String, required: true },
  },
  { timestamps: true },
);

export default model("Notifications", schema);
