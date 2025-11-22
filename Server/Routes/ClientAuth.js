import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../Config/db.js";
import { randomBytes } from "crypto";
import { sendPasswordResetEmail } from "../utils/email.js"; // You'll create this

const router = express.Router();

// Cookie options (secure even in dev with mkcert)
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production" ? true : false, // false only in dev without HTTPS
  sameSite: "strict",
  path: "/",
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days for refresh token cookie
  signed: true,
};

// Generate both access & refresh tokens
const generateTokens = (user) => {
  const payload = {
    id: user.id,
    email: user.email.toLowerCase(),
    role: user.role || "user",
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );

  return { accessToken, refreshToken };
};

// ========================
// 1. SIGNUP ROUTE
// ========================
router.post("/signup", async (req, res) => {
  const { full_name, email, password, age, phone } = req.body;

  if (!full_name || !email || !password) {
    return res.status(400).json({ error: "Full name, email and password are required" });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }

  try {
    const client = await pool.connect();

    // Check if email already exists (case-insensitive thanks to CITEXT)
    const existingUser = await client.query("SELECT id FROM clients WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      client.release();
      return res.status(409).json({ error: "Email already registered" });
    }

    // Hash password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Insert new client
    const result = await client.query(
      `INSERT INTO clients (
        full_name, email, password_hash, age, phone
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, full_name, created_at`,
      [full_name.trim(), email.toLowerCase(), password_hash, age || null, phone || null]
    );

    const user = result.rows[0];
    const { accessToken, refreshToken } = generateTokens(user);

    // Set refresh token in httpOnly cookie
    res.cookie("refreshToken", refreshToken, cookieOptions);

    client.release();

    return res.status(201).json({
      message: "Account created successfully",
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
      },
      accessToken,
      expiresIn: 900,
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ========================
// 2. LOGIN ROUTE
// ========================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const client = await pool.connect();

    const result = await client.query(
      `SELECT id, email, full_name, password_hash, is_banned, failed_login_attempts, locked_until
       FROM clients WHERE email = $1`,
      [email.toLowerCase()]
    );

    const user = result.rows[0];

    if (!user) {
      client.release();
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check if account is banned
    if (user.is_banned) {
      client.release();
      return res.status(403).json({ error: "Account is banned" });
    }

    // Check if account is locked due to too many failed attempts
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      client.release();
      return res.status(403).json({
        error: "Account temporarily locked. Try again later.",
        locked_until: user.locked_until,
      });
    }

    // Compare password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      // Increment failed attempts
      const attempts = user.failed_login_attempts + 1;
      let lockedUntil = null;

      if (attempts >= 5) {
        lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // lock for 15 mins
        await client.query(
          "UPDATE clients SET failed_login_attempts = $1, locked_until = $2 WHERE id = $3",
          [attempts, lockedUntil, user.id]
        );
        client.release();
        return res.status(403).json({ error: "Too many failed attempts. Account locked for 15 minutes." });
      } else {
        await client.query(
          "UPDATE clients SET failed_login_attempts = $1 WHERE id = $2",
          [attempts, user.id]
        );
      }

      client.release();
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Successful login → reset failed attempts + update last login
    await client.query(
      `UPDATE clients 
       SET failed_login_attempts = 0, locked_until = NULL, last_login_at = NOW(), last_login_ip = $1 
       WHERE id = $2`,
      [req.ip || req.connection.remoteAddress, user.id]
    );

    const { accessToken, refreshToken } = generateTokens(user);

    res.cookie("refreshToken", refreshToken, cookieOptions);
    client.release();

    return res.json({
      message: "Login successful",
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
      },
      accessToken,
      expiresIn: 900,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ========================
// 3. FORGOT PASSWORD (Send Reset Link)
// ========================
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const client = await pool.connect();

    const result = await client.query("SELECT id, full_name FROM clients WHERE email = $1", [
      email.toLowerCase(),
    ]);

    const user = result.rows[0];

    if (!user) {
      // Security: Don't reveal if email exists
      client.release();
      return res.json({ message: "If the email exists, a reset link has been sent." });
    }

    // Generate secure token
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await client.query(
      `UPDATE clients 
       SET reset_password_token = $1, reset_password_expires_at = $2 
       WHERE id = $3`,
      [token, expiresAt, user.id]
    );

    // Send email (implement this function)
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await sendPasswordResetEmail(user.full_name, email, resetLink);

    client.release();
    return res.json({ message: "If the email exists, a password reset link has been sent." });
  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(500).json({ error: "Failed to send reset email" });
  }
});

// ========================
// 4. RESET PASSWORD (With Token)
// ========================
router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ error: "Token and new password are required" });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }

  try {
    const client = await pool.connect();

    const result = await client.query(
      `SELECT id FROM clients 
       WHERE reset_password_token = $1 
         AND reset_password_expires_at > NOW()`,
      [token]
    );

    const user = result.rows[0];

    if (!user) {
      client.release();
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    const password_hash = await bcrypt.hash(password, 12);

    await client.query(
      `UPDATE clients 
       SET password_hash = $1, 
           reset_password_token = NULL, 
           reset_password_expires_at = NULL,
           updated_at = NOW()
       WHERE id = $2`,
      [password_hash, user.id]
    );

    client.release();
    return res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ error: "Failed to reset password" });
  }
});

// Bonus: Logout (clear cookie)
router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken", cookieOptions);
  return res.json({ message: "Logged out successfully" });
});

export default router;