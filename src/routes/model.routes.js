import express from 'express';
import ModelService from '../service/model.service.js';

const router = express.Router();

// POST /api/model/predict → send telemetry to model, save probability
router.post('/predict', async (req, res) => {
  try {
    const result = await ModelService.processTelemetryForPrediction(req.body);
    res.status(201).json({ success: true, prediction: result });
  } catch (error) {
    console.error('❌ Model Prediction Error:', error.message);
    res.status(500).json({ success: false, error: 'Model prediction failed' });
  }
});

// GET /api/model/:vehicleId/latest → fetch latest probability
router.get('/:vehicleId/latest', async (req, res) => {
  try {
    const output = await ModelService.getLatestPrediction(req.params.vehicleId);
    res.json({ success: true, latestPrediction: output });
  } catch (error) {
    console.error('❌ Model Output Fetch Error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch prediction' });
  }
});

export default router;
