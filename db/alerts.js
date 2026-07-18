import dbConnection from '../config/dbConnection.js';

const AlertsTable = {
  // Create schema
  getSchemaQuery: () => `
    CREATE TABLE IF NOT EXISTS alerts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      vehicle_id VARCHAR(50) NOT NULL,
      title VARCHAR(100) NOT NULL,
      message TEXT,
      severity ENUM('normal','warning','critical') DEFAULT 'normal',
      status ENUM('active','resolved') DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      resolved_at TIMESTAMP NULL,
      rca_data JSON,

      INDEX idx_vehicle(vehicle_id),
      INDEX idx_status(status)
    );
  `,

  // Create new alert
  async createAlert(alert) {
    try {
      const sql = `
        INSERT INTO alerts
        (vehicle_id, title, message, severity, status, rca_data)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const params = [
        alert.vehicle_id,
        alert.title,
        alert.message,
        alert.severity,
        alert.status || 'active',
        JSON.stringify(alert.rca_data || {})
      ];

      const [result] = await dbConnection.query(sql, params);
      return result.insertId;
    } catch (err) {
      console.error("Error creating alert:", err.message);
      throw err;
    }
  },

  // Get all active alerts
  async getActiveAlerts() {
    try {
      const sql = `SELECT * FROM alerts WHERE status = 'active' ORDER BY created_at DESC`;
      const [rows] = await dbConnection.query(sql);
      return rows;
    } catch (err) {
      console.error("Error fetching active alerts:", err.message);
      throw err;
    }
  },

  // Resolve alert by ID
  async resolveAlert(id) {
    try {
      const sql = `
        UPDATE alerts
        SET status = 'resolved', resolved_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      const [result] = await dbConnection.query(sql, [id]);
      return result.affectedRows > 0;
    } catch (err) {
      console.error(`Error resolving alert ${id}:`, err.message);
      throw err;
    }
  },
  // Get alerts by vehicle ID
  async getAlertsByVehicle(vehicleId) {
    try {
      const sql = `SELECT * FROM alerts WHERE vehicle_id = ? ORDER BY created_at DESC`;
      const [rows] = await dbConnection.query(sql, [vehicleId]);
      return rows;
    } catch (err) {
      console.error(`Error fetching alerts for vehicle ${vehicleId}:`, err.message);
      throw err;
    }
  },

  // Get alert by ID
  async getAlertById(id) {
    try {
      const sql = `SELECT * FROM alerts WHERE id = ?`;
      const [rows] = await dbConnection.query(sql, [id]);
      return rows[0] || null;
    } catch (err) {
      console.error(`Error fetching alert ${id}:`, err.message);
      throw err;
    }
  }
};

export default AlertsTable;
