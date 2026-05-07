import express from "express";
import { handlePaystackWebhook } from "../controllers/webhookController.js";

const router = express.Router();

router.post("/paystack", express.raw({ type: "application/json" }), (req, res) => {
  try {
    req.body = JSON.parse(req.body.toString());
  } catch (e) {
    console.error("Webhook body parse error");
  }
  handlePaystackWebhook(req, res);
});

export default router;