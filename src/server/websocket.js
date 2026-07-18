import { WebSocketServer } from 'ws';
import dbConnection from '../config/dbConnection.js';
import AlertsTable from '../db/alerts.js'; // Ensure path matches your project layout

export function initTelemetrySocket(server) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('🔌 [SERVER] Client registered to active dashboard monitor.');

    const interval = setInterval(async () => {
      if (ws.readyState !== 1) { // 1 === WebSocket.OPEN
        clearInterval(interval);
        return;
      }

      try {
        // 1. PULL LATEST TELEMETRY DATA
        const [rows] = await dbConnection.query(
          `SELECT * FROM vehicle_telemetry ORDER BY timestamp DESC LIMIT 1`
        );
        
        if (!rows || rows.length === 0) return;
        const latest = Array.isArray(rows[0]) ? rows[0][0] : rows[0];
        if (!latest) return;

        const activeVehicleId = latest.vehicle_id || latest.vehicleId || 'EV-001';
        const currentTemp = Number(latest.battery_temp ?? 0);
        const currentVoltage = Number(latest.voltage ?? 0);
        const currentAmperage = Number(latest.current ?? 0);

        let generatedAlert = null;

        // 2. MOCK RCA INCIDENT TRIGGER (Fires when Battery Temp crosses 50°C)
        if (currentTemp > 50) {
          const rcaObject = {
            sensor_source: 'battery_temp',
            captured_value: currentTemp,
            safe_threshold: 50,
            confidence_score: '97.2%',
            sub_systems_affected: ['Coolant Loop B Component', 'Cell Module 4 Array'],
            predicted_failure_mode: 'Thermal threshold runaway limit breach.',
            actionable_recommendations: ['Throttle motor output voltage profile', 'Trigger auxiliary radiator pump']
          };

          const alertTitle = 'Critical Thermal Runaway Risk';
          const alertMessage = `RCA Simulation Flag: Core Temperature registered high at ${currentTemp}°C`;

          // Construct object payload matching your database store attributes
          generatedAlert = {
            id: `alert-${latest.id || Date.now()}`,
            vehicleId: activeVehicleId,
            title: alertTitle,
            message: alertMessage,
            severity: 'critical',
            status: 'active',
            timestamp: latest.timestamp || new Date().toISOString(),
            metric: 'Temperature',
            value: currentTemp,
            threshold: 50,
            unit: '°C',
            rca_data: rcaObject
          };

          // 💾 Save generated alerts straight to the active database table layout
          try {
            if (AlertsTable && typeof AlertsTable.createAlert === 'function') {
              await AlertsTable.createAlert({
                vehicle_id: activeVehicleId,
                title: alertTitle,
                message: alertMessage,
                severity: 'critical',
                status: 'active',
                rca_data: JSON.stringify(rcaObject)
              });
            } else {
              // Direct query fallback if helper models aren't globally bound
              await dbConnection.query(
                `INSERT INTO alerts (vehicle_id, title, message, severity, status, rca_data, timestamp) 
                 VALUES (?, ?, ?, ?, 'active', ?, NOW())`,
                [activeVehicleId, alertTitle, alertMessage, 'critical', JSON.stringify(rcaObject)]
              );
            }
          } catch (dbErr) {
            // Quietly suppress primary key duplicate collision warnings on high frequency ticks
          }
        }

        // 3. BROADCAST VIA WEBSOCKET CONTEXT
        const payload = {
          type: 'telemetry',
          data: {
            ...latest,
            vehicleId: activeVehicleId,
            vehicle_id: activeVehicleId,
            voltage: currentVoltage,
            current: currentAmperage,
            battery_temp: currentTemp
          },
          alert: generatedAlert // Dynamically null if telemetry reads safe limits (< 50°C)
        };

        ws.send(JSON.stringify(payload));

      } catch (err) {
        console.error('❌ [SERVER DATA STREAM ERROR]:', err.message);
      }
    }, 300);

    ws.on('close', () => clearInterval(interval));
  });
}