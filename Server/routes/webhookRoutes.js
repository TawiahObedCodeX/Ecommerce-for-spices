import express from "express";
import { handlePaystackWebhook } from "../controllers/webhookController.js";

const router = express.Router();

// Paystack webhook endpoint - no validation middleware (raw body needed)
router.post("/paystack", express.raw({ type: "application/json" }), (req, res) => {
  // Parse raw body for signature verification
  req.body = JSON.parse(req.body.toString());
  handlePaystackWebhook(req, res);
});

export default router;