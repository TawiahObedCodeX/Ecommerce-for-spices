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
    }
  } catch (err) {
    console.error("❌ Failed to ensure database exists:", err);
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

// AUTO CREATE TABLES - BEST SOLUTION
async function createTables(client) {
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        reference VARCHAR(100) UNIQUE NOT NULL,
        amount INTEGER NOT NULL,
        currency VARCHAR(3) DEFAULT 'GHS',
        status VARCHAR(20) DEFAULT 'pending',
        customer_name VARCHAR(200) NOT NULL,
        customer_email VARCHAR(200) NOT NULL,
        customer_whatsapp VARCHAR(50),
        cart_items JSONB NOT NULL,
        total_amount DECIMAL(12,2) NOT NULL,
        payment_method VARCHAR(50),
        ip_address INET,
        user_agent TEXT,
        idempotency_key VARCHAR(100) UNIQUE,
        fingerprint VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS request_logs (
        id SERIAL PRIMARY KEY,
        ip_address INET NOT NULL,
        method VARCHAR(10) NOT NULL,
        path VARCHAR(255) NOT NULL,
        status_code INTEGER NOT NULL,
        duration INTEGER NOT NULL,
        user_agent TEXT,
        request_body TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS failed_payments (
        id SERIAL PRIMARY KEY,
        ip_address INET NOT NULL,
        email VARCHAR(200),
        reason TEXT NOT NULL,
        attempted_amount INTEGER,
        fingerprint VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS verified_payments (
        id SERIAL PRIMARY KEY,
        transaction_reference VARCHAR(100) UNIQUE NOT NULL,
        paystack_data JSONB NOT NULL,
        verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS blocked_ips (
        id SERIAL PRIMARY KEY,
        ip_address INET UNIQUE NOT NULL,
        reason TEXT NOT NULL,
        blocked_until TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_transactions_reference ON transactions(reference);
      CREATE INDEX IF NOT EXISTS idx_transactions_email ON transactions(customer_email);
      CREATE INDEX IF NOT EXISTS idx_blocked_ips_ip ON blocked_ips(ip_address);
    `);

    console.log("✅ All database tables are ready.");
  } catch (err) {
    console.error("❌ Table creation failed:", err);
  }
}

export async function initDatabase() {
  if (!pool) await initDatabasePool();

  const client = await pool.connect();
  try {
    await createTables(client);
  } catch (error) {
    console.error("Database initialization error:", error);
  } finally {
    client.release();
  }
}