import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const adminConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "postgres",
  max: 1,
  idleTimeoutMillis: 0,
  connectionTimeoutMillis: 2000,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
};

export let pool = null;

async function ensureDatabaseExists() {
  const adminClient = new pg.Client(adminConfig);
  try {
    await adminClient.connect();
    const dbName = process.env.DB_NAME;
    
    const res = await adminClient.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [dbName]
    );
    
    if (res.rowCount === 0) {
      console.log(`📦 Creating database "${dbName}"...`);
      await adminClient.query(`CREATE DATABASE "${dbName}" TEMPLATE template0;`);
      console.log(`✅ Database "${dbName}" created.`);
    } else {
      console.log(`✅ Database "${dbName}" already exists.`);
    }
  } catch (err) {
    console.error("❌ Failed to ensure database exists:", err);
    throw err;
  } finally {
    await adminClient.end();
  }
}

export async function initDatabasePool() {
  await ensureDatabaseExists();
  pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  });
  return pool;
}

export async function initDatabase() {
  if (!pool) {
    await initDatabasePool();
  }
  const client = await pool.connect();
  try {
    console.log("✅ Database connection established. Tables should be created via SQL script.");
    // We no longer create tables here to avoid conflicts with manual SQL script
  } catch (error) {
    console.error("Database initialization error:", error);
    throw error;
  } finally {
    client.release();
  }
}