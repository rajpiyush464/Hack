import dbConnection from '../config/dbConnection.js';

const ModelOutputTable = {
  getSchemaQuery: () => `
    CREATE TABLE IF NOT EXISTS model_output (
      id INT AUTO_INCREMENT PRIMARY KEY,
      vehicle_id VARCHAR(50) NOT NULL,
      timestamp DATETIME NOT NULL,
      probability DECIMAL(5,2) NOT NULL,   -- e.g. 87.45%
      model_name VARCHAR(50) DEFAULT 'failure_predictor',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_vehicle (vehicle_id),
      INDEX idx_timestamp (timestamp)
    );
  `,

  saveOutput: async (data) => {
    const sql = `
      INSERT INTO model_output (vehicle_id, timestamp, probability, model_name)
      VALUES (?, ?, ?, ?)
    `;
    const params = [
      data.vehicleId,
      data.timestamp,
      data.probability,
      data.modelName || 'failure_predictor'
    ];
    const [result] = await dbConnection.query(sql, params);
    return result;
  },

  getLatestOutput: async (vehicleId) => {
    const sql = `
      SELECT * FROM model_output 
      WHERE vehicle_id = ? 
      ORDER BY timestamp DESC LIMIT 1
    `;
    const [rows] = await dbConnection.query(sql, [vehicleId]);
    return rows[0];
  }
};

export default ModelOutputTable;
