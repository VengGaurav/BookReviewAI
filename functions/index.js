/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const {GoogleGenerativeAI} = require("@google/generative-ai");
const functions = require("firebase-functions");

const genAI = new GoogleGenerativeAI(functions.config().gemini.api_key);

exports.generateText = onRequest(async (req, res) => {
  try {
    const prompt = req.query.prompt || "Tell me a joke";
    const model = genAI.getGenerativeModel({model: "gemini-1.0-pro"});
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    logger.info("Generated text", {text});
    res.json({text});
  } catch (error) {
    logger.error("Error generating text", error);
    res.status(500).json({error: "Failed to generate text"});
  }
});
