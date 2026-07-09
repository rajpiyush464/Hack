import express from 'express';
import telemetryRoutes from './telemetry.routes.js';
import vehicleRoutes from './vehicle.routes.js';
import chartRoutes from './chart.routes.js';
import modelRoutes from './model.routes.js';
import masterRoutes from './master.routes.js';   // ✅ add this

const router = express.Router();

router.use('/chart', chartRoutes);
router.use('/telemetry', telemetryRoutes);
router.use('/vehicle', vehicleRoutes);
router.use('/model', modelRoutes);
router.use('/master', masterRoutes);   // ✅ add this

export default router;
