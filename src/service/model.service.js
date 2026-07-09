import { spawn } from "child_process";

import ModelOutputTable from "../../db/model_output.js";

import RuleEngine from "../ai/ruleEngine.js";
import RCAService from "../ai/rca.service.js";

const ModelService = {

  processTelemetryForPrediction: async (payload) => {

    console.log("\n========== TELEMETRY PAYLOAD ==========");
    console.log(JSON.stringify(payload, null, 2));
    console.log("=======================================\n");

    return new Promise((resolve, reject) => {

      const pythonPath =
        "C:\\Users\\hp\\Desktop\\EV-Hackathon\\venv\\Scripts\\python.exe";

      const py = spawn(pythonPath, ["ml_model/predict.py"]);

      let dataString = "";

      py.stdout.on("data", (data) => {
        dataString += data.toString();
      });

      py.stderr.on("data", (err) => {
        console.error("Python Error:", err.toString());
      });

      py.on("close", async () => {

        try {

          if (!dataString.trim()) {
            throw new Error("Python returned no output.");
          }

          //---------------------------------------
          // ML Prediction
          //---------------------------------------

          const result = JSON.parse(dataString);

          const probability = result.probability;

          //---------------------------------------
          // Save Prediction
          //---------------------------------------

          const dbResult = await ModelOutputTable.saveOutput({

            vehicleId: payload.vehicleId,

            timestamp: payload.timestamp,

            probability: probability * 100,

            modelName: "XGBoost"

          });

          //---------------------------------------
          // Rule Engine
          //---------------------------------------

          const prediction = RuleEngine.analyze(

            probability,

            payload.metadata

          );

          console.log("\n========== RULE ENGINE ==========");
          console.log(prediction);

          //---------------------------------------
          // Gemini RCA
          //---------------------------------------

          const rca = await RCAService.generate({

            vehicleId: payload.vehicleId,

            timestamp: payload.timestamp,

            prediction,

            telemetry: payload.metadata

          });

          console.log("\n========== GEMINI RCA ==========");
          console.log(JSON.stringify(rca, null, 2));

          //---------------------------------------
          // Final Response
          //---------------------------------------

          const finalResponse = {

            referenceId: dbResult.insertId,

            vehicleId: payload.vehicleId,

            timestamp: payload.timestamp,

            failureProbability: prediction.failureProbability,

            predictedFailure: prediction.predictedFailure,

            healthStatus: prediction.healthStatus,

            riskLevel: prediction.riskLevel,

            confidence: prediction.confidence,

            atRiskComponent: prediction.atRiskComponent,

            failureType: prediction.failureType,

            recommendedAction: prediction.recommendedAction,

            rca

          };

          console.log("\n========== FINAL RESPONSE ==========");
          console.log(JSON.stringify(finalResponse, null, 2));

          resolve(finalResponse);

        }

        catch (err) {

          console.error("Model Service Error:", err);

          reject(err);

        }

      });

      py.stdin.write(JSON.stringify(payload));

      py.stdin.end();

    });

  }

};

export default ModelService;