import MasterOutputTable from "../../db/master_output.js";

const MasterService = {
  // Fetch latest record for a specific vehicle
  getLatestByVehicle: async (vehicleId) => {
    return await MasterOutputTable.getLatestOutput(vehicleId);
  },

  // Fetch all records for a specific vehicle
  getAllByVehicle: async (vehicleId) => {
    const sql = `SELECT * FROM vehicle_master WHERE vehicle_id = ? ORDER BY timestamp DESC`;
    const [rows] = await MasterOutputTable.db.query(sql, [vehicleId]);
    return rows;
  },

  // Fetch all vehicles latest snapshot
  getAllLatest: async () => {
    const sql = `
      SELECT vm.* 
      FROM vehicle_master vm
      INNER JOIN (
        SELECT vehicle_id, MAX(timestamp) AS latest_ts
        FROM vehicle_master
        GROUP BY vehicle_id
      ) latest
      ON vm.vehicle_id = latest.vehicle_id AND vm.timestamp = latest.latest_ts
    `;
    const [rows] = await MasterOutputTable.db.query(sql);
    return rows;
  }
};

export default MasterService;
