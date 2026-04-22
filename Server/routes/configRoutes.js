import express from "express";

const router = express.Router();

// Endpoint to provide Paystack public key to frontend
router.get("/paystack-key", (req, res) => {
  res.json({ 
    publicKey: process.env.PAYSTACK_PUBLIC_KEY,
    environment: process.env.NODE_ENV
  });
});

export default router;