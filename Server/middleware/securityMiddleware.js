import crypto from "crypto";
import { pool } from "../config/database.js";

async function isIpBlocked(ip) {
  try {
    const result = await pool.query(
      `SELECT 1 FROM blocked_ips 
       WHERE ip_address = $1 
       AND (blocked_until IS NULL OR blocked_until > NOW())`,
      [ip]
    );
    return result.rows.length > 0;
  } catch (err) {
    if (err.message.includes('does not exist')) {
      return false; // Silent during development
    }
    console.error("IP block check error:", err);
    return false;
  }
}

export const securityMiddleware = async (req, res, next) => {
  try {
    const realIp = 
      req.headers["cf-connecting-ip"] ||
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.ip ||
      req.socket?.remoteAddress;

    req.realIp = realIp;

    if (await isIpBlocked(realIp)) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Content-Type validation
    if ((req.method === "POST" || req.method === "PUT") && !req.is("application/json")) {
      return res.status(415).json({ error: "Content-Type must be application/json" });
    }

    // Basic sanitization
    if (req.body) {
      const sanitize = (obj) => {
        if (typeof obj === "string") {
          return obj.replace(/(--|;|\/\*|\*\/|union|select|drop)/gi, "").trim();
        }
        if (typeof obj === "object" && obj !== null) {
          for (let key in obj) obj[key] = sanitize(obj[key]);
        }
        return obj;
      };
      req.body = sanitize(req.body);
    }

    req.requestFingerprint = crypto
      .createHash("sha256")
      .update(`${realIp}-${req.headers["user-agent"] || ""}`)
      .digest("hex");

    next();
  } catch (err) {
    console.error("Security middleware error:", err);
    next();
  }
};