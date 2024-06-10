import { Schema, model } from "mongoose";

const schema = new Schema(
  {
    user_id: { type: String, required: true },
    good_posture: { type: Boolean, required: true },
    recorded_at: { type: Date, required: true },
    session_id: { type: String, required: false },
  },
  { timestamps: true },
);

export default model("PostureRecord", schema);
