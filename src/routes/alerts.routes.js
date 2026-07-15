import express from 'express';
import AlertService from '../service/alert.service.js';

const router = express.Router();

/**
 * GET /api/alerts/active
 * ----------------------
 * Fetch all active alerts.
 * Returns: { alerts: [...] }
 */
router.get('/alerts/active', async (req, res) => {
  try {
    const alerts = await AlertService.listActive();
    res.json({ alerts });
  } catch (err) {
    console.error("Error fetching active alerts:", err.message);
    res.status(500).json({ error: "Failed to fetch active alerts" });
  }
});

/**
 * GET /api/alerts/:id
 * -------------------
 * Fetch a single alert by ID.
 * Returns: { alert: {...} }
 */
router.get('/alerts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const alert = await AlertService.getById(id);
    if (!alert) {
      return res.status(404).json({ error: "Alert not found" });
    }
    res.json({ alert });
  } catch (err) {
    console.error(`Error fetching alert ${req.params.id}:`, err.message);
    res.status(500).json({ error: "Failed to fetch alert" });
  }
});

/**
 * POST /api/alerts/:id/resolve
 * ----------------------------
 * Resolve an alert by ID.
 * Returns: { success: true }
 */
router.post('/alerts/:id/resolve', async (req, res) => {
  try {
    const { id } = req.params;
    const success = await AlertService.resolve(id);
    if (!success) {
      return res.status(404).json({ error: "Alert not found or already resolved" });
    }
    res.json({ success: true });
  } catch (err) {
    console.error(`Error resolving alert ${req.params.id}:`, err.message);
    res.status(500).json({ error: "Failed to resolve alert" });
  }
});

/**
 * POST /api/alerts/create
 * -----------------------
 * Create an alert manually (optional).
 * Body: { vehicleId, rca }
 * Returns: { success: true, id: <alertId> }
 */
router.post('/alerts/create', async (req, res) => {
  try {
    const { vehicleId, rca } = req.body;
    const id = await AlertService.generateFromRCA(vehicleId, rca);
    res.json({ success: true, id });
  } catch (err) {
    console.error("Error creating alert:", err.message);
    res.status(500).json({ error: "Failed to create alert" });
  }
});

export default router;
