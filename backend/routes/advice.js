// backend/routes/advice.js
import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", // ✅ updated model
        messages: [
          {
            role: "system",
            content: "You are a robo-advisor giving simple financial advice to SMEs and individuals.",
          },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();
    console.log("RAW GROQ RESPONSE:", JSON.stringify(data, null, 2));

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({
        error: data.error?.message || "Invalid response from Groq",
      });
    }

    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error("Groq API error:", err);
    res.status(500).json({ error: "AI service failed" });
  }
});

export default router;
