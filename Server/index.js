import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import AdminAuth from './Routes/AdminAuth.js';
import ClientAuth from './Routes/ClientAuth.js';

dotenv.config();

const Server = express();

// Middleware
Server.use(express.json());
Server.use(cookieParser());
Server.use('/auth/admin', AdminAuth);
Server.use('/auth/client', ClientAuth);

// Test Route
Server.get("/", (req, res) => {
  res.send(`Hello world try out Melo's Spices , it's still on work`);
});

// Corrected fallback port
const Port = process.env.PORT || 5002;

Server.listen(Port, "::1", () => {
  console.log(`server is running at http://localhost:${Port}`);
});
