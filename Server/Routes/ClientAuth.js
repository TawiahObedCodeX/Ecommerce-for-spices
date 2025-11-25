/**
 * ClientAuth Routes
 * ---------------------------------------------
 * Handles client (end-user) authentication flows:
 *  - POST   /signup          Create a new client account
 *  - POST   /login           Client login with email/password
 *  - POST   /forgot-password Generate and store a reset token, send reset link
 *  - POST   /reset-password  Reset password using valid token
 *  - GET    /me              Get current authenticated client profile
 *  - POST   /logout          Clear refresh token cookie
 *
 * Environment variables used:
 *  - JWT_SECRET: required; used to sign access tokens
 *  - JWT_REFRESH_SECRET: optional; used to sign refresh tokens (fallback to JWT_SECRET)
 *  - NODE_ENV: when 'production', secure cookies are enabled
 *  - FRONTEND_URL: base URL used to generate password reset link
 *
 * Database tables expected (columns referenced):
 *  - clients(id, email, full_name, password_hash, age, phone,
 *            is_banned, failed_login_attempts, locked_until,
 *            last_login_at, last_login_ip,
 *            reset_password_token, reset_password_expires_at,
 *            created_at)
 */

import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../Config/db.js";
import crypto from "crypto";

const router = express.Router();

/**
 * Cookie settings for refresh tokens
 * - httpOnly: JS cannot read cookie (XSS protection)
 * - secure: only over HTTPS in production
 * - sameSite strict: mitigates CSRF for cross-site requests
 * - path '/' and 30 days lifetime
 */
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

/**
 * Generate JWT access and refresh tokens for a user
 * @param {{ id: string | number, email: string, role?: string }} user
 * @returns {{ accessToken: string, refreshToken: string }}
 */
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role || "user" },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );

  return { accessToken, refreshToken };
};

// ====================================================================
// 1) SIGNUP
// Route: POST /signup
// Body: { full_name: string, email: string, password: string, age?: number, phone?: string }
// Response: 201 Created with user summary and access token
// ====================================================================
router.post("/signup", async (req, res) => {
  const { full_name, email, password, age, phone } = req.body;

  try {
    // Basic validation
    if (!full_name || !email || !password) {
      return res.status(400).json({ error: "Full name, email, and password are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    // Check if email already exists
    const existingUser = await pool.query(
      "SELECT id FROM clients WHERE email = $1",
      [email]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Insert new client
    const newUser = await pool.query(
      `INSERT INTO clients (
        full_name, email, password_hash, age, phone
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, full_name, created_at`,
      [full_name, email, password_hash, age || null, phone || null]
    );

    const user = newUser.rows[0];

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Set refresh token in httpOnly cookie
    res.cookie("refreshToken", refreshToken, cookieOptions);

    return res.status(201).json({
      message: "Account created successfully",
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
      },
      accessToken,
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ====================================================================
// 2) LOGIN
// Route: POST /login
// Body: { email: string, password: string }
// Response: 200 OK with user summary and access token
// - Implements basic account lockout after 5 failed attempts (15 min)
// ====================================================================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user + check status
    const result = await pool.query(
      `SELECT id, email, full_name, password_hash, is_banned, failed_login_attempts, locked_until
       FROM clients WHERE email = $1`,
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check if account is banned
    if (user.is_banned) {
      return res.status(403).json({ error: "Your account is banned" });
    }

    // Check if account is locked (too many failed attempts)
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      return res.status(403).json({ error: "Account locked. Try again later." });
    }

    // Compare password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      // Increment failed attempts
      const attempts = user.failed_login_attempts + 1;
      const lockTime = attempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null; // 15 min lock after 5 tries

      await pool.query(
        `UPDATE clients 
         SET failed_login_attempts = $1, locked_until = $2, last_login_ip = $3
         WHERE id = $4`,
        [attempts, lockTime, req.ip, user.id]
      );

      return res.status(401).json({ 
        error: "Invalid email or password",
        attempts_left: 5 - attempts > 0 ? 5 - attempts : 0
      });
    }

    // Successful login → reset failed attempts & update last login
    await pool.query(
      `UPDATE clients 
       SET failed_login_attempts = 0, locked_until = NULL, 
           last_login_at = NOW(), last_login_ip = $1
       WHERE id = $2`,
      [req.ip, user.id]
    );

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Set refresh token cookie
    res.cookie("refreshToken", refreshToken, cookieOptions);

    return res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
      },
      accessToken,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ====================================================================
// 3) FORGOT PASSWORD (Send Reset Token)
// Route: POST /forgot-password
// Body: { email: string }
// Response: 200 OK (always generic to avoid account enumeration)
// ====================================================================

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) return res.status(400).json({ error: "Email is required" });

    const userResult = await pool.query(
      "SELECT id, full_name FROM clients WHERE email = $1",
      [email]
    );
    const user = userResult.rows[0];

    if (!user) {
      // Don't reveal if email exists → security best practice
      return res.json({ message: "If your email exists, a reset link has been sent." });
    }

    // Generate secure random token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await pool.query(
      `UPDATE clients 
       SET reset_password_token = $1, reset_password_expires_at = $2
       WHERE id = $3`,
      [token, expiresAt, user.id]
    );

    // TODO: Send email with this link using your mail provider
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    console.log("Password reset link (send via email):", resetLink);

    return res.json({ message: "If your email exists, a reset link has been sent." });
  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ====================================================================
// 4) RESET PASSWORD
// Route: POST /reset-password
// Body: { token: string, newPassword: string }
// Response: 200 OK when password updated
// ====================================================================
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    if (!token || !newPassword) {
      return res.status(400).json({ error: "Token and new password are required" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    const result = await pool.query(
      `SELECT id FROM clients 
       WHERE reset_password_token = $1 
         AND reset_password_expires_at > NOW()`,
      [token]
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    const password_hash = await bcrypt.hash(newPassword, 12);

    await pool.query(
      `UPDATE clients 
       SET password_hash = $1, 
           reset_password_token = NULL, 
           reset_password_expires_at = NULL
       WHERE id = $2`,
      [password_hash, user.id]
    );

    return res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ====================================================================
// 5) AUTH MIDDLEWARE for client routes (used for /me)
// Extracts Bearer token, validates, and loads basic user profile
// ====================================================================
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Access token required" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userResult = await pool.query(
      "SELECT id, email, full_name, avatar_url, created_at FROM clients WHERE id = $1",
      [decoded.id]
    );
    req.user = userResult.rows[0];

    if (!req.user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// ====================================================================
// 6) GET CURRENT USER PROFILE
// Route: GET /me (protected)
// Response: 200 OK with user object from authMiddleware
// ====================================================================
router.get("/me", authMiddleware, async (req, res) => {
  return res.json({
    user: req.user,
  });
});

// ====================================================================
// 7) LOGOUT
// Route: POST /logout
// Clears refresh token cookie (no server-side token blacklist here)
// ====================================================================
router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken", cookieOptions);
  return res.json({ message: "Logged out successfully" });
});

export default router;
