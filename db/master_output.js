import dbConnection from '../config/dbConnection.js';

const MasterOutputTable = {

  getSchemaQuery: () => `
    CREATE TABLE IF NOT EXISTS vehicle_master (
      id INT AUTO_INCREMENT PRIMARY KEY,

      vehicle_id VARCHAR(50) NOT NULL,
      timestamp DATETIME NOT NULL,

      battery_temp INT,
      motor_temp INT,
      coolant_temp INT,
      voltage INT,
      current INT,
      rpm INT,
      speed INT,
      vibration DECIMAL(6,2),
      soc INT,

      gps_lat DECIMAL(10,7),
      gps_lon DECIMAL(10,7),

      maintenance_history VARCHAR(255),
      fault_code VARCHAR(50),
      failure_label VARCHAR(50),
      firmware_version VARCHAR(50),

      vehicle_type INT,
      year_of_manufacture INT,
      route_info INT,
      weather_conditions INT,
      road_conditions INT,
      vehicle_runtime_hours INT,
      load_capacity INT,
      vehicle_load INT,
      tire_pressure INT,

      battery_health DECIMAL(6,2),
      motor_vibration DECIMAL(6,2),
      failure_history INT,
      anomalies_detected INT,
      diagnostic_trouble_code_count INT,
      brake_condition INT,

      vehicle_age INT,
      load_utilization DECIMAL(6,2),
      operational_stress DECIMAL(6,2),
      brake_risk DECIMAL(6,2),

      failure_probability DECIMAL(6,2),
      predicted_failure BOOLEAN,
      health_status VARCHAR(50),
      risk_level VARCHAR(50),
      confidence DECIMAL(6,2),

      at_risk_component VARCHAR(100),
      failure_type VARCHAR(100),
      recommended_action VARCHAR(255),

      rca_executive_summary TEXT,
      rca_root_cause TEXT,
      rca_incident_timeline TEXT,
      rca_supporting_evidence TEXT,

      rca_at_risk_component VARCHAR(100),
      rca_failure_type VARCHAR(100),
      rca_severity VARCHAR(50),
      rca_confidence VARCHAR(50),

      rca_recommended_maintenance TEXT,
      rca_preventive_actions TEXT,

      odometer INT,
      calculated_risk VARCHAR(20),
      system_status VARCHAR(50),

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      INDEX idx_vehicle(vehicle_id),
      INDEX idx_timestamp(timestamp)
    );
  `,


  saveOutput: async (data) => {


    const columns = [
      "vehicle_id",
      "timestamp",

      "battery_temp",
      "motor_temp",
      "coolant_temp",
      "voltage",
      "current",
      "rpm",
      "speed",
      "vibration",
      "soc",

      "gps_lat",
      "gps_lon",

      "maintenance_history",
      "fault_code",
      "failure_label",
      "firmware_version",

      "vehicle_type",
      "year_of_manufacture",
      "route_info",
      "weather_conditions",
      "road_conditions",
      "vehicle_runtime_hours",
      "load_capacity",
      "vehicle_load",
      "tire_pressure",

      "battery_health",
      "motor_vibration",
      "failure_history",
      "anomalies_detected",
      "diagnostic_trouble_code_count",
      "brake_condition",

      "vehicle_age",
      "load_utilization",
      "operational_stress",
      "brake_risk",

      "failure_probability",
      "predicted_failure",
      "health_status",
      "risk_level",
      "confidence",

      "at_risk_component",
      "failure_type",
      "recommended_action",

      "rca_executive_summary",
      "rca_root_cause",
      "rca_incident_timeline",
      "rca_supporting_evidence",

      "rca_at_risk_component",
      "rca_failure_type",
      "rca_severity",
      "rca_confidence",

      "rca_recommended_maintenance",
      "rca_preventive_actions",

      "odometer",
      "calculated_risk",
      "system_status"
    ];



const params = [

  // Vehicle
  data.insights.vehicleId,
  data.insights.timestamp,


  // Metrics
  data.insights.metrics?.batteryTemp,
  data.insights.metrics?.motorTemp,
  data.insights.metrics?.coolantTemp,
  data.insights.metrics?.voltage,
  data.insights.metrics?.current,
  data.insights.metrics?.rpm,
  data.insights.metrics?.speed,
  data.insights.metrics?.vibration,
  data.insights.metrics?.soc,


  // Location
  data.insights.location?.gpsLat,
  data.insights.location?.gpsLon,


  // Metadata
  data.insights.metadata?.maintenanceHistory,
  data.insights.metadata?.faultCode,
  data.insights.metadata?.failureLabel,
  data.insights.metadata?.firmwareVersion,

  data.insights.metadata?.Vehicle_Type,
  data.insights.metadata?.Year_of_Manufacture,
  data.insights.metadata?.Route_Info,
  data.insights.metadata?.Weather_Conditions,
  data.insights.metadata?.Road_Conditions,
  data.insights.metadata?.Vehicle_Runtime_Hours,
  data.insights.metadata?.Load_Capacity,
  data.insights.metadata?.Vehicle_Load,
  data.insights.metadata?.Tire_Pressure,

  data.insights.metadata?.Battery_Health,
  data.insights.metadata?.Motor_Vibration,
  data.insights.metadata?.Failure_History,
  data.insights.metadata?.Anomalies_Detected,
  data.insights.metadata?.Diagnostic_Trouble_Code_Count,
  data.insights.metadata?.Brake_Condition,

  data.insights.metadata?.Vehicle_Age,
  data.insights.metadata?.Load_Utilization,
  data.insights.metadata?.Operational_Stress,
  data.insights.metadata?.Brake_Risk,


  // Prediction
  data.prediction?.failureProbability,
  data.prediction?.predictedFailure,
  data.prediction?.healthStatus,
  data.prediction?.riskLevel,
  data.prediction?.confidence,

  data.prediction?.atRiskComponent,
  data.prediction?.failureType,
  data.prediction?.recommendedAction,


  // RCA
  data.prediction?.rca?.executiveSummary,
  data.prediction?.rca?.rootCause,

  JSON.stringify(
    data.prediction?.rca?.incidentTimeline || []
  ),

  JSON.stringify(
    data.prediction?.rca?.supportingEvidence || []
  ),

  data.prediction?.rca?.atRiskComponent,
  data.prediction?.rca?.failureType,
  data.prediction?.rca?.severity,
  data.prediction?.rca?.confidence,

  data.prediction?.rca?.maintenanceRecommendation,

  JSON.stringify(
    data.prediction?.rca?.preventiveActions || []
  ),


  // Extra
  data.insights?.odometer,
  data.insights?.calculatedRisk,
  data.insights?.systemStatus

];



    console.log(
      "INSERT vehicle_master => Columns:",
      columns.length,
      "Params:",
      params.length
    );


    const sql = `
      INSERT INTO vehicle_master
      (${columns.join(",")})
      VALUES (${columns.map(() => "?").join(",")})
    `;


    const [result] = await dbConnection.query(sql, params);

    return result;
  },



  getLatestOutput: async (vehicleId) => {

    const sql = `
      SELECT *
      FROM vehicle_master
      WHERE vehicle_id = ?
      ORDER BY timestamp DESC
      LIMIT 1
    `;


    const [rows] = await dbConnection.query(sql, [vehicleId]);

    return rows[0];

  }

};


export default MasterOutputTable;