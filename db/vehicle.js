import dbConnection from '../config/dbConnection.js';

const VehicleTable = {
  // Schema definition
  getSchemaQuery: () => `
    CREATE TABLE IF NOT EXISTS vehicle (
      id INT AUTO_INCREMENT PRIMARY KEY,
      vin VARCHAR(50) UNIQUE NOT NULL,
      model VARCHAR(50) NOT NULL,
      make VARCHAR(50) NOT NULL,
      year INT NOT NULL,
      fleet_id VARCHAR(50),
      odometer INT DEFAULT 0,
      firmware_version VARCHAR(20),
      location VARCHAR(100),
      status ENUM('Idle','Active','Maintenance') DEFAULT 'Idle',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `,

  // Insert a new vehicle
  saveVehicle: async (data) => {
    const sql = `
      INSERT INTO vehicle 
      (vin, model, make, year, fleet_id, odometer, firmware_version, location, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      data.vin,
      data.model,
      data.make,
      data.year,
      data.fleetId || null,
      data.odometer || 0,
      data.firmwareVersion || null,
      data.location || null,
      data.status || 'Idle'
    ];
    const [result] = await dbConnection.query(sql, params);
    return result;
  },

  // Fetch vehicle by VIN
  getVehicleByVin: async (vin) => {
    const sql = `SELECT * FROM vehicle WHERE vin = ?`;
    const [rows] = await dbConnection.query(sql, [vin]);
    return rows[0];
  },

  // Update vehicle info
  updateVehicle: async (vin, updates) => {
    const sql = `
      UPDATE vehicle 
      SET odometer = ?, firmware_version = ?, location = ?, status = ?
      WHERE vin = ?
    `;
    const params = [
      updates.odometer || 0,
      updates.firmwareVersion || null,
      updates.location || null,
      updates.status || 'Idle',
      vin
    ];
    const [result] = await dbConnection.query(sql, params);
    return result;
  },

  // Fetch all vehicles
  getAllVehicles: async () => {
    const sql = `SELECT * FROM vehicle ORDER BY created_at DESC`;
    const [rows] = await dbConnection.query(sql);
    return rows;
  },

  // Delete vehicle by VIN
  deleteVehicle: async (vin) => {
    const sql = `DELETE FROM vehicle WHERE vin = ?`;
    const [result] = await dbConnection.query(sql, [vin]);
    return result;
  }
};

export default VehicleTable;
