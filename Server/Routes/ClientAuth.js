import express from "express";
import bcrypt from "bcrypt";
import jwt from  "jsonwebtoken"
import pool from "../Config/db";

const router =express.Router()

const cookieOptions = {
  httpOnly: true,
  secure: true,  // Always true in 2025 (even localhost via HTTPS with mkcert)
  sameSite: 'strict',
  path: '/',
  maxAge: 30 * 24 * 60 * 60 * 1000,
  // Add these for extra security
  signed: true,  // If using cookie-parser with secret
};

// Bonus: Professional version with more data + refresh token
const generateTokens = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role || 'user',              // admin, client, etc.
    iat: Math.floor(Date.now() / 1000),     // issued at
  };

  const accessToken = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: '15m' }                    // short-lived
  );

  const refreshToken = jwt.sign(
    { id: user.id },                        // minimal payload for refresh
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: '30d' }                    // long-lived
  );

  return {
    accessToken,
    refreshToken,
    expiresIn: 15 * 60,                     // 900 seconds
  };
};import express from "express";
import jwt from "jsonwebtoken";
