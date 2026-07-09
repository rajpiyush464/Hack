import axios from 'axios';

const INGESTION_TARGET_URL = 'http://localhost:5000/api/telemetry';
const ASSET_ID = 'EV-001';

const TRANSMISSION_INTERVAL = 30000;

// ------------------------------------------------------
// Utility Functions
// ------------------------------------------------------

const randomBetween = (min, max) => Math.random() * (max - min) + min;

const randomInt = (min, max) =>
  Math.round(randomBetween(min, max));

const clamp = (value, min, max) =>
  Math.max(min, Math.min(max, value));

const randomChoice = (arr) =>
  arr[Math.floor(Math.random() * arr.length)];

function mysqlTimestamp(date = new Date()) {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

// ------------------------------------------------------
// Vehicle State
// ------------------------------------------------------

const vehicle = {
  vehicleId: ASSET_ID,

  year: 2022,

  odometer: 18500,

  runtimeHours: 1320,

  batteryHealth: 96,

  failureHistory: 0,

  anomaliesDetected: 0,

  diagnosticCodes: 0,

  latitude: 12.9716,

  longitude: 77.5946,

  scenario: "HEALTHY"
};

// ------------------------------------------------------
// Scenario Selection
// HEALTHY 70%
// WARNING 20%
// CRITICAL 10%
// ------------------------------------------------------

function selectScenario() {

  const value = Math.random();

  if (value < 0.70)
    return "HEALTHY";

  if (value < 0.90)
    return "WARNING";

  return "CRITICAL";
}

// ------------------------------------------------------
// Simulate one telemetry cycle
// ------------------------------------------------------

function simulateVehicleState() {

  vehicle.scenario = selectScenario();

  vehicle.runtimeHours += 0.5;

  vehicle.odometer += randomBetween(0.2, 1.2);

  vehicle.batteryHealth = clamp(
    vehicle.batteryHealth - randomBetween(0.002, 0.01),
    35,
    100
  );

  let motorTemperature;
  let tirePressure;
  let motorVibration;
  let operationalStress;
  let brakeRisk;
  let loadUtilization;
  let speed;
  let batteryTemp;
  let coolantTemp;
  let voltage;
  let current;
  let rpm;
  let soc;
  let vehicleLoad;

  switch (vehicle.scenario) {

    case "HEALTHY":

      speed = randomInt(40, 75);

      batteryTemp = randomInt(35, 48);

      motorTemperature = randomInt(45, 60);

      coolantTemp = randomInt(50, 65);

      voltage = randomInt(385, 405);

      current = randomInt(10, 45);

      rpm = randomInt(1800, 3500);

      tirePressure = randomInt(32, 35);

      motorVibration = Number(randomBetween(1,3).toFixed(2));

      vehicleLoad = randomInt(300,1200);

      loadUtilization = Number(randomBetween(15,35).toFixed(2));

      operationalStress = Number(randomBetween(10,30).toFixed(2));

      brakeRisk = Number(randomBetween(5,15).toFixed(2));

      soc = randomInt(70,90);

      break;

    case "WARNING":

      speed = randomInt(55,90);

      batteryTemp = randomInt(48,60);

      motorTemperature = randomInt(65,85);

      coolantTemp = randomInt(65,80);

      voltage = randomInt(370,390);

      current = randomInt(40,80);

      rpm = randomInt(3000,4500);

      tirePressure = randomInt(28,31);

      motorVibration = Number(randomBetween(3,7).toFixed(2));

      vehicleLoad = randomInt(1200,2800);

      loadUtilization = Number(randomBetween(45,70).toFixed(2));

      operationalStress = Number(randomBetween(45,70).toFixed(2));

      brakeRisk = Number(randomBetween(35,60).toFixed(2));

      soc = randomInt(45,70);

      break;

    default:

      speed = randomInt(70,120);

      batteryTemp = randomInt(60,78);

      motorTemperature = randomInt(90,120);

      coolantTemp = randomInt(85,105);

      voltage = randomInt(340,365);

      current = randomInt(80,140);

      rpm = randomInt(4500,6500);

      tirePressure = randomInt(18,26);

      motorVibration = Number(randomBetween(8,18).toFixed(2));

      vehicleLoad = randomInt(2800,4500);

      loadUtilization = Number(randomBetween(80,100).toFixed(2));

      operationalStress = Number(randomBetween(80,100).toFixed(2));

      brakeRisk = Number(randomBetween(80,100).toFixed(2));

      soc = randomInt(15,45);

      vehicle.failureHistory++;

      vehicle.anomaliesDetected += randomInt(1,3);

      vehicle.diagnosticCodes += randomInt(1,2);

      break;
  }

  return {

    batteryTemp,
    motorTemperature,
    coolantTemp,
    voltage,
    current,
    rpm,
    speed,
    tirePressure,
    motorVibration,
    soc,
    vehicleLoad,
    operationalStress,
    loadUtilization,
    brakeRisk
  };

}
// ------------------------------------------------------
// Build Payload
// ------------------------------------------------------

function craftPayload() {

  const telemetry = simulateVehicleState();

  const vehicleAge = new Date().getFullYear() - vehicle.year;

  return {

    vehicleId: vehicle.vehicleId,

    timestamp: mysqlTimestamp(),

    //---------------------------------------------------
    // Existing backend telemetry
    //---------------------------------------------------

    metrics: {

      batteryTemp: telemetry.batteryTemp,
      motorTemp: telemetry.motorTemperature,
      coolantTemp: telemetry.coolantTemp,
      voltage: telemetry.voltage,
      current: telemetry.current,
      rpm: telemetry.rpm,
      speed: telemetry.speed,
      vibration: telemetry.motorVibration,
      soc: telemetry.soc

    },

    //---------------------------------------------------
    // GPS
    //---------------------------------------------------

    location: {

      gpsLat: vehicle.latitude,
      gpsLon: vehicle.longitude

    },

    //---------------------------------------------------
    // ML Features
    //---------------------------------------------------

    metadata: {

      maintenanceHistory:
        vehicle.failureHistory > 3
          ? "Major service completed"
          : "Routine inspection",

      faultCode:
        vehicle.scenario === "CRITICAL"
          ? "P0A80"
          : vehicle.scenario === "WARNING"
          ? "P1B12"
          : "SYS_HEALTHY",

      failureLabel:
        vehicle.scenario === "CRITICAL"
          ? "Critical"
          : vehicle.scenario === "WARNING"
          ? "Warning"
          : "Normal",

      firmwareVersion: "v4.5.5",

      //------------------------------------------------
      // MODEL FEATURES
      //------------------------------------------------

      Vehicle_Type: randomChoice([1,2,3,4]),

      Year_of_Manufacture: vehicle.year,

      Route_Info: randomChoice([1,2,3]),

      Weather_Conditions: randomChoice([0,1,2]),

      Road_Conditions:
        vehicle.scenario === "CRITICAL"
          ? randomChoice([0,0,1])
          : randomChoice([0,1]),

      Vehicle_Runtime_Hours:
        Number(vehicle.runtimeHours.toFixed(1)),

      Load_Capacity: 4500,

      Vehicle_Load: telemetry.vehicleLoad,

      Motor_Temperature:
        telemetry.motorTemperature,

      Tire_Pressure:
        telemetry.tirePressure,

      Battery_Health:
        Number(vehicle.batteryHealth.toFixed(2)),

      Motor_Vibration:
        telemetry.motorVibration,

      Failure_History:
        vehicle.failureHistory,

      Anomalies_Detected:
        vehicle.anomaliesDetected,

      Diagnostic_Trouble_Code_Count:
        vehicle.diagnosticCodes,

      Brake_Condition:
        telemetry.brakeRisk > 60 ? 0 : 1,

      Vehicle_Age:
        vehicleAge,

      Load_Utilization:
        telemetry.loadUtilization,

      Operational_Stress:
        telemetry.operationalStress,

      Brake_Risk:
        telemetry.brakeRisk

    }

  };

}

// ------------------------------------------------------
// Send telemetry
// ------------------------------------------------------

async function transmitFrame() {

  try {

    const payload = craftPayload();

    console.log(
      `\n==============================`
    );

    console.log(
      `Vehicle : ${payload.vehicleId}`
    );

    console.log(
      `Scenario : ${vehicle.scenario}`
    );

    console.log(
      `Battery Health : ${payload.metadata.Battery_Health}%`
    );

    console.log(
      `Motor Temp : ${payload.metadata.Motor_Temperature}°C`
    );

    console.log(
      `Brake Risk : ${payload.metadata.Brake_Risk}`
    );

    console.log(
      `Operational Stress : ${payload.metadata.Operational_Stress}`
    );

    const response = await axios.post(
      INGESTION_TARGET_URL,
      payload
    );

    console.log(
      "Prediction :",
      response.data.prediction.probability
    );

    console.log(
      "Vehicle Status :",
      response.data.insights.systemStatus
    );

  }
  catch(err){

    if(err.response){

      console.error(
        "Server Error:",
        err.response.data
      );

    }
    else{

      console.error(
        err.message
      );

    }

  }

}

// ------------------------------------------------------
// Start simulator
// ------------------------------------------------------

console.log(
"==========================================="
);

console.log(
"EV Predictive Maintenance Simulator Started"
);

console.log(
"==========================================="
);

transmitFrame();

setInterval(
  transmitFrame,
  TRANSMISSION_INTERVAL
);