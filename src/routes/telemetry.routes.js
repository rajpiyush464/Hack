import express from 'express';
import TelemetryService from '../service/telemetry.service.js';
const router = express.Router();

// Maps downstream payload ingestion straight to the service handling block
router.post('/', async (req, res) => {
  try {
    const analyticalInsights = await TelemetryService.processIngestionPayload(req.body);
    return res.status(201).json({
      success: true,
      message: 'Vehicle streaming metrics written successfully.',
      insights: analyticalInsights
    });
  } catch (error) {
    console.error('❌ Router Ingestion Error:', error.message);
    return res.status(500).json({ success: false, error: 'Inbound processing fault' });
  }
});

export default router;