import { Schema, model } from "mongoose";

const schema = new Schema({
  name: { type: String, default: null, required: false },
  device_id: { type: String, required: true },
  level_id: { type: Schema.Types.ObjectId, ref: "Level", required: false },
  is_setup_complete: { type: Boolean, default: false, required: true },
  xp: { type: Number, min: 0, default: 0, required: true },
  hp: { type: Number, min: 0, default: 100, required: true },
  preferred_mode: {
    type: String,
    enum: ["phone", "earbuds"],
    default: "phone",
    required: true,
  },
});

export default model("User", schema);
