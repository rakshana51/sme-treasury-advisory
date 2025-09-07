import express from "express";
import AdviceSession from "../models/AdviceSession.js";

const router = express.Router();

// POST /api/advice/intake
// body: { userId, goal, horizonMonths, riskProfile, currentSavings, monthlyAbility }
router.post("/intake", async (req, res) => {
  const { userId, goal, horizonMonths = 36, riskProfile = "BALANCED", currentSavings = 0, monthlyAbility = 0 } = req.body;
  
  // simple allocation matrix and assumed returns
  const allocation = { CONSERVATIVE: {cash: 60, bonds:30, equity:10}, BALANCED: {cash:30, bonds:40, equity:30}, AGGRESSIVE: {cash:10, bonds:30, equity:60} };
  const expectedReturns = { cash: 0.01, bonds: 0.04, equity: 0.07 };

  const alloc = allocation[riskProfile] || allocation["BALANCED"];

  // project simple growth using monthly compound approx (very rough)
  const monthlyReturn = (alloc.cash*expectedReturns.cash + alloc.bonds*expectedReturns.bonds + alloc.equity*expectedReturns.equity)/100/12;
  // target estimate: how much monthly contribution to reach goal - rough iterative approach
  const goalAmount = parseFloat(goal.replace(/[^0-9.]/g, '')) || 10000;

  // simple projection using monthly contributions
  let months = horizonMonths;
  let monthlyRequired = 0;
  const current = Number(currentSavings);
  if (monthlyAbility > 0) {
    monthlyRequired = monthlyAbility;
  } else {
    // rough solver: trial contributions
    for (let c = 1; c < 100000; c += 1) {
      let total = current;
      for (let m = 0; m < months; m++) {
        total = total * (1 + monthlyReturn) + c;
      }
      if (total >= goalAmount) { monthlyRequired = c; break; }
    }
  }

  const recommendation = { monthlyRequired: Number(monthlyRequired.toFixed(2)), allocation: alloc, expectedReturnAnn: (alloc.cash*expectedReturns.cash + alloc.bonds*expectedReturns.bonds + alloc.equity*expectedReturns.equity)/100 };

  const session = new AdviceSession({ userId, goal, horizonMonths, riskProfile, recommendation, transcript: [] });
  await session.save();

  res.json({ sessionId: session._id, recommendation, session });
});

export default router;
