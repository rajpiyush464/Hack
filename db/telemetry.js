import dbConnection from '../config/dbConnection.js';

const TelemetryTable = {
  getSchemaQuery: () => {
    return `
      CREATE TABLE IF NOT EXISTS vehicle_telemetry (
        id INT AUTO_INCREMENT PRIMARY KEY,
        vehicle_id VARCHAR(50) NOT NULL,
        timestamp DATETIME NOT NULL,
        battery_temp INT NOT NULL,
        motor_temp INT NOT NULL,
        coolant_temp INT NOT NULL,
        voltage INT NOT NULL,
        current INT NOT NULL,
        rpm INT NOT NULL,
        speed INT NOT NULL,
        vibration INT NOT NULL,
        soc INT NOT NULL,
        gps_lat DECIMAL(10, 7) NOT NULL,
        gps_lon DECIMAL(10, 7) NOT NULL,
        maintenance_history VARCHAR(100) NOT NULL,
        fault_code VARCHAR(20) NOT NULL,
        failure_label VARCHAR(50) NOT NULL,
        INDEX idx_vehicle (vehicle_id),
        INDEX idx_timestamp (timestamp)
      );
    `;
  },

  saveTelemetry: async (data) => {
    const sql = `
      INSERT INTO vehicle_telemetry 
      (vehicle_id, timestamp, battery_temp, motor_temp, coolant_temp, voltage, current, rpm, speed, vibration, soc, gps_lat, gps_lon, maintenance_history, fault_code, failure_label)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      data.vehicleId, data.timestamp, data.metrics.batteryTemp, data.metrics.motorTemp,
      data.metrics.coolantTemp, data.metrics.voltage, data.metrics.current, data.metrics.rpm,
      data.metrics.speed, data.metrics.vibration, data.metrics.soc, data.location.gpsLat,
      data.location.gpsLon, data.metadata.maintenanceHistory, data.metadata.faultCode, data.metadata.failureLabel
    ];
    const [result] = await dbConnection.query(sql, params);
    return result;
  }
};

export default TelemetryTable;