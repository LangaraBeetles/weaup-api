import { Schema, model } from "mongoose";

const Member = new Schema({
  user_id: { type: String, required: true },
  joined_at: { type: Date, default: Date.now(), required: false },
  points: { type: Number, default: 0, required: true },
  left_at: { type: Date, default: null, required: false },
});

const schema = new Schema({
  creator_id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: false, default: "" },
  start_at: { type: Date, default: Date.now(), required: false },
  end_at: { type: Date, required: true },
  duration: { type: Number, required: true },
  goal: { type: Number, required: true },
  status: {
    type: String,
    enum: ["in_progress", "failed", "completed", "quitted"],
    default: "in_progress",
    required: false,
  },
  color: { type: String, required: false },
  icon: { type: String, required: false },
  members: [Member],
});

export default model("Challenge", schema);
