import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pool = null;
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : 'MISSING');
console.log('DB_NAME:', process.env.DB_NAME);

export async function initializePool() {
  try {
    // Stage 1: Pre-connect to verify the database schema exists
    const setupConnection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    await setupConnection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
    await setupConnection.end();

    // Stage 2: Instantiate persistent pool connection allocation
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 15,
      queueLimit: 0
    });

    return pool;
  } catch (error) {
    console.error('❌ MySQL Connection Pool Initialization Failed:', error.message);
    throw error;
  }
}

const dbConnection = {
  initializePool,
  query: async (sql, params) => {
    if (!pool) throw new Error('Database connection pool has not been initialized yet.');
    return pool.query(sql, params);
  }
};

export default dbConnection;