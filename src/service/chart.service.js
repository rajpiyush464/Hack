import dbConnection from '../../config/dbConnection.js';

const ChartService = {
  // Voltage history
  getVoltageHistory: async (vehicleId, limit = 50) => {
    const sql = `
      SELECT timestamp, voltage 
      FROM vehicle_telemetry 
      WHERE vehicle_id = ? 
      ORDER BY timestamp DESC 
      LIMIT ?
    `;
    const [rows] = await dbConnection.query(sql, [vehicleId, limit]);
    return rows;
  },

  // Current history
  getCurrentHistory: async (vehicleId, limit = 50) => {
    const sql = `
      SELECT timestamp, current 
      FROM vehicle_telemetry 
      WHERE vehicle_id = ? 
      ORDER BY timestamp DESC 
      LIMIT ?
    `;
    const [rows] = await dbConnection.query(sql, [vehicleId, limit]);
    return rows;
  },

  // RPM history
  getRpmHistory: async (vehicleId, limit = 50) => {
    const sql = `
      SELECT timestamp, rpm 
      FROM vehicle_telemetry 
      WHERE vehicle_id = ? 
      ORDER BY timestamp DESC 
      LIMIT ?
    `;
    const [rows] = await dbConnection.query(sql, [vehicleId, limit]);
    return rows;
  },

  // Speed history
  getSpeedHistory: async (vehicleId, limit = 50) => {
    const sql = `
      SELECT timestamp, speed 
      FROM vehicle_telemetry 
      WHERE vehicle_id = ? 
      ORDER BY timestamp DESC 
      LIMIT ?
    `;
    const [rows] = await dbConnection.query(sql, [vehicleId, limit]);
    return rows;
  },

  // SOC history
  getSocHistory: async (vehicleId, limit = 50) => {
    const sql = `
      SELECT timestamp, soc 
      FROM vehicle_telemetry 
      WHERE vehicle_id = ? 
      ORDER BY timestamp DESC 
      LIMIT ?
    `;
    const [rows] = await dbConnection.query(sql, [vehicleId, limit]);
    return rows;
  },

  // Battery temperature history
  getBatteryTempHistory: async (vehicleId, limit = 50) => {
    const sql = `
      SELECT timestamp, battery_temp 
      FROM vehicle_telemetry 
      WHERE vehicle_id = ? 
      ORDER BY timestamp DESC 
      LIMIT ?
    `;
    const [rows] = await dbConnection.query(sql, [vehicleId, limit]);
    return rows;
  }
};

export default ChartService;
