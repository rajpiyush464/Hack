import express from 'express';
import ChartService from '../service/chart.service.js';

const router = express.Router();

// Voltage chart data
router.get('/:vehicleId/voltage', async (req, res) => {
  try {
    const data = await ChartService.getVoltageHistory(req.params.vehicleId, 50);
    res.json({ success: true, voltageHistory: data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch voltage history' });
  }
});

// Current chart data
router.get('/:vehicleId/current', async (req, res) => {
  try {
    const data = await ChartService.getCurrentHistory(req.params.vehicleId, 50);
    res.json({ success: true, currentHistory: data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch current history' });
  }
});

// RPM chart data
router.get('/:vehicleId/rpm', async (req, res) => {
  try {
    const data = await ChartService.getRpmHistory(req.params.vehicleId, 50);
    res.json({ success: true, rpmHistory: data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch rpm history' });
  }
});

// Speed chart data
router.get('/:vehicleId/speed', async (req, res) => {
  try {
    const data = await ChartService.getSpeedHistory(req.params.vehicleId, 50);
    res.json({ success: true, speedHistory: data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch speed history' });
  }
});

export default router;
