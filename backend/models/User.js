import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  role: { type: String, enum: ["SME","RM","RETAIL"], default: "SME" },
  createdAt: { type: Date, default: Date.now },
  // add password/hash if needed later
});

export default mongoose.model("User", userSchema);
