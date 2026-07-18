import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http'; // needed to attach WebSocket
import { WebSocketServer } from 'ws'; // WebSocket library
import { initializePool } from './config/dbConnection.js';
import { ensureDatabaseSchema } from './db/index.js';
import coreRoutes from './src/routes/routes.js';
// import { seedAlerts } from './seed/alert.seed.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Attach core router logic tree
app.use('/api', coreRoutes);

const RUNTIME_PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('🔌 Client connected to telemetry WebSocket');

  // Push mock telemetry every 5 seconds
  const interval = setInterval(() => {
    const telemetry = {
      timestamp: new Date().toISOString(),
      voltage: 380 + Math.random() * 20,
      current: 120 + Math.random() * 10,
      battery_temp: 40 + Math.random() * 5,
      rpm: 3000 + Math.random() * 200,
    };
    ws.send(JSON.stringify({ type: 'telemetry', data: telemetry }));
  }, 5000);

  ws.on('close', () => {
    clearInterval(interval);
    console.log('❌ Client disconnected from telemetry WebSocket');
  });
});

// 🧠 SEQUENTIAL BOOTSTRAP ENGINE
// This guarantees the database pool initializes completely BEFORE the ports open!
async function bootServer() {
  try {
    console.log('⏳ Initializing Core Stack Components...');
    
    // 1. Core Databases initialize first
    await initializePool();
    console.log('✔ MySQL connection pool initialized.');
    
    await ensureDatabaseSchema();
    console.log('✔ Relational database tables validated.');

    // 2. Sockets and Routing Engine listen AFTER dependencies are ready
    server.listen(RUNTIME_PORT, () => {
      console.log(`====================================================`);
      console.log(`🚀 EV Platform Gateway Engine Online | Routing via Port: ${RUNTIME_PORT}`);
      console.log(`✔ Ingestion network sockets mapping established.`);
      console.log(`====================================================`);
    });

  } catch (error) {
    console.error('❌ Fatal Core Stack Initialization Abort:', error.message);
    process.exit(1);
  }
}

// Fire up the engine safely
bootServer();