import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import compression from "compression";
import paymentRoutes from "./routes/paymentRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import configRoutes from "./routes/configRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { securityMiddleware } from "./middlewares/securityMiddleware.js";
import { requestLogger } from "./middlewares/requestLogger.js";
import { pool, initDatabase } from "./config/database.js";
import { redisClient } from "./config/redis.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Compression
app.use(compression());

// Helmet for security
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

// Logging
app.use(morgan("combined"));
app.use(requestLogger);

// Custom security
app.use(securityMiddleware);

// Rate limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests" },
});
app.use(globalLimiter);

// Initialize database
await initDatabase();

// Test Redis
try {
  await redisClient.ping();
  console.log("✅ Redis connected");
} catch (error) {
  console.error("❌ Redis connection failed:", error.message);
}

// Routes
app.use("/api/config", configRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/webhooks", webhookRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    redis: redisClient.isOpen ? "connected" : "disconnected"
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
  console.log(`✅ All routes loaded\n`);
});