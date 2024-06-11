import { Schema, model } from "mongoose";

const schema = new Schema(
  {
    notification_id: { type: String, required: true },
    user_id: { type: String, required: true },
    notification_type: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    detail_path: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export default model("Notifications", schema);
