import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializePool } from './config/dbConnection.js';
import { ensureDatabaseSchema } from './db/index.js';
import coreRoutes from './src/routes/routes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Attach core router logic tree
app.use('/api', coreRoutes);

const RUNTIME_PORT = process.env.PORT || 5000;

app.listen(RUNTIME_PORT, async () => {
  console.log(`====================================================`);
  console.log(`🚀 EV Platform Gateway Engine Online | Routing via Port: ${RUNTIME_PORT}`);
  console.log(`====================================================`);
  try {
    await initializePool();
    await ensureDatabaseSchema();
    console.log('✔ Ingestion network sockets mapping established.');
  } catch (error) {
    console.error('❌ Fatal Core Stack Initialization Abort:', error.message);
    process.exit(1);
  }
});