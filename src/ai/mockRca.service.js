import AlertsTable from "../../db/alerts";// Adjust paths based on your absolute structure if needed

// Toggle this switch: true = Mock Mode, false = Production Mode (Uses your real RCA when token is fixed)
const USE_MOCK_RCA = true; 

/**
 * Evaluates live telemetry data against simulated RCA rules when token is expired
 * @param {string} vehicleId 
 * @param {object} telemetryData 
 * @param {object} io - Socket.io instance to broadcast alerts live
 */
export async function handleRcaAlertGeneration(vehicleId, telemetryData, io) {
  try {
    let triggeredAlert = null;

    if (USE_MOCK_RCA) {
      // 🛠️ MOCK RULE: If battery temperature crosses 60°C
      if (telemetryData.temperature > 60) {
        triggeredAlert = {
          vehicle_id: vehicleId,
          title: 'Battery Overheating (Simulated)',
          message: `RCA Analysis: Temperature reached ${telemetryData.temperature.toFixed(1)}°C, exceeding safe threshold of 60°C.`,
          severity: 'critical',
          status: 'active',
          rca_data: JSON.stringify({ sensor: 'battery_temp', value: telemetryData.temperature, threshold: 60 })
        };
      }
      
      // 🛠️ OPTIONAL MOCK RULE 2: Voltage Drop example
      else if (telemetryData.voltage < 320) {
        triggeredAlert = {
          vehicle_id: vehicleId,
          title: 'Critical Voltage Drop (Simulated)',
          message: `RCA Analysis: Supply voltage dropped abnormally to ${telemetryData.voltage.toFixed(1)}V.`,
          severity: 'warning',
          status: 'active',
          rca_data: JSON.stringify({ sensor: 'voltage', value: telemetryData.voltage, threshold: 320 })
        };
      }
    } else {
      // 🔌 REAL PRODUCTION MODE
      // When your token works again, import your real rca.service.js logic here!
      // Example: triggeredAlert = await realRcaAnalysis(vehicleId, telemetryData);
    }

    // Process and broadcast the alert if triggered
    if (triggeredAlert) {
      // 1. Insert into database table
      const insertId = await AlertsTable.createAlert(triggeredAlert);
      
      // 2. Attach generated MySQL ID to payload
      const fullAlert = { ...triggeredAlert, id: insertId, rca_data: JSON.parse(triggeredAlert.rca_data) };

      // 3. Emit through WebSocket instantly so frontend Updates
      io.emit('new_alert', fullAlert);
      console.log(`📡 [RCA Engine] Live alert broadcasted for ${vehicleId} (ID: ${insertId})`);
    }

  } catch (err) {
    console.error("❌ Error running standalone RCA analyzer pipeline:", err.message);
  }
}