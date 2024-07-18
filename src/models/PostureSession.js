import { Schema, model } from "mongoose";
import dayjs from "dayjs";

const schema = new Schema(
  {
    user_id: { type: String, required: true },
    started_at: { type: Date, required: true },
    ended_at: { type: Date, required: false },
    score: { type: Number, required: false },
    xp: {
      type: {
        initial: Number,
        final: Number,
      },
      required: true,
    },
    duration: {
      type: Number,
      default: function () {
        const startedAt = dayjs(this.started_at);
        const endedAt = dayjs(this.ended_at);
        if (startedAt.isValid() && endedAt.isValid()) {
          return endedAt.diff(startedAt, "seconds");
        }
        return 0;
      },
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
      default: function () {
        return Number(this.total_bad) + Number(this.total_good);
      },
    },
  },
  { timestamps: true },
);

export default model("PostureSession", schema);
