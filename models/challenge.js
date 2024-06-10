const Challenge = new Schema({
  creator_id: { type: Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true },
  description: { type: String, required: true },
  start_at: { type: Date, required: true },
  end_at: { type: Date, required: true },
  goal: { type: Number, required: true },
});
