import { Schema, model } from "mongoose";

const schema = new Schema(
  {
    user_id: { type: String, required: true },
    duration: { type: Number, required: true }, // Duration in seconds
  },
  { timestamps: true },
);

export default model("ActiveMonitoring", schema);
