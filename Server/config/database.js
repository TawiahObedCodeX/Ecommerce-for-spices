import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});

// Initialize database tables
export async function initDatabase() {
  const client = await pool.connect();
  try {
    // Transactions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        reference VARCHAR(100) UNIQUE NOT NULL,
        amount INTEGER NOT NULL,
        currency VARCHAR(3) DEFAULT 'GHS',
        status VARCHAR(20) DEFAULT 'pending',
        customer_name VARCHAR(200),
        customer_email VARCHAR(200) NOT NULL,
        customer_whatsapp VARCHAR(50),
        cart_items JSONB,
        total_amount DECIMAL(10,2),
        payment_method VARCHAR(50),
        ip_address INET,
        user_agent TEXT,
        idempotency_key VARCHAR(100) UNIQUE,
        fingerprint VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Request logs table (MISSING - ADD THIS)
    await client.query(`
      CREATE TABLE IF NOT EXISTS request_logs (
        id SERIAL PRIMARY KEY,
        ip_address INET,
        method VARCHAR(10),
        path VARCHAR(255),
        status_code INTEGER,
        duration INTEGER,
        user_agent TEXT,
        request_body TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Failed attempts log for fraud detection
    await client.query(`
      CREATE TABLE IF NOT EXISTS failed_payments (
        id SERIAL PRIMARY KEY,
        ip_address INET,
        email VARCHAR(200),
        reason TEXT,
        attempted_amount INTEGER,
        fingerprint VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Verified transactions log
    await client.query(`
      CREATE TABLE IF NOT EXISTS verified_payments (
        id SERIAL PRIMARY KEY,
        transaction_reference VARCHAR(100) UNIQUE NOT NULL,
        paystack_data JSONB,
        verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Blocked IPs table (ADD THIS FOR SECURITY)
    await client.query(`
      CREATE TABLE IF NOT EXISTS blocked_ips (
        id SERIAL PRIMARY KEY,
        ip_address INET UNIQUE NOT NULL,
        reason TEXT,
        blocked_until TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_transactions_reference ON transactions(reference);
      CREATE INDEX IF NOT EXISTS idx_transactions_email ON transactions(customer_email);
      CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
      CREATE INDEX IF NOT EXISTS idx_failed_payments_ip ON failed_payments(ip_address);
      CREATE INDEX IF NOT EXISTS idx_failed_payments_created ON failed_payments(created_at);
      CREATE INDEX IF NOT EXISTS idx_request_logs_ip ON request_logs(ip_address);
      CREATE INDEX IF NOT EXISTS idx_blocked_ips_ip ON blocked_ips(ip_address);
    `);

    console.log("✅ Database initialized successfully");
  } catch (error) {
    console.error("Database initialization error:", error);
    throw error;
  } finally {
    client.release();
  }
}