import express from "express";
import Invoice from "../models/Invoice.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "userId required" });
  const inv = await Invoice.find({ userId }).sort({ dueDate: 1 });
  res.json(inv);
});

router.post("/", async (req, res) => {
  const invoice = new Invoice(req.body);
  await invoice.save();
  res.json(invoice);
});

export default router;
