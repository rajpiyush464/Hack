import dbConnection from '../config/dbConnection.js';

const VehicleTable = {
  getSchemaQuery: () => `
    CREATE TABLE IF NOT EXISTS vehicle (
      id INT AUTO_INCREMENT PRIMARY KEY,
      vin VARCHAR(50) UNIQUE NOT NULL,
      model VARCHAR(50) NOT NULL,
      make VARCHAR(50) NOT NULL,
      year INT NOT NULL,
      fleet_id VARCHAR(50),
      odometer INT,
      firmware_version VARCHAR(20),
      location VARCHAR(100),
      status ENUM('Idle','Active','Maintenance') DEFAULT 'Idle'
    );
  `,

  saveVehicle: async (data) => {
    const sql = `
      INSERT INTO vehicle 
      (vin, model, make, year, fleet_id, odometer, firmware_version, location, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      data.vin, data.model, data.make, data.year, data.fleetId,
      data.odometer, data.firmwareVersion, data.location, data.status
    ];
    const [result] = await dbConnection.query(sql, params);
    return result;
  },

  getVehicleByVin: async (vin) => {
    const sql = `SELECT * FROM vehicle WHERE vin = ?`;
    const [rows] = await dbConnection.query(sql, [vin]);
    return rows[0];
  },

  updateVehicle: async (vin, updates) => {
    const sql = `
      UPDATE vehicle 
      SET odometer = ?, firmware_version = ?, location = ?, status = ?
      WHERE vin = ?
    `;
    const params = [
      updates.odometer, updates.firmwareVersion, updates.location, updates.status, vin
    ];
    const [result] = await dbConnection.query(sql, params);
    return result;
  }
};

export default VehicleTable;
