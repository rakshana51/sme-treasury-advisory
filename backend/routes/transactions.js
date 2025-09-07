import express from "express";
import Transaction from "../models/Transaction.js";

const router = express.Router();

// GET transactions for a user (query ?userId=)
router.get("/", async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "userId required" });
  const txs = await Transaction.find({ userId }).sort({ date: 1 });
  res.json(txs);
});

// POST create transaction
router.post("/", async (req, res) => {
  const tx = new Transaction(req.body);
  await tx.save();
  res.json(tx);
});

export default router;
