import express from "express";
import MasterService from "../service/master.service.js";

const router = express.Router();

// GET /api/master/:vehicleId/latest → latest record for one vehicle
router.get("/:vehicleId/latest", async (req, res) => {
  try {
    const data = await MasterService.getLatestByVehicle(req.params.vehicleId);
    res.json({ success: true, latest: data });
  } catch (error) {
    console.error("❌ Master API Error:", error.message);
    res.status(500).json({ success: false, error: "Failed to fetch latest record" });
  }
});

// GET /api/master/:vehicleId/all → all records for one vehicle
router.get("/:vehicleId/all", async (req, res) => {
  try {
    const data = await MasterService.getAllByVehicle(req.params.vehicleId);
    res.json({ success: true, records: data });
  } catch (error) {
    console.error("❌ Master API Error:", error.message);
    res.status(500).json({ success: false, error: "Failed to fetch records" });
  }
});

// GET /api/master/all-latest → latest snapshot for all vehicles
router.get("/all-latest", async (req, res) => {
  try {
    const data = await MasterService.getAllLatest();
    res.json({ success: true, vehicles: data });
  } catch (error) {
    console.error("❌ Master API Error:", error.message);
    res.status(500).json({ success: false, error: "Failed to fetch all latest records" });
  }
});

export default router;
