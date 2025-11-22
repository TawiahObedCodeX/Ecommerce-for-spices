import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import pool from "../Config/db.js";
import { sendPasswordResetEmail } from "../utils/email.js"; // Reuse or duplicate for admin

const router = express.Router();

// Cookie options (same as client, but you can use a different name if needed)
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  signed: true,
};

// Generate JWT tokens
const generateTokens = (admin) => {
  const payload = {
    id: admin.id,
    email: admin.email.toLowerCase(),
    role: admin.role, // 'admin' or 'superadmin'
    company_name: admin.company_name,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(
    { id: admin.id, role: admin.role },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );

  return { accessToken, refreshToken };
};

// ========================
// 1. ADMIN SIGNUP (Restricted: Only superadmin or first admin)
// ========================
router.post("/signup", async (req, res) => {
  const { full_name, company_name, email, password } = req.body;

  if (!full_name || !company_name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (password.length < 10) {
    return res.status(400).json({ error: "Password must be at least 10 characters" });
  }

  try {
    const client = await pool.connect();

    // Option 1: Allow signup only if NO admins exist (first admin = superadmin)
    // Option 2: Or protect with a secret key (recommended for production)
    const setupSecret = req.headers["x-setup-secret"] || req.body.setup_secret;

    const adminCount = await client.query("SELECT COUNT(*) FROM admins");
    const totalAdmins = parseInt(adminCount.rows[0].count);

    if (totalAdmins > 0 && setupSecret !== process.env.ADMIN_SETUP_SECRET) {
      client.release();
      return res.status(403).json({ error: "Admin registration is restricted" });
    }

    // Check for duplicate email (case-insensitive)
    const existing = await client.query("SELECT id FROM admins WHERE LOWER(email) = LOWER($1)", [email]);
    if (existing.rows.length > 0) {
      client.release();
      return res.status(409).json({ error: "Email already in use" });
    }

    const password_hash = await bcrypt.hash(password, 12);

    const role = totalAdmins === 0 ? "superadmin" : "admin"; // First one becomes superadmin

    const result = await client.query(
      `INSERT INTO admins (full_name, company_name, email, password_hash, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, full_name, company_name, role, created_at`,
      [full_name.trim(), company_name.trim(), email.toLowerCase(), password_hash, role]
    );

    const admin = result.rows[0];
    const { accessToken, refreshToken } = generateTokens(admin);

    res.cookie("adminRefreshToken", refreshToken, {
      ...cookieOptions,
      path: "/api/admin", // Separate cookie path
    });

    client.release();

    return res.status(201).json({
      message: "Admin account created successfully",
      admin: {
        id: admin.id,
        full_name: admin.full_name,
        email: admin.email,
        company_name: admin.company_name,
        role: admin.role,
      },
      accessToken,
      expiresIn: 900,
    });
  } catch (err) {
    console.error("Admin signup error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ========================
// 2. ADMIN LOGIN
// ========================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const client = await pool.connect();

    const result = await client.query(
      `SELECT id, email, full_name, company_name, password_hash, role,
              is_banned, failed_login_attempts, locked_until
       FROM admins WHERE LOWER(email) = LOWER($1)`,
      [email]
    );

    const admin = result.rows[0];

    if (!admin) {
      client.release();
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (admin.is_banned) {
      client.release();
      return res.status(403).json({ error: "Admin account is banned" });
    }

    if (admin.locked_until && new Date(admin.locked_until) > new Date()) {
      client.release();
      return res.status(403).json({
        error: "Account locked due to too many failed attempts",
        locked_until: admin.locked_until,
      });
    }

    const isValid = await bcrypt.compare(password, admin.password_hash);
    if (!isValid) {
      const attempts = admin.failed_login_attempts + 1;
      let lockedUntil = null;

      if (attempts >= 5) {
        lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 min lock
        await client.query(
          "UPDATE admins SET failed_login_attempts = $1, locked_until = $2 WHERE id = $3",
          [attempts, lockedUntil, admin.id]
        );
        client.release();
        return res.status(403).json({ error: "Too many failed attempts. Account locked for 30 minutes." });
      } else {
        await client.query(
          "UPDATE admins SET failed_login_attempts = $1 WHERE id = $2",
          [attempts, admin.id]
        );
      }

      client.release();
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Success: Reset attempts + log login
    await client.query(
      `UPDATE admins 
       SET failed_login_attempts = 0, locked_until = NULL, 
           last_login_at = NOW(), last_login_ip = $1 
       WHERE id = $2`,
      [req.ip || req.connection.remoteAddress, admin.id]
    );

    const { accessToken, refreshToken } = generateTokens(admin);

    res.cookie("adminRefreshToken", refreshToken, {
      ...cookieOptions,
      path: "/api/admin",
    });

    client.release();

    return res.json({
      message: "Admin login successful",
      admin: {
        id: admin.id,
        full_name: admin.full_name,
        email: admin.email,
        company_name: admin.company_name,
        role: admin.role,
      },
      accessToken,
      expiresIn: 900,
    });
  } catch (err) {
    console.error("Admin login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ========================
// 3. ADMIN FORGOT PASSWORD
// ========================
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const client = await pool.connect();

    const result = await client.query(
      "SELECT id, full_name FROM admins WHERE LOWER(email) = LOWER($1)",
      [email]
    );

    const admin = result.rows[0];

    // Always return same message (security)
    if (!admin) {
      client.release();
      return res.json({ message: "If an admin account exists, a reset link has been sent." });
    }

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await client.query(
      `UPDATE admins 
       SET reset_password_token = $1, reset_password_expires_at = $2 
       WHERE id = $3`,
      [token, expiresAt, admin.id]
    );

    const resetLink = `${process.env.ADMIN_DASHBOARD_URL}/reset-password?token=${token}`;
    await sendPasswordResetEmail(admin.full_name, email, resetLink, true); // true = admin template

    client.release();
    return res.json({ message: "If an admin account exists, a reset link has been sent." });
  } catch (err) {
    console.error("Admin forgot password error:", err);
    return res.status(500).json({ error: "Failed to send reset email" });
  }
});

// ========================
// 4. ADMIN RESET PASSWORD
// ========================
router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ error: "Token and password are required" });
  }

  if (password.length < 10) {
    return res.status(400).json({ error: "Password must be at least 10 characters" });
  }

  try {
    const client = await pool.connect();

    const result = await client.query(
      `SELECT id FROM admins 
       WHERE reset_password_token = $1 
         AND reset_password_expires_at > NOW()`,
      [token]
    );

    if (!result.rows[0]) {
      client.release();
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const password_hash = await bcrypt.hash(password, 12);

    await client.query(
      `UPDATE admins 
       SET password_hash = $1, 
           reset_password_token = NULL, 
           reset_password_expires_at = NULL,
           updated_at = NOW()
       WHERE reset_password_token = $2`,
      [password_hash, token]
    );

    client.release();
    return res.json({ message: "Admin password reset successfully" });
  } catch (err) {
    console.error("Admin reset password error:", err);
    return res.status(500).json({ error: "Failed to reset password" });
  }
});

// ========================
// 5. ADMIN LOGOUT
// ========================
router.post("/logout", (req, res) => {
  res.clearCookie("adminRefreshToken", { ...cookieOptions, path: "/api/admin" });
  return res.json({ message: "Admin logged out" });
});

export default router;