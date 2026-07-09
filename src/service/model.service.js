import { spawn } from 'child_process';
import ModelOutputTable from '../../db/model_output.js';

const ModelService = {
  processTelemetryForPrediction: async (payload) => {
    console.log("\n========== TELEMETRY PAYLOAD ==========");
    console.log(JSON.stringify(payload, null, 2));
    console.log("=======================================\n");
    return new Promise((resolve, reject) => {
      const pythonPath =
  'C:\\Users\\hp\\AppData\\Local\\Python\\pythoncore-3.14-64\\python.exe';

const py = spawn(pythonPath, ['ml_model/predict.py']);
      let dataString = '';

      py.stdout.on('data', (data) => {
        dataString += data.toString();
      });

      py.stderr.on('data', (err) => {
        console.error('Python error:', err.toString());
      });

      py.on('close', async () => {
        try {
          const result = JSON.parse(dataString);
          const probability = result.probability;

          // Save to DB
          const dbResult = await ModelOutputTable.saveOutput({
            vehicleId: payload.vehicleId,
            timestamp: payload.timestamp,
            probability: probability * 100,
            modelName: 'failure_predictor'
          });

          resolve({
            referenceId: dbResult.insertId,
            vehicleId: payload.vehicleId,
            timestamp: payload.timestamp,
            probability: `${(probability * 100).toFixed(2)}%`
          });
        } catch (e) {
          reject(e);
        }
      });

      py.stdin.write(JSON.stringify(payload));
      py.stdin.end();
    });
  }
};

export default ModelService;
