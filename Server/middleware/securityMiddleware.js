import crypto from "crypto";

// Validate request origin and headers
export const securityMiddleware = (req, res, next) => {
  // Check for suspicious headers
  const suspiciousHeaders = ["x-forwarded-for", "x-real-ip", "cf-connecting-ip"];
  const hasSuspiciousHeaders = suspiciousHeaders.some(header => req.headers[header]);
  
  if (hasSuspiciousHeaders && process.env.NODE_ENV === "production") {
    console.warn(`Suspicious headers detected from IP: ${req.ip}`);
    // Don't block, but log for monitoring
  }

  // Validate content type for POST requests
  if (req.method === "POST" && !req.is("application/json")) {
    return res.status(415).json({ error: "Content-Type must be application/json" });
  }

  // Check for SQL injection patterns in query/body
  const sqlPattern = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE)\b|\-\-|;|\|\||&&)/i;
  
  const checkForInjection = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === "string" && sqlPattern.test(obj[key])) {
        return true;
      }
      if (typeof obj[key] === "object" && obj[key] !== null) {
        if (checkForInjection(obj[key])) return true;
      }
    }
    return false;
  };

  if (req.body && checkForInjection(req.body)) {
    console.error(`SQL injection attempt detected from IP: ${req.ip}`);
    return res.status(400).json({ error: "Invalid request parameters" });
  }

  // Generate request fingerprint for fraud detection
  req.requestFingerprint = crypto
    .createHash("sha256")
    .update(`${req.ip}-${req.headers["user-agent"]}-${Date.now()}`)
    .digest("hex");

  next();
};