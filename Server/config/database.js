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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

    // Create indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_transactions_reference ON transactions(reference);
      CREATE INDEX IF NOT EXISTS idx_transactions_email ON transactions(customer_email);
      CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
      CREATE INDEX IF NOT EXISTS idx_failed_payments_ip ON failed_payments(ip_address);
      CREATE INDEX IF NOT EXISTS idx_failed_payments_created ON failed_payments(created_at);
    `);

    console.log("✅ Database initialized successfully");
  } catch (error) {
    console.error("Database initialization error:", error);
    throw error;
  } finally {
    client.release();
  }
}