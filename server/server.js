const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

// Check if GEMINI_API_KEY is loaded
if (!process.env.GEMINI_API_KEY) {
  console.error("Error: GEMINI_API_KEY environment variable is not set");
  process.exit(1);
} else {
  console.log("GEMINI_API_KEY loaded successfully");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  console.log("GET / request received");
  res.json({ message: "Server is running" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/ai", async (req, res) => {
  console.log("POST /api/ai request received:", req.body);
  try {
    const { mode, text, tone, persona, message, userReview } = req.body;
    if (!mode || !text) {
      return res.status(400).json({ error: "Mode and text are required" });
    }

    let prompt = "";
    switch (mode) {
      case "30second":
        prompt = `Provide a 30-second summary of the following text: ${text}`;
        break;
      case "eli10":
        prompt = `Explain the following text like I'm 10 years old: ${text}`;
        break;
      case "chapter":
        prompt = `Provide a chapter-wise breakdown of the following text: ${text}`;
        break;
      case "bullet":
        prompt = `Summarize the following text in bullet points: ${text}`;
        break;
      case "review":
        if (!tone)
          return res.status(400).json({ error: "Tone is required for review" });
        prompt = `Write a book review in ${tone} tone for the following book: ${text}`;
        break;
      case "chat":
        if (!persona || !message)
          return res
            .status(400)
            .json({ error: "Persona and message are required for chat" });
        prompt = `Respond as a ${persona} to the following message about the book: ${text}. Message: ${message}`;
        break;
      case "compare":
        if (!userReview)
          return res
            .status(400)
            .json({ error: "User review is required for comparison" });
        prompt = `Compare the following user review with typical reviews for the book: ${text}. User review: ${userReview}. Provide similarity percentage, originality score, unique points, common points, and contradictions.`;
        break;
      default:
        return res.status(400).json({ error: "Invalid mode" });
    }

    console.log(
      "Calling Gemini API with prompt:",
      prompt.substring(0, 100) + "...",
    );
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResponse = response.text();
    console.log("Gemini API response received, length:", aiResponse.length);

    res.json({ result: aiResponse });
  } catch (error) {
    console.error("Error generating AI response:", error);
    res.status(500).json({ error: "Failed to generate AI response" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
