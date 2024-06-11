import { Schema, model } from "mongoose";

const schema = new Schema({
  creator_id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  start_at: { type: Date, default: Date.now(), required: false },
  end_at: { type: Date, required: true },
  goal: { type: Number, required: true },
  status: {
    type: String,
    enum: ["in_progress", "not_achieved", "achieved", "deleted"],
    default: "in_progress",
    required: false,
  },
});

export default model("Challenge", schema);
