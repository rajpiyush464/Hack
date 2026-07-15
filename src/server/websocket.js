import { WebSocketServer } from 'ws';
import dbConnection from '../config/dbConnection.js';

export function initTelemetrySocket(server) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('Client connected to telemetry socket');

    // Example: push new telemetry every 5 seconds
    const interval = setInterval(async () => {
      const [rows] = await dbConnection.query(
        `SELECT * FROM vehicle_telemetry ORDER BY timestamp DESC LIMIT 1`
      );
      const latest = rows[0];
      ws.send(JSON.stringify({ type: 'telemetry', data: latest }));
    }, 5000);

    ws.on('close', () => clearInterval(interval));
  });
}
