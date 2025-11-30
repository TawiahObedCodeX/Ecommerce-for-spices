import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan"; // <--- ADD THIS
import AdminAuth from "./Routes/AdminAuth.js";
import ClientAuth from "./Routes/ClientAuth.js";
import cors from "cors";
import pool from "./Config/db.js"

dotenv.config();

const Server = express();

// ==========================
// Middleware
// ==========================
Server.use(cors());

// ==========================
// Middleware
// ==========================
Server.use(morgan("dev")); // <--- ADD THIS (logs all requests)
Server.use(express.json());
Server.use(cookieParser());

// Routes
Server.use("/auth/admin", AdminAuth);
Server.use("/auth/client", ClientAuth);

// Test Route
Server.get("/", (req, res) => {
  res.send(`Hello world try out Melo's Spices , it's still on work`);
});

// Corrected fallback port
const Port = process.env.PORT || 5002;

Server.listen(Port, "localhost", async () => {
  console.log(`server is running at http://localhost:${Port}`);
  try {
       const res = await pool.query('SELECT current_database(), current_schema(), version()');
    console.log("DATABASE CHECK:", res.rows);
  } catch (error) {
    console.error("DB Check failed:", error);
  }
});
