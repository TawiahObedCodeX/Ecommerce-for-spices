import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME_ADMIN,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Database connected
pool.on("connect", () => {
  console.log("Connected to PostgreSQL database");
});

// Database error
pool.on("error", (err) => {
  console.error("PostgreSQL error:", err);
});

export default pool;
