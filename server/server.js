const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: "./server/.env" });

const app = express();

// Check if GEMINI_API_KEY is loaded
if (!process.env.GEMINI_API_KEY) {
  console.error("Error: GEMINI_API_KEY environment variable is not set");
  process.exit(1);
} else {
  console.log("GEMINI_API_KEY loaded successfully");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(express.json());

app.get("/", (req, res) => {
  console.log("GET / request received");
  res.json({ message: "Server is running" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/summarize", async (req, res) => {
  console.log("POST /api/summarize request received:", req.body);
  try {
    const { text, mode } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    let prompt = `Summarize the following text: ${text}`;
    if (mode === "bullets") {
      prompt = `Summarize the following text in bullet points: ${text}`;
    } else if (mode === "chapter") {
      prompt = `Summarize the following text chapter-wise: ${text}`;
    }

    console.log(
      "Calling Gemini API with prompt:",
      prompt.substring(0, 100) + "...",
    );
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();
    console.log("Gemini API response received, length:", summary.length);

    res.json({ result: summary });
  } catch (error) {
    console.error("Error generating summary:", error);
    res.status(500).json({ error: "Failed to generate summary" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
