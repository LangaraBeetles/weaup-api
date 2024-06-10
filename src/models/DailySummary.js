import { Schema, model } from "mongoose";

const schema = new Schema(
  {
    user_id: { type: String, required: true },
    date: { type: String, required: true },
    duration: {
      type: Number,
      required: true,
    },
    total_good: {
      type: Number,
      required: true,
      default: 0,
    },
    total_bad: {
      type: Number,
      required: true,
      default: 0,
    },
    total_records: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true },
);

export default model("DailySummary", schema);
