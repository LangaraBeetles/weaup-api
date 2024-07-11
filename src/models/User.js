import { Schema, model } from "mongoose";
import { userAvatar } from "../shared/user";

const schema = new Schema({
  provider_id: { type: String, required: false },
  name: { type: String, default: null, required: false },
  email: { type: String, default: null, required: false, unique: false },
  preferred_mode: {
    type: String,
    enum: ["phone", "earbuds"],
    default: "phone",
    required: true,
  },
  avatar_bg: {
    type: String,
    enum: userAvatar,
    default: "blue1",
  },
  daily_goal: { type: Number, min: 50, default: 50, required: true },
  level: { type: Number, default: 1 },
  is_setup_complete: { type: Boolean, default: false, required: true },
  xp: { type: Number, min: 0, default: 0, required: true },
  hp: { type: Number, min: 0, default: 100, required: true },
  device_id: { type: String, default: null, required: false },
  badges: { type: Array, default: [], required: false },
});

export default model("User", schema);
