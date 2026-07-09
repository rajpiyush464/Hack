import express from 'express';
import TelemetryService from '../service/telemetry.service.js';
import ModelService from '../service/model.service.js';

const router = express.Router();

// POST /api/telemetry → ingest telemetry + run model
router.post('/', async (req, res) => {
  try {
    // Save telemetry
    const analyticalInsights = await TelemetryService.processIngestionPayload(req.body);

    // Run ML model prediction
    const prediction = await ModelService.processTelemetryForPrediction(req.body);

    return res.status(201).json({
      success: true,
      message: 'Telemetry + Model prediction processed successfully.',
      insights: analyticalInsights,
      prediction: prediction
    });
  } catch (error) {
    console.error('❌ Telemetry Router Error:', error.message);
    return res.status(500).json({ success: false, error: 'Inbound processing fault' });
  }
});

export default router;
