import mongoose from "mongoose";

const txSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ["CREDIT","DEBIT"], required: true },
  amount: { type: Number, required: true },
  description: String,
  source: { type: String, default: "manual" }
});

export default mongoose.model("Transaction", txSchema);
