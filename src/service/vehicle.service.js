import VehicleTable from '../../db/vehicle.js';

const VehicleService = {
  // Register a new vehicle
  registerVehicle: async (payload) => {
    const result = await VehicleTable.saveVehicle(payload);
    return {
      referenceId: result.insertId,
      message: 'Vehicle registered successfully',
      vehicle: payload
    };
  },

  // Fetch vehicle details by VIN
  fetchVehicle: async (vin) => {
    const vehicle = await VehicleTable.getVehicleByVin(vin);
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }
    return vehicle;
  },

  // Update vehicle record
  updateVehicleInfo: async (vin, updates) => {
    const result = await VehicleTable.updateVehicle(vin, updates);
    return {
      affectedRows: result.affectedRows,
      message: 'Vehicle updated successfully'
    };
  },

  // Fetch all vehicles
  listAllVehicles: async () => {
    const vehicles = await VehicleTable.getAllVehicles();
    return vehicles;
  },

  // Delete a vehicle
  deleteVehicle: async (vin) => {
    const result = await VehicleTable.deleteVehicle(vin);
    return {
      affectedRows: result.affectedRows,
      message: `Vehicle with VIN ${vin} deleted successfully`
    };
  }
};

export default VehicleService;
