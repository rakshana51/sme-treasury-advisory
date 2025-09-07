import mongoose from "mongoose";

const adviceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  goal: String,
  horizonMonths: Number,
  riskProfile: String,
  recommendation: mongoose.Schema.Types.Mixed,
  handOffToRM: { type: Boolean, default: false },
  transcript: [{ from: String, text: String, time: Date }]
});

export default mongoose.model("AdviceSession", adviceSchema);
