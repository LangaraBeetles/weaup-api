import { Schema, model } from "mongoose";

const schema = new Schema({
  name: { type: Number, required: true },
  required_xp: { type: Number, required: true },
});

export default model("Level", schema);
