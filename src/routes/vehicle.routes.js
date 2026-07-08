import express from 'express';
import VehicleService from '../service/vehicle.service.js';

const router = express.Router();

// POST /api/vehicle
router.post('/', async (req, res) => {
  try {
    const result = await VehicleService.registerVehicle(req.body);
    res.status(201).json({ success: true, ...result });
  } catch (error) {
    console.error('❌ Vehicle Registration Error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to register vehicle' });
  }
});

// GET /api/vehicle/:vin
router.get('/:vin', async (req, res) => {
  try {
    const vehicle = await VehicleService.fetchVehicle(req.params.vin);
    res.json({ success: true, vehicle });
  } catch (error) {
    console.error('❌ Vehicle Fetch Error:', error.message);
    res.status(404).json({ success: false, error: 'Vehicle not found' });
  }
});

// PUT /api/vehicle/:vin
router.put('/:vin', async (req, res) => {
  try {
    const result = await VehicleService.updateVehicleInfo(req.params.vin, req.body);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('❌ Vehicle Update Error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to update vehicle' });
  }
});
// GET /api/vehicle/:vin/latest
router.get('/:vin/latest', async (req, res) => {
  try {
    const vehicle = await VehicleService.fetchVehicle(req.params.vin);
    res.json({ success: true, vehicle });
  } catch (error) {
    res.status(404).json({ success: false, error: 'Vehicle not found' });
  }
});


export default router;
