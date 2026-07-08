import dbConnection from '../config/dbConnection.js';
import TelemetryTable from './telemetry.js';
import VehicleTable from './vehicle.js';

export async function ensureDatabaseSchema() {
  try {
    console.log('[Schema Orchestrator] Validating relational tables...');
    
    await dbConnection.query(TelemetryTable.getSchemaQuery());
    await dbConnection.query(VehicleTable.getSchemaQuery());

    console.log('✔ MySQL schema entities initialized inside [backend] space.');
  } catch (error) {
    console.error('❌ Relational Schema Sync Operation Failed:', error.message);
    throw error;
  }
}

const dbOrchestrator = {
  ensureDatabaseSchema,
  Telemetry: TelemetryTable,
  Vehicle: VehicleTable
};

export default dbOrchestrator;
