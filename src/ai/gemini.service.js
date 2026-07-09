import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

class GeminiService {

    static async generateRCA(prompt) {

        try {

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash-lite",
                contents: prompt
            });

            let text = response.text;

            // Remove markdown if Gemini wraps JSON
            text = text.replace(/```json/g, "")
                       .replace(/```/g, "")
                       .trim();

            return JSON.parse(text);

        } catch (err) {

            console.error("Gemini Error:", err);

            return {
                executiveSummary: "Unable to generate RCA.",
                rootCause: "LLM service unavailable.",
                supportingEvidence: [],
                maintenanceRecommendation: "",
                preventiveActions: [],
                severity: "Unknown",
                confidence: "Low"
            };

        }

    }

}

export default GeminiService;