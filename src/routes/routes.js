import express from 'express';
import telemetryRoutes from './telemetry.routes.js';
import vehicleRoutes from './vehicle.routes.js';
import chartRoutes from './chart.routes.js';





const router = express.Router();

// Ties up sub-feature endpoints under the primary API namespace map
router.use('/chart', chartRoutes);
router.use('/telemetry', telemetryRoutes);
router.use('/vehicle', vehicleRoutes);

export default router;