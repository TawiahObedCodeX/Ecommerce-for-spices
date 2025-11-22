// middleware/auth.js
import jwt from "jsonwebtoken";
import pool from "../Config/db.js";

/**
 * =============================================
 * 1. CLIENT AUTH MIDDLEWARE
 * Protects client routes (e.g. /api/client/profile)
 * =============================================
 */
export const clientAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Access token required" });
    }

    const token = authHeader.split(" ")[1];

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch client from DB (ensure user still exists and is active)
    const result = await pool.query(
      `SELECT id, email, full_name, is_active, is_banned 
       FROM clients 
       WHERE id = $1`,
      [decoded.id]
    );

    const client = result.rows[0];
    if (!client) {
      return res.status(401).json({ error: "Invalid token - user not found" });
    }

    if (!client.is_active || client.is_banned) {
      return res.status(403).json({ 
        error: "Account is disabled or banned" 
      });
    }

    // Attach client to request
    req.client = {
      id: client.id,
      email: client.email,
      full_name: client.full_name,
    };

    next();
  } catch (err) {
    console.error("Client auth error:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

/**
 * =============================================
 * 2. ADMIN AUTH MIDDLEWARE (any admin)
 * Protects admin routes
 * =============================================
 */
export const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Access token required" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query(
      `SELECT id, email, full_name, company_name, role, is_active, is_banned 
       FROM admins 
       WHERE id = $1`,
      [decoded.id]
    );

    const admin = result.rows[0];
    if (!admin) {
      return res.status(401).json({ error: "Invalid admin token" });
    }

    if (!admin.is_active || admin.is_banned) {
      return res.status(403).json({ error: "Admin account is disabled or banned" });
    }

    // Attach full admin object
    req.admin = {
      id: admin.id,
      email: admin.email,
      full_name: admin.full_name,
      company_name: admin.company_name,
      role: admin.role, // 'admin' or 'superadmin'
    };

    next();
  } catch (err) {
    console.error("Admin auth error:", err.message);
    return res.status(401).json({ error: "Invalid or expired admin token" });
  }
};

/**
 * =============================================
 * 3. SUPERADMIN ONLY MIDDLEWARE
 * Only allows superadmin role
 * =============================================
 */
export const superAdminOnly = (req, res, next) => {
  if (!req.admin || req.admin.role !== "superadmin") {
    return res.status(403).json({ 
      error: "Access denied. Superadmin only." 
    });
  }
  next();
};

/**
 * =============================================
 * 4. OPTIONAL: Combine Client OR Admin Auth
 * Useful for shared APIs (e.g. file uploads, notifications)
 * =============================================
 */
export const authOptional = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      req.user = null;
      return next(); // Allow unauthenticated access
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Try client first
    let result = await pool.query("SELECT id, email, full_name FROM clients WHERE id = $1", [decoded.id]);
    if (result.rows[0]) {
      req.user = { ...result.rows[0], type: "client" };
      return next();
    }

    // Then try admin
    result = await pool.query(
      "SELECT id, email, full_name, company_name, role FROM admins WHERE id = $1",
      [decoded.id]
    );
    if (result.rows[0]) {
      req.user = { ...result.rows[0], type: "admin" };
      return next();
    }

    req.user = null;
    next();
  } catch (err) {
    req.user = null;
    next(); // Continue even if token is invalid
  }
};

/**
 * =============================================
 * 5. Require Authenticated User (Client OR Admin)
 * =============================================
 */
export const requireAuth = async (req, res, next) => {
  await authOptional(req, res, () => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }
    next();
  });
};