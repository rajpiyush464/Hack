// import axios from 'axios';

// const INGESTION_TARGET_URL = 'http://localhost:5000/api/telemetry';
// const ASSET_ID = 'EV-001';

// // Utility: generate random metric values
// const createMetricValue = (min, max) => Math.round(Math.random() * (max - min) + min);

// // Utility: format timestamp for MySQL DATETIME
// function formatDateForMySQL(date) {
//   return date.toISOString().slice(0, 19).replace('T', ' ');
// }

// // Craft telemetry payload
// function craftDataLog() {
//   return {
//     vehicleId: ASSET_ID,
//     timestamp: formatDateForMySQL(new Date()),   // ✅ MySQL-friendly format
//     metrics: {
//       batteryTemp: createMetricValue(35, 65),
//       motorTemp: createMetricValue(40, 80),
//       coolantTemp: createMetricValue(55, 90),
//       voltage: createMetricValue(360, 410),
//       current: createMetricValue(-15, 125),
//       rpm: createMetricValue(1000, 6000),
//       speed: createMetricValue(40, 115),
//       vibration: createMetricValue(1, 10),
//       soc: createMetricValue(70, 80)
//     },
//     location: {
//       gpsLat: 12.9716,
//       gpsLon: 77.5946
//     },
//     metadata: {
//       maintenanceHistory: "Standard verification completed",
//       faultCode: "SYS_HEALTHY",
//       failureLabel: "Normal"
//     }
//   };
// }

// // Transmit telemetry frame
// async function transmitFrame() {
//   try {
//     const payload = craftDataLog();
//     console.log(`[Simulator Gateway] Transmitting data block for identifier: ${ASSET_ID}`);
//     const receipt = await axios.post(INGESTION_TARGET_URL, payload);
//     console.log(`[Acknowledgment Payload Box]:`, receipt.data);
//   } catch (error) {
//     console.error(`[Simulation Block Transmission Error]: Ingestion path failed -> ${error.message}`);
//   }
// }

// // Initial packet execution
// transmitFrame();

// // Schedule telemetry transmission every 30 seconds
// setInterval(transmitFrame, 30000);

// console.log('📡 Streaming Active: Pushing structured asset matrices upstream every 30s.');







import axios from 'axios';

const INGESTION_TARGET_URL = 'http://localhost:5000/api/telemetry';
const ASSET_ID = 'EV-001';

// Utility: generate random metric values
const createMetricValue = (min, max) => Math.round(Math.random() * (max - min) + min);

// Utility: pick random categorical code
const pickRandomCode = (options) => options[Math.floor(Math.random() * options.length)];

// Utility: format timestamp for MySQL DATETIME
function formatDateForMySQL(date) {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

// Craft telemetry payload
function craftDataLog() {
  return {
    vehicleId: ASSET_ID,
    timestamp: formatDateForMySQL(new Date()),

    // Numeric metrics
    metrics: {
      batteryTemp: createMetricValue(35, 65),
      motorTemp: createMetricValue(40, 80),
      coolantTemp: createMetricValue(55, 90),
      voltage: createMetricValue(360, 410),
      current: createMetricValue(-15, 125),
      rpm: createMetricValue(1000, 6000),
      speed: createMetricValue(40, 115),
      vibration: createMetricValue(1, 10),
      soc: createMetricValue(70, 80)
    },

    // Location
    location: {
      gpsLat: 12.9716,
      gpsLon: 77.5946
    },

    // Metadata (categorical codes randomized each cycle)
    metadata: {
      maintenanceHistory: "Standard verification completed",
      faultCode: "SYS_HEALTHY",
      failureLabel: "Normal",

      Vehicle_Type: pickRandomCode([1, 2, 3, 4]),       // Sedan, SUV, Truck, Bus
      Route_Info: pickRandomCode([1, 2, 3]),            // City, Highway, Mixed
      Weather_Conditions: pickRandomCode([0, 1, 2]),    // Clear, Rainy, Foggy
      Road_Conditions: pickRandomCode([0, 1]),          // Good, Bad
      Maintenance_Type: pickRandomCode([1, 2, 3]),      // Routine, Repair, Inspection
      Brake_Condition: pickRandomCode([0, 1])           // Poor, Good
    }
  };
}

// Transmit telemetry frame
async function transmitFrame() {
  try {
    const payload = craftDataLog();
    console.log(`[Simulator Gateway] Transmitting data block for identifier: ${ASSET_ID}`);
    const receipt = await axios.post(INGESTION_TARGET_URL, payload);
    console.log(`[Acknowledgment Payload Box]:`, receipt.data);
  } catch (error) {
    console.error(`[Simulation Block Transmission Error]: Ingestion path failed -> ${error.message}`);
  }
}

// Initial packet execution
transmitFrame();

// Schedule telemetry transmission every 30 seconds
setInterval(transmitFrame, 30000);

console.log('📡 Streaming Active: Pushing structured asset matrices upstream every 30s.');
