import express from "express";
import dotenv from "dotenv";

dotenv.config(); // ✅ ensure env is loaded

const router = express.Router();

// Endpoint to provide Paystack public key to frontend
router.get("/paystack-key", (req, res) => {
  if (!process.env.PAYSTACK_PUBLIC_KEY) {
    return res.status(500).json({ error: "Paystack public key not configured" });
  }
  res.json({ 
    publicKey: process.env.PAYSTACK_PUBLIC_KEY,
    environment: process.env.NODE_ENV
  });
});

export default router;