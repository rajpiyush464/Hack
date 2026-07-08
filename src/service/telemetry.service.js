import TelemetryTable from '../../db/telemetry.js';
import VehicleTable from '../../db/vehicle.js';

const TelemetryService = {
  processIngestionPayload: async (payload) => {
    // 1. Save telemetry row
    const writeResult = await TelemetryTable.saveTelemetry(payload);

    // 2. Fetch current vehicle record
    const vehicle = await VehicleTable.getVehicleByVin(payload.vehicleId);

    // 3. Calculate odometer increment from speed
    // Assuming telemetry interval = 30 seconds = 0.0083 hours
    const intervalHours = 30 / 3600; // 30 seconds in hours
    const distanceIncrement = (payload.metrics.speed || 0) * intervalHours;

    const newOdometer = (vehicle?.odometer || 0) + Math.round(distanceIncrement);

    // 4. Update vehicle record
    await VehicleTable.updateVehicle(payload.vehicleId, {
      odometer: newOdometer,
      firmwareVersion: payload.metadata?.firmwareVersion || vehicle?.firmware_version || 'v4.5.5',
      location: `${payload.location.gpsLat},${payload.location.gpsLon}`,
      status: payload.metrics.speed > 0 ? 'Active' : 'Idle'
    });

    // 5. Risk calculation
    let operationalRiskFactor = 5;
    if (payload.metrics.batteryTemp > 60) {
      operationalRiskFactor += 13;
    }

    return {
      referenceId: writeResult.insertId,
      calculatedRisk: `${operationalRiskFactor}%`,
      systemStatus: operationalRiskFactor > 15 ? 'Low Risk Warning' : 'Healthy'
    };
  }
};

export default TelemetryService;
