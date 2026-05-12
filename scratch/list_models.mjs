import { GoogleGenerativeAI } from "@google/generative-ai";

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY not found in environment");
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  try {
    const result = await genAI.listModels();
    console.log("Available Models:");
    result.models.forEach((m) => {
      console.log(`- ${m.name} (Methods: ${m.supportedGenerationMethods.join(", ")})`);
    });
  } catch (error) {
    console.error("Error listing models:", error);
  }
}

listModels();
