import express from "express";
import { verifyPayment } from "../controllers/paymentController.js";

const router = express.Router();

// POST /api/payment/verify
router.post("/verify", verifyPayment);

export default router;