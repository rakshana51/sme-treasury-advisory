// backend/routes/auth.js
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = express.Router();

// REGISTER (for hackathon, you already seeded users, so optional)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    res.json({ message: "User registered" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    // check password (if you seeded without passwords, we can skip this for now)
    if (user.password) {
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
