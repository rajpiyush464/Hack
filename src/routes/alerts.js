import express from "express";
// import { successResponse } from "../utils/apiResponse.js";
import { successResponse } from "../../utils/apiResponse.js";
import MasterOutputTable from "../../db/master_output.js";


import { generateAlerts } from "../service/alertService.js";

const router = express.Router();

router.get("/:vehicleId/alerts", async (req, res) => {
  try {
    const vehicle = await MasterOutputTable.getLatestOutput(req.params.vehicleId);
    if (!vehicle) {
      return res.status(404).json({ success: false, error: "Vehicle not found" });
    }
    const alerts = generateAlerts(vehicle);
    res.json(successResponse(alerts));
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
