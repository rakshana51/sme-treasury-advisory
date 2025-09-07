import express from "express";
import Transaction from "../models/Transaction.js";
import Invoice from "../models/Invoice.js";
import mongoose from "mongoose";

const router = express.Router();

// POST /api/forecast/run { userId, days=30 }
router.post("/run", async (req, res) => {
  const { userId, days = 30 } = req.body;
  if (!userId) return res.status(400).json({ error: "userId required" });

  // get current balance: sum credits - sum debits
  const txs = await Transaction.find({ userId });
  const balance = txs.reduce((s, t) => s + (t.type === "CREDIT" ? t.amount : -t.amount), 0);

  // get open invoices and their due dates
  const invoices = await Invoice.find({ userId, status: { $in: ["OPEN"] } });

  // Build daily forecast array
  const start = new Date();
  const dailyBalances = [];
  let running = balance;

  for (let i = 0; i < days; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);

    // add invoices due today
    const dueToday = invoices.filter(inv => {
      const d = new Date(inv.dueDate);
      return d.toDateString() === day.toDateString();
    });

    const inflows = dueToday.reduce((s, inv) => s + inv.amount, 0);

    // approximate outflows: use average of recent debits (simple heuristic)
    const recentDebits = txs.filter(t => t.type === "DEBIT").slice(-20);
    const avgDebit = recentDebits.length ? recentDebits.reduce((s, t) => s + t.amount, 0) / recentDebits.length : 1000;

    running = running + inflows - avgDebit;
    dailyBalances.push({ date: day.toISOString().slice(0,10), balance: Number(running.toFixed(2)) });
  }

  const alertDates = dailyBalances.filter(d => d.balance < 0).map(d => d.date);

  res.json({ currentBalance: balance, dailyBalances, alertDates });
});

export default router;
