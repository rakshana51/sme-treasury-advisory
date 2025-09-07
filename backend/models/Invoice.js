import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  invoiceId: String,
  issueDate: Date,
  dueDate: Date,
  amount: Number,
  status: { type: String, enum: ["OPEN","PAID","OVERDUE"], default: "OPEN" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Invoice", invoiceSchema);
