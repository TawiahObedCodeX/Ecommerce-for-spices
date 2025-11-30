import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME_SPICESHUB,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Database connected
(async () => {
  try {
    const check = await pool.query("SELECT current_database(), version()");
    console.log("Connected to PostgreSQL database:", check.rows[0].current_database);
  } catch (err) {
    console.error("Database connection error:", err);
  }
})();

export default pool;
