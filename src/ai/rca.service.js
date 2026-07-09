import PromptBuilder from "./promptBuilder.js";
import GeminiService from "./gemini.service.js";

class RCAService {

    static async generate({ vehicleId, timestamp, prediction, telemetry }) {

        try {

            const prompt = PromptBuilder.buildPredictiveRCA({

                vehicleId,

                timestamp,

                prediction,

                telemetry

            });

            const rca = await GeminiService.generateRCA(prompt);

            return rca;

        } catch (err) {

            console.error("RCA Service Error:", err);

            return {

                executiveSummary:
                    "Unable to generate Root Cause Analysis.",

                rootCause:
                    "LLM service unavailable.",

                incidentTimeline: [],

                supportingEvidence: [],

                atRiskComponent:
                    prediction?.atRiskComponent || "Unknown",

                failureType:
                    prediction?.failureType || "Unknown",

                severity:
                    prediction?.riskLevel || "Unknown",

                confidence:
                    prediction?.confidence || "Low",

                recommendedMaintenance:
                    prediction?.recommendedAction ||
                    "Inspect the vehicle.",

                preventiveActions: []

            };

        }

    }

}

export default RCAService;