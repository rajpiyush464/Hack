
import VehicleTable from '../../db/vehicle.js';

const VehicleService = {
  registerVehicle: async (payload) => {
    const result = await VehicleTable.saveVehicle(payload);
    return { referenceId: result.insertId, message: 'Vehicle registered successfully' };
  },

  fetchVehicle: async (vin) => {
    const vehicle = await VehicleTable.getVehicleByVin(vin);
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }
    return vehicle;
  },

  updateVehicleInfo: async (vin, updates) => {
    const result = await VehicleTable.updateVehicle(vin, updates);
    return { affectedRows: result.affectedRows, message: 'Vehicle updated successfully' };
  }
};

export default VehicleService;
