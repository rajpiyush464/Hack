import express from 'express';
import VehicleService from '../service/vehicle.service.js';
import ModelService from '../service/model.service.js';

const router = express.Router();

// POST /api/vehicle → register a new vehicle
router.post('/', async (req, res) => {
  try {
    const result = await VehicleService.registerVehicle(req.body);
    res.status(201).json({ success: true, ...result });
  } catch (error) {
    console.error('❌ Vehicle Registration Error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to register vehicle' });
  }
});

// GET /api/vehicle/:vin → fetch vehicle details
router.get('/:vin', async (req, res) => {
  try {
    const vehicle = await VehicleService.fetchVehicle(req.params.vin);
    res.json({ success: true, vehicle });
  } catch (error) {
    console.error('❌ Vehicle Fetch Error:', error.message);
    res.status(404).json({ success: false, error: 'Vehicle not found' });
  }
});

// PUT /api/vehicle/:vin → update vehicle info
router.put('/:vin', async (req, res) => {
  try {
    const result = await VehicleService.updateVehicleInfo(req.params.vin, req.body);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('❌ Vehicle Update Error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to update vehicle' });
  }
});

// GET /api/vehicle/:vin/latest → fetch latest vehicle record
router.get('/:vin/latest', async (req, res) => {
  try {
    const vehicle = await VehicleService.fetchVehicle(req.params.vin);
    res.json({ success: true, vehicle });
  } catch (error) {
    console.error('❌ Vehicle Latest Fetch Error:', error.message);
    res.status(404).json({ success: false, error: 'Vehicle not found' });
  }
});

// GET /api/vehicle/all → list all vehicles
router.get('/all/list', async (req, res) => {
  try {
    const vehicles = await VehicleService.listAllVehicles();
    res.json({ success: true, vehicles });
  } catch (error) {
    console.error('❌ Vehicle List Error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch vehicles' });
  }
});

// DELETE /api/vehicle/:vin → delete a vehicle
router.delete('/:vin', async (req, res) => {
  try {
    const result = await VehicleService.deleteVehicle(req.params.vin);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('❌ Vehicle Delete Error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to delete vehicle' });
  }
});

// GET /api/vehicle/:vin/withPrediction → vehicle info + latest probability
router.get('/:vin/withPrediction', async (req, res) => {
  try {
    const vehicle = await VehicleService.fetchVehicle(req.params.vin);
    const prediction = await ModelService.getLatestPrediction(req.params.vin);
    res.json({ success: true, vehicle, prediction });
  } catch (error) {
    console.error('❌ Vehicle + Prediction Fetch Error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch vehicle + prediction' });
  }
});

export default router;
