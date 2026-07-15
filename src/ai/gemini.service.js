import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

class GeminiService {
  static MODELS = [
    "gemini-2.5-flash",
    "gemini-2.5-pro",
    "gemini-2.0-flash",
  ];

  static async generateRCA(prompt) {
    for (const model of this.MODELS) {
      try {
        console.log(`Trying Gemini model: ${model}`);

        const response = await ai.models.generateContent({
          model,
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: {
            responseMimeType: "application/json",
            temperature: 0.2,
            maxOutputTokens: 2048,
          },
        });

        console.log(`Successfully generated using ${model}`);

        const text = response?.text || "{}";
        return JSON.parse(text);
      } catch (err) {
        console.error("================================");
        console.error("Model:", model);
        console.error("Status:", err.status);
        console.error("Message:", err.message);
        console.error("Error:", err);
        console.error("================================");

        if (
          err.status === 404 ||
          err.message?.includes("NOT_FOUND") ||
          err.message?.includes("no longer available")
        ) {
          console.log("Falling back to next model...");
          continue;
        }

        console.log("Trying next available model...");
      }
    }

    return {
      executiveSummary: "Unable to generate RCA.",
      rootCause: "All Gemini models are unavailable.",
      supportingEvidence: [],
      recommendedMaintenance: "",
      preventiveActions: [],
      severity: "Unknown",
      confidence: "Low",
    };
  }
}

export default GeminiService;