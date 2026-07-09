import dbConnection from '../config/dbConnection.js';
import TelemetryTable from './telemetry.js';
import VehicleTable from './vehicle.js';
import ModelOutputTable from './model_output.js';
import MasterOutputTable from './master_output.js';


export async function ensureDatabaseSchema() {
  try {
    console.log('[Schema Orchestrator] Validating relational tables...');
    
    await dbConnection.query(TelemetryTable.getSchemaQuery());
    await dbConnection.query(VehicleTable.getSchemaQuery());
    await dbConnection.query(ModelOutputTable.getSchemaQuery());
    await dbConnection.query(MasterOutputTable.getSchemaQuery());  // ✅ new line

    console.log('✔ MySQL schema entities initialized inside [backend] space.');
  } catch (error) {
    console.error('❌ Relational Schema Sync Operation Failed:', error.message);
    throw error;
  }
}

const dbOrchestrator = {
  ensureDatabaseSchema,
  Telemetry: TelemetryTable,
  Vehicle: VehicleTable,
  ModelOutput: ModelOutputTable,
  MasterOutput: MasterOutputTable   // ✅ new entry
};


export default dbOrchestrator;
