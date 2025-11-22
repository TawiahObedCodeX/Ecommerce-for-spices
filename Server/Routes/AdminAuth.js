// routes/adminAuth.js
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import pool from "../Config/db.js";

const router = express.Router();

// Cookie options (secure in production)
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

// Generate Access + Refresh Tokens
const generateTokens = (admin) => {
  const payload = {
    id: admin.id,
    email: admin.email,
    role: admin.role, // 'admin' or 'superadmin'
    company_name: admin.company_name,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign(
    { id: admin.id },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );

  return { accessToken, refreshToken };
};

// ======================
// 1. ADMIN SIGNUP
// Only allow first admin OR superadmin to create new admins
// ======================
router.post("/signup", async (req, res) => {
  const { full_name, company_name, email, password, role } = req.body;

  try {
    // Required fields
    if (!full_name || !company_name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    // Only allow 'admin' or 'superadmin' roles
    const validRoles = ["admin", "superadmin"];
    const finalRole = role && validRoles.includes(role) ? role : "admin";

    // Check if this would be the first admin → allow without auth
    const totalAdmins = await pool.query("SELECT COUNT(*) FROM admins");
    const isFirstAdmin = totalAdmins.rows[0].count === "0";

    // In real app: protect this route with superadmin middleware
    // For now: allow first admin, otherwise block direct signup
    if (!isFirstAdmin) {
      return res.status(403).json({
        error: "Admin signup is restricted. Contact superadmin.",
      });
    }

    // Check if email already exists (case-insensitive)
    const existing = await pool.query(
      "SELECT id FROM admins WHERE LOWER(email) = LOWER($1)",
      [email]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const password_hash = await bcrypt.hash(password, 12);

    const newAdmin = await pool.query(
      `INSERT INTO admins (
        full_name, company_name, email, password_hash, role
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, full_name, company_name, role, created_at`,
      [full_name, company_name, email, password_hash, finalRole]
    );

    const admin = newAdmin.rows[0];
    const { accessToken, refreshToken } = generateTokens(admin);

    res.cookie("refreshToken", refreshToken, cookieOptions);

    return res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: admin.id,
        email: admin.email,
        full_name: admin.full_name,
        company_name: admin.company_name,
        role: admin.role,
      },
      accessToken,
    });
  } catch (err) {
    console.error("Admin signup error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ======================
// 2. ADMIN LOGIN
// ======================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const result = await pool.query(
      `SELECT id, email, full_name, company_name, role, password_hash,
              is_banned, failed_login_attempts, locked_until
       FROM admins WHERE LOWER(email) = LOWER($1)`,
      [email]
    );

    const admin = result.rows[0];
    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (admin.is_banned) {
      return res.status(403).json({ error: "Admin account is banned" });
    }

    if (admin.locked_until && new Date(admin.locked_until) > new Date()) {
      return res.status(403).json({ error: "Account locked due to too many attempts" });
    }

    const validPassword = await bcrypt.compare(password, admin.password_hash);
    if (!validPassword) {
      const attempts = admin.failed_login_attempts + 1;
      const lockUntil = attempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null;

      await pool.query(
        `UPDATE admins 
         SET failed_login_attempts = $1, locked_until = $2, last_login_ip = $3
         WHERE id = $4`,
        [attempts, lockUntil, req.ip, admin.id]
      );

      return res.status(401).json({
        error: "Invalid credentials",
        attempts_left: attempts >= 5 ? 0 : 5 - attempts,
      });
    }

    // Success → reset attempts
    await pool.query(
      `UPDATE admins 
       SET failed_login_attempts = 0, locked_until = NULL,
           last_login_at = NOW(), last_login_ip = $1
       WHERE id = $2`,
      [req.ip, admin.id]
    );

    const { accessToken, refreshToken } = generateTokens(admin);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    return res.json({
      message: "Login successful",
      admin: {
        id: admin.id,
        email: admin.email,
        full_name: admin.full_name,
        company_name: admin.company_name,
        role: admin.role,
      },
      accessToken,
    });
  } catch (err) {
    console.error("Admin login error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// ======================
// 3. FORGOT PASSWORD
// ======================
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) return res.status(400).json({ error: "Email required" });

    const result = await pool.query(
      "SELECT id, full_name FROM admins WHERE LOWER(email) = LOWER($1)",
      [email]
    );
    const admin = result.rows[0];

    // Always respond the same (security)
    if (!admin) {
      return res.json({ message: "If account exists, a reset link was sent." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await pool.query(
      `UPDATE admins 
       SET reset_password_token = $1, reset_password_expires_at = $2
       WHERE id = $3`,
      [token, expiresAt, admin.id]
    );

    const resetLink = `${process.env.ADMIN_DASHBOARD_URL}/reset-password?token=${token}`;
    console.log("Admin Reset Link (send via email):", resetLink);
    // sendEmail(admin.email, "Admin Password Reset", resetLink);

    return res.json({ message: "If account exists, a reset link was sent." });
  } catch (err) {
    console.error("Admin forgot password error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// ======================
// 4. RESET PASSWORD
// ======================
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    if (!token || !newPassword) {
      return res.status(400).json({ error: "Token and password required" });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: "Password too short" });
    }

    const result = await pool.query(
      `SELECT id FROM admins 
       WHERE reset_password_token = $1 
         AND reset_password_expires_at > NOW()`,
      [token]
    );

    if (!result.rows[0]) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const password_hash = await bcrypt.hash(newPassword, 12);

    await pool.query(
      `UPDATE admins 
       SET password_hash = $1, 
           reset_password_token = NULL, 
           reset_password_expires_at = NULL
       WHERE id = $2`,
      [password_hash, result.rows[0].id]
    );

    return res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Admin reset password error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// ======================
// 5. AUTH MIDDLEWARE (for protected routes)
// ======================
export const adminAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) return res.status(401).json({ error: "Access token required" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await pool.query(
      "SELECT id, email, full_name, company_name, role FROM admins WHERE id = $1",
      [decoded.id]
    );
    if (!result.rows[0]) return res.status(401).json({ error: "Invalid token" });

    req.admin = result.rows[0];
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// ======================
// 6. GET CURRENT ADMIN (/me)
// ======================
router.get("/me", adminAuth, (req, res) => {
  return res.json({
    admin: {
      id: req.admin.id,
      email: req.admin.email,
      full_name: req.admin.full_name,
      company_name: req.admin.company_name,
      role: req.admin.role,
    },
  });
});

// ======================
// 7. LOGOUT
// ======================
router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken", cookieOptions);
  return res.json({ message: "Logged out" });
});

export default router;