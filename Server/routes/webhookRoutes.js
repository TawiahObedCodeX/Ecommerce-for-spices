import express from "express";
import { handlePaystackWebhook } from "../controllers/webhookController.js";   // ✅ correct  // fixed

const router = express.Router();

router.post("/paystack", express.raw({ type: "application/json" }), (req, res) => {
  req.body = JSON.parse(req.body.toString());
  handlePaystackWebhook(req, res);
});

export default router;