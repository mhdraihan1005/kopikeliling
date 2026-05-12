import * as genAIModule from "@google/generative-ai";
console.log("Exported keys from @google/generative-ai:");
console.log(Object.keys(genAIModule));

const apiKey = process.env.GEMINI_API_KEY;
if (apiKey) {
  const genAI = new genAIModule.GoogleGenerativeAI(apiKey);
  console.log("Instance keys:");
  console.log(Object.keys(genAI));
  
  // Try to find listModels or equivalent
  for (const key in genAI) {
    if (typeof genAI[key] === 'function') {
      console.log(`- Method: ${key}`);
    }
  }
}
