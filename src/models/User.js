import { Schema, model } from "mongoose";

const schema = new Schema({
  providerId: { type: String, required: false },
  name: { type: String, default: null, required: false },
  email: { type: String, required: true, unique: false },
  preferred_mode: {
    type: String,
    enum: ["phone", "earbuds"],
    default: "phone",
    required: true,
  },
  daily_goal: { type: Number, min: 50, default: 50, required: true },
  level_id: { type: Schema.Types.ObjectId, ref: "Level", required: false }, //TODO: Update to "true" when Level collection is populated
  is_setup_complete: { type: Boolean, default: false, required: true },
  xp: { type: Number, min: 0, default: 0, required: true },
  hp: { type: Number, min: 0, default: 100, required: true },
  device_id: { type: String, default: null, required: false },
});

export default model("User", schema);
