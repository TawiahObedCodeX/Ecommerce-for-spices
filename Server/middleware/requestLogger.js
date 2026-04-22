import { pool } from "../config/database.js";

// Log all requests for audit trail
export const requestLogger = async (req, res, next) => {
  const startTime = Date.now();
  
  // Capture response
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - startTime;
    
    // Log to database for sensitive endpoints
    if (req.path.includes("/payment") || req.path.includes("/verify")) {
      pool.query(
        `INSERT INTO request_logs (ip_address, method, path, status_code, duration, user_agent, request_body)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          req.ip,
          req.method,
          req.path,
          res.statusCode,
          duration,
          req.headers["user-agent"],
          JSON.stringify(req.body).substring(0, 1000)
        ]
      ).catch(err => console.error("Logging failed:", err));
    }
    
    originalSend.call(this, data);
  };
  
  next();
};