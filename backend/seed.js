// run with: node seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import User from "./models/User.js";
import Transaction from "./models/Transaction.js";
import Invoice from "./models/Invoice.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/smehack";
await mongoose.connect(MONGO_URI);

const user = await User.create({ email: "owner@acme.com", name: "Acme Drinks", role: "SME" });

// create current transactions: a positive balance
await Transaction.create([
  { userId: user._id, date: new Date("2025-08-01"), type: "CREDIT", amount: 5000, description: "Initial balance" },
  { userId: user._id, date: new Date("2025-08-05"), type: "DEBIT", amount: 1500, description: "Supplies" },
  { userId: user._id, date: new Date("2025-08-10"), type: "DEBIT", amount: 1200, description: "Payroll" },
]);

// create an invoice due in 7 days for 3000
const due = new Date();
due.setDate(due.getDate() + 7);
await Invoice.create({ userId: user._id, invoiceId: "INV-1001", issueDate: new Date(), dueDate: due, amount: 3000, status: "OPEN" });

console.log("Seed done");
process.exit(0);
